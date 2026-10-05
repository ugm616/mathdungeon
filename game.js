// =====================================================
// DUNGEON CRAWLER V2
// PART 1
// CORE SETUP + DUNGEON GENERATION
// =====================================================

const canvas =
    document.getElementById(
        "gameCanvas"
    );

const ctx =
    canvas.getContext("2d");

const TILE_SIZE = 32;

const COLS = 20;
const ROWS = 15;

const TILE = {

    WALL: 0,
    FLOOR: 1,
    GATE: 2,
    EXIT: 3
};

let gameActive = true;

let floorNumber = 1;

let floorTheme = "Dungeon";

let map = [];

let enemies = [];

let items = [];

const player = {

    x: 1,
    y: 1,

    strength: 20,

    coins: 0,

    keys: 0,

    inventory: {

        potion: 1,

        fury: 1,

        shield: 1,

        bomb: 1
    },

    furyCharges: 0,

    shieldActive: false,

    bombArmed: false
};

// =====================================================
// LOG
// =====================================================

function addLog(message) {

    const log =
        document.getElementById(
            "log"
        );

    log.innerHTML =
        message +
        "<br>" +
        log.innerHTML;
}

// =====================================================
// THEMES
// =====================================================

function chooseTheme() {

    if (
        floorNumber % 5 === 0
    ) {

        return "Arena";
    }

    const themes = [

        "Barracks",

        "Laboratory",

        "Treasury",

        "Crypt"
    ];

    return themes[
        Math.floor(
            Math.random() *
            themes.length
        )
    ];
}

// =====================================================
// DUNGEON GENERATION
// =====================================================

function generateDungeon() {

    floorTheme =
        chooseTheme();

    map =
        Array(ROWS)
        .fill(null)
        .map(() =>
            Array(COLS)
            .fill(TILE.WALL)
        );

    const rooms = [];

    const roomCount = 5;

    for (
        let i = 0;
        i < roomCount;
        i++
    ) {

        const w =
            4 +
            Math.floor(
                Math.random() * 4
            );

        const h =
            4 +
            Math.floor(
                Math.random() * 3
            );

        const x =
            1 +
            Math.floor(
                Math.random() *
                (COLS - w - 2)
            );

        const y =
            1 +
            Math.floor(
                Math.random() *
                (ROWS - h - 2)
            );

        rooms.push({
            x,
            y,
            w,
            h
        });

        for (
            let yy = y;
            yy < y + h;
            yy++
        ) {

            for (
                let xx = x;
                xx < x + w;
                xx++
            ) {

                map[yy][xx] =
                    TILE.FLOOR;
            }
        }
    }

    connectRooms(
        rooms
    );

    player.x =
        rooms[0].x + 1;

    player.y =
        rooms[0].y + 1;

    createExit(
        rooms
    );

    createEnemies(
        rooms
    );

    createItems(
        rooms
    );

    addLog(
        `Entered Floor ${floorNumber}`
    );
}

// =====================================================
// CONNECT ROOMS
// =====================================================

function connectRooms(
    rooms
) {

    for (
        let i = 0;
        i < rooms.length - 1;
        i++
    ) {

        const a =
            rooms[i];

        const b =
            rooms[i + 1];

        let cx =
            Math.floor(
                a.x + a.w / 2
            );

        let cy =
            Math.floor(
                a.y + a.h / 2
            );

        const tx =
            Math.floor(
                b.x + b.w / 2
            );

        const ty =
            Math.floor(
                b.y + b.h / 2
            );

        while (
            cx !== tx
        ) {

            map[cy][cx] =
                TILE.FLOOR;

            cx +=
                cx < tx
                ? 1
                : -1;
        }

        while (
            cy !== ty
        ) {

            map[cy][cx] =
                TILE.FLOOR;

            cy +=
                cy < ty
                ? 1
                : -1;
        }
    }
}

