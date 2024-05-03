function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setRandomNumbers() {
    const min = 1;
    const max = 10;

    const buttonIds = ["button1", "button2", "button3", "button4"];
    const buttonNums = []; 

    buttonIds.forEach((buttonId) => {
        const randomNum = getRandomInt(min, max); 
        while (buttonNums.includes(randomNum)) { 
            randomNum = getRandomInt(min, max);
        }
        buttonNums.push(randomNum); 
        
        const button = document.getElementById(buttonId); 
        button.setAttribute("data-value", randomNum); 
        button.innerText = randomNum; 
    });

    return buttonNums; 
}

function getUniqueRandom(arr) {
    const index = getRandomInt(0, arr.length - 1); 
    const value = arr[index]; 
    arr.splice(index, 1); 
    return value;
}

function getRandomOperator() {
    const operators = ["+", "-", "*"];
    return operators[getRandomInt(0, operators.length - 1)];
}

function calculateResult(numbers, operators) {
    let result = numbers[0]; 
    
    for (let i = 0; i < operators.length; i++) {
        const operator = operators[i];
        const number = numbers[i + 1];
        
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
                console.error("Unknown operator: ", operator); 
                break;
        }
    }

    return result;
}

// Set a random goal using a subset of unique random numbers
function setRandomGoal(buttonNums) {
    const selectedNumbers = [];

    // Get 4 unique random numbers for the operations
    for (let i = 0; i < 4; i++) {
        const randomNumber = getUniqueRandom(buttonNums);
        selectedNumbers.push(randomNumber);
    }

    // Randomly select operators for the operations
    const selectedOperators = [];
    for (let i = 0; i < 3; i++) { // 3 operators between 4 numbers
        const randomOperator = getRandomOperator();
        selectedOperators.push(randomOperator);
    }

    // Calculate the goal based on numbers and operators
    const calculatedGoal = calculateResult(selectedNumbers, selectedOperators);

    // Set the goal in the HTML
    document.getElementById("goal").innerText = calculatedGoal
}

function startNewGame() {
    const buttonNums = setRandomNumbers(); // Randomize button numbers
    setRandomGoal(buttonNums); // Set the goal
}

const newGameButton = document.getElementById("new-game-btn");
newGameButton.addEventListener("click", startNewGame);


startNewGame(); 