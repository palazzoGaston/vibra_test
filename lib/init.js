/* ↓  ECHO   ↓ */
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

// preload screen
const preloadTextStyle = new PIXI.TextStyle({ fontFamily: 'console', fontSize: '49px', fill: '#ffffff' });
      textoLoading = new PIXI.Text( 'Loading...', preloadTextStyle );

// winings text
var estilo = new PIXI.TextStyle({ fontFamily: 'arial black', fontSize: '20px', fill: '#102045' }),
    textoWinings = new PIXI.Text( 'WIN: $0', estilo );

const WIDTH = 490,
      HEIGHT = 650,
      GRID_X = 27,
      GRID_Y = 110,
      GRID_PADDING = 7;

let sprites = {},
    reels_load = [[], [], []],
    isSpining = [ false, false, false ],
    spinInterval = []
    lines_container = new PIXI.Container(),
    premios_acumulados=0;

const loader = new PIXI.Loader();

// assets
const assets = [
  ["btn_spin", "./images/btn_spin.png"],
  ["line_1", "./images/line_1.png"],
  ["line_4", "./images/line_4.png"],
  ["line_5", "./images/line_5.png"],
  ["logo_mobile", "./images/logo_mobile.png"],
  ["prize_window", "./images/prize_window.png"],
  ["sym_a", "./images/symbols/sym_a.png"],
  ["sym_b", "./images/symbols/sym_b.png"],
  ["sym_c", "./images/symbols/sym_c.png"],
  ["sym_d", "./images/symbols/sym_d.png"],
  ["sym_e", "./images/symbols/sym_e.png"],
  ["frame", "./images/frame.png"]
];


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


app.stage.addChild( textoLoading );
textoLoading.x = ( WIDTH / 2 ) - ( textoLoading.width / 2 );
textoLoading.y = ( HEIGHT / 2 ) - ( textoLoading.height / 2 );

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
  let no_aderir_aun = [
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
    if (!no_aderir_aun.includes(key)){
      app.stage.addChild(sprites[key]);
    }
  });


  // creacion y carga de los contendores
  // simbolos
  reels.forEach(( reel, r ) => {
    let container = new PIXI.Container();
    app.stage.addChild(container);
    
    container.name = r;

    reel.forEach((r_obj_key, reel_pos) => {
      reels_load[r].push({
        reel_contenedor: r, 
        reelPos: reel_pos,
        sprite: createSprite(`sym_${r_obj_key}`)
      });

      container.addChild(reels_load[r][reel_pos].sprite);
    })
  });

  // lineas
  app.stage.addChild(lines_container);
 
  [ "line_1", "line_4", "line_5" ].forEach((l)=>{
    lines_container.addChild( createSprite( l ));
  });

  for(let i=0; i<3; i++){
    lines_container.children[i].visible = false;
  }

  for(let i=0; i<3; i++){
    lines_container.children[i].x = (WIDTH/2) - (lines_container.children[i].width /2);
  }
  // window prize
  app.stage.addChild(textoWinings);

  reelConfig();
  templateInicial();
}

// sprite factory
function createSprite(key=""){
  if (key != ""){
    let sprite = new PIXI.Sprite(loader.resources[key, key].texture)
    sprite.name = key;
    return sprite;
  }
};

// layout template
function templateInicial(){
  // resource position
  sprites.frame.y = (HEIGHT/2) - (sprites.frame.height/2);
  
  sprites.btn_spin.x = WIDTH - sprites.btn_spin.width - 20;
  sprites.btn_spin.y = (HEIGHT - sprites.btn_spin.height) - 15;
  sprites.btn_spin.interactive = true;
  sprites.btn_spin.buttonMode = true;
  sprites.btn_spin.on("click", spin);
  
  sprites.prize_window.x = 20;
  sprites.prize_window.y = (HEIGHT - sprites.prize_window.height) - 15;
  
  sprites.logo_mobile.x = (WIDTH/2) - (sprites.logo_mobile.width/2);
  sprites.logo_mobile.y = 8;

  textoWinings.x = sprites.prize_window.x + ( textoWinings.width / 3 );
  textoWinings.y = sprites.prize_window.y + ( textoWinings.height / 2 ) + 2;
}

