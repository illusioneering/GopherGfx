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

/** 
 * Represents a 2D line.
 */
export class Line2 extends Transform2
{
    /**
     * WebGL context of the application.
     */
    protected readonly gl: WebGL2RenderingContext;

    /**
     * Buffer that stores the position of each vertex.
     */
    public positionBuffer: WebGLBuffer | null;

    /**
     * Buffer that stores the color of each vertex.
     */
    public colorBuffer: WebGLBuffer | null;

    /**
     * Number of vertices of the line.
     */
    public vertexCount: number;

    /**
     * Material used to render the line.
     */
    public material: LineMaterial;

    /**
     * Mode of the line.
     */
    public lineMode: number;
    
    /**
     * Creates an instance of Line2.
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
     * Creates a Line object from a BoundingBox2 object
     * 
     * @param box - The BoundingBox2 object to create the Line from
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
     * Draws the Line object
     */
    draw(): void
    {
        if(!this.visible)
            return;

        this.material.draw2d(this);

        this.children.forEach((elem: Transform2) => {
            elem.draw();
        });
    }

    /**
     * Sets the vertices of the Line object
     * 
     * @param vertices - An array of Vector2 objects or numbers representing the vertex positions
     * @param usage - OpenGL flag specifying the expected usage of the buffer (defaults to STATIC_DRAW)
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
     * Sets the colors of the Line object
     * 
     * @param colors - An array of Color objects or numbers representing the vertex colors
     * @param usage - OpenGL flag specifying the expected usage of the buffer (defaults to STATIC_DRAW)
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
     * Gets the vertex positions of the Line object
     * 
     * @returns An array of numbers representing the vertex positions
     */
    getVertices(): number[]
    {
        const vertexArray = new Float32Array(this.vertexCount * 2);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.getBufferSubData(this.gl.ARRAY_BUFFER, 0, vertexArray);
        return [... vertexArray];
    }

    /**
     * Gets the vertex colors of the Line object
     * 
     * @returns An array of numbers representing the vertex colors
     */
    getColors(): number[]
    {
        const colorArray = new Float32Array(this.vertexCount * 4);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.getBufferSubData(this.gl.ARRAY_BUFFER, 0, colorArray);
        return [... colorArray];
    }

    
    /**
     * Creates a default set of colors for the Line object, with each vertex having a color of white (r,g,b,a = 1,1,1,1)
     */
    public createDefaultVertexColors(): void
    {
        const colors: number[] = [];

        for(let i=0; i < this.vertexCount; i++)
            colors.push(1, 1, 1, 1);

        this.setColors(colors);
    }

    /**
     * Returns the appropriate OpenGL line mode for the current LineMode2 value
     * 
     * @returns The OpenGL line mode corresponding to the LineMode2 value
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
