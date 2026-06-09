import Menus from './Menus.js';
import { canvas } from './Return.js';

// State the map jumps to when a room is picked: the battle lobby (deck prep),
// which then starts the actual battle. Kept in sync with Return.js screenManager.
const LOBBY_STATE = 11;

// ─── MapManager ───────────────────────────────────────────────────────────────
// Tracks unlock/completion over the castle floors (1-3) built from the DB. The
// forest (floor 0) is a separate tutorial and is NOT part of this model, so the
// map's entry point is floor 1, room 1 (the courtyard).
export class MapManager {
    constructor(floorRoomModel, savedState) {
        // Deep-copy the normalized rooms and layer per-room progression flags.
        this.floors = floorRoomModel.map(f => ({
            floorNumber: f.floorNumber,
            rooms: f.rooms.map(r => ({ ...r, unlocked: false, completed: false }))
        }));
        savedState ? this.restoreState(savedState) : this.resetToNewGame();
    }

    resetToNewGame() {
        for (const f of this.floors)
            for (const r of f.rooms) { r.unlocked = false; r.completed = false; }
        // The castle opens at the courtyard once the forest tutorial is cleared.
        if (this.floors[0]?.rooms[0]) this.floors[0].rooms[0].unlocked = true;
    }

    restoreState(state) {
        const byFloor = new Map(state.map(f => [f.floorNumber, f]));
        for (const floor of this.floors) {
            const saved = byFloor.get(floor.floorNumber);
            if (!saved) continue;
            const savedRooms = new Map(saved.rooms.map(r => [r.roomNumber, r]));
            for (const room of floor.rooms) {
                const s = savedRooms.get(room.roomNumber);
                if (!s) continue;
                room.unlocked = !!s.unlocked;
                room.completed = !!s.completed;
            }
        }
    }

    // Rebuilds unlock/completion from a run's furthest (floor, room) by replaying
    // completions in order. Floor 0 (forest) is off-map: any finalFloor < 1 just
    // leaves the castle at its entry state (courtyard unlocked).
    restoreFromProgress(finalFloor, finalRoom) {
        this.resetToNewGame();
        if(finalFloor == null || finalFloor < 1){ return; }
        for(const floor of this.floors){
            let stop = false;
            for(const room of floor.rooms){
                const reached = floor.floorNumber < finalFloor ||
                    (floor.floorNumber === finalFloor && room.roomNumber <= finalRoom);
                if(reached){ this.completeRoom(floor.floorNumber, room.roomNumber); }
                else { stop = true; break; }
            }
            if(stop){ break; }
        }
    }

    getState() {
        return this.floors.map(f => ({
            floorNumber: f.floorNumber,
            rooms: f.rooms.map(r => ({ roomNumber: r.roomNumber, unlocked: r.unlocked, completed: r.completed }))
        }));
    }

    getRoom(floorNumber, roomNumber) {
        const floor = this.floors.find(f => f.floorNumber === floorNumber);
        return floor?.rooms.find(r => r.roomNumber === roomNumber) ?? null;
    }

    canEnter(floorNumber, roomNumber) {
        return this.getRoom(floorNumber, roomNumber)?.unlocked === true;
    }

    // Marks a room cleared and unlocks the next room in the floor, or the first
    // room of the next floor when the last room of this floor is cleared.
    completeRoom(floorNumber, roomNumber) {
        const floorIdx = this.floors.findIndex(f => f.floorNumber === floorNumber);
        if (floorIdx < 0) return false;
        const floor = this.floors[floorIdx];
        const roomIdx = floor.rooms.findIndex(r => r.roomNumber === roomNumber);
        if (roomIdx < 0) return false;

        floor.rooms[roomIdx].completed = true;

        const next = floor.rooms[roomIdx + 1];
        if (next) {
            next.unlocked = true;
        } else {
            const nextFloor = this.floors[floorIdx + 1];
            if (nextFloor?.rooms.length) nextFloor.rooms[0].unlocked = true;
        }
        return true;
    }
}

