var gameplayElement = document.querySelector('#gameplay');
var preparerElement = document.querySelector('#preparer');

var timer = {};

timer.init = function() {
  console.log('init');

  timer.startTime = new Date();
  timer.element = document.createElement('div');
  timer.element.id = 'timer-box';

  gameplay.element.appendChild(timer.element);

  timer.interval = setInterval(function(){
    timer.updateTime();
  }, 1000);
};

timer.updateTime = function() {
  var endTime = new Date().getTime();
  var startTime = timer.startTime.getTime();
  var diff = Math.abs(endTime - startTime);
  var minutes = parseInt(diff / (1000 * 60) % 60);
  var seconds = parseInt(diff / (1000) % 60);

  minutes = minutes >= 10 ? minutes : '0' + minutes;
  seconds = seconds >= 10 ? seconds : '0' + seconds;

  timer.text = minutes + ' : ' + seconds;
  timer.displayTime();
}

timer.displayTime = function() {
  timer.element.innerText = timer.text;
}

timer.stopTime = function() {
  clearInterval(timer.interval);
}

var gameplay = {
  element: gameplayElement,
  rect: gameplayElement.getBoundingClientRect(),
  preparer: {
    element: preparerElement
  },
  question: {}
};

gameplay.inAnswerArea = function(pageX, pageY) {
  const rect = gameplay.question.answer.rect
  return (
    pageX > rect.x
      &&
    pageX < (rect.x + rect.width)
      &&
    pageY > rect.y
      &&
    pageY < (rect.y + rect.height)
  );
}

gameplay.checkValid = function(word) {
  var questionWords = gameplay.question.question.words;
  var answers = gameplay.question.answer.words;
  if (answers.length == 0) {
    return true;
  }

  var firstWord = answers[0];
  var lastWord = answers[answers.length - 1];

  console.debug('check valid', [firstWord, lastWord]);

  var availables = [];

  for (var i = 0; i < questionWords.length; i++) {
    if (i > 0 && firstWord === questionWords[i]) {
      var leftWord = questionWords[i-1];
      availables.push(leftWord);
    }

    if (i < (questionWords.length - 1) && lastWord === questionWords[i]) {
      var rightWord = questionWords[i+1];
      availables.push(rightWord);
    }
  }

  if (availables.indexOf(word) > -1) {
    return true;
  }

  return false;
}

gameplay.setValid = function(valid) {
  if (valid === true) {
    return gameplay.question.answer.element.className = 'valid';
  }

  if (valid === false) {
    return gameplay.question.answer.element.className = 'invalid';
  }

  return gameplay.question.answer.element.className = '';
}

gameplay.setAnswer = function(word) {
  var questionWords = gameplay.question.question.words;
  var answers = gameplay.question.answer.words;

  var firstWord = answers[0];
  var lastWord = answers[answers.length - 1];

  var answerWordIndex = questionWords.indexOf(word);
  var firstWordIndex = questionWords.indexOf(firstWord);
  var lastWordIndex = questionWords.indexOf(lastWord);

  if (answerWordIndex < firstWordIndex) {
    answers.unshift(word);
  } else {
    answers.push(word);
  }

  gameplay.question.answer.element.innerText = answers.join(' ');

  gameplay.checkFinish();
}

gameplay.checkFinish = function() {
  // we may need to check more things for safe. But the length is enough for now.
  if (gameplay.question.question.words.length === gameplay.question.answer.words.length) {
    gameplay.finishGame();
  }
}

gameplay.finishGame = function() {
  timer.stopTime();
  showScore();
}

var displayQuestionRect = {
  x: 30,
  y: 100,
  width: gameplay.rect.width - 60,
  height: gameplay.rect.height / 2,
};
var numOfSlots = { x: 5, y: 5 };

function makeSlots(numOfSlots) {
  var slots = [];
  var xUnit = displayQuestionRect.width / numOfSlots.x;
  var yUnit = displayQuestionRect.height / numOfSlots.y;

  for (var x = 0; x < numOfSlots.x; x++) {
    for (var y = 0; y < numOfSlots.y; y++) {
      slots.push({
        x: xUnit * x + displayQuestionRect.x,
        y: yUnit * y + displayQuestionRect.y,
        width: xUnit,
        height: yUnit,
        available: true
      });
    }
  }
  return slots;
}

function initPosition(word, slots) {
  while (true) {
    var random = Math.floor(Math.random() * slots.length);
    var slot = slots[random];
    if (slot.available) {
      slot.available = false;
      return {
        x: slot.x,
        y: slot.y,
        width: slot.width,
        height: slot.height
      };
    }
  }
}

function prepareGame(sentence) {
  gameplay.element.innerHTML = "";
  gameplay.element.innerText = "";

  var words = sentence.split(' ')
    .filter(function(word) {
      return word;
    });

  var answers = [];

  var answerElement = document.createElement('div');
  answerElement.id = 'answer-box';
  answerElement.innerText = '';

  var questionElement = document.createElement('div');
  questionElement.id = 'question-box';
  questionElement.innerText = 'Form the phrase "' + sentence +'" on the line above"' ;

  gameplay.element.appendChild(answerElement);
  gameplay.element.appendChild(questionElement);

  gameplay.question = {
    answer: {
      element: answerElement,
      rect: answerElement.getBoundingClientRect(),
      words: answers,
    },
    question: {
      element: questionElement,
      sentence: sentence,
      words: words
    }
  };
}

function addWords(words) {
  var slots = makeSlots(numOfSlots);

  var wordSprites = words.map((word) => {
    var position = initPosition(word, slots);
    var wordSprite = new WordSprite(word, position, gameplay);
    wordSprite.render();
    return wordSprite;
  });

  return wordSprites;
}

function playGame() {
  var sentence = "dat va nhi that la de thuong";

  var buttonElement = document.querySelector(".button");

  buttonElement.className = "button out";

  setTimeout(function() {
    prepareGame(sentence);
    console.log('init game', gameplay);

    var wordSprites = addWords(gameplay.question.question.words);
    timer.init();
  }, 1000);
}

function showScore() {
  gameplay.element.innerHTML = "";
  gameplay.element.innerText = "";

  var scoreTextElement = document.createElement('div');
  scoreTextElement.id = 'score-text';
  scoreTextElement.innerText = 'Your Score';

  var scoreElement = document.createElement('div');
  scoreElement.id = 'score-box';
  scoreElement.innerText = timer.text;

  var playGameElement = document.createElement('a');
  playGameElement.className = 'button';
  playGameElement.innerText = 'Play Again';

  playGameElement.addEventListener('click', playGame);

  gameplay.element.appendChild(scoreTextElement);
  gameplay.element.appendChild(scoreElement);
  gameplay.element.appendChild(playGameElement);
}

function splashScreen() {
  gameplay.element.innerHTML = "";
  gameplay.element.innerText = "";

  var gameNameElement = document.createElement('div');
  gameNameElement.id = 'game-name';
  gameNameElement.innerText = 'word game';

  var playGameElement = document.createElement('a');
  playGameElement.className = 'button';
  playGameElement.innerText = 'Play';

  playGameElement.addEventListener('click', playGame);

  gameplay.element.appendChild(gameNameElement);
  gameplay.element.appendChild(playGameElement);
}

splashScreen();
