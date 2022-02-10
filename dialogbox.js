class DialogBox {
    constructor(passages, highlightIndices, msPerPassage) {

        this.LEFT_MARGIN = 80
        this.RIGHT_MARGIN = this.LEFT_MARGIN
        this.BOTTOM_MARGIN = 20
        this.HEIGHT = 224

        this.boxWidth = width - this.LEFT_MARGIN - this.RIGHT_MARGIN

        this.phase = 0 /* controls fading for triangle via alpha channel */
        this.radius = 6 /* "radius" of the next-passage triangle */
    }

    renderTriangle(cam) {

        /*  render fading dialogbox triangle if:
         *      we are at the end of the passage, i.e.
         *          this.index === this.passage.length-1?
         *  TODO check if this works
         *
         *
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


    /*  saves the output of render2DTextBox to a PGraphics object with
        transparency. we can save this and use image() to display later!
        this gets around several p5.js bugs in 3D
     */
    saveRenderedTextBoxImg() {
        const pg = createGraphics(width, height)
        pg.colorMode(HSB, 360, 100, 100, 100)

        // add render2DTextBox code here. don't forget extra pg. calls if
        // doing manually. now it's automatic because we pass in pg!
        this.render2DTextBox(pg)
        pg.save()
    }


    /*  renders the transparent dialog box. modify this function for use in
        saveRenderedImg. pg is "this" passed from sketch.js
     */
    render2DTextBox(pg) {
        // these are the coordinates for the top left corner of our target box
        const x = this.LEFT_MARGIN
        const y = height-this.HEIGHT-this.BOTTOM_MARGIN
        const r = 7 // side length of the corner triangle
        const s = 4 // scaling factor of r to extend brackets in corners

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