const rows = 5;
const cols = 6;
let currentPlayer = 'X';
let board = createBoard();
let scores = { 'X': 0, 'O': 0 };
const winningScore = 5;
let aiLevel = ''; // To store the selected AI level
let isAITurn = false;
let desiredPosition = '';

// Manually define winning combinations
const winningCombos = [
    // Rows
    [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5]],
    [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5]],
    [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5]],
    [[3, 0], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5]],
    [[4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5]],
    // Columns
    [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]],
    [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1]],
    [[0, 2], [1, 2], [2, 2], [3, 2], [4, 2]],
    [[0, 3], [1, 3], [2, 3], [3, 3], [4, 3]],
    [[0, 4], [1, 4], [2, 4], [3, 4], [4, 4]],
    [[0, 5], [1, 5], [2, 5], [3, 5], [4, 5]],
    // Diagonals
    [[0, 1],[1, 0]],
    [[0, 2],[1, 1],[2, 0]],
    [[0, 3],[1, 2],[2, 1],[3, 0]],
    [[0, 4],[1, 3],[2, 2],[4, 0]],
    [[0, 5],[1, 4],[2, 3],[4, 1]],
    [[1, 5],[2, 4],[3, 3],[4, 2]],
    [[2, 5],[3, 4],[4, 3],],
    [[3, 5],[4, 4]],
    [[3, 0],[4, 1]],
    [[2, 0],[3, 1],[4, 2]],
    [[1, 0],[2, 1],[3, 2],[4, 3]],
    [[0, 0],[1, 1],[2, 2],[3, 3],[4, 4]],
    [[0, 1],[1, 2],[3, 4],[4, 5]],
    [[0, 2],[1, 3],[2, 4],[3, 5]],
    [[0, 3],[1, 4],[2, 5]],
    [[0, 4],[1, 5]]
];

function createBoard() {
    const board = [];
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            row.push('');
        }
        board.push(row);
    }
    return board;
}

function render() {
    const table = document.getElementById('ticTacToe');
    table.innerHTML = '';

    for (let i = 0; i < rows; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < cols; j++) {
            const cell = document.createElement('td');
            cell.textContent = board[i][j];
            cell.addEventListener('click', () => cellClick(i, j));
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
}

function updateScores() {
    document.getElementById('scoreX').textContent = scores['X'];
    document.getElementById('scoreO').textContent = scores['O'];
}

function resetGame() {
    board = createBoard();
    currentPlayer = 'X'; // Set currentPlayer back to 'X'
    render();
    updateTurnLabel();
}

function updateTurnLabel() {
    document.getElementById('turnLabel').textContent = `Turn: Player ${currentPlayer}`;
}

function setInitialPlayerToX() {
    currentPlayer = 'X';
}

function initializeGame() {
    scores = { 'X': 0, 'O': 0 };
    setInitialPlayerToX();
    updateTurnLabel();
    updateScores();
}

function showModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

function selectDesiredPosition(position) {
    desiredPosition = position;
}

function selectAIDifficulty(difficulty) {
    aiLevel = difficulty;
    desiredPosition = ''; // Reset desired position
    closeModal();
    initializeGame();
    if (aiLevel !== '' && currentPlayer === 'O') {
        playAgainstAI();
    }
}

function cellClick(row, col) {
    if (!isAITurn && board[row][col] === '' && !checkWinner()) {
        board[row][col] = currentPlayer;
        render();

        // Check for a winner after rendering
        if (checkWinner()) {
            scores[currentPlayer]++; // Increment the current player's score
            updateScores();

            if (scores[currentPlayer] === winningScore) {
                resetGame();
                setTimeout(() => {
                    alert(`Player ${currentPlayer} wins the game!`);
                    scores = { 'X': 0, 'O': 0 }; // Reset scores
                }, 0);
            } else {
                setTimeout(() => {
                    alert(`Player ${currentPlayer} wins this round!`);
                    resetGame();
                }, 0);
            }
        } else if (checkDraw()) {
            setTimeout(() => {
                alert("It's a draw!");
                resetGame();
            }, 0);
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            updateTurnLabel();

            if (aiLevel !== '' && currentPlayer === 'O') {
                playAgainstAI();
            }
        }
    }
}

function evaluate() {
    for (const combo of winningCombos) {
        const values = combo.map(([i, j]) => board[i][j]);
        if (values.every(value => value === 'O')) {
            return 10;
        } else if (values.every(value => value === 'X')) {
            return -10;
        }
    }
    return 0;
}

function minimax(board, depth, isMaximizing) {
    const scores = {
        X: -1,
        O: 1,
        tie: 0
    };

    const score = evaluate();

    if (score !== 0) {
        return score;
    }

    if (depth >= 3) {
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (board[i][j] === '') {
                    board[i][j] = 'O';
                    bestScore = Math.max(bestScore, minimax(board, depth + 1, false));
                    board[i][j] = '';
                }
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (board[i][j] === '') {
                    board[i][j] = 'X';
                    bestScore = Math.min(bestScore, minimax(board, depth + 1, true));
                    board[i][j] = '';
                }
            }
        }
        return bestScore;
    }
}

function findBestMove() {
    let bestScore = -Infinity;
    let bestMove;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (board[i][j] === '') {
                board[i][j] = 'O';
                const score = minimax(board, 0, false);
                board[i][j] = '';

                if (score > bestScore) {
                    bestScore = score;
                    bestMove = { row: i, col: j };
                }
            }
        }
    }

    return bestMove;
}

function playAgainstAI() {
    if (currentPlayer === 'O') {
        if (aiLevel === 'expert') {
            const bestMove = findBestMove();
            cellClick(bestMove.row, bestMove.col);
        } else if (aiLevel === 'difficult') {
            // 50% chance of making the best move, else make a random move
            if (Math.random() < 0.5) {
                const bestMove = findBestMove();
                cellClick(bestMove.row, bestMove.col);
            } else {
                makeRandomMove();
            }
        } else {
            // Easy level: Make a completely random move
            makeRandomMove();
        }
    }
}

function checkDraw() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (board[i][j] === '') {
                return false; // There is an empty cell, game is not a draw
            }
        }
    }
    return true; // All cells are filled, indicating a draw
}

// Helper function to make a completely random move
function makeRandomMove() {
    const emptyCells = [];
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (board[i][j] === '') {
                emptyCells.push({ row: i, col: j });
            }
        }
    }

    if (emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const { row, col } = emptyCells[randomIndex];
        cellClick(row, col);
    }
}

function checkWinner() {
    for (const combo of winningCombos) {
        const values = combo.map(([i, j]) => board[i][j]);
        if (values.every(value => value === currentPlayer)) {
            return true;
        }
    }
    return false;   
}
function restartGame() {
    location.reload(); // Reload the current page
}

initializeGame(); // Initialize the game when the page loads
render();

