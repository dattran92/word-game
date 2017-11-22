var gameplayElement = document.querySelector('#gameplay');
var preparerElement = document.querySelector('#preparer');

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

  prepareGame(sentence);
  console.log('init game', gameplay);

  var wordSprites = addWords(gameplay.question.question.words);
}

playGame();
