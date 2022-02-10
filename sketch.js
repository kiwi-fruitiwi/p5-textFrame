/**
 * @author Kiwi
 * @date 2022.02.10
 *
 * this project attempts to replicate the animated dialog box in Metroid Dread
 * that appears whenever Adam is speaking. here we are concerned only with
 * methods to generate and animate the frame. p5-dialogSystem takes a look
 * at how to implement the scrolling text for each passage.
 *
 * what am I aiming for?
 *
 *
 */

let font
let dialogBox
let finishedTextFrame

let frameTop, frameBottom

function preload() {
    // finishedTextFrame = loadImage('data/textFrame.png')
    font = loadFont("data/consola.ttf")
    frameTop = loadImage('data/frameTop.png')
    frameBottom = loadImage('data/frameBottom.png')
}

function setup() {
    createCanvas(1280, 720)
    colorMode(HSB, 360, 100, 100, 100)
    background(234, 34, 24)

    textFont(font, 14)
    dialogBox = new DialogBox(frameTop, frameBottom)
    // dialogBox.saveRenderedTextBoxImg()
    // dialogBox.generateFrameHalves()
}


function draw() {
    openAnimationDemo()
}


/**
 * animates a dialog frame opening and expanding from the vertical center.
 * mouseX controls the rate of opening. includes helpful debug text
 */
function openAnimationDemo() {
    background(234, 34, 24)

    const Y_CENTER = 200
    const X_OFFSET = 100

    let scale = map(mouseX, 0, width, 0, 100)
    scale = constrain(scale, 0.01, 100)

    let h = frameTop.height * scale/100.0
    let w = frameTop.width
    let transparency = constrain(scale, 30, 100)
    tint(0, 0, 100, transparency) /* gradually increase opacity */

    /* keep frameTop's bottom edge at a constant height */
    image(frameTop, X_OFFSET, Y_CENTER-h, w, h)
    image(frameBottom, X_OFFSET, Y_CENTER, w, h)


    /** debug corner 🍁 */
    const DEBUG_Y_OFFSET = height - 50
    const LINE_HEIGHT = textAscent() + textDescent() + 2 /* 2 = lineSpacing */
    fill(0, 0, 100, 100) /* white */
    text(`scaleF: ${scale.toFixed(2)}`, 50, DEBUG_Y_OFFSET)
    text(`height: ${h.toFixed(2)}`, 50, DEBUG_Y_OFFSET - LINE_HEIGHT)
    text(`transparency: ${transparency.toFixed(2)}`, 50,
        DEBUG_Y_OFFSET - 2*LINE_HEIGHT)
}

/**
 * displays frames from dialogBox.generateFrameHalves for debugging
 */
function displayFrameHalves() {
    dialogBox.render2DTextBox(this)

    /**
     *  create a cropped version of the 1280x720 textFrame. this is the
     *  frame itself without the rest of the transparent background. Use
     *  image.get(x, y, w, h). we need STROKE_WIDTH_ADJUST because the
     *  stroke of the original frame exceeds the coordinates roughly by the
     *  strokeWidth/2
     *
     *  https://p5js.org/reference/#/p5.Image/get
     *  syntax: get(x, y, w, h)
     */
    const STROKE_WIDTH_ADJUST = 3;
    const x = dialogBox.LEFT_MARGIN-STROKE_WIDTH_ADJUST
    const y = height
        - dialogBox.BOTTOM_MARGIN
        - dialogBox.HEIGHT-STROKE_WIDTH_ADJUST
    const w = dialogBox.boxWidth+STROKE_WIDTH_ADJUST*2
    const h = dialogBox.HEIGHT+STROKE_WIDTH_ADJUST*2

    // we can use either get() which uses the canvas, or finishedTextFrame.get()
    let frameCrop = get(x, y, w, h)



    /** display top and bottom halves of our frame separately */

    /* frame top half */
    const HALF_HEIGHT = h-dialogBox.HEIGHT/2 + STROKE_WIDTH_ADJUST
    const frameTop = frameCrop.get(0, 0, w, HALF_HEIGHT)
    image(frameTop, x, 50)

    /* frame bottom half */
    const frameBottom = frameCrop.get(0, HALF_HEIGHT, w, HALF_HEIGHT)
    image(frameBottom, x, 250)

    /** add debug dots on top left and bottom right corners */
    fill(90, 100, 100, 50) /* green */
    noStroke()
    circle(x, y, 4)
    circle(x+w, y+h, 4)
}