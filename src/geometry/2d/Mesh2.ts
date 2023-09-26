import { Node2 } from "../../core/Node2";
import { Vector2 } from "../../math/Vector2";
import { Color } from "../../math/Color";
import { Material2 } from "../../materials/Material2";
import { GfxApp } from "../../core/GfxApp";

/**
 * The base class for 2D triangle meshes.  This class extends Node2 so it can be added directly
 * to the GopherGfx 2D scene graph.  It is possible to create a new "empty" Mesh2 and then add
 * triangles to it.  Most of the routines in the Geometry2Factory do this.  Use those to create
 * a new Mesh2 for simple geometric shapes like circles and rectangles.  Those routines also 
 * provide good examples of how to create your own custom mesh via code if you wish to create
 * something more complex via programming.
 */
export class Mesh2 extends Node2
{
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
     * Buffer that stores the texture (UV) coordinate at each vertex.
     */
    public texCoordBuffer: WebGLBuffer | null;

    /**
     * Array of buffers that store custom information for each vertex.
     */
    public customBuffers: (WebGLBuffer | null)[];

    /**
     * Number of vertices in the Mesh2.
     */
    public vertexCount: number;

    /**
     * Material to draw the Mesh2 with.
     */
    public material: Material2;

    /**
     * Flag that determines whether to use vertex colors.
     */
    public hasVertexColors: boolean;
    
    /**
     * Construct a new 2D Mesh2
     */
    constructor()
    {
        super();

        this.gl  = GfxApp.getInstance().renderer.gl;

        this.positionBuffer = this.gl.createBuffer();
        this.colorBuffer = this.gl.createBuffer();
        this.texCoordBuffer = this.gl.createBuffer();
        this.customBuffers = [];
        this.vertexCount = 0;
        this.hasVertexColors = false;

        // default material
        this.material = new Material2();
    }

    /**
     * Draw a Mesh2 with a particular Transform (position, rotation, scale)
     */
    draw(): void
    {
        if(!this.visible)
            return;

        this.material.draw(this);

        this.children.forEach((elem: Node2) => {
            elem.draw();
        });
    }

