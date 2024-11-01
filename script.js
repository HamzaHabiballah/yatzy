// Dice class
class Dice {
    constructor(numDice = 5) {
        this.numDice = numDice;
        this.currentValues = Array(this.numDice).fill(1);
    }

    roll() {
        this.currentValues = this.currentValues.map(() => Math.floor(Math.random() * 6) + 1);
        return this.currentValues;
    }

    getValues() {
        return this.currentValues;
    }
}

// YatzyEngine class
class YatzyEngine {
    calculateScore(category, diceValues) {
        switch (category) {
            case 'Ones': return this.calculateUpperSection(diceValues, 1);
            case 'Twos': return this.calculateUpperSection(diceValues, 2);
            case 'Threes': return this.calculateUpperSection(diceValues, 3);
            case 'Fours': return this.calculateUpperSection(diceValues, 4);
            case 'Fives': return this.calculateUpperSection(diceValues, 5);
            case 'Sixes': return this.calculateUpperSection(diceValues, 6);
            case 'Three of a Kind': return this.calculateOfAKind(diceValues, 3);
            case 'Four of a Kind': return this.calculateOfAKind(diceValues, 4);
            case 'Full House': return this.calculateFullHouse(diceValues);
            case 'Small Straight': return this.calculateStraight(diceValues, 'small');
            case 'Large Straight': return this.calculateStraight(diceValues, 'large');
            case 'Chance': return this.calculateChance(diceValues);
            case 'Yatzy': return this.calculateYatzy(diceValues);
            default: return 0;
        }
    }

    calculateUpperSection(diceValues, targetNumber) {
        return diceValues.filter(value => value === targetNumber).reduce((a, b) => a + b, 0);
    }

    calculateOfAKind(diceValues, count) {
        for (let i = 1; i <= 6; i++) {
            if (diceValues.filter(value => value === i).length >= count) {
                return diceValues.reduce((a, b) => a + b, 0);
            }
        }
        return 0;
    }

    calculateFullHouse(diceValues) {
        const counts = {};
        diceValues.forEach(value => counts[value] = (counts[value] || 0) + 1);
        const values = Object.values(counts);
        return values.includes(3) && values.includes(2) ? 25 : 0;
    }

    calculateStraight(diceValues, type) {
        const uniqueSortedValues = [...new Set(diceValues)].sort((a, b) => a - b);
        const smallStraight = [1, 2, 3, 4, 5];
        const largeStraight = [2, 3, 4, 5, 6];
        if (type === 'small' && this.isSubArray(uniqueSortedValues, smallStraight)) {
            return 30;
        }
        if (type === 'large' && this.isSubArray(uniqueSortedValues, largeStraight)) {
            return 40;
        }
        return 0;
    }

    calculateChance(diceValues) {
        return diceValues.reduce((a, b) => a + b, 0);
    }

    calculateYatzy(diceValues) {
        return diceValues.every(value => value === diceValues[0]) ? 50 : 0;
    }

    isSubArray(array, subArray) {
        return subArray.every(value => array.includes(value));
    }
}

// YatzyGame class
class YatzyGame {
    constructor() {
        this.dice = new Dice();
        this.engine = new YatzyEngine();
        this.scores = {};
        this.currentTurn = 0;
        this.maxTurns = 13;

        document.querySelectorAll('#scoreboard tbody tr').forEach(row => {
            row.addEventListener('click', (event) => {
                const category = event.currentTarget.cells[0].textContent.trim();
                this.endTurn(category);
            });
        });

        document.getElementById('clear-stats').addEventListener('click', () => {
            this.clearStatistics();
        });
    }

    startNewGame() {
        this.scores = {};
        this.currentTurn = 0;
        document.getElementById('total-score').textContent = '0';
        this.updateScoreboard();
    }

    rollDice() {
        const values = this.dice.roll();
        this.displayDice(values);
    }

    displayDice(values) {
        values.forEach((value, index) => {
            document.getElementById(`dice-${index + 1}`).textContent = value;
        });
    }

    endTurn(category) {
        if (this.currentTurn >= this.maxTurns) {
            alert('Game over. No more turns allowed.');
            return;
        }

        const diceValues = this.dice.getValues();
        const score = this.engine.calculateScore(category, diceValues);

        if (score > 0 && !this.scores[category]) {
            this.scores[category] = score;
            this.currentTurn++;
            this.updateScoreboard();
        } else {
            alert(`Category ${category} has already been used or score is 0.`);
        }

        if (this.currentTurn >= this.maxTurns) {
            alert(`Game over! Your total score is: ${this.calculateTotalScore()}`);
        }
    }

    calculateTotalScore() {
        return Object.values(this.scores).reduce((a, b) => a + b, 0);
    }

    updateScoreboard() {
        for (const [category, score] of Object.entries(this.scores)) {
            const id = `score-${category.toLowerCase().replace(/ /g, '-')}`;
            const scoreElement = document.getElementById(id);
            if (scoreElement) {
                scoreElement.textContent = score;
            }
        }
        document.getElementById('total-score').textContent = this.calculateTotalScore();
    }

    clearStatistics() {
        this.scores = {};
        this.currentTurn = 0;
        document.querySelectorAll('#scoreboard tbody td:nth-child(2)').forEach(cell => {
            cell.textContent = '0';
        });
        document.getElementById('total-score').textContent = '0';
        alert('Statistics have been cleared.');
    }
}

// Initialize the game
const game = new YatzyGame();
document.getElementById('new-game').addEventListener('click', () => game.startNewGame());
document.getElementById('roll-dice').addEventListener('click', () => game.rollDice());
