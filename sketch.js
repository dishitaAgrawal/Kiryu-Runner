var city, player, tank, missile, obstacle, logo, invisibleGround, city_Img, mine_explode_Anim, tank_explode_Anim, player_Img, player_die_Img, tank_Img, end_Img, game_over_Img, missile_Img, obstacle_Img, logo_Img, fuel, fuel_Img;
var tankG, missileG, obstacleG, fuelG;
var score = 0;

//Game States
var PLAY=1;
var START=0;
var END=2;
var gameState=START;
var fuelValue=120, fuelBar, bar, rand_Frames = [1050, 1250, 1450, 1650], rand_no;

function preload()
{
    player_Img = loadAnimation("kir_player.gif");
    player_die_Img = loadImage("kir_player_die.png");
    tank_Img = loadImage("tank.png");
    missile_Img = loadImage("missile.png");
    obstacle_Img = loadImage("mine.png");
    city_Img = loadImage("background.png");
    fuel_Img = loadImage("fuel.png");
    tank_explode_Anim = loadAnimation("tank_explode.gif");
    mine_explode_Anim = loadAnimation("mine_explode.gif");
    fuel_explode_Anim = loadAnimation("fuel_explode.gif");
    game_over_Img = loadImage("game_over.png");
}

function setup()
{
    createCanvas(500, 500);
    // Moving background
    city = createSprite(250, 250);
    city.addImage(city_Img);
    invisibleGround = createSprite(200,490,500,10);
    invisibleGround.visible = false;

    // bar = createSprite(450, 30, 85, 30);
    // fuelBar = createSprite(450, 30, 5 * fuelValue, 20);
    // fuelBar.shapeColor = 'red';
    // bar.shapeColor = 'black';

    // fuelBar.visible = false;
    // bar.visible = false;

    end_Img = createSprite(250, 250);
    end_Img.addImage(game_over_Img);
    end_Img.visible = false;


    player = createSprite(70, 420, 20,20);
    player.visible = true;

    tankG=new Group();
    missileG=new Group();
    fuelG=new Group();
    obstacleG=new Group();
}
function draw(){
    background(0);
    
    drawSprites()
    if(gameState==START){ 
        if (mouseDown("leftButton") == true) {
           
            gameState = gameState +1;
        
        }
    }else if(gameState==PLAY){
        city.velocityX = -4;
        if(city.x < 50 ){
            city.x = 450;
        }

        fill("white")
        rect(350, 30,120,30)
        fill("red")
        rect(350, 30,fuelValue,30)
        player.addAnimation("Kiryu",player_Img);
  
        player.visible = true;
        player.scale=0.55;  

        createTank();
        createObstacles();
        createFuel();
        if (keyDown("f"))
        {
            fireMissile();
        }
        if (keyDown("space"))
        {
          player.velocityY = -10;

          console.log("Jump! " +player.velocityY)

        }
        if(player.y < 360 && frameCount % 30 == 0){
              fuelValue = fuelValue - 10;
            }
        player.velocityY = player.velocityY + 0.5;
        destroyTank();
        destroyPlayer();
        destroyFuel();
        fuelG.overlap(player,(collided)=>{
            collided.destroy();
            
              fuelValue = 120;
           
  
        })
    }else{
        setTimeout(() => {
            obstacleG.destroyEach();
          }, 1000);
          end_Img.visible = true;
          player.addAnimation("Kiryu", player_die_Img);
          player.x = 120;
          player.y = 455;
          player.scale = 0.475;
          if(mouseDown("leftButton") == true) {
                reset()
               
              
          }
    }
  player.collide(invisibleGround);

}

function reset(){
    gameState=START;
 tankG.destroyEach();
                score = 0;
                fuelValue = 15;
                gameState = gameState + 1;
}
function destroyTank()
{
  if(missileG.isTouching(tankG)){
    missileG.destroyEach();
    tank.addAnimation("Tank",tank_explode_Anim);
    tank.scale=0.5;
    score = score + 1;
    setTimeout(() => {
      tankG.destroyEach();
    }, 1000);
  }

}

function destroyFuel()
{
  if(missileG.isTouching(fuelG)){
    missileG.destroyEach();
    fuel.y = 430;
    fuel.addAnimation("Fuel",fuel_explode_Anim);
    fuel.scale=0.5;
    setTimeout(() => {
      fuelG.destroyEach();
    }, 1000);
  } 
}

function destroyPlayer()
{
  if(obstacleG.isTouching(player))
  {
      tank.velocityX = 0;
      city.velocityX = 0;
      obstacle.velocityX =0;
      if(fuel)
      {
        fuel.velocityX = 0;
      }
      obstacle.y = 435;
      obstacle.addAnimation("Mine",mine_explode_Anim);
      obstacle.scale=0.5;
      obstacle.depth = player.depth + 2;
      setTimeout(() => {
        obstacleG.destroyEach();
      }, 1000);
      gameState = END;
  }
}

function fireMissile()
{

        missile= createSprite(180, 100, 60, 10);
        missile.addImage(missile_Img);
        missile.y=player.y + 10;
        missile.velocityX = 4;
        missile.lifetime = 300;
        missile.scale = 0.15;
        missileG.add(missile);
        player.depth = missile.depth + 1;
         
}

function createTank() {
    if (World.frameCount % 300 == 0) {
      tank = createSprite(500, 440, 10, 10);
      tank.addImage("Tank",tank_Img);
      tank.scale=0.12;
      tank.velocityX = -3;
      tank.lifetime = width / 3;
      tankG.add(tank);
    }
  }
  
  function createFuel() {
        
    if (World.frameCount % 150 == 0) {
      fuel = createSprite(500, 440, 10, 10);
      fuel.y = Math.floor(random(10,450))
      fuel.addImage("Fuel",fuel_Img);
      fuel.scale=0.5;
      fuel.velocityX = -3;
      fuel.lifetime = width / 3;
      fuelG.add(fuel);
    }
  }
  
  function createObstacles() {
    if (World.frameCount % 340 == 0) {
      obstacle = createSprite(500, 465, 10, 10);
      obstacle.addImage("Mine",obstacle_Img);
      obstacle.scale=0.035;
      obstacle.velocityX = -3;
      obstacle.lifetime = width / 3;
      obstacleG.add(obstacle);
      }
  }