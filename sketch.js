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

let dialogBox
let finishedTextFrame

function preload() {
    finishedTextFrame = loadImage('data/textFrame.png')
}

function setup() {
    createCanvas(1280, 720)
    colorMode(HSB, 360, 100, 100, 100)
    noCursor()

    dialogBox = new DialogBox()
    // dialogBox.saveRenderedTextBoxImg()
}

function draw() {
    background(234, 34, 24)

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

    let frameCrop = finishedTextFrame.get(x, y, w, h)

    /* top half of our frame */
    const HALF_HEIGHT = h-dialogBox.HEIGHT/2 + STROKE_WIDTH_ADJUST
    const frameTop = frameCrop.get(0, 0, w, HALF_HEIGHT)

    /* bottom half of our frame */
    const frameBottom = frameCrop.get(0, HALF_HEIGHT, w, HALF_HEIGHT)

    image(frameTop, x, 50)
    image(frameBottom, x, 250)

    fill(90, 100, 100, 50)
    noStroke()
    circle(x, y, 4)
    circle(x+w, y+h, 4)
}