// ─── Cell layout ──────────────────────────────────────────────────────────────
// Hand-authored cell rects tuned to mapa.png. Rows top→bottom are floor 3
// (throne), floor 2 (halls), floor 1 (courtyard/entrance). Floor 1 room 1 (the
// courtyard) sits OUTSIDE the castle on the lower-left. Positions are fractional
// so they scale with the canvas; expect a visual tuning pass against the art.
const ROOM_LAYOUT = [
    // --- FLOOR 3 (top: Library, Bedroom, Throne[boss]) ---
    { floorNumber: 3, roomNumber: 1, xF: 0.309, yF: 0.073, wF: 0.200, hF: 0.280 },
    { floorNumber: 3, roomNumber: 2, xF: 0.530, yF: 0.073, wF: 0.193, hF: 0.280 },
    { floorNumber: 3, roomNumber: 3, xF: 0.750, yF: 0.073, wF: 0.225, hF: 0.280 },

    // --- FLOOR 2 (middle: Paintings, Dining, Red Stairs[boss]) ---

    { floorNumber: 2, roomNumber: 3, xF: 0.310, yF: 0.392, wF: 0.110, hF: 0.260 },
    { floorNumber: 2, roomNumber: 2, xF: 0.440, yF: 0.392, wF: 0.260, hF: 0.260 },
    { floorNumber: 2, roomNumber: 1, xF: 0.720, yF: 0.392, wF: 0.260, hF: 0.260 },

    // --- FLOOR 1 (bottom: Courtyard[outside castle], Main Entrance, Purple Stairs[boss]) ---
    { floorNumber: 1, roomNumber: 1, xF: 0.030, yF: 0.690, wF: 0.275, hF: 0.270 }, // courtyard, outside
    { floorNumber: 1, roomNumber: 2, xF: 0.355, yF: 0.680, wF: 0.380, hF: 0.290 },
    { floorNumber: 1, roomNumber: 3, xF: 0.755, yF: 0.680, wF: 0.225, hF: 0.290 },
];

// ─── mapScreen ────────────────────────────────────────────────────────────────
export default class mapScreen extends Menus {
    constructor(background, canvasWidth, canvasHeight, mapManager, onRoomSelected) {
        super(background, canvasWidth, canvasHeight);
        this.mapManager     = mapManager;
        this.onRoomSelected = onRoomSelected;
        this.state          = undefined;
        this.hoveredCell    = null;
        // Transient banner shown when the player clicks an already-beaten boss room
        // (boss rooms are one-time only). Counts down in update().
        this.bossMessage      = null;
        this.bossMessageTimer = 0;

        // Only keep cells whose DB room actually exists; convert to pixel rects once.
        this.cells = ROOM_LAYOUT
            .filter(def => this.mapManager.getRoom(def.floorNumber, def.roomNumber))
            .map(def => ({
                ...def,
                x: def.xF * canvasWidth,
                y: def.yF * canvasHeight,
                w: def.wF * canvasWidth,
                h: def.hF * canvasHeight,
            }));

        this._onMove  = this._onMove.bind(this);
        this._onClick = this._onClick.bind(this);
        canvas.addEventListener('mousemove', this._onMove);
        canvas.addEventListener('click',     this._onClick);
    }

    _hit(mx, my) {
        for (const cell of this.cells) {
            if (mx >= cell.x && mx <= cell.x + cell.w &&
                my >= cell.y && my <= cell.y + cell.h) return cell;
        }
        return null;
    }

    _coords(e) {
        const r = canvas.getBoundingClientRect();
        return { mx: e.clientX - r.left, my: e.clientY - r.top };
    }

    _roomState(cell) {
        const room = this.mapManager.getRoom(cell.floorNumber, cell.roomNumber);
        if (!room)                          return 'locked';
        // Boss rooms are one-time: once beaten they're not enterable (but render plain).
        if (room.isBoss && room.completed)  return 'bossCleared';
        // A completed non-boss room keeps its unlocked flag, so it stays replayable.
        if (room.unlocked)                  return 'unlocked';
        return 'locked';
    }

