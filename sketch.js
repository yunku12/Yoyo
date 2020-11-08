let y1;
let p1;
let yoyoPos;

let hand;
let next = 0;
let lineLength;
let lx, ly;
let box;
let tracks = [];
let armColor;


function setup() {
  createCanvas(windowWidth, 800);
  y1 = new Yoyo(mouseX, mouseY, 50);
  gravity = createVector(0,0.1);

  mNow = createVector(0,0);
  mPre = createVector(0,0);

}

function draw() {
  background(255);
  textSize(20);
  noStroke();

  armColor = color(200,200,150);
  armColor.setRed(128 + mouseY *sin(millis()/1000))
  fill(armColor);
  textAlign(CENTER);
  text('CLICK to START ',mouseX,mouseY+70);

  p1 = new Player();
  p1.armDisplay();
  p1.handDisplay();

  if (mouseButton == LEFT) {

  background(255);
  textSize(20);
  noStroke();
  fill(200);

  textAlign(CENTER);
  text('CLICK : HOLDING YOYO ',width/2,height*0.8);


  if (mouseIsPressed) {

    p1.handDisplay();
    p1.armDisplay();
    y1.display();
    y1.displayShadow()
    ly = ly * 0.7+5;
    lx = lx * 0.7-2;
    p1.handDisplay();
  } else {

    p1.handDisplay();
    y1.edge();
    y1.applyForce(gravity);
    yoyoPos = y1.pos;

    p1.armDisplay();
    p1.line();

    y1.update();
    y1.display();
    y1.displayShadow();
    p1.handDisplay();

    y1.applyForce(hand);

  }
  }

    for (let i = 0; i < tracks.length; i++){
    tracks[i].update();
    tracks[i].display();
  }
}



function mousePressed (){

  setup();
}



class Yoyo {

  constructor (x,y,m){
    this.pos = createVector(x,y);
    this.x = 0;
    this.y = 0;
    this.w = m;

    this.vel = createVector(0,0);
    this.acc = createVector(0,0);
    this.op = 0;
  }

  applyForce(force){
    this.f = force;
    this.acc.add(this.f);

  }

  update(){

    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0,0);


  }

  display(){
    noStroke();
    this.op = 255;
    fill(random(255),255,100,this.op);
    ellipse(this.x+mouseX+lx,this.y+mouseY+ly,this.w);
  }
  displayShadow() {

    noStroke();
    this.op = 160;
    fill(random(255),255,100,this.op);
    ellipse(mouseX+lx+5,mouseY+ly-5,this.w);
  }
  edge(){

    if(this.pos.y > height || this.pos.y < 0){
      this.vel.mult(-1);
      let r = random(10,50);
      let t = new Track(this.x+mouseX+lx,this.y+mouseY+ly,r);
      tracks.push(t);
  }

    if(this.pos.x > width-this.w/2){
      this.vel.mult(-1);
    } else if (this.pos.x < this.w/2){
      this.vel.mult(-1);
    }


  }

}

class Player {

  constructor (){

    this.lpos = createVector(width/2,height/3);
    this.Mpos = createVector(mouseX,mouseY);

    this.w = 30;

    if (millis() > next) {
        mNow.x = mouseX;
        mNow.y = mouseY;
        next = millis() + 1;
        mPre.x = mNow.x;
        mPre.y = mPre.y;
        hand = p5.Vector.sub(mNow, mPre);
        hand.mult(0.009);
    }
  }

  handDisplay(){
    this.lpos.x = this.Mpos.x;
    this.lpos.y = this.Mpos.y;
    fill(255);


    //손부분

    //손가락
    let t1 = map(mouseY, 0, height, 27, 13);
    let t2 = map(mouseY, 0, height, 31, 15);
    let t3 = map(mouseY, 0, height, 17, 0);


    strokeWeight(6);
    strokeCap(ROUND);
    stroke(50);
    line(mouseX-7,mouseY-10, mouseX-t1,mouseY-7);
    line(mouseX-5,mouseY-10, mouseX-t2,mouseY+5);
    line(mouseX,mouseY-10, mouseX-t2,mouseY+15);
    line(mouseX,mouseY, mouseX-t1+3,mouseY+19);
    line(mouseX,mouseY, mouseX+t3,mouseY+20);

    //손바닥
    noStroke();
    fill(50);
    ellipse (this.Mpos.x, this.Mpos.y, this.w);



  }
    armDisplay(){
    this.lpos.x = this.Mpos.x;
    this.lpos.y = this.Mpos.y;
    fill(255);


    //팔부분
    let gap = map(mouseX, 0, width, 0.2, 1);

    noFill();
    noStroke();
    point(mouseX, mouseY);
    point(width*gap, height/3);
    point(width, height/3);
    stroke(armColor);
    strokeWeight(15);

    beginShape();
    vertex(mouseX, mouseY);
    quadraticVertex(width*0.7, height/3, width, height/3);
    endShape();


  }

  line() {
    lineLength = p5.Vector.sub(yoyoPos, p1.Mpos);
    lx = map(lineLength.x, 0, width, 0,10);
    ly = map(lineLength.y, 0, height, 0, 400);

    stroke(100);
    strokeWeight(1);

    line (p1.lpos.x, p1.lpos.y,
          p1.lpos.x+lx, p1.lpos.y+ly);

  }

}


class Track {

  constructor(x,y,r){
    this.x = x;
    this.y = y;
    this.r = r;
    this.strokeRandom = random(1,5);
    this.lifespan = 255.0;
    this.rc = color(200,200,150);
    this.rc.setRed(128 + mouseY *sin(millis()/1000))
  }

  update() {
    this.r = this.r +0.1
    this.y = this.y +0.1;
    this.lifespan -= 1;
  }

  display() {
    stroke(this.rc, this.lifespan);
    strokeWeight(this.strokeRandom);
    noFill();
    ellipse(this.x,this.y,this.r);
  }


}
