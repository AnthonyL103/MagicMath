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

    const goal = document.getElementById('goal');
    goal.textContent = calculatedGoal;
}


function updateWorkArea() {
    const equationsDiv = document.getElementById('equations');
    equationsDiv.innerHTML = ''; // Clear the work area

    if (currentCalculation.operator) {
        const numberText = `Number: ${currentCalculation.numbers.join(" ")}`;
        const operatorText = `Operator: ${currentCalculation.operator}`;

        equationsDiv.appendChild(document.createElement("p")).textContent = numberText;
        equationsDiv.appendChild(document.createElement("p")).textContent = operatorText;
    } else {
        const numberText = `Numbers: ${currentCalculation.numbers.join(" ")}`;
        equationsDiv.appendChild(document.createElement("p")).textContent = numberText;
    }
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

    currentCalculation = {
        numbers: [],
        operator: null,
    };
}

document.getElementById('new-game-btn').addEventListener('click', startNewGame);

const newGameButton = document.getElementById("new-game-btn");
newGameButton.addEventListener("click", startNewGame);

document.querySelectorAll('.number-btn').forEach(btn => {
    btn.addEventListener("click", function() {
        if (currentCalculation.numbers.length < 2) {
            const num = parseInt(this.textContent, 10);
            currentCalculation.numbers.push(num);
            updateWorkArea(); 
            this.disabled = true; 
        }

        if (currentCalculation.numbers.length === 2 && currentCalculation.operator) {
            performCalculation();
        }
    });
});

document.querySelectorAll('.operator-btn').forEach(btn => {
    btn.addEventListener("click", function() {
        if (!currentCalculation.operator) {  
            currentCalculation.operator = this.textContent;
            updateWorkArea(); // Refresh the work area display
        }

        // If two numbers and one operator, perform the calculation
        if (currentCalculation.numbers.length === 2 && currentCalculation.operator) {
            performCalculation();
        }
    });
});

startNewGame();
