import { GfxApp } from '../core/GfxApp';

/**
 * Represents an image texture
 * 
 * @class Texture
 */
export class Texture
{
    private static numTextures = 0;

    protected readonly gl: WebGL2RenderingContext;

    /**
     * The internal object used by WebGL to draw this texture
     */
    public texture: WebGLTexture | null;

    /**
     * The WebGL texture ID used to draw this texture
     */
    public id: number;

    /** 
     * The width of the original (non-mipmapped) texture image data or 'undefined' if
     * the image has not yet completed loading.
     */
    public width: number | undefined;

    /** 
     * The height of the original (non-mipmapped) texture image data or 'undefined' if
     * the image has not yet completed loading.
     */
    public height: number | undefined;

    /**
     * Create a new instance of a texture.
     * 
     * @param url URL to load the texture from (can be absolute, e.g.
     * "http://unlikely-url.com/some-image.jpg", or relative, e.g.
     * "./some-image.jpg"). Can be null to start out with, in which case the
     * texture will be empty.
     */
    constructor(source: string | null | ImageData = new ImageData(new Uint8ClampedArray([255, 0, 255, 255]), 1, 1))
    {
        this.gl  = GfxApp.getInstance().renderer.gl;

        this.texture = this.gl.createTexture();
        this.id = Texture.numTextures;
        Texture.numTextures++;

        this.gl.activeTexture(this.gl.TEXTURE0 + this.id);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST_MIPMAP_LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);

        if (source instanceof ImageData) {
            this.width = source.width;
            this.height = source.height;
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.width, this.height, 0, this.gl.RGBA, 
                this.gl.UNSIGNED_BYTE, source.data);
        } else if (typeof source == "string") {
            this.width = undefined;
            this.height = undefined;
            this.load(source);
        } else {
            this.width = 1;
            this.height = 1;
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.width, this.height, 0, this.gl.RGBA, 
                this.gl.UNSIGNED_BYTE, new Uint8Array([255, 0, 255, 255]));  
        }
    }

    /**
     * Load an image into this texture.
     * 
     * @param url URL to load the texture from (can be absolute, e.g.
     * "http://unlikely-url.com/some-image.jpg", or relative, e.g.
     * "./some-image.jpg"). Can be null to start out with, in which case the
     * texture will be empty.
     */
    load(url: string): void
    {
        GfxApp.getInstance().assetManager.requestedAssets.push(url);

        const image = new Image();
        image.addEventListener('load', (event: Event)=>{ this.imageLoaded(image, url) }, false);
        image.addEventListener('error', (event: Event)=>{ this.imageNotFound(url) }, false);
        image.src = url;
    }

    /**
     * Callback function for image loaded events
     * 
     * @param image HTML DOM image element produced by loading the image texture
     * @param url Original URL the image was loaded from (used as an internal identifier for the image asset)
     */
    imageLoaded(image: HTMLImageElement, url: string): void
    {
        GfxApp.getInstance().assetManager.loadedAssets.push(url);

        this.width = image.width;
        this.height = image.height;
        this.gl.activeTexture(this.gl.TEXTURE0 + this.id);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
    }

    /**
     * Copies the pixel data from an ImageData source into the texture
     * 
     * @param imageData An ImageData object with the same width and height as the texture
     */
    setFullImageData(imageData: ImageData): void
    {
        this.gl.activeTexture(this.gl.TEXTURE0 + this.id);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.texSubImage2D(this.gl.TEXTURE_2D, 0, 0, 0, imageData.width, imageData.height, this.gl.RGBA, this.gl.UNSIGNED_BYTE, imageData.data);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
    }

    /**
     * Copies the pixel data from an ImageData source into a portion of the texture, placing it as a sub-image within the texture
     * 
     * @param imageData An ImageData object with width and height that are the same size or smaller than the texture
     * @param xOffset An offset in the x-direction within the texture where the top-left corner of imageData should be placed
     * @param yOffset An offset in the y-direction within the texture where the top-left corner of imageData should be placed
     */
    setSubImageData(imageData: ImageData, xOffset: number, yOffset: number): void
    {
        this.gl.activeTexture(this.gl.TEXTURE0 + this.id);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.texSubImage2D(this.gl.TEXTURE_2D, 0, xOffset, yOffset, imageData.width, imageData.height, this.gl.RGBA, this.gl.UNSIGNED_BYTE, imageData.data);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
    }

    /**
     * Callback function for when the requested image cannot be found (load error)
     * 
     * @param url Original URL the image was loaded from (used as an internal identifier for the errored image asset)
     */
    imageNotFound(url: string): void
    {
        GfxApp.getInstance().assetManager.errorAssets.push(url);
    }

    /**
     * Control the minification filter (sampling if a texture is shown at less than its original size)
     * 
     * @param linear Use linear filtering
     * @param mipmap Use mipmapping
     */
    setMinFilter(linear: boolean, mipmap: boolean)
    {
        this.gl.activeTexture(this.gl.TEXTURE0 + this.id);

        if(linear)
        {
            if(mipmap)
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST_MIPMAP_LINEAR);
            else
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        }
        else
        {
            if(mipmap)
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST_MIPMAP_NEAREST);
            else
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        }
    }

    /**
     * Control the magnification filter (sampling if a texture is shown at greater than its original size)
     * 
     * @param linear Use linear filtering
     */
    setMagFilter(linear: boolean)
    {
        this.gl.activeTexture(this.gl.TEXTURE0 + this.id);

        if(linear)
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        else
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    }

    /**
     * Set the wrapping mode for the texture.
     * 
     * @param repeat Repeat the texture beyond its bounds or just show it once
     */
    setWrapping(repeat: boolean)
    {
        this.gl.activeTexture(this.gl.TEXTURE0 + this.id);
        
        if(repeat)
        {
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);
        }
        else
        {
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        }
    }
}