    /**
     * Set the vertices of the Mesh2. Vertices should be in normalized device
     * coordinates [-1, 1].
     * 
     * @param vertices - Array of vertices.
     * @param usage - Intended usage (static or dynamic) of the Mesh2's vertices.
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

            this.computeBounds(vertices);
        }
    }

    /**
     * Set the color at each vertex of the Mesh2.
     * 
     * @param color - Array of colors.
     * @param usage - Intended usage (static or dynamic) of the Mesh2's vertex colors.
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
     * Set the texture (UV) coordinates at each vertex of the Mesh2.
     * 
     * @param texCoords - Array of texture coordinates.
     * @param usage - Intended usage (static or dynamic) of the Mesh2's UV coordinates.
     */
    setTextureCoordinates(texCoords: Vector2[] | number[], usage = this.gl.STATIC_DRAW): void
    {
        if(texCoords.length > 0)
        {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);

            if(typeof texCoords[0] === 'number')
            {
                this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(texCoords as number[]), usage);
            }
            else
            {
                const tArray: number[] = [];
                (texCoords as Vector2[]).forEach((elem: Vector2) =>
                {
                    tArray.push(elem.x, elem.y);
                });
                
                this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(tArray), usage);
            }
        }
    }

    /**
     * Sets a custom buffer from an input array.
     * 
     * @param bufferIndex - The index number of the buffer to set.
     * @param values - Array of numerical values to store in the buffer.
     * @param usage - Intended usage (static or dynamic) of the Mesh2's buffer.
     */
    setCustomBuffer(bufferIndex: number, values: number[], usage = this.gl.STATIC_DRAW): void
    {
        while(this.customBuffers.length <= bufferIndex)
            this.customBuffers.push(this.gl.createBuffer());

        if(values.length > 0)
        {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.customBuffers[bufferIndex]);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(values), usage);
        }
    }

    /**
     * Get the vertices of the Mesh2
     * 
     * @returns - Returns the array of vertices as numbers (not Vector2 objects)
     */
    getVertices(): number[]
    {
        const vertexArray = new Float32Array(this.vertexCount * 2);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.getBufferSubData(this.gl.ARRAY_BUFFER, 0, vertexArray);
        return [... vertexArray];
    }

    /**
     * Get the vertex colors of the Mesh2
     * 
     * @returns - Returns the array of colors as numbers (not Color objects)
     */
    getColors(): number[]
    {
        const colorArray = new Float32Array(this.vertexCount * 4);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.getBufferSubData(this.gl.ARRAY_BUFFER, 0, colorArray);
        return [... colorArray];
    }

    /**
     * Get the texture coordinates of the Mesh2
     * 
     * @returns - Returns the array of texture (UV) coordinates as numbers (not Vector2 objects)
     */
    getTextureCoordinates(): number[]
    {
        const texCoordArray = new Float32Array(this.vertexCount * 2);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);
        this.gl.getBufferSubData(this.gl.ARRAY_BUFFER, 0, texCoordArray);
        return [... texCoordArray];
    }

    /**
     * Get the values in one of the Mesh2's custom buffers
     * 
     * @param bufferIndex - The index number of the buffer to get.
     * @param numAvalues - The number of values per vertex in the buffer.
     * @returns - Returns the array of numbers stored in the buffer
     */
    getCustomBuffer(bufferIndex: number, numValues: number): number[]
    {
        const customBufferArray = new Float32Array(this.vertexCount * numValues);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.customBuffers[bufferIndex]);
        this.gl.getBufferSubData(this.gl.ARRAY_BUFFER, 0, customBufferArray);
        return [... customBufferArray];
    }

    /**
     * Create default (white) vertex colors for the Mesh2
     */
    public createDefaultVertexColors(): void
    {
        const colors: number[] = [];

        for(let i=0; i < this.vertexCount; i++)
            colors.push(1, 1, 1, 1);

        this.setColors(colors);
    }

    /**
     * Compute the 2D Bounds (both bounding box and bounding circle) of the Mesh2.
     * 
     * @param vertices - Vertices to include in the Mesh2. If empty, defaults to
     * the object's current vertices.
     */
    public computeBounds(vertices: Vector2[] | number[] | null): void
    {
        if(!vertices)
        {
            vertices = this.getVertices();
        } 
        
        if(vertices.length == 0)
            return;

        this.boundingBox.computeBounds(vertices);
        this.boundingCircle.computeBounds(vertices, this.boundingBox);

        this.localBoundsDirty = true;
        this.worldBoundsDirty = true;
    }

    public createInstance(copyTransform = true): Mesh2
    {
        const instance = new Mesh2();
        instance.positionBuffer = this.positionBuffer;
        instance.colorBuffer = this.colorBuffer;
        instance.texCoordBuffer = this.texCoordBuffer;
        instance.customBuffers = this.customBuffers;
        instance.vertexCount = this.vertexCount;
        instance.hasVertexColors = this.hasVertexColors;
        instance.material = this.material;
        instance.visible = this.visible;
        instance.boundingBox = this.boundingBox;
        instance.boundingCircle = this.boundingCircle;
        instance.localBoundsDirty = true;
        instance.worldBoundsDirty = true;
        
        if(copyTransform)
        {
            instance._position.copy(this._position);
            instance._rotation = this._rotation;
            instance._scale.copy(this._scale);
            if(this._shear)
            {
                instance._shear = new Vector2();
                instance._shear.copy(this._shear);
            }
            instance.localToParentMatrix.copy(this.localToParentMatrix);
            instance.localToWorldMatrix.copy(this.localToWorldMatrix);
            instance.localMatrixDirty = this.localMatrixDirty;
            instance.worldMatrixDirty = true;
            instance.layer = this.layer;
        }

        return instance;
    }
}