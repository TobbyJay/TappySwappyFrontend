// Get the userId from the URL
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('userid');

console.log(userId); // Outputs the user's Telegram ID

let coins = 0;                  // Initialize coins
let isGameActive = false;       // Flag to track game status
let gameTime = 10;              // Game duration in seconds
let timerId;                    // To hold the timer ID
let timeLeft = gameTime;        // Remaining time

// Function to start the game
function startGame() {
    coins = 0; // Reset coins
    timeLeft = gameTime; // Reset time
    isGameActive = true; // Set game active
    document.getElementById('playButton').textContent = 'Tap!';
    document.getElementById('coinCount').textContent = '0';
    document.getElementById('timer').textContent = `Time: ${timeLeft}`;

    // Start the timer
    timerId = setInterval(updateTimer, 1000); // Update timer every second
}

// Function to update the timer
function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        document.getElementById('timer').textContent = `Time: ${timeLeft}`;
    } else {
        endGame(); // End game when time is up
    }
}

// Function to handle button taps
// Function to handle button taps
function handleTap() {
    if (isGameActive) {
        coins++; // Increment coins
        const coinCountElement = document.getElementById('coinCount');
        coinCountElement.textContent = coins; // Update coins display
        coinCountElement.classList.add('animate'); // Add animation class

        // Remove animation class after the animation ends
        setTimeout(() => {
            coinCountElement.classList.remove('animate');
        }, 500); // Match this duration to the CSS animation duration
        showToast(); // Show toast notification
    }
}

// Function to end the game
async function endGame() {
    isGameActive = false; // Set game inactive
    clearInterval(timerId); // Clear the timer
    //document.getElementById('playButton').style.display = 'none'; // Hide the "Tap" button
    document.getElementById('playButton').textContent = `Time up! Your final coin is: ${coins}, Saving Progress...`;
    document.getElementById('playButton').disabled = true; // Optionally disable the button to prevent any further clicks
    await postScore(); // Post score and wait for completion
    document.getElementById('playButton').textContent = 'Game Over! Tap to Restart';
    document.getElementById('playButton').disabled = false; // Optionally disable the button to prevent any further clicks
    document.getElementById('playButton').style.display = 'block'; // Show the game over button

    showFinalToast(); // Show final toast notification
}

// Function to post the score
async function postScore() {
    const url = "https://fb64-102-89-33-60.ngrok-free.app/api/Game/saveScore";
    const payload = {
        Coins: coins,
        TelegramUserId: userId
    };

    console.log(payload)
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Score posted successfully:', data);
    } catch (error) {
        console.error('Error posting score:', error);
    }
}

// Function to show toast notification
function showToast() {
    const toast = document.getElementById('toast');
    toast.classList.add('show'); // Add class to show toast
    setTimeout(() => {
        toast.classList.remove('show'); // Remove class after 2 seconds
    }, 2000); // Show toast for 2 seconds
}

// Function to show final toast notification
function showFinalToast() {
    const finalToast = document.getElementById('finalToast');
    finalToast.textContent = `Time's up! Your final coin count is: ${coins}`; // Update this line
    finalToast.classList.add('show'); // Show final toast
    setTimeout(() => {
        finalToast.classList.remove('show'); // Hide final toast after 4 seconds
    }, 4000); // Show for 4 seconds
}

// Event listeners
document.getElementById('playButton').addEventListener('click', () => {
    if (!isGameActive) {
        startGame(); // Start the game if it is not active
    } else {
        handleTap(); // Handle tap if the game is active
    }
});
