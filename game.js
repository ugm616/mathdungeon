// ======================================================
// DUNGEON CRAWLER V2
// CHUNK 1 OF 5
// CORE SETUP
// ======================================================

// --------------------
// CANVAS
// --------------------

const canvas =
    document.getElementById(
        "gameCanvas"
    );

const ctx =
    canvas.getContext("2d");

// --------------------
// CONSTANTS
// --------------------

const TILE_SIZE = 32;

const COLS = 20;
const ROWS = 15;

const TILE = {

    WALL: 0,
    FLOOR: 1,
    GATE: 2,
    EXIT: 3
};

// --------------------
// GAME STATE
// --------------------

let floorNumber = 1;

let floorTheme =
    "Barracks";

let gameActive =
    true;

let map = [];

let enemies = [];

let items = [];

// --------------------
// PLAYER
// --------------------

const player = {

    x: 1,
    y: 1,

    strength: 20,
    maxStrength: 20,

    coins: 0,
    keys: 0,

    inventory: {

        fury: 1,
        potion: 1,
        shield: 1,
        bomb: 1
    },

    furyCharges: 0,

    shieldActive: false,

    bombArmed: false
};

// --------------------
// LOGGING
// --------------------

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

// --------------------
// THEMES
// --------------------

function chooseTheme() {

    if (
        floorNumber % 5 === 0
    ) {

        return "Arena";
    }

    const themes = [

        "Barracks",

        "Treasury",

        "Crypt",

        "Laboratory"
    ];

    return themes[
        Math.floor(
            Math.random() *
            themes.length
        )
    ];
}

// --------------------
// DUNGEON GENERATION
// --------------------

function generateDungeon() {

    floorTheme =
        chooseTheme();

    map =
        Array(ROWS)
            .fill()
            .map(() =>
                Array(COLS)
                .fill(TILE.WALL)
            );

    const rooms = [];

    const roomCount =
        floorTheme ===
        "Barracks"
        ? 6
        : 4;

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
            3 +
            Math.floor(
                Math.random() * 3
            );

        const x =
            1 +
            Math.floor(
                Math.random() *
                (
                    COLS -
                    w -
                    2
                )
            );

        const y =
            1 +
            Math.floor(
                Math.random() *
                (
                    ROWS -
                    h -
                    2
                )
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
        rooms[0].x;

    player.y =
        rooms[0].y;

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
        `Entered ${floorTheme}`
    );
}

// --------------------
// CONNECT ROOMS
// --------------------

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
                a.x +
                a.w / 2
            );

        let cy =
            Math.floor(
                a.y +
                a.h / 2
            );

        const tx =
            Math.floor(
                b.x +
                b.w / 2
            );

        const ty =
            Math.floor(
                b.y +
                b.h / 2
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

// --------------------
// EXIT
// --------------------

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

// --------------------
// ENEMIES
// --------------------

function createEnemies(
    rooms
) {

    enemies = [];

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
                30 +
                (
                    floorNumber *
                    5
                ),

            boss:
                true,

            hasKey:
                true,

            name:
                "Minotaur"
        });

        return;
    }

    const enemyNames = [

        "Goblin",

        "Skeleton",

        "Bandit",

        "Wolf",

        "Cultist",

        "Spider"
    ];

    let keyPlaced =
        false;

    for (
        let i = 1;
        i < rooms.length;
        i++
    ) {

        const room =
            rooms[i];

        const strength =
            (
                Math.floor(
                    Math.random() * 8
                ) +
                floorNumber +
                3
            );

        const name =
            enemyNames[
                Math.floor(
                    Math.random() *
                    enemyNames.length
                )
            ];

        enemies.push({

            x:
                room.x + 1,

            y:
                room.y + 1,

            strength,

            name:
                !keyPlaced
                ? "Gatekeeper"
                : name,

            hasKey:
                !keyPlaced,

            boss:
                false
        });

        keyPlaced =
            true;
    }
}

// --------------------
// ITEMS
// --------------------

