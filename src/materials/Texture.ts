import { GfxApp } from '../core/GfxApp';

export class Texture
{
    private static numTextures = 0;

    protected readonly gl: WebGL2RenderingContext;

    public texture: WebGLTexture | null;
    public id: number;

    constructor(url: string | null = null)
    {
        this.gl  = GfxApp.getInstance().renderer.gl;

        this.texture = this.gl.createTexture();
        this.id = Texture.numTextures;
        Texture.numTextures++;

        this.gl.activeTexture(this.gl.TEXTURE0 + this.id);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, 
            this.gl.UNSIGNED_BYTE, new Uint8Array([255, 0, 255, 255]));
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        
        if(url)
            this.load(url);
    }

    load(url: string): void
    {
        GfxApp.getInstance().assetManager.requestedAssets.push(url);

        const image = new Image();
        image.addEventListener('load', (event: Event)=>{ this.imageLoaded(image, url) }, false);
        image.addEventListener('error', (event: Event)=>{ this.imageNotFound(url) }, false);
        image.src = url;
    }

    imageLoaded(image: HTMLImageElement, url: string): void
    {
        GfxApp.getInstance().assetManager.loadedAssets.push(url);

        this.gl.activeTexture(this.gl.TEXTURE0 + this.id);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
    }

    imageNotFound(url: string): void
    {
        GfxApp.getInstance().assetManager.errorAssets.push(url);
    }
}