// noinspection NonAsciiCharacters

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
 *  ☒ basic opening animation demo
 *  ☐ full animation including flashing white background + expanding line
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
    const LEFT_MARGIN = 80

    /* maps mouseX from [0, width] to [0.01, 100]; 0.01 avoids boundary case */
    let mouseX0To100 = map(mouseX, 0, width, 0.01, 100)


    /* convert mouseX mapping to mapping by frameCount */
    // mouseX0To100 = map(frameCount % 100, 0, 100, 0, 100)


    /* again mapped to 0.01 instead of 0 to avoid garbage negative image */
    /* note the use of constrain boolean at end of map */
    let mouseX30To100 = map(mouseX0To100, 30, 100, 0.01, 100, true)

    /**
     *  from 0-30, draw a growing white horizontal line
     *      map from [0,30] to [0,50] side length percentage σ
     *      side length will be (σ/100) * width ← better as [0, 0.5]
     *      find center point (width/2, Y_CENTER)
     *          line from width/2 +/- σ
     *  💩 match width of line to textFrame. center properly
     *      how do we fix the width? determine margins and centering
     *          dialogBox.js shows LEFT_MARGIN to be 80
     *          ☒ thus our X_OFFSET should be 80 instead of 100
     *      how do we restrict our expanding white line?
     *          we expand from the center using a percentage of width
     *          ☒ change to percentage of width - 80 or 80*2?
     *  🔧 reduce transparency of white line as it grows to 30
     *
     *
     */
    let σ = map(mouseX0To100, 0.01, 30, 0, 50, true)
    strokeWeight(2)

    /* have the opacity of the white line decrease from [0, 30] */
    // let lineAlpha = ?
    stroke(0, 0, 100, 100)

    /* our side length is a percentage of the width minus the margins; this
     spans from 0 to half the width of the textFrame */
    let sideLength = (σ/100) * (width-2*LEFT_MARGIN)

    if (mouseX0To100 > 0.1) /* don't display a dot before we start growing */
        /* only display if textFrame hasn't appeared yet */
        if (mouseX0To100 < 32)
            line(width/2-sideLength, Y_CENTER, width/2+sideLength, Y_CENTER)

    let h = frameTop.height * mouseX30To100/100.0
    let w = frameTop.width
    let transparency = constrain(mouseX0To100, 5, 30)

    if(mouseX0To100 >= 80 && mouseX0To100 <= 99) {
        /*  draw a white rectangle with the correct width and height
            ☐ start with two rects with the same coordinates as fTop + fBottom

         */
        const L_MARGIN_PADDING = 4
        const H_PADDING_TOP = 5
        const H_PADDING_BOTTOM = 12
        fill(0, 0, 100, 100)

        /* TODO this should technically be one correctly-sized rect ;p */
        rect( /* top half */
            LEFT_MARGIN+L_MARGIN_PADDING, Y_CENTER-h+5,
            w-L_MARGIN_PADDING*2, h+5,
            8)
        rect(
            LEFT_MARGIN+L_MARGIN_PADDING, Y_CENTER,
            w-L_MARGIN_PADDING*2, h-15,
            8)
    }
    if(mouseX0To100 >= 80) {
        tint(0, 0, 100, 100) /* full opacity near end of mouseX range */
    } else {
        /* gradually increase opacity ∈[30, 100] */
        tint(0, 0, 100, transparency)
    }


    /* if mouseX0To100 ∈ [80. 90] maybe tint the entire thing white? */


    /* keep frameTop's bottom edge at a constant height */
    image(frameTop, LEFT_MARGIN, Y_CENTER-h, w, h)
    image(frameBottom, LEFT_MARGIN, Y_CENTER, w, h)


    /** debug corner 🍁 TODO: make a function for this. dictionary! */
    const DEBUG_Y_OFFSET = height - 50 /* floor of debug corner */
    const LINE_HEIGHT = textAscent() + textDescent() + 2 /* 2 = lineSpacing */
    fill(0, 0, 100, 100) /* white */
    strokeWeight(0)
    text(`scaleF: ${mouseX0To100.toFixed(2)}`, 50, DEBUG_Y_OFFSET)
    text(`height: ${h.toFixed(2)}`, 50, DEBUG_Y_OFFSET - LINE_HEIGHT)
    text(`transparency: ${transparency.toFixed(2)}`, 50,
        DEBUG_Y_OFFSET - 2*LINE_HEIGHT)
    text(`mouseX30to100: ${mouseX30To100.toFixed(2)}`, 50,
        DEBUG_Y_OFFSET - 3*LINE_HEIGHT)
    text(`σ: ${σ.toFixed(2)}`, 50, DEBUG_Y_OFFSET - 4*LINE_HEIGHT)
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