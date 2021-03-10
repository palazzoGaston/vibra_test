// 1. Se lanza el juego en un browser.
// 2. Se piden los reels a la api.
// 3. Se piden las paylines a la api.
// 4. Se pide el paytable a la api.

// 5. Se realiza un spin (giro de reels) presionando el botón spin. El spin debe durar en promedio 3 segundos desde que comenzaron a girar los reels hasta que se detienen.
// 6. Se detienen los reels mostrando el layout sorteado.
// 7. En el caso de haber premios, se muestran las líneas ganadoras sobre los reels y el total ganado en la ventana correspondiente.
// 8. Si hubieran líneas ganadoras, quedan resaltadas hasta el siguiente spin. Al volver a clickear el botón spin, deben desmarcarse.
// 9. Se deben poder repetir los pasos desde el punto 5.

var wrapper = new Wrapper();
var payLines = wrapper.getPaylines();
var payTables = wrapper.getPaytable();
var reels = wrapper.getReels();

const WIDTH = 490
    HEIGHT = 570;

var app = new PIXI.Application(
    {
        width: WIDTH,
        height: HEIGHT,
        antialias: true,
        backgroundAlpha: 1,
        resolution: 1,
    }
);

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

loader = new PIXI.Loader;

//load an image and run the `setup` function when it's done
loader
  .add("./images/btn_spin.png")
  .add("./images/frame.png")
  .add("./images/line_1.png")
  .add("./images/line_4.png")
  .add("./images/line_5.png")
  .add("./images/logo_mobile.png")
  .add("./images/prize_window.png")
  .add("./images/ref.png")
  .load(setup);

//This `setup` function will run when the image has loaded
function setup() {

  //Create the cat sprite
  let frame = new PIXI.Sprite(loader.resources["./images/frame.png"].texture);
  
  //Add the cat to the stage
  app.stage.addChild(frame);
}