// =====================================================
// EXIT
// =====================================================

function createExit(
    rooms
) {

    const room =
        rooms[
            rooms.length - 1
        ];

    map[
        room.y +
        room.h -
        1
    ][
        room.x +
        room.w -
        2
    ] =
        TILE.GATE;

    map[
        room.y +
        room.h -
        1
    ][
        room.x +
        room.w -
        1
    ] =
        TILE.EXIT;
}

// =====================================================
// ENEMIES
// =====================================================

function createEnemies(
    rooms
) {

    enemies = [];

    let keyPlaced =
        false;

    const names = [

        "Goblin",

        "Skeleton",

        "Bandit",

        "Cultist",

        "Spider"
    ];

    if (
        floorNumber % 5 === 0
    ) {

        const room =
            rooms[
                rooms.length - 1
            ];

        enemies.push({

            x:
                room.x + 2,

            y:
                room.y + 2,

            strength:
                15 +
                (
                    floorNumber *
                    3
                ),

            boss: true,

            hasKey: true,

            name:
                "Minotaur"
        });

        return;
    }

    for (
        let i = 1;
   
// =====================================================
// DUNGEON CRAWLER V2
// PART 2
// RENDERING + GAMEPLAY
// =====================================================

// =====================================================
// UI
// =====================================================

function updateUI() {

    document.getElementById(
        "strength"
    ).textContent =
        `Strength: ${player.strength}`;

    document.getElementById(
        "coins"
    ).textContent =
        `Coins: ${player.coins}`;

    document.getElementById(
        "keys"
    ).textContent =
        `Keys: ${player.keys}`;

    document.getElementById(
        "inv-potion"
    ).textContent =
        player.inventory.potion;

    document.getElementById(
        "inv-fury"
    ).textContent =
        player.inventory.fury;

    document.getElementById(
        "inv-shield"
    ).textContent =
        player.inventory.shield;

    document.getElementById(
        "inv-bomb"
    ).textContent =
        player.inventory.bomb;
}

// =====================================================
// DRAWING
// =====================================================

function drawMap() {

    for (
        let y = 0;
        y < ROWS;
        y++
    ) {

        for (
            let x = 0;
            x < COLS;
            x++
        ) {

            const tile =
                map[y][x];

            if (
                tile === TILE.WALL
            ) {
                ctx.fillStyle =
                    "#333";
            }
            else if (
                tile === TILE.FLOOR
            ) {
                ctx.fillStyle =
                    "#111";
            }
            else if (
                tile === TILE.GATE
            ) {
                ctx.fillStyle =
                    "#c49000";
            }
            else {
                ctx.fillStyle =
                    "#00bbbb";
            }

            ctx.fillRect(

                x * TILE_SIZE,

                y * TILE_SIZE,

                TILE_SIZE,

                TILE_SIZE
            );

            ctx.strokeStyle =
                "#222";

            ctx.strokeRect(

                x * TILE_SIZE,

                y * TILE_SIZE,

                TILE_SIZE,

                TILE_SIZE
            );
        }
    }
}

function drawItems() {

    ctx.font =
        "20px sans-serif";

    ctx.textAlign =
        "center";

    ctx.textBaseline =
        "middle";

    for (
        const item of items
    ) {

        let icon = "?";

        if (
            item.type === "coin"
        ) icon = "🪙";

        if (
            item.type === "potion"
        ) icon = "❤️";

        if (
            item.type === "fury"
        ) icon = "⚡";

        if (
            item.type === "shield"
        ) icon = "🛡";

        if (
            item.type === "bomb"
        ) icon = "💣";

        ctx.fillText(

            icon,

            item.x *
            TILE_SIZE +
            16,

            item.y *
            TILE_SIZE +
            16
        );
    }
}

function drawEnemies() {

    for (
        const enemy of enemies
    ) {

        ctx.fillStyle =
            enemy.hasKey
            ? "#ffd700"
            : "#cc4444";

        if (
            enemy.boss
        ) {

            ctx.fillStyle =
                "#aa55ff";
        }

        ctx.beginPath();

        ctx.arc(

            enemy.x *
            TILE_SIZE +
            16,

            enemy.y *
            TILE_SIZE +
            16,

            12,

            0,

            Math.PI * 2
        );

        ctx.fill();

        ctx.fillStyle =
            "#fff";

        ctx.font =
            "bold 12px monospace";

        ctx.fillText(

            enemy.strength,

            enemy.x *
            TILE_SIZE +
            16,

            enemy.y *
            TILE_SIZE +
            16
        );
    }
}

function drawPlayer() {

    ctx.fillStyle =
        player.furyCharges > 0
        ? "#ff00ff"
        : "#3399ff";

    ctx.fillRect(

        player.x *
        TILE_SIZE +
        4,

        player.y *
        TILE_SIZE +
        4,

        TILE_SIZE - 8,

        TILE_SIZE - 8
    );
}

function draw() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawMap();

    drawItems();

    drawEnemies();

    drawPlayer();

    updateUI();
}

// =====================================================
// COMBAT
// =====================================================

function fight(enemy) {

    if (
        player.bombArmed
    ) {

        player.bombArmed =
            false;

        addLog(
            `${enemy.name} destroyed by bomb`
        );

        killEnemy(enemy);

        return;
    }

    let enemyValue =
        enemy.strength;

    if (
        player.furyCharges > 0
    ) {

        enemyValue =
            Math.ceil(
                enemyValue / 2
            );

        player.furyCharges--;

        addLog(
            "Fury activated"
        );
    }

    if (
        player.shieldActive
    ) {

        enemyValue =
            Math.ceil(
                enemyValue / 2
            );

        player.shieldActive =
            false;

        addLog(
            "Shield activated"
        );
    }

    if (
        player.strength >
        enemyValue
    ) {

        addLog(
            `Defeated ${enemy.name}`
        );

        killEnemy(enemy);
    }
    else {

        gameActive = false;

        addLog(
            "☠ YOU DIED"
        );
    }
}

function killEnemy(enemy) {

    if (
        enemy.hasKey
    ) {

        player.keys++;

        addLog(
            "Obtained key"
        );
    }

    if (
        enemy.boss
    ) {

        player.strength += 5;

        addLog(
            "+5 Strength from boss"
        );
    }

    enemies =
        enemies.filter(
            e => e !== enemy
        );
}

// =====================================================
// ITEMS
// =====================================================

function pickupItem() {

    const item =
        items.find(

            i =>

                i.x === player.x &&
                i.y === player.y
        );

    if (!item) {
        return;
    }

    if (
        item.type === "coin"
    ) {

        player.coins +=
            item.value || 5;

        addLog(
            "Found coins"
        );
    }

    if (
        item.type === "potion"
    ) {

        player.inventory.potion++;

        addLog(
            "Found potion"
        );
    }

    if (
        item.type === "fury"
    ) {

        player.inventory.fury++;

        addLog(
            "Found fury"
        );
    }

    if (
        item.type === "shield"
    ) {

        player.inventory.shield++;

        addLog(
            "Found shield"
        );
    }

    if (
        item.type === "bomb"
    ) {

        player.inventory.bomb++;

        addLog(
            "Found bomb"
        );
    }

    items =
        items.filter(
            i => i !== item
        );
}

// =====================================================
// HOTKEY ITEMS
// =====================================================

function usePotion() {

    if (
        player.inventory.potion < 1
    ) return;

    player.inventory.potion--;

    player.strength += 2;

    addLog(
        "+2 Strength"
    );
}

function useFury() {

    if (
        player.inventory.fury < 1
    ) return;

    player.inventory.fury--;

    player.furyCharges = 3;

    addLog(
        "Fury for 3 battles"
    );
}

function useShield() {

    if (
        player.inventory.shield < 1
    ) return;

    player.inventory.shield--;

    player.shieldActive =
        true;

    addLog(
        "Shield ready"
    );
}

function useBomb() {

    if (
        player.inventory.bomb < 1
    ) return;

    player.inventory.bomb--;

    player.bombArmed =
        true;

    addLog(
        "Bomb armed"
    );
}

// =====================================================
// MOVEMENT
// =====================================================

window.addEventListener(
    "keydown",
    keyPress
);

function keyPress(event) {

    if (!gameActive) {
        return;
    }

    const key =
        event.key.toLowerCase();

    if (key === "1") {
        usePotion();
        draw();
        return;
    }

    if (key === "2") {
        useFury();
        draw();
        return;
    }

    if (key === "3") {
        useShield();
        draw();
        return;
    }

    if (key === "4") {
        useBomb();
        draw();
        return;
    }

    let dx = 0;
    let dy = 0;

    if (
        key === "w" ||
        event.key === "ArrowUp"
    ) dy = -1;

    if (
        key === "s" ||
        event.key === "ArrowDown"
    ) dy = 1;

    if (
        key === "a" ||
        event.key === "ArrowLeft"
    ) dx = -1;

    if (
        key === "d" ||
        event.key === "ArrowRight"
    ) dx = 1;

    if (
        dx === 0 &&
        dy === 0
    ) {
        return;
    }

    const nx =
        player.x + dx;

    const ny =
        player.y + dy;

    if (
        map[ny][nx] ===
        TILE.WALL
    ) {
        return;
    }

    if (
        map[ny][nx] ===
        TILE.GATE
    ) {

        if (
            player.keys > 0
        ) {

            player.keys--;

            map[ny][nx] =
                TILE.FLOOR;
        }
        else {

            addLog(
                "Need a key"
            );

            return;
        }
    }

    const enemy =
        enemies.find(

            e =>

                e.x === nx &&
                e.y === ny
        );

    if (enemy) {

        fight(enemy);

        draw();

        return;
    }

    player.x = nx;
    player.y = ny;

    pickupItem();

    if (
        map[player.y][player.x]
        === TILE.EXIT
    ) {

        document
            .getElementById(
                "modal"
            )
            .style.display =
            "block";
    }

    draw();
}

// =====================================================
// FLOORS
// =====================================================

function nextFloor() {

    floorNumber++;

    document
        .getElementById(
            "modal"
        )
        .style.display =
        "none";

    generateDungeon();

    draw();
}

// =====================================================
// SLOT MACHINE
// =====================================================

function spinBandit() {

    if (
        player.coins < 5
    ) {

        addLog(
            "Need 5 coins"
        );

        return;
    }

    player.coins -= 5;

    const icons = [

        "🍒",
        "⚡",
        "💎",
        "🪙"
    ];

    const s1 =
        icons[
            Math.floor(
                Math.random() * 4
            )
        ];

    const s2 =
        icons[
            Math.floor(
                Math.random() * 4
            )
        ];

    const s3 =
        icons[
            Math.floor(
                Math.random() * 4
            )
        ];

    document.getElementById(
        "slot1"
    ).textContent = s1;

    document.getElementById(
        "slot2"
    ).textContent = s2;

    document.getElementById(
        "slot3"
    ).textContent = s3;

    if (
        s1 === s2 &&
        s2 === s3
    ) {

        player.strength += 5;

        addLog(
            "JACKPOT! +5 Strength"
        );
    }

    draw();
}

// =====================================================
// BUTTONS
// =====================================================

document
    .getElementById(
        "spinBtn"
    )
    .onclick =
    spinBandit;

document
    .getElementById(
        "nextFloorBtn"
    )
    .onclick =
    nextFloor;

// =====================================================
// START
// =====================================================

addLog(
    "Welcome to the dungeon"
);

generateDungeon();

draw();