var lines = [];
var svg = document.getElementById("svg");
var w = (svg.style.width = window.innerWidth);
var h = (svg.style.height = window.innerHeight);
var allLines = document.getElementsByTagName("line");
var colors = [
  "#C501E1",
  "#9A26F8",
  "#6564FE",
  "#2B97FA",
  "#02C4E7",
  "#16E6CC",
  "#2EF9A0",
  "#C6E501",
  "#E7C501",
  "#FF6A63",
  "#F82D98",
  "#E830CE"
];

var mouse = { x: 0, y: 0, isDown: false };
svg.addEventListener("mouseover", function (e) {
  mouse.x = e.x;
  mouse.y = e.y;
});

window.addEventListener("resize", function (e) {
  w = svg.style.width = window.innerWidth;
  h = svg.style.height = window.innerHeight;
  createLines();
});
function Line(x1, x2, y1, y2, dy, color, width) {
  this.x1 = x1;
  this.x2 = x2;
  this.y1 = y1;
  this.y2 = y2;
  this.dy = dy;
  this.color = color;
  this.width = width;
  this.draw = function () {
    this.aLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    this.aLine.setAttribute("stroke-linecap", "round");
    this.aLine.setAttribute("stroke", this.color);
    this.aLine.setAttribute("y1", this.y1);
    this.aLine.setAttribute("y2", this.y2);
    this.aLine.setAttribute("x1", this.x1);
    this.aLine.setAttribute("x2", this.x2);
    this.aLine.setAttribute("stroke-width", this.width);
  };
  this.update = function () {
    if (this.y2 + 3 * this.dy > (2 * h) / 3 || this.y2 <= 10) {
      this.dy = -this.dy;
    }
    this.aLine.setAttribute("y2", this.y2);
    this.y2 += this.dy;
    // // if(mouse.y - this.y2 <50  && mouse.y - this.y2 >0 && mouse.x - this.x1 <50  && mouse.x - this.x1 >0)
    //    var ds =
    //   (mouse.x - this.x1) * (mouse.x - this.x1) +
    //   (mouse.y - this.y2) * (mouse.y - this.y2);
    // var rs = 150 * 150;
    // if (ds < rs)  {
    //    // console.log(mouse.y - this.y2)
    //   // this.y2 -=5;
    //   this.aLine.setAttribute("y2", mouse.y -150);
    //   this.aLine.setAttribute("stroke", "blue");
    //    }
    // else {
    //   // this.aLine.setAttribute("y2", this.y2);
    //   this.aLine.setAttribute("stroke", this.color);
    // }
  };
}

function createLines() {
  lines = [];
  while (svg.firstChild) {
    svg.removeChild(svg.firstChild);
  }
  var c = 0;
  for (var i = 0; i < w; i++) {
    var color = colors[c];
    var width = 12;
    var x1 = i * width;
    var x2 = x1;
    var y1 = 0;
    var y2 = Math.floor(Math.random() * (h / 2)) + 20;
    var dy = Math.floor(Math.random() * 6) + 2;
    var line = new Line(x1, x2, y1, y2, dy, color, width);
    if (c === colors.length - 1) {
      c = 0;
    } else {
      c++;
    }
    lines.push(line);
    lines[i].draw();
    svg.appendChild(lines[i].aLine);
  }
}
createLines();

function animate() {
  for (var i = 0; i < lines.length; i++) {
    lines[i].update();
  }
  requestAnimationFrame(animate);
}
animate();
