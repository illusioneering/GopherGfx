import { Shape } from './Shape'

/**
 * Represents a rectangle 2D shape
 */
export class Rectangle extends Shape
{
    /**
     * width of the rectangle, in normalized device coordinates [-1, 1]
     */
    public readonly width: number;

    /**
     * height of the rectangle, in normalized device coordinates [-1, 1]
     */
    public readonly height: number;

    /**
     * Creates an instance of a Rectangle.
     * 
     * @param width - width of the rectangle, in normalized device coordinates [-1, 1]
     * @param height - height of the rectangle, in normalized device coordinates [-1, 1]
     */
    constructor(width = 1, height = 1)
    {
        super();

        this.width = width;
        this.height  = height;

        this.material.drawMode = this.gl.TRIANGLE_STRIP;

        this.createVertices(this.width, this.height);
        this.createTextureCoordinates();
        this.createDefaultVertexColors();
    }

    /**
     * Creates the vertices of a Rectangle object
     * 
     * @param width - The width of the Rectangle
     * @param height - The height of the Rectangle
     */
    private createVertices(width: number, height: number): void
    {
        const vertices: number[] = [];

        vertices.push(-width/2, height/2);
        vertices.push(-width/2, -height/2);
        vertices.push(width/2, height/2);
        vertices.push(width/2, -height/2);
        
        this.setVertices(vertices);
    }

    /**
     * Creates the texture coordinates of a Rectangle object
     */
    private createTextureCoordinates(): void
    {
        const uvs: number[] = [];

        uvs.push(0, 0);
        uvs.push(0, 1);
        uvs.push(1, 0);
        uvs.push(1, 1);
        
        this.setTextureCoordinates(uvs);
    }
}