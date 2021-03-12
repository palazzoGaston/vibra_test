// ↓  TO DO   ↓
// 1. Se lanza el juego en un browser.
// 2. Se piden los reels a la api.
// 3. Se piden las paylines a la api.
// 4. Se pide el paytable a la api.
// 5. Se realiza un spin (giro de reels) presionando el botón spin. El spin debe durar en promedio 3 segundos desde que comenzaron a girar los reels hasta que se detienen.
// 6. Se detienen los reels mostrando el layout sorteado.
// 7. En el caso de haber premios, se muestran las líneas ganadoras sobre los reels y el total ganado en la ventana correspondiente.
// 8. Si hubieran líneas ganadoras, quedan resaltadas hasta el siguiente spin. Al volver a clickear el botón spin, deben desmarcarse.
// 9. Se deben poder repetir los pasos desde el punto 5.

const wrapper = new Wrapper(),
      payLines = wrapper.getPaylines(),
      payTables = wrapper.getPaytable(),
      reels = wrapper.getReels();

const WIDTH = 490,
      HEIGHT = 650,
      GRID_X = 27,
      GRID_Y = 110;

const loader = new PIXI.Loader();

// assets
const assets = [
  ["btn_spin", "./images/btn_spin.png"],
  ["frame", "./images/frame.png"],
  ["line_1", "./images/line_1.png"],
  ["line_4", "./images/line_4.png"],
  ["line_5", "./images/line_5.png"],
  ["logo_mobile", "./images/logo_mobile.png"],
  ["prize_window", "./images/prize_window.png"],
  ["sym_a", "./images/symbols/sym_a.png"],
  ["sym_b", "./images/symbols/sym_b.png"],
  ["sym_c", "./images/symbols/sym_c.png"],
  ["sym_d", "./images/symbols/sym_d.png"],
  ["sym_e", "./images/symbols/sym_e.png"]
];

let sprites = {};

const GRID_Y_X = 
[
  "117, 34",
  "257, 34",
  "2777, 34",
  "117, 174",
  "257, 174",
  "2777, 174",
  "117, 314",
  "257, 314",
  "2777, 314"
];

// app
const app = new PIXI.Application({
  width: WIDTH,
  height: HEIGHT
});


document.body.appendChild(app.view);

preload();

// preload assets
function preload(){
  assets.forEach(element => {
    loader.add(element[0], element[1]);
  });
  loader.load(setup);
}

// setup assets
function setup(){
  let hidden_sprites = [
    "line_1",
    "line_4",
    "line_5",
    "sym_a",
    "sym_b",
    "sym_c",
    "sym_d",
    "sym_e"
  ];

  assets.forEach(([ key, value ]=items) => {
    sprites[key] = createSprite(key);
    app.stage.addChild(sprites[key]);
    if (hidden_sprites.includes(key)){
      sprites[key].visible = false;
    }
  });
  templateInicial();
}

// sprite factory
function createSprite(key=""){
  if (key != ""){
    let sprite = new PIXI.Sprite(loader.resources[key, key].texture)
    sprite.name = key;
    return sprite;
  }
  console.log("invalid key");
};

// layout template
function templateInicial(){
  // resource position
  sprites.frame.y = (HEIGHT/2) - (sprites.frame.height/2);

  sprites.btn_spin.x = WIDTH - sprites.btn_spin.width - 20;
  sprites.btn_spin.y = (HEIGHT - sprites.btn_spin.height) - 15;
  
  sprites.prize_window.x = 20;
  sprites.prize_window.y = (HEIGHT - sprites.prize_window.height) - 15;
  
  sprites.logo_mobile.x = (WIDTH/2) - (sprites.logo_mobile.width/2);
  sprites.logo_mobile.y = 8;
  
  sprites.line_1.x = (WIDTH/2) - (sprites.line_1.width/2);
  sprites.line_1.y = HEIGHT/2;

  sprites.line_4.x = (WIDTH/2) - (sprites.line_4.width/2);
  sprites.line_4.y = (HEIGHT/2) - (sprites.line_5.height/2);

  sprites.line_5.x = (WIDTH/2) - (sprites.line_5.width/2);
  sprites.line_5.y = (HEIGHT/2) - (sprites.line_5.height/2);


  // spin
  spin(reelConfig());
}

// reel config
function reelConfig(){
  let reels_load = { 0:[], 1:[], 2:[] };

  let count=0;

  reels.forEach(( reel, r ) => {
    reel.forEach((r_obj_key, reel_pos) => {
      reels_load[r].push({
        reel_contenedor: r, 
        reelPos: reel_pos,
        sprite: createSprite(`sym_${r_obj_key}`)
      });
      app.stage.addChild(reels_load[r][reel_pos].sprite);
      
      reels_load[r][reel_pos].sprite.position.y = 7 + GRID_Y + (reels_load[r][reel_pos].sprite.height * count);
      reels_load[r][reel_pos].sprite.position.x = 7 + GRID_X + (reels_load[r][reel_pos].sprite.width * r);
      
      count++;
      if (count == 20) count = 0;
      
      if(count > 3) {
        reels_load[r][reel_pos].sprite.visible = false;
      }
    });
  });
  return reels_load;
}

// spin
function spin(reels_load){ // REHACER
  // app.stage.children.sort(() => sprites.frame.zIndex=2);

  // var refreshInterval =  window.setInterval((e)=>{
  //   reels_load.value.forEach( reel_obj => {
  //     reel_obj.sprite.position.y += 1;

  //     if (reel_obj.sprite.position.y > 405){
  //       reel_obj.sprite.visible = false;
  //       reel_obj.sprite.position.y %= 20;
  //     } else{
  //       reel_obj.sprite.visible = true;
  //     }

  //     if (reel_obj.sprite.position.y < 110){
  //       reel_obj.sprite.visible = false;
  //     }
  //   });
  // }, 1);
}

// game loop
    // update
    // display