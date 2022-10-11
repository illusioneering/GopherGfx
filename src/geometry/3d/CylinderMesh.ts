import { Mesh } from './Mesh'

export class CylinderMesh extends Mesh
{
    public readonly numSegments: number;
    public readonly height: number;

    constructor(numSegments = 20, height = 1)
    {
        super();
        
        this.numSegments = numSegments;
        this.height = height;

        this.createCylinderMesh(numSegments, height);
    }

    private createCylinderMesh(numSegments: number, height: number): void
    {
        const vertices: number[] = [];
        const normals: number[] = [];
        const indices: number[] = [];
        const uvs: number[] = [];

        // Initialize variables for the cylinder circumference
        const angleIncrement = (Math.PI * 2) / numSegments;
        const numVerticesX = numSegments + 1;

        // Create the cylinder barrel vertices
        for(let i=0; i < numVerticesX; i++)
        {
            const angle = i * angleIncrement;

            vertices.push(Math.cos(angle), height/2, Math.sin(angle));
            vertices.push(Math.cos(angle), -height/2, Math.sin(angle));

            normals.push(Math.cos(angle), 0, Math.sin(angle));
            normals.push(Math.cos(angle), 0, Math.sin(angle));

            uvs.push(1 - i / numSegments, 0);
            uvs.push(1 - i / numSegments, 1);
        }

        // Create the cylinder barrel triangles
        for(let i=0; i < numSegments; i++)
        {
            const angle = i * angleIncrement;

            indices.push(i*2, i*2+2, i*2+1);
            indices.push(i*2+1, i*2+2, i*2+3);
        }

        // Create a single vertex and normal at center for the top disc
        const topCenterIndex = vertices.length / 3;
        vertices.push(0, height/2, 0);
        normals.push(0, 1, 0);
        uvs.push(0.5, 0);
        
        // Create the top disc vertices
        for(let i=0; i < numVerticesX; i++)
        {
            const angle = i * angleIncrement;

            vertices.push(Math.cos(angle), height/2, Math.sin(angle));
            normals.push(0, 1, 0);
            uvs.push(1 - i / numSegments, 0);
        }

        // Create the top disc triangles
        for(let i=0; i < numSegments; i++)
        {
            // Create a triangle from the center to the two added vertices
            indices.push(topCenterIndex, topCenterIndex+i+2, topCenterIndex+i+1);
        }

        // Create a single vertex and normal at center for the bottom disc
        const bottomCenterIndex = vertices.length / 3;
        vertices.push(0, -height/2, 0);
        normals.push(0, -1, 0);
        uvs.push(0.5, 1);
        
        // Create the bottom disc vertices
        for(let i=0; i < numVerticesX; i++)
        {
            const angle = i * angleIncrement;

            vertices.push(Math.cos(angle), -height/2, Math.sin(angle));
            normals.push(0, -1, 0);
            uvs.push(1 - i / numSegments, 1);
        }

        // Create the bottom disc triangles
        for(let i=0; i < numSegments; i++)
        {
            // Create a triangle from the center to the two added vertices
            indices.push(bottomCenterIndex, bottomCenterIndex+i+1, bottomCenterIndex+i+2);
        }

        this.setVertices(vertices);
        this.setNormals(normals);
        this.setIndices(indices);
        this.setTextureCoordinates(uvs);
        this.createDefaultVertexColors();
    }
}