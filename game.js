/*Web Development project #6
Prompt: Magic Math Game
Team Members: Zane Garvey & Anthony Li
Date: 5/8/2024
*/



let globalGoal;
let globalWins = 0;
let globalLoss = 0;
let currentCalculation = {
    numbers: [], // Array to hold selected numbers
    operator: null,  // Variable to hold the chosen operator
};

// Utility function to generate a random integer within a range
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to update messages in the message box
function updateMessage(message) {
    document.getElementById('message').textContent = message;
}

function startNewGame() {
    console.log("Starting a new game");

    // Reset current calculations at the start of a new game
    currentCalculation = {
        numbers: [],
        operator: null,
    };
    
    const buttonNums = setRandomNumbers(); // Set random numbers on buttons
    setRandomGoal(buttonNums); // Calculate and display a new goal based on random numbers

    document.getElementById('equations').innerHTML = ''; // Clear previous equations from the display

    updateMessage("Let's play! Select a number."); // Update message for user to start game

}

function setRandomNumbers() {
    const min = 1;
    const max = 10;

    const buttonIds = ["number1", "number2", "number3", "number4"]; // Array of number board button IDs
    const buttonNums = []; // Array to hold numbers for each button

    // Assign random numbers to each button
    buttonIds.forEach((buttonId) => {
        let randomNum = getRandomInt(min, max); // Get a unique random number
        while (buttonNums.includes(randomNum)) {  // Ensure no duplicate numbers
            randomNum = getRandomInt(min, max);
        } 
        buttonNums.push(randomNum); // Add unique number to the array
        
        const button = document.getElementById(buttonId); 
        button.setAttribute("data-value", randomNum); // Set data value attribute to hold the number
        button.innerText = randomNum; // Display the number on the button
        button.disabled = false; // Ensure button is enabled
    });

    return buttonNums; // Return the array of numbers assigned to buttons
}

function getUniqueRandom(arr) {
    const index = getRandomInt(0, arr.length - 1); // Select a random index
    const value = arr[index]; 
    arr.splice(index, 1); // Remove and return the item at the index
    return value;
}

function getRandomOperator() {
    const operators = ["+", "-", "*"]; // Possible operators
    return operators[getRandomInt(0, operators.length - 1)]; // Return random op
}

function calculateResult(numbers, operators) {
    let result = numbers[0];  // Start with the first number
    
    for (let i = 0; i < operators.length; i++) {
        const operator = operators[i]; // Get the operator
        const number = numbers[i + 1]; // Get the next number in the sequence
        
        // Perform operation based on the type of operator
        switch (operator) {
            case "+":
                result += number;
                break;
            case "-":
                result -= number;
                break;
            case "*":
                result *= number;
                break;
            default:
                console.error("Unknown operator: ", operator); // Log error for unkown op
                break;
        }
    }

    return result; // Return calculated result
}

function setRandomGoal(buttonNums) {
    const selectedNumbers = []; // Array to hold randomly selected numbers for the goal
    console.log("This is a test message2.");

    // Select random numebrs from the button numbers
    for (let i = 0; i < 4; i++) {
        const randomNumber = getUniqueRandom(buttonNums);
        selectedNumbers.push(randomNumber);
    }

    const selectedOperators = []; // Array to hold randomly selected operators for the goal
    for (let i = 0; i < 3; i++) { 
        const randomOperator = getRandomOperator();
        selectedOperators.push(randomOperator);
    }

    const calculatedGoal = calculateResult(selectedNumbers, selectedOperators); // Calculate the goal
    globalGoal = calculatedGoal; // Set the global goal to the calculated value
    const goal = document.getElementById('goal');
    goal.textContent = calculatedGoal; // Display goal in UI
}

function checkempty() {
    const buttonIds = ["number1", "number2", "number3", "number4"]; // List of button IDs
    let emptyCount = 0; // Empty button counter

    // Loop through all button IDs and count how many have empty inner text
    buttonIds.forEach((id) => {
        const button = document.getElementById(id);
        if (button && button.innerText.trim() === "") {
            emptyCount++; // Increment the empty count if the button is empty
        }
    });

    return emptyCount;
}



