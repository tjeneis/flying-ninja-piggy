// Aanmaken van de variabelen
var canvas;
var stage;
var myChar;
var character;
var myBullet;
var bullet;
var myEnemy;
var enemy;
var myLfe;
var life;
var myLogo;
var logo;
var myArrows;
var arrows;
var myStartBttn;
var startBttn;
var myReloadBttn;
var reloadBttn;
var scoreTxt = new Text(score, "30px OrsonCasual", "#fff");
var livesTxt = new Text(lives, "30px OrsonCasual", "#fff");
var levelTxt = new Text(level, "30px OrsonCasual", "#fff");
var usernameTxt = new Text("30px OrsonCasual", "#fff");
var gameoverTxt = new Text(score, "18px Arnold", "#292929");
var timer = 0;
var score = 0;
var lives = 3;
var level = 1;
var speed = 5;
var reloadSwitch = false;
var startGame = false;
var deadEnemy = false;
var left = false;
var right = false;
var up = false;
var down = false;
var fire = false;
var enter = false;

// Initialisatie
var canvas = document.getElementById('stageCanvas');
var stage = new Stage(canvas);

// Browsercheck
var browser = navigator.userAgent;

// Ticker aanmaken en init functie laden bij het laden van scherm
Ticker.setFPS(30);
Ticker.addListener(window);
window.onload = init;
stage.update();

// Cookie
function getCookie(c_name)
{
var i,x,y,ARRcookies=document.cookie.split(";");
for (i=0;i<ARRcookies.length;i++)
  {
  x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
  y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
  x=x.replace(/^\s+|\s+$/g,"");
  if (x==c_name)
    {
    return unescape(y);
    }
  }
}

// Checken of er een username cookie opgeslagen is, anders nieuwe aanmaken
function setCookie(c_name,value,exdays)
{
var exdate=new Date();
exdate.setDate(exdate.getDate() + exdays);
var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
document.cookie=c_name + "=" + c_value;
}

// Checken of er een username cookie opgeslagen is, anders nieuwe aanmaken
function checkCookie()
{
var username=getCookie("username");
// Als de username niet null is of niet leeg laden we de bestaande username cookie
if (username!=null && username!="")
  {
  var controle = confirm("Welcome back " + username + ". Would you like to change your name?");
	  if (controle == true)
	  {
		  username=prompt("Please enter your new name:","");
		  if (username!=null && username!="")
		  {
			setCookie("username",username,365);
		 }
	  }
  }
// Anders prompt voor nieuwe username
else 
  {
  username=prompt("Please enter your name:","");
  if (username!=null && username!="")
    {
    setCookie("username",username,365);
    }
  }
}

// Aanmaken achtergronden
myBg = new Image();  
myBg.src = "img/bg.jpg";
myBg2 = new Image();  
myBg2.src = "img/bg2.jpg";
myBg3 = new Image();  
myBg3.src = "img/bg3.jpg";

// Aanmaken bullet & leven
myBullet = new Image();  
myBullet.src = "img/bullet.png";
myLife = new Image();

// Aanmaken startbuttons
myStartBttn = new Image()
myStartBttn.src = "img/startbttn.png";
myReloadBttn = new Image()
myReloadBttn.src = "img/reloadbttn.png";

// Aanmaken logo spritesheet
myLogo = new SpriteSheet
({
"frames":{
"width":150,
"height":220,
"numFrames":40,
"regX":75,
"regY":100
},
"animations":{
"idle":[0,39]
},
"images":["img/logo_sprite.png"]
});

// Aanmaken character spritesheet
myChar = new SpriteSheet
({
"frames":{
"width":150,
"height":200,
"numFrames":40,
"regX":75,
"regY":100
},
"animations":{
"left":[0,19],
"right":[20,39]
},
"images":["img/character_sprite.png"]
});

// Aanmaken enemy spritesheet
myEnemy = new SpriteSheet
({
"frames":{
"width":78,
"height":100,
"numFrames":21,
"regX":39,
"regY":50
},
"animations":{
"idle":[0,17],
"dead":[18,20]
},
"images":["img/enemy_sprite.png"]
});

// Aanmaken arrow spritesheet
myArrows = new SpriteSheet
({
"frames":{
"width":100,
"height":93,
"numFrames":6,
},
"animations":{
"idle":[0],
"left":[1],
"right":[2],
"up":[3],
"down":[4],
"shoot":[5]
},
"images":["img/arrow_sprite.png"]
});

// Aanmaken geluiden
var removeSnd = new Audio;
var fartSnd = new Audio;
var introSnd = new Audio;
var confirmSnd = new Audio;
var oinkSnd = new Audio;

