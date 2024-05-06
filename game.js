let globalGoal;
let globalWins = 0;
let globalLoss = 0;
let currentCalculation = {
    numbers: [],  
    operator: null,  
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function startNewGame() {
    console.log("Starting a new game");

    currentCalculation = {
        numbers: [],
        operator: null,
    };
    
    const buttonNums = setRandomNumbers();
    setRandomGoal(buttonNums);
    document.getElementById('equations').innerHTML = '';
}

function setRandomNumbers() {
    const min = 1;
    const max = 10;

    const buttonIds = ["number1", "number2", "number3", "number4"];
    const buttonNums = []; 

    buttonIds.forEach((buttonId) => {
        let randomNum = getRandomInt(min, max); 
        while (buttonNums.includes(randomNum)) { 
            randomNum = getRandomInt(min, max);
        }
        buttonNums.push(randomNum); 
        
        const button = document.getElementById(buttonId); 
        button.setAttribute("data-value", randomNum); 
        button.innerText = randomNum; 
        button.disabled = false; 
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

function setRandomGoal(buttonNums) {
    const selectedNumbers = [];
    console.log("This is a test message2.");
    for (let i = 0; i < 4; i++) {
        const randomNumber = getUniqueRandom(buttonNums);
        selectedNumbers.push(randomNumber);
    }

    const selectedOperators = [];
    for (let i = 0; i < 3; i++) { 
        const randomOperator = getRandomOperator();
        selectedOperators.push(randomOperator);
    }

    const calculatedGoal = calculateResult(selectedNumbers, selectedOperators);
    globalGoal = calculatedGoal; 
    const goal = document.getElementById('goal');
    goal.textContent = calculatedGoal;
}

function checkempty() {
    const buttonIds = ["number1", "number2", "number3", "number4"]; // List of button IDs
    let emptyCount = 0;

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
        console.error("Insufficient data for calculation");
        return;
    }

    const [num1, num2] = currentCalculation.numbers;
    const operator = currentCalculation.operator;

    let result;

    result = calculateResult([num1, num2], operator);

    console.log(`Calculation: ${num1} ${operator} ${num2} = ${result}`);

    const resultText = `Result: ${num1} ${operator} ${num2} = ${result}`;
    const equationsDiv = document.getElementById('equations');
    equationsDiv.appendChild(document.createElement("p")).textContent = resultText;

    if (result === globalGoal) {
        const winText = "Congratulations! You Win!";
        equationsDiv.appendChild(document.createElement("p")).textContent = winText;
        globalWins += 1;
        const wins = document.getElementById('win-count');
        wins.textContent = globalWins;
    }

    const emptyCount = checkempty();

    if (result != globalGoal && emptyCount >= 3) {
        const equationsDiv = document.getElementById("equations");
        const lossText = "Game Over! Too many empty buttons.";
        equationsDiv.appendChild(document.createElement("p")).textContent = lossText;

        globalLoss += 1; // Increment global loss count
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
}

document.getElementById('new-game-btn').addEventListener('click', startNewGame);

const newGameButton = document.getElementById("new-game-btn");
newGameButton.addEventListener("click", startNewGame);

document.querySelectorAll('.number-btn').forEach(btn => {
    btn.addEventListener("click", function() {
        if (currentCalculation.numbers.length < 2) {
            const num = parseInt(this.textContent, 10);
            currentCalculation.numbers.push(num);
            this.disabled = true; 
        }

        if (currentCalculation.numbers.length === 2 && currentCalculation.operator) {
            performCalculation();
            updateWorkArea(); 
        }
    });
});

document.querySelectorAll('.operator-btn').forEach(btn => {
    btn.addEventListener("click", function() {
        if (!currentCalculation.operator) {  
            currentCalculation.operator = this.textContent;
             // Refresh the work area display
        }

        // If two numbers and one operator, perform the calculation
        if (currentCalculation.numbers.length === 2 && currentCalculation.operator) {
            performCalculation();
            updateWorkArea();
        }
    });
});

startNewGame();
