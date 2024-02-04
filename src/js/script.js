var currentDate = new Date();
var day = currentDate.getDate().toString().padStart(2, '0');
var month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
var year = currentDate.getFullYear();
var formattedDate = day + '/' + month + '/' + year;

var apiURL = 'https://opensheet.elk.sh/1EC9jZ1GWVjSzn4-JpktT4D4efjr00hgfjQlZxGwgcUM/1';
var wordOfTheDay = ''; 

function setupBoard(word) {
    const board = document.getElementById('attempts');
    board.innerHTML = ''; 
    for (let i = 0; i < maxAttempts; i++) {
        const attemptRow = document.createElement('div');
        attemptRow.id = 'attempt-' + i;
        for (let j = 0; j < word.length; j++) {
            const letterBox = document.createElement('span');
            letterBox.textContent = '';
            letterBox.classList.add('box');
            attemptRow.appendChild(letterBox);
        }
        board.appendChild(attemptRow);
    }
}

function getWordOfTheDay(date) {
    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            const entry = data.find(item => item.date === date);
            if (entry) {
                wordOfTheDay = entry.team.toUpperCase();
                setupBoard(wordOfTheDay);
            } else {
                console.log('Nenhuma palavra encontrada para a data:', date);
            }
        })
        .catch(error => console.error('Erro ao obter a palavra do dia:', error));
}

getWordOfTheDay(formattedDate);

document.getElementById('guessInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        submitGuess();
    }
});

let attempts = 0;
const maxAttempts = 5;

function submitGuess() {
    if (attempts < maxAttempts) {
        let input = document.getElementById('guessInput');
        let guess = input.value.toUpperCase();

        if (guess.length !== wordOfTheDay.length) {
            showAlert('CHAMA O VAR', `A palavra deve ter ${wordOfTheDay.length} letras`);
            return;
        }

        const attemptDisplay = document.getElementById('attempt-' + attempts);
        attemptDisplay.innerHTML = '';

        for (let i = 0; i < guess.length; i++) {
            const letterDisplay = document.createElement('span');
            letterDisplay.textContent = guess[i];
            letterDisplay.classList.add('box');

            if (guess[i] === wordOfTheDay[i]) {
                letterDisplay.classList.add('correct');
            } else if (wordOfTheDay.includes(guess[i])) {
                letterDisplay.classList.add('present');
            } else {
                letterDisplay.classList.add('absent');
            }

            attemptDisplay.appendChild(letterDisplay);
        }

        input.value = '';
        attempts++;

        if (guess === wordOfTheDay) {
            showAlert('PARABÉNS!', 'Você acertou o time do dia');
            document.getElementById('guessInput').disabled = true;
        } else if (attempts === maxAttempts) {
            showAlert('Não foi dessa vez...', 'Você atingiu o limite de tentativas');
            document.getElementById('guessInput').disabled = true;
        }
    } else {
        showAlert('Que pena!','Você já atingiu o limite de tentativas');
    }
}

function showAlert(title, message) {
    document.getElementById('messageTitle').textContent = title;
    document.getElementById('messageText').textContent = message;
    document.getElementById('overlay').style.display = 'flex';
    document.getElementById('customMessage').style.display = 'flex';
}

function hideAlert() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('customMessage').style.display = 'none';
}