function init()
{
	// Checken of de browser IE is of niet
	if(browser.indexOf("MSIE") != -1)
	{
		// Laden van IE geluiden
		loadIESound();
	}
	else
	{
		// Laden van Non IE geluiden
		loadNonIESound();
	}		
	
	// Benodigde onderdelen aan de stage toevoegen
	background = new Bitmap(myBg);
	background.x = background.y = 0;
	stage.addChildAt(background,0);

	logo = new BitmapAnimation(myLogo);
	logo.x = 550;
	logo.y = 225;
	logo.gotoAndPlay("idle");
	stage.addChildAt(logo,2);
	
	startBttn = new Bitmap(myStartBttn);
	startBttn.x = 380;
	startBttn.y = 400;
	stage.addChildAt(startBttn,2);
	stage.addChildAt(gameoverTxt, 4);
	
	// Cookie controleren en eventueel nieuwe aanmaken
	getCookie();
	setCookie();
	checkCookie();
}

// Ticker
function tick() 
{
	// Achtergrond geluid afspelen
	introSnd.play();
	
	// Laad het level wanneer de startknop niet null is en erop geklikt word
	if(startBttn != null)
	{
		startBttn.onClick = loadGame; 
	}
	// Herlaad het level wanneer de herlaadknop niet null is en erop geklikt word
	if(reloadBttn != null)
	{
		reloadBttn.onClick = reloadGame;
	}
	
	// Wanneer het level geladen is zullen onderstaande functies uitgevoerd worden
	if(startGame == true)
	{
		loadScore();
		loadLives();
		loadLevel();
		checkScore();
		checkLives();
		checkLevel();
		moveChar();
		
		// Wanneer de levens op zijn zal het game over scherm laden
		if (lives == 0) 
		{       
			endGame();
		}
		
		// Wanneer spatiebalk ingedrukt wordt en er nog geen kogel is word er een nieuwe aangemaakt
		if(fire == true && bullet == null)
		{
			shoot();
		}
		// Wanneer de kogel geladen is mag deze bewegen
		if(bullet != null)
		{
			moveBullet();
		}
		
		// Controleren of objecten mekaar raken
		hitDetection();
		// Wanneer de enemy geraakt wordt zal de timer starten en tot 25 tellen, daarna wordt de enemy verwijderd
		timerEnemy();
		
		// Enemy laden wanneer deze null is
		if(enemy == null)
		{
			loadEnemy();
		}
		// Wanneer er een enemy is mag deze bewegen
		else
		{
			moveEnemy();
		}
		
		// Extra leven laden wanneer deze null is
		if(life == null)
		{
			loadLife();
		}
		// Wanneer er een extra leven is mag deze bewegen
		else
		{
			moveLife();
		}
	}
	stage.update();
}
	
// Eerste keer laden van de game
function loadGame()
{
	// Overbodige onderdelen van de stage verwijderen
	stage.removeChild(background);
	stage.removeChild(logo);
	stage.removeChild(startBttn);
	logo = null;
	
	// Benodigde onderdelen aan de stage toevoegen
	confirmSnd.play();
	
	background2 = new Bitmap(myBg2);
	background2.x = background2.y = 0;
	stage.addChildAt(background2,0);
	
	arrows = new BitmapAnimation(myArrows);
	arrows.x = 670;
	arrows.y = 380;
	arrows.gotoAndPlay("idle");
	stage.addChildAt(arrows,1);
	
	character = new BitmapAnimation(myChar);
	character.x = 150;
	character.y = 390;
	character.gotoAndPlay("right");
	stage.addChildAt(character,2);
	
	// Startgame op true zetten zodat de andere functies binnen de tick actief worden
	startGame = true;
}	

// Laden van de game na game over
function reloadGame()
{
	// Overbodige onderdelen van de stage verwijderen
	stage.removeChild(background3);
	stage.removeChild(logo);
	stage.removeChild(reloadBttn);
	stage.removeChild(gameoverTxt);
	logo = null;
	
	// Benodigde onderdelen aan de stage toevoegen
	confirmSnd.play();
	
	background2 = new Bitmap(myBg2);
	background2.x = background2.y = 0;
	stage.addChildAt(background2,0);
	
	arrows = new BitmapAnimation(myArrows);
	arrows.x = 670;
	arrows.y = 380;
	arrows.gotoAndPlay("idle");
	stage.addChildAt(arrows,1);
	
	character = new BitmapAnimation(myChar);
	character.x = 150;
	character.y = 390;
	character.gotoAndPlay("right");
	stage.addChildAt(character,4);
	
	// Reset score en speed en zet de switch in de tikker om
	score = 0;
	speed = 5;
	startGame = true;
}


