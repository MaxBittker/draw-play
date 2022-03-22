let w, h;
let pathStarted = false;
let g_path;
let paths = [];
let g_changeNode = [-1, -1];
// const synth = new Tone.Synth().toDestination();
const synth = new Tone.MetalSynth({
  harmonicity: 27,
  resonance: 600,
  modulationIndex: 1,
  envelope: {
    decay: 1
  },
  volume: -15
}).toDestination();
var Cmajor = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"];
var Ebmajor = ["Eb4", "F4", "G4", "Ab4", "Bb4", "C5", "D5", "Eb5"];
let scale = Cmajor;
if (synth.context._context.state !== "running") {
  synth.context.resume();
}
document.documentElement.addEventListener("mousedown", function () {
  if (synth.context._context.state !== "running") {
    synth.context.resume();
  }
});

document.documentElement.addEventListener("touchstart", function () {
  if (synth.context._context.state !== "running") {
    synth.context.resume();
  }
});
function setup() {
  w = windowWidth;
  h = windowHeight;
  createCanvas(w, h);
  colorMode(HSB, 360, 100, 100);
  background(0, 0, 0);
  rectMode(CENTER);
}
let sat = 60;
let b = 120;
function draw() {
  // background(0, 0, 0, 0.1);

  if (mouseIsPressed) {
    if (!pathStarted) {
      g_path = new Path();
      pathStarted = true;
      paths.push(g_path);
      let p = createVector(mouseX, mouseY);
      g_path.addPoint(p);
    }

    if (pathStarted) {
      let collission_dist = g_path.r;
      let p = createVector(mouseX, mouseY);
      let p_i = g_path.points[g_path.points.length - 1];
      let d = p5.Vector.dist(p, p_i);
      if (d > collission_dist) {
        noStroke();
        let c = collideColor(p_i, g_path.r);

        strokeWeight(g_path.r / 2);
        stroke(g_path.c, sat, b, 0.9);
        line(p_i.x, p_i.y, p.x, p.y);
        noStroke();

        if (c > 0) {
          synth.triggerAttackRelease(scale[g_path.i % scale.length], 5);

          stroke(g_path.c, sat, b, 1);
          noStroke();

          //   noFill();
          fill(g_path.c, sat, b);

          ellipse(p_i.x, p_i.y, collission_dist * 1, collission_dist * 1);
        }
        g_path.addPoint(p);
      }
    }
  }

  if (!mouseIsPressed) {
    pathStarted = false;
  }
}

class Path {
  constructor() {
    this.points = [];
    this.r = 10;
    this.c = 180;
    this.i = 0;
  }

  addPoint(p) {
    this.points.push(p);
  }

  drawPath() {
    this.points.forEach((p, i) => {});
  }
}

function collideColor(p, dist) {
  //iterate through points, see if it intersects
  let crosses = 0;
  paths.forEach((path, path_i) => {
    path.points.forEach((point, point_i) => {
      let d = p5.Vector.dist(point, p);
      //make sure it doesn't change color twice in the same point (or neighbors) when crossing
      if (
        d != 0 &&
        d < dist &&
        !(g_changeNode[0] == path_i && abs(g_changeNode[1] - point_i) < 2)
      ) {
        crosses++;
        g_path.c = newColor();
        g_changeNode = [path_i, point_i];
      }
    });
  });
  if (crosses) {
    g_path.i += Math.ceil(Math.random() * 6);
  }
  return crosses;
}

function newColor() {
  let c = (g_path.c += (Math.ceil(Math.random() * 6) * 360) / scale.length);
  c %= 360;
  return c;
}
