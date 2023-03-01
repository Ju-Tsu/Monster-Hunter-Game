const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;

const MODE_ATTACK = 'ATTACK';
const MODE_STRONG_ATTACK = 'STRONG_ATTACK';
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_HEAL = 'HEAL';
const LOG_EVENT_GAME_OVER = 'GAME OVER';

const enteredValue = prompt('Maximum life for you and the monster', '100');

let chosenMaxLife = parseInt(enteredValue);
let battleLog = [];

if (isNaN(chosenMaxLife) || chosenMaxLife <= 0) {
    chosenMaxLife = 100;
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

function writeToLog (event, value, currentMonsterHealth, currentPlayerHealth) {
    let logEntry = {
        event: event,
        value: value,
        finalMonsterHealth: currentMonsterHealth,
        finalPlayerHealth: currentPlayerHealth
    };
    if (event === LOG_EVENT_PLAYER_ATTACK) {
        logEntry.target = 'MONSTER';
    } else if (event === LOG_EVENT_PLAYER_STRONG_ATTACK) {
        logEntry.target = 'MONSTER';
    } else if (event === LOG_EVENT_MONSTER_ATTACK) {
        logEntry.target = 'PLAYER';
    } else if (event === LOG_EVENT_HEAL) {
        logEntry.target = 'PLAYER';
    } else if (event === LOG_EVENT_GAME_OVER) {
        logEntry = {
            event: event,
            value: value,
            finalMonsterHealth: currentMonsterHealth,
            finalPlayerHealth: currentPlayerHealth
        };
    }
    battleLog.push(logEntry);
}

adjustHealthBars(chosenMaxLife);
function reset () {
    currentMonsterHealth = chosenMaxLife;
    currentPlayerHealth = chosenMaxLife;
    resetGame(chosenMaxLife);
}

function endRound() {
    const initialPlayerHealth = currentPlayerHealth;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;
    writeToLog(
                LOG_EVENT_MONSTER_ATTACK,
                playerDamage,
                currentPlayerHealth,
                currentMonsterHealth
    );

    if (currentPlayerHealth <= 0 && hasBonusLife) {
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerHealth;
        alert('You would be dead. Bonus life has been used');
        setPlayerHealth(initialPlayerHealth);
    }

    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
        alert('Well done the Ashen One');
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'PLAYER WON!',
            currentPlayerHealth,
            currentMonsterHealth
        );
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
        alert('YOU DIED');
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'PLAYER LOSE!',
            currentPlayerHealth,
            currentMonsterHealth
        );
    } else if (currentMonsterHealth <=0 && currentPlayerHealth <= 0) {
        alert('DRAW!')
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'DRAW',
            currentPlayerHealth,
            currentMonsterHealth
        );
    }

    if (currentPlayerHealth <= 0 || currentMonsterHealth <=0) {
        reset();
    }

}
function attackMonster(mode) {
    let maxDamage;
    if (mode === MODE_ATTACK) {
        maxDamage = ATTACK_VALUE;
    } else if (mode === MODE_STRONG_ATTACK){
        maxDamage = STRONG_ATTACK_VALUE;
    }
    const damage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= damage;
    endRound();
}

function attackHandler() {
    attackMonster(MODE_ATTACK);
}

function strongAttackHandler() {
    attackMonster(MODE_STRONG_ATTACK);
}

function healPlayerHandler() {
    let healValue;
    if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
        alert("You can't heal more than 100hp");
        healValue = chosenMaxLife - currentPlayerHealth;
    } else {
        healValue = HEAL_VALUE;
    }
    increasePlayerHealth(healValue);
    currentPlayerHealth += healValue;
    endRound();
}

function showLogHandler() {
    console.log(battleLog);
}

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPlayerHandler)
logBtn.addEventListener('click', showLogHandler);



