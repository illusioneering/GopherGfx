import { Transform2 } from "../../core/Transform2";
import { Vector2 } from "../../math/Vector2";
import { Color } from "../../math/Color";
import { Material2 } from "../../materials/Material2";
import { GfxApp } from "../../core/GfxApp";

/**
 * Represents a 2D shape. Note that for actually drawing shapes in the scene, a
 * {ShapeInstance} should be used instead.
 * 
 * @export
 * @class Shape
 * @extends {Transform2}
 */
export class Shape extends Transform2
{
    protected readonly gl: WebGL2RenderingContext;

    /**
     * Buffer that stores the position of each vertex.
     * 
     * @memberof Shape
     */
    public positionBuffer: WebGLBuffer | null;

    /**
     * Buffer that stores the color of each vertex.
     * 
     * @memberof Shape
     */
    public colorBuffer: WebGLBuffer | null;

    /**
     * Buffer that stores the texture (UV) coordinate at each vertex.
     * 
     * @memberof Shape
     */
    public texCoordBuffer: WebGLBuffer | null;

    /**
     * Number of vertices in the shape.
     * 
     * @memberof Shape
     */
    public vertexCount: number;

    /**
     * Material to draw the shape with.
     * 
     * @memberof Shape
     */
    public material: Material2;
    
    /**
     * Construct a new 2D shape
     * 
     * @constructor
     */
    constructor()
    {
        super();

        this.gl  = GfxApp.getInstance().renderer.gl;

        this.positionBuffer = this.gl.createBuffer();
        this.colorBuffer = this.gl.createBuffer();
        this.texCoordBuffer = this.gl.createBuffer();
        this.vertexCount = 0;

        // default material
        this.material = new Material2();
    }

    /**
     * Draw a shape with a particular Transform (position, rotation, scale)
     * 
     * @param parent - unused
     */
    draw(parent: Transform2): void
    {
        if(!this.visible)
            return;

        this.material.draw(this, this);

        this.children.forEach((elem: Transform2) => {
            elem.draw(this);
        });
    }

    /**
     * Set the vertices of the shape. Vertices should be in normalized device
     * coordinates [-1, 1].
     * 
     * @param vertices - Array of vertices.
     * @param usage - Intended usage (static or dynamic) of the shape's vertices.
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
     * Set the color at each vertex of the shape.
     * 
     * @param color - Array of colors.
     * @param usage - Intended usage (static or dynamic) of the shape's vertex colors.
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
     * Set the texture (UV) coordinates at each vertex of the shape.
     * 
     * @param texCoords - Array of texture coordinates.
     * @param usage - Intended usage (static or dynamic) of the shape's UV coordinates.
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
     * Get the vertices of the shape
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
     * Get the vertex colors of the shape
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
     * Get the texture coordinates of the shape
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
     * Create default (white) vertex colors for the shape
     */
    public createDefaultVertexColors(): void
    {
        const colors: number[] = [];

        for(let i=0; i < this.vertexCount; i++)
            colors.push(1, 1, 1, 1);

        this.setColors(colors);
    }

    /**
     * Compute the 2D Bounds (both bounding box and bounding circle) of the shape.
     * 
     * @param vertices - Vertices to include in the shape. If empty, defaults to
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

        if(typeof vertices[0] === 'number')
        {
            const vArray = vertices as number[];

            this.boundingBox.max.set(vArray[0], vArray[1]);
            this.boundingBox.min.set(vArray[0], vArray[1]);
            
            for(let i=0; i < vArray.length; i+=3)
            {
                if(vArray[i] > this.boundingBox.max.x)
                    this.boundingBox.max.x = vArray[i];
                if(vArray[i] < this.boundingBox.min.x)
                    this.boundingBox.min.x = vArray[i];

                if(vArray[i+1] > this.boundingBox.max.y)
                    this.boundingBox.max.y = vArray[i+1];
                if(vArray[i+1] < this.boundingBox.min.y)
                    this.boundingBox.min.y = vArray[i+1];
            }
        }
        else
        {
            this.boundingBox.max.copy((vertices as Vector2[])[0]);
            this.boundingBox.min.copy((vertices as Vector2[])[0]);

            (vertices as Vector2[]).forEach((elem: Vector2) =>
            {
                if(elem.x > this.boundingBox.max.x)
                    this.boundingBox.max.x = elem.x;
                if(elem.x < this.boundingBox.min.x)
                    this.boundingBox.min.x = elem.x;

                if(elem.y > this.boundingBox.max.y)
                    this.boundingBox.max.y = elem.y;
                if(elem.y < this.boundingBox.min.y)
                    this.boundingBox.min.y =elem.y;
            });
        }

        this.boundingCircle.center.copy(this.boundingBox.min);
        this.boundingCircle.center.add(this.boundingBox.max);
        this.boundingCircle.center.multiplyScalar(0.5);
        this.boundingCircle.radius = 0;
        if(typeof vertices[0] === 'number')
        {
            const vArray = vertices as number[];
            for(let i=0; i < vArray.length; i+=3)
            {
                const distance = Math.sqrt(
                    (vArray[i] - this.boundingCircle.center.x) * (vArray[i] - this.boundingCircle.center.x) +
                    (vArray[i+1] - this.boundingCircle.center.y) * (vArray[i+1] - this.boundingCircle.center.y)
                );
                
                if(distance > this.boundingCircle.radius)
                    this.boundingCircle.radius = distance;
            }
        }
        else
        {
            (vertices as Vector2[]).forEach((elem: Vector2) =>
            {
                const distance = elem.distanceTo(this.boundingCircle.center);

                if(distance > this.boundingCircle.radius)
                    this.boundingCircle.radius = distance;
            });
        }
    }
}