var WordSprite = function(word, zone, gameplay) {
  this.word = word;
  this.gameplay = gameplay;
  this.zone = zone;
  this.position = {};

  console.debug('New word sprite', this);
};

WordSprite.prototype.setPosition = function() {
  this.element.style.position = 'absolute';
  this.gameplay.preparer.element.appendChild(this.element);

  var rect = this.element.getBoundingClientRect();
  var availableWidth = this.zone.width - rect.width;
  var availableHeight = this.zone.height - rect.height;

  console.debug('element available:', this.word, {
    width: availableWidth,
    height: availableHeight
  });

  var x = Math.floor(Math.random() * availableWidth) + this.zone.x;
  var y = Math.floor(Math.random() * availableHeight) + this.zone.y;

  this.position = {
    x: x + 'px',
    y: y + 'px'
  };
}

WordSprite.prototype.resetPosition = function() {
  this.element.style.left = this.position.x;
  this.element.style.top = this.position.y;
  this.element.style.position = 'absolute';
  this.element.style.zIndex = 1;

  this.gameplay.element.appendChild(this.element);
}

WordSprite.prototype.inGame = function(x, y) {
  const padding = 30;
  return (
    x > this.gameplay.rect.x + padding
      &&
    x < (this.gameplay.rect.x + this.gameplay.rect.width - padding)
      &&
    y > this.gameplay.rect.y + padding
      &&
    y < (this.gameplay.rect.y + this.gameplay.rect.height - padding)
  );
}

WordSprite.prototype.setAnswer = function() {
  this.element.style.display = 'none';
  this.gameplay.setAnswer(this.word);
}

WordSprite.prototype.render = function() {
  var self = this;
  var element = document.createElement('div');
  this.element = element;

  element.innerText = this.word;
  element.className = "word-sprite";

  this.setPosition();
  this.resetPosition();

  element.onmousedown = function(event) {
    element.style.position = 'fixed';
    element.style.zIndex = 1000;
    document.body.append(element);

    moveAt(event.pageX, event.pageY);

    function moveAt(pageX, pageY) {
      if (self.inGame(pageX, pageY)) {
        element.style.left = pageX - element.offsetWidth / 2 + 'px';
        element.style.top = pageY - element.offsetHeight / 2 + 'px';
      } else {
        removeEvent();
      }

      if (gameplay.inAnswerArea(pageX, pageY)) {
        var valid = gameplay.checkValid(self.word);
        self.valid = valid;
        console.debug('valid', valid);
        gameplay.setValid(valid);
      } else {
        console.debug('out answer area');
        self.valid = null;
        gameplay.setValid(null);
      }
    }

    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
    }

    function removeEvent() {
      document.removeEventListener('mousemove', onMouseMove);
      element.onmouseup = null;
      if (self.valid === true) {
        self.setAnswer();
      }
      self.resetPosition();
    }

    document.addEventListener('mousemove', onMouseMove);
    element.onmouseup = removeEvent;
  };
}
