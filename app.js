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
    const url = "https://b036-102-89-33-60.ngrok-free.app/api/Game/saveScore";
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
        console.log(payload)

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

function getRandomAvatar() {
    const avatars = [
        'https://randomuser.me/api/portraits/men/1.jpg',
        'https://randomuser.me/api/portraits/men/2.jpg',
        'https://randomuser.me/api/portraits/men/3.jpg',
        'https://randomuser.me/api/portraits/women/1.jpg',
        'https://randomuser.me/api/portraits/women/2.jpg',
        'https://randomuser.me/api/portraits/women/3.jpg'
    ];
    return avatars[Math.floor(Math.random() * avatars.length)];
}
    // Fetch leaderboard data
    async function fetchLeaderboard() {
        const url = "https://b036-102-89-33-60.ngrok-free.app/api/Game/leaderboard";
        try {
            const response = await fetch(url);
            if (!response.ok) { // Check for 404 or other errors
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            
            // Check if data is empty
            if (!data || data.length === 0) {
                return "No players found yet, start playing to be at the top."; // Return the message
            }
            console.log(data)
            return data; // Adjust based on your API response structure
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            return "No players found"; // Return the message on error
        }
    }

    // Show leaderboard modal
    document.getElementById('leaderboardButton').addEventListener('click', async () => {
        const leaderboardData = await fetchLeaderboard();
        const leaderboardList = document.getElementById('leaderboardList');
        leaderboardList.innerHTML = ''; // Clear previous entries

        // Check if the result is a string (the "No players found" message)
        if (typeof leaderboardData === 'string') {
            const messageDiv = document.createElement('div');
            messageDiv.textContent = leaderboardData; // Display the message
            messageDiv.style.textAlign = 'center'; // Center the text
            messageDiv.style.fontSize = '1.5rem'; // Adjust font size if needed
            messageDiv.style.marginTop = '20px'; // Add some margin
            leaderboardList.appendChild(messageDiv);
        } else {
            leaderboardData.forEach(entry => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'leaderboard-item';
                
                const avatar = document.createElement('img');
                avatar.src = getRandomAvatar();
                avatar.alt = 'Avatar';
                avatar.className = 'avatar';

                const name = document.createElement('span');
                name.className = 'leaderboard-name';
                name.textContent = entry.firstName;

                const score = document.createElement('span');
                score.className = 'leaderboard-score';
                score.textContent = `Score: ${entry.totalScore}`;

                itemDiv.appendChild(avatar);
                itemDiv.appendChild(name);
                itemDiv.appendChild(score);
                leaderboardList.appendChild(itemDiv);
            });
        }

        document.getElementById('leaderboardModal').style.display = 'block'; // Show modal
    });

    // Close modal
    document.querySelector('.close-button').addEventListener('click', () => {
        document.getElementById('leaderboardModal').style.display = 'none';
    });