// Game over bij 0 levens
function endGame()
{	
	// Overbodige onderdelen van de stage verwijderen
	stage.removeChild(enemy);
	stage.removeChild(character);
	stage.removeChild(bullet);
	stage.removeChild(life);
	stage.removeChild(arrows);
	stage.removeChild(scoreTxt);
	stage.removeChild(livesTxt);
	stage.removeChild(levelTxt);
	stage.removeChild(usernameTxt);
	stage.removeChild(background2);
	life = null;
		
	// Benodigde onderdelen aan de stage toevoegen
	background3 = new Bitmap(myBg3);
	background3.x = background3.y = 0;
	stage.addChildAt(background3,0);
	
	if(logo == null)
	{
		logo = new BitmapAnimation(myLogo);
		logo.x = 520;
		logo.y = 240;
		logo.gotoAndPlay("idle");
		stage.addChildAt(logo,2);
	}
	
	gameoverTxt.text = getCookie("username") + ", YOU SCORED " + score + " POINTS";
	gameoverTxt.x = 150;
	gameoverTxt.y = 340;
	stage.addChild(gameoverTxt);
	
	reloadBttn = new Bitmap(myReloadBttn);
	reloadSwitch = true;
	reloadBttn.x = 380;
	reloadBttn.y = 400;
	stage.addChildAt(reloadBttn,2);
	
	// Reset level en lives en zet de switch in de tikker om
	level = 1;
	lives = 3;
	startGame = false;
}
	
// Meet de afstand tussen 2 objecten
function distance(obj1, obj2) 
{          
	var difx = obj2.x - obj1.x;          
	var dify = obj2.y - obj1.y;                
	return Math.sqrt( (difx*difx) + (dify*dify) );  
}

// Hit detectie
function hitDetection()
{
	// Wanneer de bullet en de enemy mekaar raken, de bullet verwijderen en enemy animatie afspelen
	if(bullet != null && enemy != null)
	{
		if(distance(bullet, enemy)<=50)
		{
			stage.removeChild(bullet);
			bullet = null;
			enemy.gotoAndPlay("dead");
			deadEnemy = true;
		}
	}
	// Wanneer de character en een extra leven mekaar raken, het extra leven verwijderen en leven erbij optellen
	if(character != null && life != null)
	{
		if(distance(character, life)<=60)
		{
			stage.removeChild(life);
			life = null;
			lives = lives + 1;
		}
	}
}

// Timer van enemy
function timerEnemy()
{
	if(deadEnemy == true)
	{
		timer += 1;
	}
	else
	{
		timer = 0;
	}
	if(timer >= 25)
	{
		score += 2;
		removeSnd.play();
		deadEnemy = false;
		stage.removeChild(enemy);
		enemy = null;
	}
}	

// IE geluiden aan sources koppelen
function loadIESound()
{
	removeSnd.src = "snd/woosh.mp3";
	fartSnd.src = "snd/fart.mp3";
	introSnd.src = "snd/intro.mp3";
	confirmSnd.src = "snd/confirm.mp3";
	oinkSnd.src = "snd/oink.mp3";
}

// Non IE geluiden aan sources koppelen
function loadNonIESound()
{
	removeSnd.src = "snd/woosh.wav";
	fartSnd.src = "snd/fart.wav";
	introSnd.src = "snd/intro.wav";
	confirmSnd.src = "snd/confirm.wav";
	oinkSnd.src = "snd/oink.wav";
}

// Score laden
function loadScore()
{
	scoreTxt.x = 130;
	scoreTxt.y = 49;
	stage.addChildAt(scoreTxt, 4);
}

// Score bijhouden
function checkScore()
{
	scoreTxt.text = "" + score;
	
	// Wanneer de score hoger dan of gelijk aan 10 is, speed op 8 zetten
	if(score >= 10)
	{
		speed = 8;
	}
	// Wanneer de score hoger dan of gelijk aan 20 is, speed op 12 zetten
	if(score >= 20)
	{
		speed = 12;
	}
	// Wanneer de score hoger dan of gelijk aan 30 is, speed op 16 zetten
	if(score >= 30)
	{
		speed = 16;
	}
}
	
// Levens laden
function loadLives()
{
	livesTxt.x = 316;
	livesTxt.y = 49;
	stage.addChildAt(livesTxt, 4);
}

// Levens bijhouden
function checkLives()
{
	livesTxt.text = lives;
}

// Levels laden
function loadLevel()
{
	levelTxt.x = 512;
	levelTxt.y = 49;
	stage.addChildAt(levelTxt, 4);
}

