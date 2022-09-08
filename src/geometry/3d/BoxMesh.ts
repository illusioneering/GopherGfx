import { Mesh } from './Mesh'
import { Vector3 } from '../../math/Vector3';

export class BoxMesh extends Mesh
{
    public readonly width: number;
    public readonly height: number;
    public readonly depth: number;

    constructor(width = 1, height = 1, depth = 1)
    {
        super();
        
        this.width = width;
        this.height = height;
        this.depth = depth;

        this.createVertices(this.width, this.height, this.depth);
        this.createNormals();
        this.createTextureCoords();
        this.createIndices();
        this.createDefaultVertexColors();
    }

    public setLine(startPoint: Vector3, endPoint: Vector3, thickness: number)
    {
        this.position.copy(startPoint);
        this.lookAt(endPoint);

        const distance = Vector3.distanceBetween(startPoint, endPoint);
        this.translateZ(-distance/2);
        this.scale.x = thickness;
        this.scale.y = thickness;
        this.scale.z = distance;
    }


    private createVertices(width: number, height: number, depth: number): void
    {
        const vertices: number[] = [];

        // Front face
        vertices.push(-width/2, -height/2, depth/2);
        vertices.push(width/2, -height/2, depth/2);
        vertices.push(width/2, height/2, depth/2);
        vertices.push(-width/2, height/2, depth/2);

        // Back face
        vertices.push(-width/2, -height/2, -depth/2);
        vertices.push(width/2, -height/2, -depth/2);
        vertices.push(width/2, height/2, -depth/2);
        vertices.push(-width/2, height/2, -depth/2);

        // Left face
        vertices.push(-width/2, -height/2, -depth/2);
        vertices.push(-width/2, -height/2, depth/2);
        vertices.push(-width/2, height/2, depth/2);
        vertices.push(-width/2, height/2, -depth/2);

        // Left face
        vertices.push(width/2, -height/2, -depth/2);
        vertices.push(width/2, -height/2, depth/2);
        vertices.push(width/2, height/2, depth/2);
        vertices.push(width/2, height/2, -depth/2);

        // Top face
        vertices.push(-width/2, height/2, depth/2);
        vertices.push(width/2, height/2, depth/2);
        vertices.push(width/2, height/2, -depth/2);
        vertices.push(-width/2, height/2, -depth/2);

        // Bottom face
        vertices.push(-width/2, -height/2, depth/2);
        vertices.push(width/2, -height/2, depth/2);
        vertices.push(width/2, -height/2, -depth/2);
        vertices.push(-width/2, -height/2, -depth/2);
        
        this.setVertices(vertices);
    }

    private createNormals(): void
    {
        const normals: number[] = [];

        // Front face
        normals.push(0, 0, 1);
        normals.push(0, 0, 1);
        normals.push(0, 0, 1);
        normals.push(0, 0, 1);

        // Back face
        normals.push(0, 0, -1);
        normals.push(0, 0, -1);
        normals.push(0, 0, -1);
        normals.push(0, 0, -1);

        // Left face
        normals.push(-1, 0, 0);
        normals.push(-1, 0, 0);
        normals.push(-1, 0, 0);
        normals.push(-1, 0, 0);

        // Right face
        normals.push(1, 0, 0);
        normals.push(1, 0, 0);
        normals.push(1, 0, 0);
        normals.push(1, 0, 0);

        // Top face
        normals.push(0, 1, 0);
        normals.push(0, 1, 0);
        normals.push(0, 1, 0);
        normals.push(0, 1, 0);

        // Bottom face
        normals.push(0, -1, 0);
        normals.push(0, -1, 0);
        normals.push(0, -1, 0);
        normals.push(0, -1, 0);
       
        this.setNormals(normals);
    }

    private createIndices(): void
    {
        const indices: number[] = [];

        // Front face
        indices.push(0, 1, 2);
        indices.push(2, 3, 0);

        // Back face
        indices.push(4, 6, 5);
        indices.push(6, 4, 7);

        // Left face
        indices.push(8, 9, 10);
        indices.push(10, 11, 8);

        // Right face
        indices.push(12, 14, 13);
        indices.push(14, 12, 15);

        // Top face
        indices.push(16, 17, 18);
        indices.push(18, 19, 16);

        // Bottom face
        indices.push(20, 22, 21);
        indices.push(22, 20, 23);

        this.setIndices(indices);
    }

    private createTextureCoords(): void
    {
        const uvs: number[] = [];

        // Front face
        uvs.push(0, 1);
        uvs.push(1, 1);
        uvs.push(1, 0);
        uvs.push(0, 0);

        // Back face
        uvs.push(1, 1);
        uvs.push(0, 1);
        uvs.push(0, 0);
        uvs.push(1, 0);

        // Left face
        uvs.push(0, 1);
        uvs.push(1, 1);
        uvs.push(1, 0);
        uvs.push(0, 0);

        // Right face
        uvs.push(1, 1);
        uvs.push(0, 1);
        uvs.push(0, 0);
        uvs.push(1, 0);

        // Top face
        uvs.push(0, 1);
        uvs.push(1, 1);
        uvs.push(1, 0);
        uvs.push(0, 0);

        // Bottom face
        uvs.push(1, 1);
        uvs.push(0, 1);
        uvs.push(0, 0);
        uvs.push(1, 0);

       this.setTextureCoordinates(uvs);
    }
}