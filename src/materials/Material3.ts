import { GfxApp } from '../core/GfxApp';
import { Mesh } from '../geometry/3d/Mesh';
import { Camera } from '../core/Camera';
import { Transform3 } from '../core/Transform3';
import { LightManager } from '../lights/LightManager';

export enum Side
{
    FRONT,
    BACK,
    DOUBLE
}

export abstract class Material3
{
    public visible: boolean;
    public side: Side;

    protected readonly gl: WebGL2RenderingContext;

    constructor()
    {
        this.visible = true;
        this.side = Side.FRONT;
        this.gl  = GfxApp.getInstance().renderer.gl;
    }

    protected initialize(): void
    {
        if(this.side == Side.DOUBLE)
        {
            this.gl.disable(this.gl.CULL_FACE);
            return;
        }

        this.gl.enable(this.gl.CULL_FACE);

        if(this.side == Side.FRONT)
             this.gl.cullFace(this.gl.BACK);
        else
            this.gl.cullFace(this.gl.FRONT);
    }

    abstract draw(object: Mesh, transform: Transform3, camera: Camera, lightManager: LightManager): void; 
}