function createItems(
    rooms
) {

    items = [];

    items.push({

        x:
            rooms[0].x + 1,

        y:
            rooms[0].y + 1,

        type:
            "potion"
    });

    if (
        floorTheme ===
        "Laboratory"
    ) {

        items.push({

            x:
                rooms[1].x + 1,

            y:
                rooms[1].y + 1,

            type:
                "fury"
        });

        items.push({

            x:
                rooms[2].x + 1,

            y:
                rooms[2].y + 1,

            type:
                "fury"
        });
    }

    if (
        floorTheme ===
        "Crypt"
    ) {

        items.push({

            x:
                rooms[1].x + 2,

            y:
                rooms[1].y + 1,

            type:
                "shield"
        });
    }

    if (
        floorTheme ===
        "Treasury"
    ) {

        items.push({

            x:
                rooms[1].x + 1,

            y:
                rooms[1].y + 1,

            type:
                "coin",

            value: 10
        });

        items.push({

            x:
                rooms[2].x + 1,

            y:
                rooms[2].y + 1,

            type:
                "coin",

            value: 10
        });
    }
}

// ======================================================
// DUNGEON CRAWLER V2
// CHUNK 2 OF 5
// RENDERING & UI
// ======================================================

// --------------------
// UI
// --------------------

function updateUI() {

    const strength =
        document.getElementById(
            "strength"
        );

    const coins =
        document.getElementById(
            "coins"
        );

    const keys =
        document.getElementById(
            "keys"
        );

    strength.textContent =
        `Strength: ${player.strength}/${player.maxStrength}`;

    coins.textContent =
        `Coins: ${player.coins}`;

    keys.textContent =
        `Keys: ${player.keys}`;

    updateInventory();
}

function updateInventory() {

    document.getElementById(
        "inv-fury"
    ).textContent =
        player.inventory.fury;

    document.getElementById(
        "inv-potion"
    ).textContent =
        player.inventory.potion;

    document.getElementById(
        "inv-shield"
    ).textContent =
        player.inventory.shield;

    document.getElementById(
        "inv-bomb"
    ).textContent =
        player.inventory.bomb;
}

// --------------------
// MAP
// --------------------

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
                    "#2b2b2b";
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
                    "#b8860b";
            }
            else if (
                tile === TILE.EXIT
            ) {

                ctx.fillStyle =
                    "#00ced1";
            }

            ctx.fillRect(

                x * TILE_SIZE,

                y * TILE_SIZE,

                TILE_SIZE,

                TILE_SIZE
            );

            ctx.strokeStyle =
                "#1a1a1a";

            ctx.strokeRect(

                x * TILE_SIZE,

                y * TILE_SIZE,

                TILE_SIZE,

                TILE_SIZE
            );
        }
    }
}

// --------------------
// ITEMS
// --------------------

