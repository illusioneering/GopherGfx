import { Transform2 } from "../../core/Transform2";
import { Vector2 } from "../../math/Vector2";
import { Color } from "../../math/Color";
import { LineMaterial } from "../../materials/LineMaterial"
import { GfxApp } from "../../core/GfxApp";
import { BoundingBox2 } from "../../math/BoundingBox2";

export enum LineMode2
{
    LINES,
    LINE_STRIP,
    LINE_LOOP
}

export class Line2 extends Transform2
{
    protected readonly gl: WebGL2RenderingContext;

    public positionBuffer: WebGLBuffer | null;
    public colorBuffer: WebGLBuffer | null;

    public vertexCount: number;
    public material: LineMaterial;

    public lineMode: number;
    
    constructor(lineMode = LineMode2.LINE_STRIP)
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

    createFromBox(box: BoundingBox2)
    {      
         const vertices: number[] = [];
         vertices.push(box.min.x, box.min.y);
         vertices.push(box.max.x, box.min.y);
         vertices.push(box.max.x, box.max.y);
         vertices.push(box.min.x, box.max.y);

         this.setVertices(vertices);
         this.createDefaultVertexColors();

         this.lineMode = LineMode2.LINE_LOOP;
    }

    draw(parent: Transform2,): void
    {
        if(!this.visible)
            return;

        this.material.draw2d(this);

        this.children.forEach((elem: Transform2) => {
            elem.draw(this);
        });
    }

    setVertices(vertices: Vector2[] | number[], usage = this.gl.STATIC_DRAW): void
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
                (vertices as Vector2[]).forEach((elem: Vector2) =>
                {
                    vArray.push(elem.x, elem.y);
                });
            }
            
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vArray), usage);
            this.vertexCount = vArray.length / 2;
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
        const vertexArray = new Float32Array(this.vertexCount * 2);
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
        if(this.lineMode == LineMode2.LINES)
            return this.gl.LINES;
        else if(this.lineMode == LineMode2.LINE_STRIP)
            return this.gl.LINE_STRIP;
        else
            return this.gl.LINE_LOOP;  
    }
}