// reel config
function reelConfig(){
  reels_load.forEach(( reel, r ) => {
    reel.forEach(( reel_obj, reel_pos ) =>{
      
      reel_obj.sprite.position.y = (GRID_Y + GRID_PADDING) + (reel_obj.sprite.height * 3) - 2800 + ( reel_obj.sprite.height * reel_pos );
      reel_obj.sprite.position.x = GRID_PADDING + GRID_X + ( reel_obj.sprite.width * r );
      
      reel_obj.x = reel_obj.sprite.x;
      reel_obj.y = reel_obj.sprite.y;
      
      verSoloEnGrid( reel_obj );
    });
  });

  return reels_load;
}

// spin
function spin(){
  sprites.btn_spin.interactive = false;
  
  for( let i=0; i<3; i++ ){
    lines_container.children[i].visible = false;
  };

  let velocidad = 7,
      result_data = wrapper.spin();
  
  isSpining = [ true, true, true ];

  setTimeout(() => {
    isSpining[0] = false;
  }, 1000);

  reels_load.forEach(( reel, reel_index )=>{
    setTimeout(()=>{
      spinInterval[ reel_index ] = setInterval(() => {
        updateReel( reel, reel_index, velocidad, result_data.stopPoints[ reel_index ], result_data.prizes, result_data.winnings );
      }, 7);
    }, (200 * reel_index));    
  });
}

function reelObjMove( reel_obj, velocidad ){
  reel_obj.sprite.position.y += velocidad;
  reinsertarReelObj( reel_obj );
  verSoloEnGrid( reel_obj );
}

function verSoloEnGrid( reel_obj ) {
  // definir limites de visibilidad
  if (( reel_obj.sprite.position.y >= ( GRID_Y ) )){
    reel_obj.sprite.visible = true; // dentro del grid
  }else {
    reel_obj.sprite.visible = false; // fuera del grid
  }
}

function reinsertarReelObj( reel_obj ) {
  // generar posiciones ciclicas
  if (reel_obj.sprite.position.y >= ((GRID_Y + GRID_PADDING) + (reel_obj.sprite.height * 2) + 7 )){
    reel_obj.sprite.position.y = ((GRID_Y + GRID_PADDING) + (reel_obj.sprite.height * 2)) - ( reel_obj.sprite.height * 20 ); // posicion mas alta del reel -2800 (alto de los sprite * total de sprites)
  }
}

function dibujarLinea( prizes ){  
  prizes.forEach(( prize )=>{
    switch ( prize.lineId ){
      case 1:
        lines_container.children[0].position.y = GRID_Y + GRID_PADDING + ( reels_load[0][0].sprite.height / 2 ) - 5;
        lines_container.children[0].visible = true;
        break;
      case 0:
        lines_container.children[0].position.y = GRID_Y + GRID_PADDING + ( reels_load[0][0].sprite.height * 1.5) - 5;
        lines_container.children[0].visible = true;
        break;
      case 2:
        lines_container.children[0].position.y = GRID_Y + GRID_PADDING + ( reels_load[0][0].sprite.height * 2.5) - 5;
        lines_container.children[0].visible = true;
        break;
      case 3:
        lines_container.children[1].y = GRID_Y;
        lines_container.children[1].visible = true;
        break;
      case 4:
        lines_container.children[2].y = GRID_Y;
        lines_container.children[2].visible = true;
        break;
      default:
        break;
    }
  });
}

function dibujarPremio( winnings ){
  premios_acumulados += winnings;
  textoWinings.text = `WIN: $${premios_acumulados}`;
}

function updateReel( reel, reel_index, velocidad, stop_point, prizes, winnings ){
  if (( (reel[ stop_point ].sprite.position.y + 7) != ( GRID_Y + GRID_PADDING )) || isSpining[reel_index]){
    reel.forEach(( reel_obj )=>{
      reelObjMove( reel_obj, velocidad );
    });
  } else {
    clearInterval( spinInterval[ reel_index ] );
    if ( reel_index == 2 ) {
      dibujarLinea( prizes );
      dibujarPremio( winnings );
      sprites.btn_spin.interactive = true;
    } else {
      isSpining[ reel_index + 1 ] = false;
    }
  }
}