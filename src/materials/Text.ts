import { Texture } from './Texture'
import { Color } from '../math/Color'

export class Text extends Texture
{
    public text: string;
    public font: string;
    public fillStyleString: string;
    public strokeStyleString: string;
    public backgroundStyleString: string;
    public align: CanvasTextAlign;
    public baseline: CanvasTextBaseline;

    public width: number;
    public height: number;
    public strokeWidth: number;

    private textCanvas: CanvasRenderingContext2D | null;

/**
 * Constructor for Text class. The text is rendered using the browser's canvas element and
 * then copyied into a texture, so the parameters are based on what is understood by
 * [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D).
 * Shortcuts are provided for fillStyle, backgroundStyle, and strokeStyle to use the gfx.Color
 * types if that is more convenient for your application.
 * 
 * @param text - The text to be rendered
 * @param width - The width of the text canvas
 * @param height - The height of the text canvas
 * @param font - The font style of the text. Can be a gfx.Color or see additional options for
 * [canvas.font](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/font).
 * @param fillStyle - The fill style of the text. Can be a gfx.Color or see additional options for
 * [canvas.fillStyle](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle).
 * @param backgroundStyle - The fill style of the background. Can be a gfx.Color or see additional options for
 * [canvas.fillStyle](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle).
 * @param strokeStyle - The stroke style of the text. Can be a gfx.Color or see additional options for
 * [canvas.strokeStyle](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/strokeStyle).
 * @param strokeWidth - The stroke width of the text. 
 * @param align - The alignment of the text.  See possible values in 
 * [canvas.textAlign](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/textAlign)
 * @param baseline - The baseline of the text.  See possible values in
 * [canvas.textBaseline](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/textBaseline).
 */
    constructor(text: string, width: number, height: number, font = '24px monospace', 
                fillStyle: string | Color = 'black', backgroundStyle: string | Color = '', strokeStyle: string | Color = '', strokeWidth = 1,
                align: CanvasTextAlign = 'center', baseline: CanvasTextBaseline = 'middle')
    {
        super();

        this.text = text;
        this.width = width;
        this.height = height;
        this.font = font;
        if (fillStyle instanceof Color) {
            this.fillStyleString = "rgb(" + fillStyle.r * 255 + " " + fillStyle.g * 255 + " " + fillStyle.b * 255 + " / " + fillStyle.a * 255 + ")";
        } else {
            this.fillStyleString = fillStyle;
        }
        if (backgroundStyle instanceof Color) {
            this.backgroundStyleString = "rgb(" + backgroundStyle.r * 255 + " " + backgroundStyle.g * 255 + " " + backgroundStyle.b * 255 + " / " + backgroundStyle.a * 255 + ")";
        } else {
            this.backgroundStyleString = backgroundStyle;
        }
        if (strokeStyle instanceof Color) {
            this.strokeStyleString = "rgb(" + strokeStyle.r * 255 + " " + strokeStyle.g * 255 + " " + strokeStyle.b * 255 + " / " + strokeStyle.a * 255 + ")";
        } else {
            this.strokeStyleString = strokeStyle;
        }
        this.strokeWidth = strokeWidth;
        this.align = align;
        this.baseline = baseline;
        
        this.textCanvas = document.createElement('canvas').getContext('2d');
        this.updateTextureImage();
    }

/**
 * Updates the texture image of the Text class
 * 
 * Sets the width and height of the canvas, font, text alignment, and baseline.
 * Fills the canvas with the background style if specified.
 * Fills the text with the fill style if specified.
 * Strokes the text with the stroke style and stroke width if specified.
 * Binds the texture and generated mipmap.
 */
    public updateTextureImage(): void
    {
        if(this.textCanvas)
        {   
            this.textCanvas.canvas.width = this.width;
            this.textCanvas.canvas.height = this.height;
            this.textCanvas.font = this.font;
            this.textCanvas.textAlign = this.align;
            this.textCanvas.textBaseline = this.baseline;

            this.textCanvas.clearRect(0, 0, this.width, this.height);

            if(this.backgroundStyleString != '')
            {
                this.textCanvas.fillStyle = this.backgroundStyleString;
                this.textCanvas.fillRect(0, 0, this.width, this.height);
            }

            if(this.fillStyleString != '')
            {
                this.textCanvas.fillStyle = this.fillStyleString;
                this.textCanvas.fillText(this.text, this.width / 2, this.height / 2);
            }

            if(this.strokeStyleString != '' && this.strokeWidth > 0)
            {
                this.textCanvas.strokeStyle = this.strokeStyleString;
                this.textCanvas.lineWidth = this.strokeWidth;
                this.textCanvas.strokeText(this.text, this.width / 2, this.height / 2);
            }

            this.gl.activeTexture(this.gl.TEXTURE0 + this.id);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.textCanvas.canvas);
            this.gl.generateMipmap(this.gl.TEXTURE_2D);
        }
    }
}