function drawItems() {

    ctx.font =
        "20px sans-serif";

    ctx.textAlign =
        "center";

    ctx.textBaseline =
        "middle";

    for (
        const item
        of items
    ) {

        let icon = "?";

        if (
            item.type === "coin"
        ) {

            icon = "🪙";
        }

        if (
            item.type === "potion"
        ) {

            icon = "❤️";
        }

        if (
            item.type === "fury"
        ) {

            icon = "⚡";
        }

        if (
            item.type === "shield"
        ) {

            icon = "🛡";
        }

        if (
            item.type === "bomb"
        ) {

            icon = "💣";
        }

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

// --------------------
// ENEMIES
// --------------------

function drawEnemies() {

    for (
        const enemy
        of enemies
    ) {

        if (
            enemy.boss
        ) {

            ctx.fillStyle =
                "#9b59b6";
        }
        else if (
            enemy.hasKey
        ) {

            ctx.fillStyle =
                "#ffd700";
        }
        else {

            ctx.fillStyle =
                "#e74c3c";
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

        ctx.textAlign =
            "center";

        ctx.textBaseline =
            "middle";

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

// --------------------
// PLAYER
// --------------------

function drawPlayer() {

    if (
        player.furyCharges > 0
    ) {

        ctx.fillStyle =
            "#ff00ff";
    }
    else {

        ctx.fillStyle =
            "#3498db";
    }

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

    ctx.fillStyle =
        "#fff";

    ctx.font =
        "bold 12px monospace";

    ctx.textAlign =
        "center";

    ctx.textBaseline =
        "middle";

    ctx.fillText(

        player.strength,

        player.x *
            TILE_SIZE +
            16,

        player.y *
            TILE_SIZE +
            16
    );
}

// --------------------
// FLOOR INFO
// --------------------

function drawFloorInfo() {

    ctx.fillStyle =
        "rgba(0,0,0,0.7)";

    ctx.fillRect(
        8,
        8,
        180,
        55
    );

    ctx.fillStyle =
        "#fff";

    ctx.font =
        "14px monospace";

    ctx.textAlign =
        "left";

    ctx.textBaseline =
        "alphabetic";

    ctx.fillText(
        `Floor: ${floorNumber}`,
        16,
        28
    );

    ctx.fillText(
        `Theme: ${floorTheme}`,
        16,
        48
    );
}

// --------------------
// EFFECTS
// --------------------

function drawEffects() {

    let y = 80;

    if (
        player.furyCharges > 0
    ) {

        ctx.fillStyle =
            "#ff00ff";

        ctx.fillText(

            `⚡ Fury ${player.furyCharges}`,

            16,

            y
        );

        y += 20;
    }

    if (
        player.shieldActive
    ) {

        ctx.fillStyle =
            "#00ff99";

        ctx.fillText(

            "🛡 Shield",

            16,

            y
        );
    }
}

// --------------------
// DRAW EVERYTHING
// --------------------

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

    drawFloorInfo();

    drawEffects();
}

// --------------------
// REFRESH
// --------------------

function refresh() {

    updateUI();

    draw();
}

// ======================================================
// DUNGEON CRAWLER V2
// CHUNK 3 OF 5
// GAMEPLAY
// ======================================================

// --------------------
// KEYBOARD INPUT
// --------------------

window.addEventListener(
    "keydown",
    handleInput
);

function handleInput(event) {

    if (!gameActive) {
        return;
    }

    const modal =
        document.getElementById(
            "modal"
        );

    if (
        modal &&
        modal.style.display === "block"
    ) {
        return;
    }

    const key =
        event.key.toLowerCase();

    // Inventory Hotkeys

    if (key === "1") {

        usePotion();
        refresh();
        return;
    }

    if (key === "2") {

        useFury();
        refresh();
        return;
    }

    if (key === "3") {

        useShield();
        refresh();
        return;
    }

    if (key === "4") {

        useBomb();
        refresh();
        return;
    }

    let dx = 0;
    let dy = 0;

    if (
        key === "w" ||
        event.key === "ArrowUp"
    ) {
        dy = -1;
    }
    else if (
        key === "s" ||
        event.key === "ArrowDown"
    ) {
        dy = 1;
    }
    else if (
        key === "a" ||
        event.key === "ArrowLeft"
    ) {
        dx = -1;
    }
    else if (
        key === "d" ||
        event.key === "ArrowRight"
    ) {
        dx = 1;
    }
    else {
        return;
    }

    takeTurn(
        dx,
        dy
    );
}

// --------------------
// PLAYER TURN
// --------------------

function takeTurn(
    dx,
    dy
) {

    const nx =
        player.x + dx;

    const ny =
        player.y + dy;

    if (
        nx < 0 ||
        ny < 0 ||
        nx >= COLS ||
        ny >= ROWS
    ) {
        return;
    }

    const tile =
        map[ny][nx];

    if (
        tile === TILE.WALL
    ) {
        return;
    }

    // Gate

    if (
        tile === TILE.GATE
    ) {

        if (
            player.keys > 0
        ) {

            player.keys--;

            map[ny][nx] =
                TILE.FLOOR;

            addLog(
                "Unlocked gate"
            );
        }
        else {

            addLog(
                "You need a key"
            );

            refresh();

            return;
        }
    }

    // Enemy

    const enemy =
        enemies.find(

            e =>

                e.x === nx &&
                e.y === ny
        );

    if (enemy) {

        fight(enemy);

        refresh();

        return;
    }

    player.x = nx;
    player.y = ny;

    pickupItems();

    checkExit();

    refresh();
}

// --------------------
// PICKUPS
// --------------------

function pickupItems() {

    const index =
        items.findIndex(

            item =>

                item.x === player.x &&
                item.y === player.y
        );

    if (
        index === -1
    ) {
        return;
    }

    const item =
        items[index];

    switch (
        item.type
    ) {

        case "coin":

            player.coins +=
                item.value || 1;

            addLog(
                `Found ${item.value || 1} coins`
            );

            break;

        case "potion":

            player.inventory.potion++;

            addLog(
                "Found a Potion"
            );

            break;

        case "fury":

            player.inventory.fury++;

            addLog(
                "Found Fury"
            );

            break;

        case "shield":

            player.inventory.shield++;

            addLog(
                "Found a Shield"
            );

            break;

        case "bomb":

            player.inventory.bomb++;

            addLog(
                "Found a Bomb"
            );

            break;
    }

    items.splice(
        index,
        1
    );
}

// --------------------
// COMBAT
// --------------------

function fight(enemy) {

    // Bomb kills instantly

    if (
        player.bombArmed
    ) {

        player.bombArmed =
            false;

        addLog(
            `${enemy.name} blown up`
        );

        killEnemy(
            enemy
        );

        return;
    }

    let enemyValue =
        enemy.strength;

    // Fury

    if (
        player.furyCharges > 0
    ) {

        enemyValue =
            Math.ceil(
                enemyValue / 2
            );

        player.furyCharges--;

        addLog(
            `Fury reduced enemy to ${enemyValue}`
        );
    }

    // Shield

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
            `Shield reduced enemy to ${enemyValue}`
        );
    }

    if (
        player.strength >
        enemyValue
    ) {

        player.strength -=
            enemyValue;

        addLog(
            `Defeated ${enemy.name} (-${enemyValue})`
        );

        killEnemy(
            enemy
        );
    }
    else {

        player.strength = 0;

        gameOver(
            `${enemy.name} was too strong`
        );
    }
}

// --------------------
// KILL ENEMY
// --------------------

function killEnemy(enemy) {

    if (
        enemy.hasKey
    ) {

        player.keys++;

        addLog(
            "Found dungeon key"
        );
    }

    if (
        enemy.boss
    ) {

        player.maxStrength += 10;

        player.strength += 10;

        player.inventory.bomb++;

        addLog(
            "Boss reward: +10 Strength and +1 Bomb"
        );
    }

    if (
        Math.random() < 0.6
    ) {

        items.push({

            x: enemy.x,

            y: enemy.y,

            type: "coin",

            value:
                Math.floor(
                    Math.random() * 4
                ) + 1
        });
    }

    enemies =
        enemies.filter(
            e => e !== enemy
        );
}

// --------------------
// POTION
// --------------------

function usePotion() {

    if (
        player.inventory.potion <= 0
    ) {

        addLog(
            "No Potions"
        );

        return;
    }

    player.inventory.potion--;

    player.strength =
        Math.min(

            player.maxStrength,

            player.strength + 10
        );

    addLog(
        "+10 Strength"
    );
}

// --------------------
// FURY
// --------------------

function useFury() {

    if (
        player.inventory.fury <= 0
    ) {

        addLog(
            "No Fury"
        );

        return;
    }

    player.inventory.fury--;

    player.furyCharges = 3;

    addLog(
        "Fury active for next 3 fights"
    );
}

// --------------------
// SHIELD
// --------------------

function useShield() {

    if (
        player.inventory.shield <= 0
    ) {

        addLog(
            "No Shield"
        );

        return;
    }

    player.inventory.shield--;

    player.shieldActive =
        true;

    addLog(
        "Shield active"
    );
}

// --------------------
// BOMB
// --------------------

function useBomb() {

    if (
        player.inventory.bomb <= 0
    ) {

        addLog(
            "No Bombs"
        );

        return;
    }

    player.inventory.bomb--;

    player.bombArmed =
        true;

    addLog(
        "Bomb armed"
    );
}

// --------------------
// EXIT
// --------------------

function checkExit() {

    if (
        map[player.y][player.x]
        !== TILE.EXIT
    ) {
        return;
    }

    document
        .getElementById(
            "modal"
        )
        .style.display =
        "block";

    addLog(
        `Floor ${floorNumber} cleared`
    );
}

// --------------------
// GAME OVER
// --------------------

function gameOver(reason) {

    gameActive =
        false;

    addLog(
        "☠ GAME OVER"
    );

    addLog(
        reason
    );

    refresh();
}

// ======================================================
// DUNGEON CRAWLER V2
// CHUNK 4 OF 5
// PROGRESSION & REWARDS
// ======================================================

// --------------------
// NEXT FLOOR
// --------------------

function nextFloor() {

    floorNumber++;

    checkVictory();

    if (!gameActive) {
        return;
    }

    document
        .getElementById(
            "modal"
        )
        .style.display =
        "none";

    generateDungeon();

    // Shop every 3 floors

    if (
        floorNumber % 3 === 0
    ) {

        enterShop();
    }

    addLog(
        `Entered Floor ${floorNumber}`
    );

    refresh();
}

// --------------------
// SLOT MACHINE
// --------------------

function randomSymbol() {

    const symbols = [

        "🍒",
        "⚡",
        "💎",
        "🪙"

    ];

    return symbols[
        Math.floor(
            Math.random() *
            symbols.length
        )
    ];
}

function spinBandit() {

    if (
        player.coins < 5
    ) {

        addLog(
            "Need 5 coins to spin"
        );

        return;
    }

    player.coins -= 5;

    const s1 =
        randomSymbol();

    const s2 =
        randomSymbol();

    const s3 =
        randomSymbol();

    document
        .getElementById(
            "slot1"
        )
        .textContent = s1;

    document
        .getElementById(
            "slot2"
        )
        .textContent = s2;

    document
        .getElementById(
            "slot3"
        )
        .textContent = s3;

    evaluateSpin(
        s1,
        s2,
        s3
    );

    refresh();
}

function evaluateSpin(
    s1,
    s2,
    s3
) {

    const triple =

        s1 === s2 &&
        s2 === s3;

    const pair =

        s1 === s2 ||
        s2 === s3 ||
        s1 === s3;

    if (triple) {

        rewardTriple();

        return;
    }

    if (pair) {

        rewardPair();

        return;
    }

    addLog(
        "No reward"
    );
}

// --------------------
// TRIPLE MATCH
// --------------------

function rewardTriple() {

    const choice = prompt(

        "JACKPOT!\n\n" +

        "1 = +15 Max Strength\n" +

        "2 = Fury Potion\n" +

        "3 = Bomb"
    );

    if (
        choice === "1"
    ) {

        player.maxStrength += 15;

        player.strength += 15;

        addLog(
            "+15 Max Strength"
        );
    }

    else if (
        choice === "2"
    ) {

        player.inventory.fury++;

        addLog(
            "+1 Fury"
        );
    }

    else if (
        choice === "3"
    ) {

        player.inventory.bomb++;

        addLog(
            "+1 Bomb"
        );
    }
}

// --------------------
// PAIR MATCH
// --------------------

function rewardPair() {

    const choice = prompt(

        "PAIR MATCH!\n\n" +

        "1 = +5 Max Strength\n" +

        "2 = Potion"
    );

    if (
        choice === "1"
    ) {

        player.maxStrength += 5;

        player.strength += 5;

        addLog(
            "+5 Max Strength"
        );
    }

    else if (
        choice === "2"
    ) {

        player.inventory.potion++;

        addLog(
            "+1 Potion"
        );
    }
}

// --------------------
// SHOP
// --------------------

function enterShop() {

    const choice = prompt(

        "SHOP\n\n" +

        `Coins: ${player.coins}\n\n` +

        "1 = Potion (10)\n" +

        "2 = Fury (12)\n" +

        "3 = Shield (15)\n" +

        "4 = Bomb (20)\n\n" +

        "Anything Else = Leave"
    );

    switch (choice) {

        case "1":

            buyItem(
                10,
                "potion"
            );

            break;

        case "2":

            buyItem(
                12,
                "fury"
            );

            break;

        case "3":

            buyItem(
                15,
                "shield"
            );

            break;

        case "4":

            buyItem(
                20,
                "bomb"
            );

            break;
    }
}

function buyItem(
    cost,
    item
) {

    if (
        player.coins < cost
    ) {

        addLog(
            "Not enough coins"
        );

        return;
    }

    player.coins -= cost;

    player.inventory[item]++;

    addLog(
        `Bought ${item}`
    );

    refresh();
}

// --------------------
// VICTORY
// --------------------

function checkVictory() {

    if (
        floorNumber > 20
    ) {

        gameActive = false;

        addLog(
            "🏆 YOU WON THE DUNGEON!"
        );

        refresh();
    }
}

// --------------------
// BUTTONS
// --------------------

document
    .getElementById(
        "spinBtn"
    )
    .addEventListener(
        "click",
        spinBandit
    );

document
    .getElementById(
        "nextFloorBtn"
    )
    .addEventListener(
        "click",
        nextFloor
    );

// --------------------
// START GAME
// --------------------

addLog(
    "Welcome to Dungeon Crawler V2"
);

addLog(
    "Move with WASD or Arrow Keys"
);

addLog(
    "1=Potion  2=Fury  3=Shield  4=Bomb"
);

generateDungeon();

refresh();

// ======================================================
// DUNGEON CRAWLER V2
// CHUNK 5 OF 5
// BONUS CONTENT & POLISH
// ======================================================

// --------------------
// TREASURE CHESTS
// --------------------

function spawnTreasureChest() {

    if (
        Math.random() > 0.30
    ) {
        return;
    }

    for (
        let y = 1;
        y < ROWS - 1;
        y++
    ) {

        for (
            let x = 1;
            x < COLS - 1;
            x++
        ) {

            if (
                map[y][x] === TILE.FLOOR &&
                !items.some(
                    item =>
                        item.x === x &&
                        item.y === y
                )
            ) {

                items.push({

                    x: x,

                    y: y,

                    type: "chest"
                });

                addLog(
                    "A treasure chest appeared."
                );

                return;
            }
        }
    }
}

// --------------------
// CHEST REWARDS
// --------------------

function openChest() {

    const rewards = [

        "coins",
        "coins",
        "coins",
        "potion",
        "fury",
        "shield",
        "bomb"
    ];

    const reward =

        rewards[
            Math.floor(
                Math.random() *
                rewards.length
            )
        ];

    switch (
        reward
    ) {

        case "coins":

            const amount =
                Math.floor(
                    Math.random() * 10
                ) + 5;

            player.coins += amount;

            addLog(
                `Chest contained ${amount} coins`
            );

            break;

        case "potion":

            player.inventory.potion++;

            addLog(
                "Chest contained a Potion"
            );

            break;

        case "fury":

            player.inventory.fury++;

            addLog(
                "Chest contained Fury"
            );

            break;

        case "shield":

            player.inventory.shield++;

            addLog(
                "Chest contained a Shield"
            );

            break;

        case "bomb":

            player.inventory.bomb++;

            addLog(
                "Chest contained a Bomb"
            );

            break;
    }
}

// --------------------
// PICKUP CHESTS
// --------------------

const originalPickupItems =
    pickupItems;

pickupItems = function() {

    const index =
        items.findIndex(

            item =>

                item.x === player.x &&
                item.y === player.y
        );

    if (
        index === -1
    ) {
        return;
    }

    const item =
        items[index];

    if (
        item.type === "chest"
    ) {

        openChest();

        items.splice(
            index,
            1
        );

        return;
    }

    originalPickupItems();
};

// --------------------
// BONUS BOSS REWARDS
// --------------------

const originalKillEnemy =
    killEnemy;

killEnemy = function(enemy) {

    originalKillEnemy(
        enemy
    );

    if (
        enemy.boss
    ) {

        player.inventory.fury++;

        player.inventory.shield++;

        addLog(
            "Boss bonus: Fury and Shield"
        );
    }
};

// --------------------
// FLOOR START BONUS
// --------------------

function grantFloorBonus() {

    if (
        floorNumber <= 1
    ) {
        return;
    }

    if (
        floorNumber % 4 === 0
    ) {

        player.coins += 5;

        addLog(
            "Explorer bonus: +5 coins"
        );
    }
}

// --------------------
// STRONGER LATE GAME
// --------------------

function upgradeEnemies() {

    if (
        floorNumber < 10
    ) {
        return;
    }

    for (
        const enemy
        of enemies
    ) {

        enemy.strength +=
            Math.floor(
                floorNumber / 2
            );
    }
}

// --------------------
// BETTER SHOPS
// --------------------

const oldEnterShop =
    enterShop;

enterShop = function() {

    oldEnterShop();

    if (
        Math.random() < 0.20
    ) {

        player.inventory.potion++;

        addLog(
            "Shopkeeper gave a free Potion"
        );
    }
};

// --------------------
// BETTER FLOOR START
// --------------------

const oldGenerateDungeon =
    generateDungeon;

generateDungeon = function() {

    oldGenerateDungeon();

    grantFloorBonus();

    upgradeEnemies();

    spawnTreasureChest();
};

// --------------------
// RARE LUCKY FIND
// --------------------

function luckyFind() {

    if (
        Math.random() > 0.03
    ) {
        return;
    }

    player.maxStrength += 5;

    player.strength += 5;

    addLog(
        "Lucky Find! +5 Max Strength"
    );
}

// --------------------
// EXTRA REFRESH
// --------------------

const oldRefresh =
    refresh;

refresh = function() {

    luckyFind();

    oldRefresh();
};