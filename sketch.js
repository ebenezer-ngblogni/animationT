let particles = [];
let checkedPairs = new Set();
let palette = [
  [11, 106, 136],
  [45, 197, 244],
  [112, 50, 126],
  [146, 83, 161],
  [164, 41, 99],
  [236, 1, 90],
  [240, 99, 164],
  [241, 97, 100],
  [248, 158, 79],
  [252, 238, 33],
];

let pieceImages = [];

function preload() {
  // Charger les images des pièces d'échecs
  const pieces = [
    "chess-king.svg",
    "chess-queen.svg",
    "chess-bishop.svg",
    "chess-knight.svg",
    "chess-rook.svg",
    "chess-pawn.svg",
  ];
  for (let piece of pieces) {
    pieceImages.push(loadImage(`img/${piece}`));
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight); // Adapter au viewport
  for (let i = 0; i < 10; i++) {
    let x = random(width);
    let y = random(height);
    let mass = random(4, 260);
    let img = random(pieceImages); // Associer une image aléatoire à chaque particule
    particles.push(new Particle(x, y, mass, i, img));
  }
}

function draw() {
  background(0);

  let boundary = new Rectangle(width / 2, height / 2, width, height);
  let qtree = new QuadTree(boundary, 4);
  checkedPairs.clear();

  for (let particle of particles) {
    let point = new Point(particle.position.x, particle.position.y, particle);
    qtree.insert(point);
  }

  for (let i = 0; i < particles.length; i++) {
    let particleA = particles[i];
    let range = new Circle(
      particleA.position.x,
      particleA.position.y,
      particleA.r * 2
    );

    let points = qtree.query(range);
    for (let point of points) {
      let particleB = point.userData;
      if (particleB !== particleA) {
        let idA = particleA.id;
        let idB = particleB.id;
        let pair = idA < idB ? `${idA},${idB}` : `${idB},${idA}`;
        if (!checkedPairs.has(pair)) {
          particleA.collide(particleB);
          checkedPairs.add(pair);
        }
      }
    }
  }

  for (let particle of particles) {
    particle.update();
    particle.edges();
    particle.show();
  }

  if (frameCount % 120 == 0) {
    console.log(frameRate());
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // Redimensionner le canevas lors du redimensionnement de la fenêtre
}