    _onMove(e) {
        const { mx, my } = this._coords(e);
        const cell = this._hit(mx, my);
        this.hoveredCell = (cell && this._roomState(cell) === 'unlocked') ? cell : null;
        canvas.style.cursor = this.hoveredCell ? 'pointer' : 'default';
    }

    _onClick(e) {
        const { mx, my } = this._coords(e);
        const cell = this._hit(mx, my);
        if (!cell) return;
        const rs = this._roomState(cell);
        if (rs === 'bossCleared') {
            // Tell the player why nothing happened instead of silently ignoring the click.
            this.bossMessage = 'Boss rooms can only be played once';
            this.bossMessageTimer = 2000;
            return;
        }
        if (rs !== 'unlocked') return;
        const room = this.mapManager.getRoom(cell.floorNumber, cell.roomNumber);
        this.onRoomSelected?.(room);
        this.dispose();
        this.state = LOBBY_STATE;
    }

    update(dt) {
        if (this.bossMessageTimer > 0) {
            this.bossMessageTimer -= dt;
            if (this.bossMessageTimer <= 0) this.bossMessage = null;
        }
    }

    draw(ctx) {
        this.background.draw(ctx);

        for (const cell of this.cells) {
            const rs = this._roomState(cell);
            ctx.save();

            if (rs === 'locked') {
                ctx.fillStyle    = 'rgba(0,0,0,0.72)';
                ctx.fillRect(cell.x, cell.y, cell.w, cell.h);
                ctx.font         = '28px serif';
                ctx.textAlign    = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle    = 'rgba(255,255,255,0.25)';
                ctx.fillText('🔒', cell.x + cell.w / 2, cell.y + cell.h / 2);

            } else if (cell === this.hoveredCell) {
                ctx.fillStyle   = 'rgba(200,160,60,0.22)';
                ctx.fillRect(cell.x, cell.y, cell.w, cell.h);
                ctx.strokeStyle = 'rgba(220,180,80,0.9)';
                ctx.lineWidth   = 3;
                ctx.strokeRect(cell.x, cell.y, cell.w, cell.h);
            }
            // 'bossCleared' and non-hovered 'unlocked' rooms render plain (no overlay).

            // Completed non-boss rooms get a subtle green tint and a checkmark badge.
            const room = this.mapManager.getRoom(cell.floorNumber, cell.roomNumber);
            if (room && room.completed && !room.isBoss) {
                ctx.fillStyle = 'rgba(60, 220, 100, 0.18)';
                ctx.fillRect(cell.x, cell.y, cell.w, cell.h);
                ctx.font         = 'bold 32px serif';
                ctx.textAlign    = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle    = 'rgba(60, 220, 100, 0.9)';
                ctx.fillText('✓', cell.x + cell.w / 2, cell.y + cell.h / 2);
            }

            ctx.restore();
        }

        // Transient "boss already beaten" banner, centered near the top.
        if (this.bossMessage) {
            ctx.save();
            ctx.font         = 'bold 26px Academia, serif';
            ctx.textAlign    = 'center';
            ctx.textBaseline = 'middle';
            const cx = this.canvasWidth / 2;
            const cy = this.canvasHeight * 0.12;
            const padX = 24, padY = 12;
            const textW = ctx.measureText(this.bossMessage).width;
            ctx.fillStyle = 'rgba(26,20,16,0.85)';   // dark parchment backdrop
            ctx.fillRect(cx - textW / 2 - padX, cy - 13 - padY, textW + padX * 2, 26 + padY * 2);
            ctx.strokeStyle = 'rgba(201,162,90,0.9)'; // antique gold border
            ctx.lineWidth = 2;
            ctx.strokeRect(cx - textW / 2 - padX, cy - 13 - padY, textW + padX * 2, 26 + padY * 2);
            ctx.fillStyle = '#f3ead0';                // parchment text
            ctx.fillText(this.bossMessage, cx, cy);
            ctx.restore();
        }
    }

    dispose() {
        canvas.removeEventListener('mousemove', this._onMove);
        canvas.removeEventListener('click',     this._onClick);
        canvas.style.cursor = 'default';
    }
}
