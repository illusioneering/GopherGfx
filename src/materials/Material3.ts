import { GfxApp } from '../core/GfxApp';
import { Mesh3 } from '../geometry/3d/Mesh3';
import { Camera } from '../core/Camera';
import { Node3 } from '../core/Node3';
import { LightManager } from '../lights/LightManager';
import { Color } from '../math/Color';

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

    abstract draw(object: Mesh3, camera: Camera, lightManager: LightManager): void;
    abstract setColor(color: Color): void;
    abstract getColor(): Color;
}