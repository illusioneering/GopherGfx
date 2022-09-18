import { Texture } from './Texture'

export class Text extends Texture
{
    private text: string;
    private fill: boolean;
    private stroke: boolean;
    private textCanvas: CanvasRenderingContext2D | null;

    constructor(text: string, width: number, height: number, font = '24px monospace', align: CanvasTextAlign = 'center', 
    baseline: CanvasTextBaseline = 'middle', fillStyle = 'black', strokeStyle = 'black', strokeWidth = 0)
    {
        super();

        this.text = text;
        this.fill = fillStyle == '' ? false : true;
        this.stroke = (strokeStyle ==  '' || strokeWidth == 0) ? false : true;

        this.textCanvas = document.createElement('canvas').getContext('2d');
        if(this.textCanvas)
        {
            this.textCanvas.canvas.width = width;
            this.textCanvas.canvas.height = height;
            this.textCanvas.font = font;
            this.textCanvas.textAlign = align;
            this.textCanvas.textBaseline = baseline;
            this.textCanvas.fillStyle = fillStyle;
            this.textCanvas.strokeStyle = strokeStyle;
            this.textCanvas.lineWidth = strokeWidth;
        }

        this.updateTextureImage();
    }

    setText(text: string): void
    {
        this.text = text;
    }

    setSize(width: number, height: number): void
    {
        if(this.textCanvas)
        {
            this.textCanvas.canvas.width = width;
            this.textCanvas.canvas.height = height;
        }
    }

    setFont(font: string): void
    {
        if(this.textCanvas)
        {
            this.textCanvas.font = font;
        }
    }

    setAlign(align: CanvasTextAlign): void
    {
        if(this.textCanvas)
        {
            this.textCanvas.textAlign = align;
        }
    }

    setBaseline(baseline: CanvasTextBaseline): void
    {
        if(this.textCanvas)
        {
            this.textCanvas.textBaseline = baseline;
        }
    }

    setFillStyle(fillStyle: string): void
    {
        this.fill = fillStyle == '' ? false : true;

        if(this.textCanvas)
        {
            this.textCanvas.fillStyle = fillStyle;
        }
    }

    setStrokeStyle(strokeStyle: string): void
    {
        this.stroke = strokeStyle ==  '' ? false : true;

        if(this.textCanvas)
        {
            this.textCanvas.strokeStyle = strokeStyle;
        }
    }

    setStrokeWidth(strokeWidth: number): void
    {
        this.stroke = strokeWidth == 0 ? false : true;

        if(this.textCanvas)
        {
            this.textCanvas.lineWidth = strokeWidth;
        }
    }

    public updateTextureImage(): void
    {
        if(this.textCanvas)
        {
            this.textCanvas.clearRect(0, 0, this.textCanvas.canvas.width, this.textCanvas.canvas.height);

            if(this.fill)
            {
                this.textCanvas!.fillText(this.text, this.textCanvas.canvas.width / 2, this.textCanvas.canvas.height / 2);
            }

            if(this.stroke)
            {
                console.log(this.textCanvas!.lineWidth);
                this.textCanvas!.strokeText(this.text, this.textCanvas.canvas.width / 2, this.textCanvas.canvas.height / 2);
            }

            this.gl.activeTexture(this.gl.TEXTURE0 + this.id);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.textCanvas.canvas);
            this.gl.generateMipmap(this.gl.TEXTURE_2D);
        }
    }
}