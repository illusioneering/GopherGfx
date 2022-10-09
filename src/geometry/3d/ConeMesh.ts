import { Mesh } from './Mesh'

export class ConeMesh extends Mesh
{
    public readonly radius: number;
    public readonly height: number;

    constructor(radius = 1, height = 1, numSegments = 8)
    {
        super();
        
        this.radius = radius;
        this.height = height;

        this.createVertices(this.radius, this.height, numSegments);
        this.createNormals(numSegments);
        this.createTextureCoords(numSegments);
        this.createIndices(numSegments);
        this.createDefaultVertexColors();
    }

    private createVertices(radius: number, height: number, numSegments: number): void
    {
        const vertices: number[] = [];

        const angle = (Math.PI * 2) / numSegments;

        // Top vertex
        vertices.push(0, height/2, 0);

        // Side vertices
        for(let i=0; i <= numSegments; i++)
        {
            vertices.push(Math.cos(angle*i) * radius, -height/2, Math.sin(angle*i) * radius);
        }

        // Bottom center vertex
        vertices.push(0, -height/2, 0);

        // Bottom vertices
        for(let i=0; i <= numSegments; i++)
        {
            vertices.push(Math.cos(angle*i) * radius, -height/2, Math.sin(angle*i) * radius);
        }

        this.setVertices(vertices);
    }

    private createNormals(numSegments: number): void
    {
        const normals: number[] = [];

        const angle = (Math.PI * 2) / numSegments;

        // // Top vertex
        normals.push(0, 1, 0);

        // // Side normals
        for(let i=0; i <= numSegments; i++)
        {
            normals.push(Math.cos(angle*i), 0, Math.sin(angle*i));
        }

        // Bottom center vertex
        normals.push(0, -1, 0);

        // Bottom normals
        for(let i=0; i <= numSegments; i++)
        {
            normals.push(0, -1, 0);
        }
       
        this.setNormals(normals);
    }

    private createIndices(numSegments: number): void
    {
        const indices: number[] = [];

        // Side triangles
        for(let i=0; i < numSegments; i++)
        {
            indices.push(0, i+2, i+1);
        }

        const startIndex = numSegments+2;

        // Bottom triangles
        for(let i=0; i < numSegments; i++)
        {
            indices.push(startIndex, startIndex+i+1, startIndex+i+2);
        }

        this.setIndices(indices);
    }

    private createTextureCoords(numSegments: number): void
    {
        const uvs: number[] = [];

        // Top vertex
        uvs.push(0.5, 0);

        // Side vertex
        for(let i=0; i <= numSegments; i++)
        {
            uvs.push(i / numSegments, 1);
        }

        // Bottom center vertex
        uvs.push(0.5, 0.5);

        const angle = (Math.PI * 2) / numSegments;

        // Bottom vertices
        for(let i=0; i <= numSegments; i++)
        {
            uvs.push((Math.cos(angle*i) + 1) / 2, (Math.sin(angle*i) - 1) / -2);
        }

        this.setTextureCoordinates(uvs);
    }
}