// Levels bijhouden
function checkLevel()
{
	levelTxt.text = level;
	
	// Wanneer de score hoger dan of gelijk aan 10 is, level op 2 zetten
	if(score >= 10)
	{
		level = 2;
	}
	// Wanneer de score hoger dan of gelijk aan 20 is, level op 3 zetten
	if(score >= 20)
	{
		level = 3;
	}
	// Wanneer de score hoger dan of gelijk aan 30 is, level op 4 zetten
	if(score >= 30)
	{
		level = 4;
	}
}

// Aanmaken van nieuwe kogels
function shoot()
{
	fartSnd.play();
	randomNr = Math.floor(Math.random() * 10) + 1;
	bullet = new Bitmap(myBullet);
	stage.addChildAt(bullet,1);
	bullet.y = character.y;
	bullet.x = character.x;
}

// Bullet bewegen
function moveBullet()
{
	// Wanneer de kogel nog niet buiten het canvas is, deze voortbewegen
	if(bullet.y > -50)
	{
		bullet.y -= 10;
	}
	// Verwijderen van de bullet en score met 1 verminderen
	else
	{
		stage.removeChild(bullet);
		bullet = null;
		score -= 1;
	}
}

// Enemy laden
function loadEnemy()
{
	enemy = new BitmapAnimation(myEnemy);
	enemy.gotoAndPlay("idle");
	stage.addChildAt(enemy,6);
	enemy.x = 900;
	enemy.y = Math.floor(Math.random() * 200) + 50;
}

// Enemy bewegen
function moveEnemy()
{
	// Wanneer de enemy nog niet buiten het canvas is, deze voortbewegen
	if(enemy.x > -200)
	{
		enemy.x -= speed;
	}
	// Verwijderen van de enemy en levens met 1 verminderen
	else
	{
		stage.removeChild(enemy);
		enemy = null;
		lives -= 1;
	}
}

// Life laden
function loadLife()
{
	// Random getal genereren en aan de hand van dit getal een afbeelding selecteren
	var randomNr = Math.floor(Math.random() * 2) + 1;
	if(randomNr == 1)
	{
		myLife.src = "img/life_sprite.png";
	}
	else
	{
		myLife.src = "img/life2_sprite.png";
	}
	
	life = new Bitmap(myLife);
	stage.addChildAt(life,2);
	life.y = -2000;
	life.x = Math.floor(Math.random() * 700) + 50;
	
}

// Life bewegen
function moveLife()
{
	// Wanneer het leven nog niet buiten het canvas is, deze voortbewegen
	if(life.y < 1500)
	{
		life.y += 5;
	}
	// Verwijderen van het leven
	else
	{
		stage.removeChild(life);
		life = null;
	}
}

// Toetsen wanneer ingedrukt
document.onkeydown = keyDown;

function keyDown(e) 
{	
	switch(e.keyCode)
	{
		case 37: left = true; break;
		case 38: up = true; break;
		case 39: right = true; break;
		case 40: down = true; break;
		case 32: fire = true; break;
		case 13: enter = true; break;
	}

}

// Toetsen wanneer losgelaten
document.onkeyup = keyUp;

function keyUp(e) 
{		
	switch(e.keyCode)
	{
		case 37: left = false; break;
		case 38: up = false; break;
		case 39: right = false; break;
		case 40: down = false; break;
		case 32: fire = false; break;
		case 13: enter = false; break;
	}
}

// Character bewegen
function moveChar() 
{	
	// Naar links bewegen wanneer pijltje naar links ingedrukt wordt
	if(left == true && (character.x >= 75))
	{
		character.x -= 15;
		character.gotoAndPlay("left"); 
		arrows.gotoAndPlay("left");
	}
	// Geluid afspelen wanneer pijltje naar boven ingedrukt wordt
	if(up == true) 
	{
		character.gotoAndPlay("right");
		arrows.gotoAndPlay("up");
		oinkSnd.play();
	} 
	// Naar rechts bewegen wanneer pijltje naar rechts ingedrukt wordt
	if(right == true && (character.x <= 725)) 
	{
		character.x += 15;
		character.gotoAndPlay("right"); 
		arrows.gotoAndPlay("right");
	} 
	// Geluid afspelen wanneer pijltje naar links ingedrukt wordt
	if(down == true) 
	{
		character.gotoAndPlay("right");
		arrows.gotoAndPlay("down");
		oinkSnd.play();
	}
	// Wanneer de spatiebalk ingedrukt wordt, controleren of er een nieuwe kogel geplaatst mag worden
	if(fire == true)
	{
		arrows.gotoAndPlay("shoot");
	}
}