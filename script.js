// JavaScript for the game logic

// Function to update Player 2's symbol options based on Player 1's selection
function updatePlayer2Symbol() {
    let player1Symbol = document.getElementById("player1Symbol").value;
    let player2SymbolSelect = document.getElementById("player2Symbol");

    // Enable all options
    for (let option of player2SymbolSelect.options) {
        option.disabled = false;
    }

    // Disable Player 1's symbol in Player 2's options
    for (let option of player2SymbolSelect.options) {
        if (option.value === player1Symbol) {
            option.disabled = true;
            break;
        }
    }
}

// Function to handle a cell click
function cellClick(cell) {
    if (!cell.textContent) { // Check if the cell is empty
        cell.textContent = currentPlayer; // Set cell content to current player's symbol
        checkWinner(); // Check for a winner after each move
        togglePlayer(); // Switch to the next player
    }
}

// Function to toggle players
function togglePlayer() {
    currentPlayer = currentPlayer === player1Symbol ? player2Symbol : player1Symbol; // Switch between player symbols
}

// Function to check for a winner
function checkWinner() {
    // Implement your logic to check for a winner
}

// Function to reset the game
function resetGame() {
    cells.forEach(cell => {
        cell.textContent = ""; // Clear all cells
    });
    currentPlayer = player1Symbol; // Reset current player to Player 1
}

// Function to start the game
function startGame() {
    // Get player names and symbols
    let player1Name = document.getElementById("player1Name").value;
    let player2Name = document.getElementById("player2Name").value;
    let player1Symbol = document.getElementById("player1Symbol").value;
    let player2Symbol = document.getElementById("player2Symbol").value;

    // Validate inputs
    if (!player1Name || !player2Name) {
        alert("Please enter both player names.");
        return;
    }

    // Logic for the game goes here
    // You can add event listeners to handle player moves
    // Display the game board and start the game
}

// Add event listeners to all cells
cells.forEach(cell => {
    cell.addEventListener('click', function() {
        cellClick(cell);
    });
});

// Function to initialize the game
function initializeGame() {
    // Retrieve player data from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    player1Name = urlParams.get('player1Name');
    player2Name = urlParams.get('player2Name');
    player1Symbol = urlParams.get('player1Symbol');
    player2Symbol = urlParams.get('player2Symbol');

    currentPlayer = player1Symbol; // Player 1 starts the game

    // Display player names
    document.getElementById("player1").textContent = `${player1Name} (${player1Symbol})`;
    document.getElementById("player2").textContent = `${player2Name} (${player2Symbol})`;
}

// Call initializeGame function when the page loads
initializeGame();
