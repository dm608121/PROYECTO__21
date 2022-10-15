var PLAY = 1;
var backgroundImg;
var END = 0;
var gameState = PLAY;



var niño, niño_running, niño_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;

var score = 0;

var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound


function preload(){
  niño_running = loadImage("niño.png");
  niño_collided = loadAnimation("niño.png");
  
 
  backgroundImg = loadImage("fondotenebroso.png")
  groundImage = loadImage("ground.png");
  
  cloudImage = loadImage("murcielago.png");
  
  obstacle1 = loadImage("fantasma1.png");
  obstacle2 = loadImage("Zombies2.png");
  obstacle3 = loadImage("muerte1.png");
  obstacle4 = loadImage("Zombies4.png");
 
  
   restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("y2mate.com - Sonido de suspenso.mp3")
  checkPointSound = loadSound("y2mate.com - efecto de sonido de misterio.mp3")
}

function setup() {
  createCanvas(windowWidth, windowHeight);

 

  
  
  niño = createSprite(50,height-70,20,50);
  niño.addImage("running", niño_running);
  niño.addAnimation("collided" ,niño_collided);
  niño.scale = 0.2;
       
  
  
  
  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;

  invisibleGround = createSprite(width/2,height-25,width,125);
  invisibleGround.visible = false;

  
  
   gameOver = createSprite(width/2,height/2-50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  
  gameOver.scale = 0.8;
  restart.scale = 0.1;
  
  
  //crear grupos de obstáculos y nubes
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  console.log("Hola" + 5);
  
  niño.setCollider("circle",0,0,40);
  niño.debug = false
  
  score = 0;
  
}

function draw() {
  
  background(backgroundImg);
  //mostrar puntuación
  text("Puntuación: "+ score, 500,50);
  
  console.log("esto es ",gameState)
  
  
  if(gameState === PLAY){
    gameOver.visible = false
    restart.visible = false
    //mover el suelo
    ground.velocityX = -(2 + 1 * score / 200)
    //puntuación
    score = score + Math.round(frameCount/60);
    
   if(score>0 && score %100 === 0){
    checkPointSound.play()
   }

    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //hacer que el trex salte al presionar la barra espaciadora
    if(keyDown("space")&& niño.y >= 100) {
      niño.velocityY = -9;
      jumpSound.play()
  }
    
    //agregar gravedad
    niño.velocityY = niño.velocityY + 0.8
  
    //aparecer las nubes
    spawnMurcielagos();
  
    //aparecer obstáculos en el suelo
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(niño)){
        gameState = END;
        dieSound.play();
    }
  }
   else if (gameState === END) {
     console.log("hey")
      gameOver.visible = true;
      restart.visible = true;
     
      ground.velocityX = 0;
      niño.velocityY = 0
     
      //cambiar la animación del trex
      niño.changeAnimation("collided", niño_collided);
     
      //establecer lifetime de los objetos del juego para que no sean destruidos nunca
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
   }
  
 
  //evitar que el trex caiga
  niño.collide(invisibleGround);
  
  if(mousePressedOver(restart)){
    resset();
  }
    
  
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width-20,height-95,20,30);
   obstacle.velocityX = -(8 + score / 100);
   
    //generar obstáculos al azar
    var rand = Math.round(random(1,4));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      
      default: break;
    }
   
    //asignar escala y lifetime al obstáculo           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //agregar cada obstáculo al grupo
    obstaclesGroup.add(obstacle);
 }
}

function spawnMurcielagos() {
  //escribir aquí el código para aparecer las nubes
  if (frameCount % 30 === 0) {
     cloud = createSprite(810,100,40,10);
    cloud.y = Math.round(random(10,400));
    cloud.addImage(cloudImage);
    cloud.scale = 0.08;
    cloud.velocityX = -5;
    
     //asignar lifetime a la variable
    cloud.lifetime = 300;
    
    //ajustar la profundidad
    cloud.depth = niño.depth;
    niño.depth = niño.depth + 1;
    
    //agregar cada nube al grupo
   cloudsGroup.add(cloud);
    }
}

function resset()  {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score = 0;
} 