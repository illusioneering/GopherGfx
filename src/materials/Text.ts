import { Texture } from './Texture'

export class Text extends Texture
{
    public text: string;
    public font: string;
    public fillStyle: string;
    public strokeStyle: string;
    public backgroundStyle: string;
    public align: CanvasTextAlign;
    public baseline: CanvasTextBaseline;

    public width: number;
    public height: number;
    public strokeWidth: number;

    private textCanvas: CanvasRenderingContext2D | null;

    constructor(text: string, width: number, height: number, font = '24px monospace', 
                fillStyle = 'black', backgroundStyle = '', strokeStyle = '', strokeWidth = 1,
                align: CanvasTextAlign = 'center', baseline: CanvasTextBaseline = 'middle')
    {
        super();

        this.text = text;
        this.width = width;
        this.height = height;
        this.font = font;
        this.fillStyle = fillStyle;
        this.backgroundStyle = backgroundStyle;
        this.strokeStyle = strokeStyle;
        this.strokeWidth = strokeWidth;
        this.align = align;
        this.baseline = baseline;
        
        this.textCanvas = document.createElement('canvas').getContext('2d');
        this.updateTextureImage();
    }

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

            if(this.backgroundStyle != '')
            {
                this.textCanvas.fillStyle = this.backgroundStyle;
                this.textCanvas.fillRect(0, 0, this.width, this.height);
            }

            if(this.fillStyle != '')
            {
                this.textCanvas.fillStyle = this.fillStyle;
                this.textCanvas.fillText(this.text, this.width / 2, this.height / 2);
            }

            if(this.strokeStyle != '' && this.strokeWidth > 0)
            {
                this.textCanvas.strokeStyle = this.strokeStyle;
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