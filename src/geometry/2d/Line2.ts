import { Transform2 } from "../../core/Transform2";
import { Vector2 } from "../../math/Vector2";
import { Color } from "../../math/Color";
import { LineMaterial } from "../../materials/LineMaterial"
import { GfxApp } from "../../core/GfxApp";
import { BoundingBox2 } from "../../math/BoundingBox2";

/**
  * 
  * @export
  * @enum {number}
  */
export enum LineMode2
{
    LINES,
    LINE_STRIP,
    LINE_LOOP
}

/** 
 * Represents a 2D line.
 * @export
 * @class Line2
 * @extends {Transform2}
 */
export class Line2 extends Transform2
{
    /**
     * WebGL context of the application.
     * 
     * @protected
     * @type {WebGL2RenderingContext}
     * @memberof Line2
     */
    protected readonly gl: WebGL2RenderingContext;

    /**
     * Buffer that stores the position of each vertex.
     * 
     * @type {WebGLBuffer | null}
     * @memberof Line2
     */
    public positionBuffer: WebGLBuffer | null;

    /**
     * Buffer that stores the color of each vertex.
     * 
     * @type {WebGLBuffer | null}
     * @memberof Line2
     */
    public colorBuffer: WebGLBuffer | null;

    /**
     * Number of vertices of the line.
     * 
     * @type {number}
     * @memberof Line2
     */
    public vertexCount: number;

    /**
     * Material used to render the line.
     * 
     * @type {LineMaterial}
     * @memberof Line2
     */
    public material: LineMaterial;

    /**
     * Mode of the line.
     * 
     * @type {number}
     * @memberof Line2
     */
    public lineMode: number;
    
    /**
     * Creates an instance of Line2.
     * @param {number} [lineMode=LineMode2.LINE_STRIP] 
     * @memberof Line2
     */
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

    /**
     * Creates the line from a bounding box.
     * 
     * @param {BoundingBox2} box 
     * @memberof Line2
     */
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

    /**
     * Draws the line.
     * 
     * @param {Transform2} parent 
     * @memberof Line2
     */
    draw(parent: Transform2,): void
    {
        if(!this.visible)
            return;

        this.material.draw2d(this);

        this.children.forEach((elem: Transform2) => {
            elem.draw(this);
        });
    }

    /**
     * Sets the vertices of the line.
     * 
     * @param {(Vector2[] | number[])} vertices 
     * @param {number} [usage=this.gl.STATIC_DRAW] 
     * @memberof Line2
     */
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

    /**
     * Sets the colors of the line.
     * 
     * @param {(Color[] | number[])} colors 
     * @param {number} [usage=this.gl.STATIC_DRAW] 
     * @memberof Line2
     */
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

    /**
     * Returns an array of vertex positions.
     * 
     * @returns {number[]} 
     * @memberof Line2
     */
    getVertices(): number[]
    {
        const vertexArray = new Float32Array(this.vertexCount * 2);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.getBufferSubData(this.gl.ARRAY_BUFFER, 0, vertexArray);
        return [... vertexArray];
    }

    /**
     * Returns an array of vertex colors.
     * 
     * @returns {number[]} 
     * @memberof Line2
     */
    getColors(): number[]
    {
        const colorArray = new Float32Array(this.vertexCount * 4);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.getBufferSubData(this.gl.ARRAY_BUFFER, 0, colorArray);
        return [... colorArray];
    }

    /**
     * Sets all vertex colors to white.
     * 
     * @memberof Line2
     */
    public createDefaultVertexColors(): void
    {
        const colors: number[] = [];

        for(let i=0; i < this.vertexCount; i++)
            colors.push(1, 1, 1, 1);

        this.setColors(colors);
    }

    /**
     * Returns the GL line mode.
     * 
     * @returns {number} 
     * @memberof Line2
     */
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
