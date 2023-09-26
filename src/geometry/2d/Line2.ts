import { Node2 } from "../../core/Node2";
import { Vector2 } from "../../math/Vector2";
import { Color } from "../../math/Color";
import { GfxApp } from "../../core/GfxApp";
import { Material2 } from "../../materials/Material2";

export enum LineMode2
{
    LINES,
    LINE_STRIP,
    LINE_LOOP
}

/**
 * The base class for 2D lines.  This class extends Node2 so it can be added directly
 * to the GopherGfx 2D scene graph.  The class can draw line segments, line strips,
 * and line loops.  The vertices are interpreted differently depending upon the 
 * LineMode2 that is set.  WebGL only supports lines that are exactly 1 pixel
 * thick.  To draw a more substantial "line", you need to draw the line using triangles.
 */
export class Line2 extends Node2
{
    protected readonly gl: WebGL2RenderingContext;

    public color: Color;
    public vertexCount: number;
    public lineMode: number;

    public readonly positionBuffer: WebGLBuffer | null;
    public readonly colorBuffer: WebGLBuffer | null;

    private colorUniform: WebGLUniformLocation | null;
    private useTextureUniform: WebGLUniformLocation | null;
    private textureUniform: WebGLUniformLocation | null;
    private modelUniform: WebGLUniformLocation | null;
    private layerUniform: WebGLUniformLocation | null;
    private positionAttribute: number;
    private colorAttribute: number;
    private texCoordAttribute: number;

    /**
     * Flag that determines whether to use vertex colors.
     */
    public hasVertexColors: boolean;
 
    /**
     * Creates an instance of Line2.
     */
    constructor(lineMode = LineMode2.LINE_STRIP)
    {
        super();

        this.color = new Color(1, 1, 1);
        this.vertexCount = 0;
        this.lineMode = lineMode;

        this.gl  = GfxApp.getInstance().renderer.gl;
        this.positionBuffer = this.gl.createBuffer();
        this.colorBuffer = this.gl.createBuffer();
       
        Material2.shader.initialize(this.gl);
        this.colorUniform = Material2.shader.getUniform(this.gl, 'materialColor');
        this.modelUniform = Material2.shader.getUniform(this.gl, 'modelMatrix');
        this.layerUniform = Material2.shader.getUniform(this.gl, 'layer');
        this.useTextureUniform = Material2.shader.getUniform(this.gl, 'useTexture');
        this.textureUniform = Material2.shader.getUniform(this.gl, 'textureImage');
        this.positionAttribute = Material2.shader.getAttribute(this.gl, 'position');
        this.colorAttribute = Material2.shader.getAttribute(this.gl, 'color');
        this.texCoordAttribute = Material2.shader.getAttribute(this.gl, 'texCoord');

        this.hasVertexColors = false;
    }

    /**
     * Draws the Line object
     */
    draw(): void
    {
        if(!this.visible)
            return;

        // Switch to this shader
        this.gl.useProgram(Material2.shader.getProgram());

        // Disable the texture in the shader
        this.gl.uniform1i(this.useTextureUniform, 0);
        this.gl.disableVertexAttribArray(this.texCoordAttribute);

        // Set the model matrix uniform
        this.gl.uniformMatrix3fv(this.modelUniform, false, this.localToWorldMatrix.mat);

        // Set the material property uniforms
        this.gl.uniform4f(this.colorUniform, this.color.r, this.color.g, this.color.b, this.color.a);

        // Set the layer uniform
        this.gl.uniform1f(this.layerUniform, this.layer);

        // Set the vertex colors
        if(this.hasVertexColors)
        {
            this.gl.enableVertexAttribArray(this.colorAttribute);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
            this.gl.vertexAttribPointer(this.colorAttribute, 4, this.gl.FLOAT, false, 0, 0);
        }
        else
        {
            this.gl.disableVertexAttribArray(this.colorAttribute);
            this.gl.vertexAttrib4f(this.colorAttribute, 1, 1, 1, 1);
        } 

        // Set the vertex positions
        this.gl.enableVertexAttribArray(this.positionAttribute);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.vertexAttribPointer(this.positionAttribute, 2, this.gl.FLOAT, false, 0, 0);

        // Draw the lines
        this.gl.drawArrays(this.glLineMode(), 0, this.vertexCount);
        
        this.children.forEach((elem: Node2) => {
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

            this.hasVertexColors = true;
        }
        else
        {
            this.hasVertexColors = false;
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
