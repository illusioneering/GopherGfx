import { Mesh } from './Mesh'

export class PlaneMesh extends Mesh
{
    public readonly width;
    public readonly height;

    constructor(width = 1, height = 1)
    {
        super();
        
        this.width = width;
        this.height = height;

        this.createVertices(this.width, this.height);
        this.createNormals();
        this.createTextureCoords();
        this.createIndices();
        this.createDefaultVertexColors();
    }

    private createVertices(width: number, height: number): void
    {
        const vertices = [];

        vertices.push(-width/2, -height/2, 0);
        vertices.push(width/2, -height/2, 0);
        vertices.push(width/2, height/2, 0);
        vertices.push(-width/2, height/2,0);
        
        this.setVertices(vertices);
    }

    private createNormals(): void
    {
        const normals = [];

        // Back face
        normals.push(0, 0, -1);
        normals.push(0, 0, -1);
        normals.push(0, 0, -1);
        normals.push(0, 0, -1);
       
        this.setNormals(normals);
    }

    private createIndices(): void
    {
        const indices = [];

        indices.push(0, 2, 1);
        indices.push(2, 0, 3);

        this.setIndices(indices);
    }

    private createTextureCoords(): void
    {
        const uvs = [];

        uvs.push(1, 1);
        uvs.push(0, 1);
        uvs.push(0, 0);
        uvs.push(1, 0);

       this.setTextureCoordinates(uvs);
    }
}