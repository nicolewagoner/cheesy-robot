function Hand() {
  this.width = 30;
  this.x = 0;
  this.y = 179;
  this.maxY = 30;
  this.move = function() {
    this.y -= 5;
  };
}

function Arm() {
  this.x = 0;
  this.y = 102;
  this.height = 78;
  this.pixelAdjust = false;
  this.move = function() {
    this.height -= 5;

    // todo: i'm sure there's a better way to do this but it works
    // the pixels do not line up correctly after the arm goes above the
    // robot's head, so we need to do some pixel shifting
    if(!this.pixelAdjust && this.height < 0) {
      this.y = 104;
      this.height -= 4;
      this.pixelAdjust = true;
    }
  };
}

function Text(content) {
  this.x = 10;
  this.y = 170;
  this.content = content;
  this.move = function() {
    this.y -= 5;
  };
}

function CanvasDisplay(context) {
  this.context = context;
  this.drawLine = function(x1, y1, x2, y2, lineWidth = 1, fillStyle="#000000") {
    this.context.fillStyle = fillStyle;
    this.context.lineWidth = lineWidth;
    this.context.beginPath();
    this.context.moveTo(x1, y1);
    this.context.lineTo(x2, y2);
    this.context.stroke();
  };
  this.drawText = function(x, y, text, fillStyle="#ec5a4f", font="30px Courier New") {
    this.context.fillStyle = fillStyle;
    this.context.font = font;
    this.context.fillText(text, x, y);
  };
}

function unfade(element) {
  var opacity = 0.1;
  var timer = setInterval(function () {
    opacity += opacity * 0.1;
    element.style.opacity = opacity;
    if (opacity >= 1){
        clearInterval(timer);
    }
  }, 30);
}

function draw(canvas, canvasDisplay, hand, arm, text, timer) {
  canvasDisplay.context.clearRect(0, 0, canvas.width, canvas.height);

  canvasDisplay.drawLine(hand.x, hand.y, hand.width, hand.y)
  canvasDisplay.drawLine(arm.x, arm.y, arm.x, arm.y+arm.height, 4)
  canvasDisplay.drawText(text.x, text.y, text.content);

  hand.move();
  arm.move();
  text.move();

  if(hand.y < hand.maxY) {
    // end animation
    clearTimeout(timer);

    var caption = document.getElementById("robo-caption");
    unfade(caption);
  }
}

window.onload = function() {
  var canvas = document.querySelector("canvas");
  var context = canvas.getContext("2d");
  var canvasDisplay = new CanvasDisplay(context);
  var hand = new Hand();
  var arm = new Arm();
  var text = new Text("<head>");

  canvasDisplay.drawLine(hand.x, hand.y, hand.width, hand.y)
  canvasDisplay.drawLine(arm.x, arm.y, arm.x, arm.y+arm.height, 4)
  canvasDisplay.drawText(text.x, text.y, text.content);

  var timer;
  var time = setTimeout(function () {
      timer = setInterval(function() {
        draw(canvas, canvasDisplay, hand, arm, text, timer)
      }, 50);
  }, 1000);
};
