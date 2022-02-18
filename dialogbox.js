class DialogBox {
    constructor(top, bottom) {
        this.LEFT_MARGIN = 80
        this.RIGHT_MARGIN = this.LEFT_MARGIN
        this.BOTTOM_MARGIN = 20
        this.HEIGHT = 224
        this.boxWidth = width - this.LEFT_MARGIN - this.RIGHT_MARGIN

        this.phase = 0 /* controls fading for triangle via alpha channel */
        this.radius = 6 /* "radius" of the next-passage triangle */
        this.heightScale = 1 /* controls 'open' and 'close' animations */

        this.frameTop = top
        this.frameBottom = bottom
    }


    /**
     * animates a dialog frame opening and expanding from the vertical center.
     * mouseX controls the rate of opening. includes helpful debug text
     *
     * @param slider this value should be between 0.01 to 100, where 0.01 is
     * 'fully closed' ande 100 is 'fully open'
     */
    openAnimation(slider /* increasing variable we base opening speed on */) {
        background(234, 34, 24)

        const Y_CENTER = 200
        const LEFT_MARGIN = 80

        /* maps mouseX from [0, width] to [0.01, 100]; 0.01 avoids boundary case */
        let slider0to100 = slider


        /* again mapped to 0.01 instead of 0 to avoid garbage negative image */
        /* note the use of constrain boolean at end of map */
        let slider30to100 = map(slider0to100, 30, 100, 0.01, 100, true)

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
        let σ = map(slider0to100, 0.01, 30, 0, 50, true)
        strokeWeight(2)

        /* have the opacity of the white line decrease from [0, 30] */
        // let lineAlpha = ?
        stroke(0, 0, 100, 100)

        /* our side length is a percentage of the width minus the margins; this
         spans from 0 to half the width of the textFrame */
        let sideLength = (σ/100) * (width-2*LEFT_MARGIN)

        if (slider0to100 > 0.1) /* don't display a dot before we start growing */
            /* only display if textFrame hasn't appeared yet */
            if (slider0to100 < 32)
                line(width/2-sideLength, Y_CENTER, width/2+sideLength, Y_CENTER)

        let h = frameTop.height * slider30to100/100.0
        let w = frameTop.width
        let transparency = constrain(slider0to100, 5, 30)

        if(slider0to100 >= 80 && slider0to100 <= 99) {
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
        if(slider0to100 >= 80) {
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
        text(`scaleF: ${slider0to100.toFixed(2)}`, 50, DEBUG_Y_OFFSET)
        text(`height: ${h.toFixed(2)}`, 50, DEBUG_Y_OFFSET - LINE_HEIGHT)
        text(`transparency: ${transparency.toFixed(2)}`, 50,
            DEBUG_Y_OFFSET - 2*LINE_HEIGHT)
        text(`mouseX30to100: ${slider30to100.toFixed(2)}`, 50,
            DEBUG_Y_OFFSET - 3*LINE_HEIGHT)
        text(`σ: ${σ.toFixed(2)}`, 50, DEBUG_Y_OFFSET - 4*LINE_HEIGHT)
    }


    /**
     * animate a breathing triangle
     */
    renderTriangle() {
        /*  render fading dialogbox triangle if:
         *      we are at the end of the passage, i.e.
         *          this.index === this.passage.length-1?
         *  TODO check if this works
         */
        push()
        const PADDING = 40 /* space between center of triangle and box side */
        translate(width-this.RIGHT_MARGIN-PADDING*1.2,
            height-this.BOTTOM_MARGIN-PADDING)

        /**
         *  an equilateral triangle with center (0,0) and long leg 2*r has
         *  vertices at; prove using law of sines, verify using py. theorem.
         *  (0, r)
         *  (-2r/sqrt(3), -r)
         *  (2r/sqrt(3), -r)
         */
        const r = this.radius

        /* alpha value to enable fading in our triangle */
        const a = map(sin(frameCount/20), -1, 1, 0, 80)

        const cyan = color(188, 20, 94, a)
        fill(cyan)
        triangle(0, r, -2*r/sqrt(3), -r, 2*r/sqrt(3), -r)
        pop()
    }


    /**
     *  saves the output of render2DTextBox to a PGraphics object with
     *  transparency. we can save this and use image() to display later!
     *  this gets around several p5.js bugs in 3D
     */
    saveRenderedTextBoxImg() {
        const pg = createGraphics(width, height)
        pg.colorMode(HSB, 360, 100, 100, 100)

        // add render2DTextBox code here. don't forget extra pg. calls if
        // doing manually. now it's automatic because we pass in pg!
        this.render2DTextBox(pg)
        pg.save()
    }


    /**
     * saves the top and bottom halves of the frame to an image
     */
    generateFrameHalves() {
        const pg = createGraphics(width, height)
        pg.colorMode(HSB, 360, 100, 100, 100)
        dialogBox.render2DTextBox(pg)

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
        let frameCrop = pg.get(x, y, w, h)


        /** display top and bottom halves of our frame separately */

        /* frame top half */
        const HALF_HEIGHT = h-dialogBox.HEIGHT/2 + STROKE_WIDTH_ADJUST
        const frameTop = frameCrop.get(0, 0, w, HALF_HEIGHT)
        frameTop.save()

        /* frame bottom half */
        const frameBottom = frameCrop.get(0, HALF_HEIGHT, w, HALF_HEIGHT)
        frameBottom.save()
    }


    /**
     * renders the transparent dialog box. modify this function for use in
     * saveRenderedImg. pg is "this" passed from sketch.js
     */
    render2DTextBox(pg) {
        // these are the coordinates for the top left corner of our target box
        const x = this.LEFT_MARGIN
        const y = height-this.HEIGHT-this.BOTTOM_MARGIN
        const r = 7 // side length of the corner triangle
        const s = 4 // scaling factor of r to extend brackets in corners

        /*  this approach is cumbersome. better to create quadrant 2 and
            then translate + rotate to make the remaining three quadrants
         */
        const TLC = new p5.Vector(x, y) // top left corner
        const TRC = new p5.Vector(x+this.boxWidth, y) // top right corner
        const BRC = new p5.Vector(x+this.boxWidth, y+this.HEIGHT) // bottom r.
        // corner
        const BLC = new p5.Vector(x, y+this.HEIGHT)
        const lineWeight = 5

        pg.fill(210, 62, 12, 75)
        pg.noStroke()
        pg.beginShape()

        // vertices around each of the four corners of the rectangle
        pg.vertex(TLC.x, TLC.y+r)
        pg.vertex(TLC.x+r, TLC.y)
        pg.vertex(TRC.x-r, TRC.y)
        pg.vertex(TRC.x, TRC.y+r)
        pg.vertex(BRC.x, BRC.y-r)
        pg.vertex(BRC.x-r, BRC.y)
        pg.vertex(BLC.x+r, BLC.y)
        pg.vertex(BLC.x, BLC.y-r)
        pg.endShape()

        // the cyan outline
        const cyan = color(188, 20, 94)
        pg.stroke(cyan)
        pg.strokeWeight(lineWeight)
        pg.noFill()

        // top border including corner guards
        pg.beginShape()
        // vertical line extending below TL corner guard
        // TODO needs more work with extra thick corner guard verticals
        pg.vertex(TLC.x, TLC.y+s*r /* +3 add here to be more accurate */)

        // TL corner bottom left point
        pg.vertex(TLC.x, TLC.y+r)

        // TL corner top right point
        pg.vertex(TLC.x+r, TLC.y)
        pg.vertex(TRC.x-r, TRC.y)
        pg.vertex(TRC.x, TRC.y+r)
        pg.vertex(TRC.x, TRC.y+s*r)
        pg.endShape()

        // bottom border including corner guards
        pg.strokeWeight(lineWeight)
        pg.beginShape()
        pg.vertex(BRC.x, BRC.y-s*r)
        pg.vertex(BRC.x, BRC.y-r)
        pg.vertex(BRC.x-r, BRC.y)
        pg.vertex(BLC.x+r, BLC.y)
        pg.vertex(BLC.x, BLC.y-r)
        pg.vertex(BLC.x, BLC.y-s*r)
        pg.endShape()

        const cornerGuardHorizontalScale = 0.108

        /** Corner guards! */
        // extra thick corner guard, top left
        pg.strokeWeight(lineWeight+1) /* lineWeight used to be 1 less, so we
         added one here */
        pg.beginShape()
        /* vertical line from bottom to BL corner; need vertex below */
        // pg.vertex(TLC.x+1, TLC.y+r+10)
        pg.vertex(TLC.x+1, TLC.y+r+1) // BL corner
        pg.vertex(TLC.x+1+r, TLC.y+1) // TR corner
        pg.vertex(TLC.x+this.boxWidth*cornerGuardHorizontalScale, TLC.y+1)
        // ⅛ of boxWidth bold line
        pg.endShape()

        // extra thick corner guard, top right
        pg.strokeWeight(lineWeight+1)
        pg.beginShape()
        pg.vertex(TRC.x-this.boxWidth*cornerGuardHorizontalScale, TLC.y+1)
        pg.vertex(TRC.x-r-1, TRC.y+1)
        pg.vertex(TRC.x-1, TRC.y+r+1)
        pg.endShape()

        // extra thick corner guard, bottom right
        pg.strokeWeight(lineWeight+1)
        pg.beginShape()
        pg.vertex(BRC.x-1, BRC.y-1-r)
        pg.vertex(BRC.x-1-r, BRC.y-1)
        pg.vertex(BRC.x-this.boxWidth*cornerGuardHorizontalScale, BRC.y-1)
        pg.endShape()

        // extra thick corner guard, bottom right
        pg.strokeWeight(lineWeight+1)
        pg.beginShape()
        pg.vertex(BLC.x+this.boxWidth*cornerGuardHorizontalScale, BLC.y-1)
        pg.vertex(BLC.x+1+r, BLC.y-1)
        pg.vertex(BLC.x+1, BLC.y-1-r)
        pg.endShape()
    }
}