function performCalculation() {
    if (currentCalculation.numbers.length < 2 || !currentCalculation.operator) {
        console.error("Insufficient data for calculation"); // Log error if not enough data
        return;
    }

    const [num1, num2] = currentCalculation.numbers; // Destructure the numbers array
    const operator = currentCalculation.operator;  // Get the operator from current calculation

    let result;

    result = calculateResult([num1, num2], operator); // Calculate the result based on the current numbers and operator

    console.log(`Calculation: ${num1} ${operator} ${num2} = ${result}`); //  Log the calculation

    const resultText = `Result: ${num1} ${operator} ${num2} = ${result}`; // Result text
    const equationsDiv = document.getElementById('equations'); // Get equations display div
    equationsDiv.appendChild(document.createElement("p")).textContent = resultText; // Append the result text to the display

    // Reset operators after performing calculation
    document.querySelectorAll('.operator-btn').forEach(btn => {
        btn.disabled = false;  // Re-enable all operator buttons
    });

    // Reset the current calculation state
    currentCalculation = {
        numbers: [],
        operator: null
    };

    // Check if result matches goal
    if (result === globalGoal) {
        const winText = "Congratulations! You Win!";
        equationsDiv.appendChild(document.createElement("p")).textContent = winText;
        globalWins += 1; // Increment win count
        const wins = document.getElementById('win-count');
        wins.textContent = globalWins; // Update win count in UI
    }

    const emptyCount = checkempty();

    if (result != globalGoal && emptyCount >= 2) {
        const equationsDiv = document.getElementById("equations");
        const lossText = "Game Over! You ran out of numbers.";
        equationsDiv.appendChild(document.createElement("p")).textContent = lossText;

        globalLoss++; // Increment global loss count
        const loss = document.getElementById("loss-count");
        loss.textContent = globalLoss; // Update loss count in UI


    }

    
    /*uses find index to find the index of the correct id of button with the same value as num 1 and num2 which where declared in current
    calculation, making it so we know what buttons where pressed for this round of calculation */
    const num2Index = ["number1", "number2", "number3", "number4"].findIndex(id => 
        document.getElementById(id).innerText == num2.toString()
    );

    const num1Index = ["number1", "number2", "number3", "number4"].findIndex(id => 
        document.getElementById(id).innerText == num1.toString()
    );

    //declares the variables representing the first and second buttons and adds 1 to each as indexing starts from 0
    const secondButton = document.getElementById(`number${num2Index + 1}`);
    const firstButton = document.getElementById(`number${num1Index + 1}`);
    
    // updates second buttons text based on the result of the first
    secondButton.innerText = result;
    //renables second button as it was declared as disabled when clicked in the event listener 
    secondButton.disabled = false;
    firstButton.innerText = ""; 
    //disables the first button
    firstButton.disabled = true; 

    // Reset the current calculation for next round 
    currentCalculation = {
        numbers: [],
        operator: null,
    };
    //dont need this becomes the button becomes the product 
    //currentCalculation.numbers.push(result);

    if (result === globalGoal) {
        updateMessage("Congratulations! You Win!");
    } else if (result !== globalGoal && emptyCount >= 2) {
        updateMessage("Game Over! Better luck next time.");
    } else {
        updateMessage("Keep going! Select the next number.");
    }
}

// Operator Butotn Disable
// Event listener setup for operator buttons to handle click events

document.querySelectorAll('.operator-btn').forEach(btn => {
    btn.addEventListener("click", function() {

        if (!currentCalculation.operator) { // Check if operator is not yet selected
            currentCalculation.operator = this.textContent; // Set the operator in current calculation
            this.disabled = true;  // Disable the button after clicking
        }

        if (currentCalculation.numbers.length === 1 && currentCalculation.operator) {
            updateMessage("Select another number!");
        }

        // Perform calculation if two numbers and one operator are selected
        if (currentCalculation.numbers.length === 2 && currentCalculation.operator) {
            performCalculation();
            updateWorkArea();
        }

    });
});

const newGameButton = document.getElementById("new-game-btn");
newGameButton.addEventListener("click", startNewGame);

// Event listener setup for number buttons to handle click events
document.querySelectorAll('.number-btn').forEach(btn => {
    btn.addEventListener("click", function() {

        if (currentCalculation.numbers.length < 2) { // Check if less than two numbers are selected
            const num = parseInt(this.textContent, 10); // Parse the number from button text
            currentCalculation.numbers.push(num); // Add number to the current calculation
            this.disabled = true; // Disable the button after selecting the number
        }

        if (currentCalculation.numbers.length === 1) {
            updateMessage("Select an operator!");
        }

        // Perform calculation if two numbers and one operator are selected
        if (currentCalculation.numbers.length === 2 && currentCalculation.operator) {
            performCalculation();
            updateWorkArea(); 
        }
    });
});

// Event listener for new game button to start a new game when clicked
document.getElementById('new-game-btn').addEventListener('click', startNewGame);

// Starts a new game on initial load
startNewGame();
