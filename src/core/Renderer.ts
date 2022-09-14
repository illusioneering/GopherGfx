import { Scene } from "./Scene";
import { Camera } from "./Camera";
import { Color } from "../math/Color";
import { Vector2 } from "../math/Vector2";
import { MathUtils } from "../math/MathUtils";

export enum Viewport
{
    FIT,
    CROP,
    STRETCH
}

export class Renderer
{
    public background: Color;
    public viewport: Viewport;

    public readonly gfxCanvas: HTMLCanvasElement;
    public readonly gl: WebGL2RenderingContext;

    constructor()
    {
        this.gfxCanvas = document.getElementById("gfxCanvas") as HTMLCanvasElement;
        if(!this.gfxCanvas)
        {
            alert("Unable to find gfxCanvas.");
        }

        this.gfxCanvas.width = window.innerWidth;
        this.gfxCanvas.height = window.innerHeight;

        // Initialize the GL context
        // Disabling alpha in the back buffer prevents texture blending issues
        // due to the way WebGL composites the canvas with the body background
        const gl = this.gfxCanvas.getContext("webgl2", {alpha: false})!;
        if(!gl) 
        {
            alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        }
        this.gl = gl!;

        // depth testing
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        // back face culling
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);
        
        // texturing with transparency
        gl.enable(this.gl.BLEND) ;
        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

        this.background = new Color();
        this.viewport = Viewport.FIT;
    }

    resize(width: number, height: number, aspectRatio: number): void
    {
        this.gfxCanvas.width = width;
        this.gfxCanvas.height = height;

        if(this.viewport == Viewport.FIT)
        {
            // Resize and center the viewport to preserve the aspect ratio
            if(aspectRatio > window.innerWidth / window.innerHeight)
            {
                this.gl.viewport(
                    0, 
                    (window.innerHeight - window.innerWidth / aspectRatio) / 2, 
                    window.innerWidth, 
                    window.innerWidth / aspectRatio
                );
            }
            else
            {
                this.gl.viewport(
                    (window.innerWidth - window.innerHeight * aspectRatio) / 2, 
                    0, 
                    window.innerHeight * aspectRatio, 
                    window.innerHeight
                );
            }
        }
        else if(this.viewport == Viewport.CROP)
        {
            // Resize and center the viewport to crop within the window
            if(aspectRatio > window.innerWidth / window.innerHeight)
            {
                this.gl.viewport(
                    (window.innerWidth - window.innerHeight * aspectRatio) / 2, 
                    0, 
                    window.innerHeight * aspectRatio, 
                    window.innerHeight
                );
            }
            else
            {
                this.gl.viewport(
                    0, 
                    (window.innerHeight - window.innerWidth / aspectRatio) / 2, 
                    window.innerWidth, 
                    window.innerWidth / aspectRatio
                );
            }
        }
        else
        {
            // Resize the viewport fill the entire entire window
            // This does not preserve the aspect ratio
            this.gl.viewport(
                0,
                0, 
                window.innerWidth, 
                window.innerHeight
            );
        }
    }

    render(scene: Scene, camera: Camera): void
    {
        if(camera.projectionMatrixDirty)
        {
            this.resize(this.gfxCanvas.width, this.gfxCanvas.height, camera.getAspectRatio());
            camera.projectionMatrixDirty = false;
        }

        this.gl.clearColor(this.background.r, this.background.g, this.background.b, this.background.a);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT); 
        
        scene.draw(camera);
    }

    getNormalizedDeviceCoordinates(mouseX: number, mouseY: number): Vector2
    {
        const viewport = this.gl.getParameter(this.gl.VIEWPORT) as Int32Array;
        return new Vector2(
            MathUtils.clamp((mouseX - viewport[0]) / viewport[2] * 2 - 1, -1, 1),
            MathUtils.clamp((mouseY - viewport[1]) / viewport[3] * -2 + 1, -1, 1)
        );
    }
}