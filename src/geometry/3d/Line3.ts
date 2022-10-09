import { Transform3 } from "../../core/Transform3";
import { Vector3 } from "../../math/Vector3";
import { Color } from "../../math/Color";
import { LineMaterial } from "../../materials/LineMaterial"
import { Camera } from "../../core/Camera";
import { LightManager } from "../../lights/LightManager";
import { GfxApp } from "../../core/GfxApp";
import { BoundingBox3 } from "../../math/BoundingBox3";

export enum LineMode3
{
    LINES,
    LINE_STRIP,
    LINE_LOOP
}

export class Line3 extends Transform3
{
    protected readonly gl: WebGL2RenderingContext;

    public positionBuffer: WebGLBuffer | null;
    public colorBuffer: WebGLBuffer | null;

    public vertexCount: number;
    public material: LineMaterial;

    public lineMode: number;
    
    constructor(lineMode = LineMode3.LINE_STRIP)
    {
        super();

        this.gl  = GfxApp.getInstance().renderer.gl;

        this.positionBuffer = this.gl.createBuffer();
        this.colorBuffer = this.gl.createBuffer();
        this.vertexCount = 0;

        // default material
        this.material = new LineMaterial();

        this.lineMode = lineMode;
    }

    createFromBox(box: BoundingBox3)
    {      
         const vertices: number[] = [];

         // Bottom rectangle
         vertices.push(box.max.x, box.min.y, box.max.z);
         vertices.push(box.max.x, box.min.y, box.min.z);
         vertices.push(box.min.x, box.min.y, box.min.z);
         vertices.push(box.min.x, box.min.y, box.max.z);
         vertices.push(box.max.x, box.min.y, box.max.z);
         vertices.push(box.min.x, box.min.y, box.max.z);
         vertices.push(box.max.x, box.min.y, box.min.z);
         vertices.push(box.min.x, box.min.y, box.min.z);

         // Top rectangle
         vertices.push(box.max.x, box.max.y, box.max.z);
         vertices.push(box.max.x, box.max.y, box.min.z);
         vertices.push(box.min.x, box.max.y, box.min.z);
         vertices.push(box.min.x, box.max.y, box.max.z);
         vertices.push(box.max.x, box.max.y, box.max.z);
         vertices.push(box.min.x, box.max.y, box.max.z);
         vertices.push(box.max.x, box.max.y, box.min.z);
         vertices.push(box.min.x, box.max.y, box.min.z);
         
         // Sides
         vertices.push(box.max.x, box.min.y, box.max.z);
         vertices.push(box.max.x, box.max.y, box.max.z);
         vertices.push(box.max.x, box.min.y, box.min.z);
         vertices.push(box.max.x, box.max.y, box.min.z);
         vertices.push(box.min.x, box.min.y, box.min.z);
         vertices.push(box.min.x, box.max.y, box.min.z);
         vertices.push(box.min.x, box.min.y, box.max.z);
         vertices.push(box.min.x, box.max.y, box.max.z);

         this.setVertices(vertices);
         this.createDefaultVertexColors();

         this.lineMode = LineMode3.LINES;
    }

    draw(parent: Transform3, camera: Camera, lightManager: LightManager): void
    {
        if(!this.visible)
            return;

        this.material.draw3d(this, camera);

        this.children.forEach((elem: Transform3) => {
            elem.draw(this, camera, lightManager);
        });
    }

    setVertices(vertices: Vector3[] | number[], usage = this.gl.STATIC_DRAW): void
    {
        if(vertices.length > 0)
        {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);

            let vArray: number[];
            if(typeof vertices[0] === 'number')
            {
                vArray = vertices as number[];
                
            }
            else
            {
                vArray = [];
                (vertices as Vector3[]).forEach((elem: Vector3) =>
                {
                    vArray.push(elem.x, elem.y, elem.z);
                });
            }
            
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vArray), usage);
            this.vertexCount = vArray.length / 3;

            this.boundingBox.computeBounds(vArray);
            this.boundingSphere.computeBounds(vArray, this.boundingBox);
        }
    }

    setColors(colors: Color[] | number[], usage = this.gl.STATIC_DRAW): void
    {
        if(colors.length > 0)
        {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);

            if(typeof colors[0] === 'number')
            {
                this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors as number[]), usage);
            }
            else
            {
                const cArray: number[] = [];
                (colors as Color[]).forEach((elem: Color) =>
                {
                    cArray.push(elem.r, elem.g, elem.b, elem.a);
                });
                
                this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(cArray), usage);
            }
        }
    }

    getVertices(): number[]
    {
        const vertexArray = new Float32Array(this.vertexCount * 3);
        this.gl.bindBuffer(this.gl.COPY_READ_BUFFER, this.positionBuffer);
        this.gl.getBufferSubData(this.gl.COPY_READ_BUFFER, 0, vertexArray);
        return [... vertexArray];
    }

    getColors(): number[]
    {
        const colorArray = new Float32Array(this.vertexCount * 4);
        this.gl.bindBuffer(this.gl.COPY_READ_BUFFER, this.colorBuffer);
        this.gl.getBufferSubData(this.gl.COPY_READ_BUFFER, 0, colorArray);
        return [... colorArray];
    }

    public createDefaultVertexColors(): void
    {
        const colors: number[] = [];

        for(let i=0; i < this.vertexCount; i++)
            colors.push(1, 1, 1, 1);

        this.setColors(colors);
    }

    public glLineMode(): number
    {
        if(this.lineMode == LineMode3.LINES)
            return this.gl.LINES;
        else if(this.lineMode == LineMode3.LINE_STRIP)
            return this.gl.LINE_STRIP;
        else
            return this.gl.LINE_LOOP;  
    }
}