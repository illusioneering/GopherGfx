import { Shape } from './Shape'

export class Rectangle extends Shape
{
    public readonly width: number;
    public readonly height: number;

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


    private createVertices(width: number, height: number): void
    {
        const vertices: number[] = [];

        vertices.push(-width/2, height/2);
        vertices.push(-width/2, -height/2);
        vertices.push(width/2, height/2);
        vertices.push(width/2, -height/2);
        
        this.setVertices(vertices);
    }

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