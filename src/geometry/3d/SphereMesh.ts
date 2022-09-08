import { Mesh } from './Mesh';
import { Vector3 } from '../../math/Vector3';

export class SphereMesh extends Mesh
{
    public readonly radius;
    public readonly subdivisions;

    constructor(radius = 1, subdivisions=3)
    {
        super();
        
        this.radius = radius;
        this.subdivisions = subdivisions;

        this.createSphere(this.radius, this.subdivisions);
    }

    // Based on approach from 
    // https://www.danielsieger.com/blog/2021/01/03/generating-platonic-solids.html
    // https://www.danielsieger.com/blog/2021/03/27/generating-spheres.html
    private createSphere(radius: number, subdivisions: number): void
    {
        let vertices = [];
        let indices = [];
        const normals = [];
        const texCoords = [];

        const phi = (1 + Math.sqrt(5)) * 0.5; // golden ratio
        const a = 1;
        const b = 1 / phi;

        vertices.push(new Vector3(0, b, -a));
        vertices.push(new Vector3(b, a, 0));
        vertices.push(new Vector3(-b, a, 0));
        vertices.push(new Vector3(0, b, a));
        vertices.push(new Vector3(0, -b, a));
        vertices.push(new Vector3(-a, 0, b));
        vertices.push(new Vector3(0, -b, -a));
        vertices.push(new Vector3(a, 0, -b));
        vertices.push(new Vector3(a, 0, b));
        vertices.push(new Vector3(-a, 0, -b));
        vertices.push(new Vector3(b, -a, 0));
        vertices.push(new Vector3(-b, -a, 0));

        // Project to unit sphere
        for(let i=0; i < vertices.length; i++)
        {
            vertices[i].normalize();
        }

        indices.push(2, 1, 0);
        indices.push(1, 2, 3);
        indices.push(5, 4, 3);
        indices.push(4, 8, 3);
        indices.push(7, 6, 0);
        indices.push(6, 9, 0);
        indices.push(11, 10, 4);
        indices.push(10, 11, 6);
        indices.push(9, 5, 2);
        indices.push(5, 9, 11);
        indices.push(8, 7, 1);
        indices.push(7, 8, 10);
        indices.push(2, 5, 3);
        indices.push(8, 1, 3);
        indices.push(9, 2, 0);
        indices.push(1, 7, 0);
        indices.push(11, 9, 6);
        indices.push(7, 10, 6);
        indices.push(5, 11, 4);
        indices.push(10, 8, 4);

        for(let div=0; div < subdivisions; div++)
        {
            const newIndices = [];
            for(let i=0; i < indices.length / 3; i++)
            {
                const index = i*3;
                const centroids = this.createCentroids(vertices, indices[index], indices[index+1], indices[index+2]);
                vertices.push(...centroids);

                const triangles = this.subdivide(indices[index], indices[index+1], indices[index+2], 
                    vertices.length - 3, vertices.length - 2, vertices.length - 1);
                    newIndices.push(... triangles);
            }
            indices = newIndices;
        }

        // Scale by the radius
        for(let i=0; i < vertices.length; i++)
        {
            vertices[i].multiplyScalar(radius);
        }

        [vertices, indices] = this.mergeSharedVertices(vertices, indices);
        
        // Compute texture coordinates
        for(let i=0; i < vertices.length; i++)
        {
            normals.push(Vector3.normalize(vertices[i]));

            const v = 1 - (vertices[i].y + radius) / (2 * radius);

            const direction = new Vector3(vertices[i].x, 0, vertices[i].z);
            direction.normalize();

            let angle = Math.acos(Vector3.FORWARD.dot(direction));
            if(direction.x > 0)
                 angle = Math.PI * 2 - angle;

            const u = angle / (Math.PI * 2);
            texCoords.push(u, v);
        }
        
        const indicesLength = indices.length;

        // Fix the texture seam by duplicating the vertices at the vertical edge of the sphere
        for(let i=0; i < indicesLength; i+=3)
        {
            if(this.isSeamVertex(i, vertices, indices))
            {
                if(this.isEndVertex(i+1, vertices, indices) && this.isEndVertex(i+2, vertices, indices))
                {
                    vertices.push(Vector3.copy(vertices[indices[i]]));
                    normals.push(Vector3.normalize(vertices[indices[i]]));
                    texCoords.push(1, texCoords[indices[i]*2+1]);

                    indices[i] = vertices.length-1;
                }
                else if(this.isEndVertex(i+1, vertices, indices))
                {
                    vertices.push(Vector3.copy(vertices[indices[i]]));
                    normals.push(Vector3.normalize(vertices[indices[i]]));
                    texCoords.push(1, texCoords[indices[i]*2+1]);

                    vertices.push(Vector3.copy(vertices[indices[i+2]]));
                    normals.push(Vector3.normalize(vertices[indices[i+2]]));
                    texCoords.push(1, texCoords[indices[i+2]*2+1]);

                    indices[i] = vertices.length-2;
                    indices[i+2] = vertices.length-1;
                }
                else if(this.isEndVertex(i+2, vertices, indices))
                {
                    vertices.push(Vector3.copy(vertices[indices[i]]));
                    normals.push(Vector3.normalize(vertices[indices[i]]));
                    texCoords.push(1, texCoords[indices[i]*2+1]);

                    vertices.push(Vector3.copy(vertices[indices[i+1]]));
                    normals.push(Vector3.normalize(vertices[indices[i+1]]));
                    texCoords.push(1, texCoords[indices[i+1]*2+1]);

                    indices[i] = vertices.length-2;
                    indices[i+1] = vertices.length-1;
                }
            }
            else if(this.isSeamVertex(i+1, vertices, indices))
            { 
                if(this.isEndVertex(i, vertices, indices) && this.isEndVertex(i+2, vertices, indices))
                {
                    vertices.push(Vector3.copy(vertices[indices[i+1]]));
                    normals.push(Vector3.normalize(vertices[indices[i+1]]));
                    texCoords.push(1, texCoords[indices[i+1]*2+1]);

                    indices[i+1] = vertices.length-1;
                }
                else if(this.isEndVertex(i, vertices, indices))
                {
                    vertices.push(Vector3.copy(vertices[indices[i+1]]));
                    normals.push(Vector3.normalize(vertices[indices[i+1]]));
                    texCoords.push(1, texCoords[indices[i+1]*2+1]);

                    vertices.push(Vector3.copy(vertices[indices[i+2]]));
                    normals.push(Vector3.normalize(vertices[indices[i+2]]));
                    texCoords.push(1, texCoords[indices[i+2]*2+1]);

                    indices[i+1] = vertices.length-2;
                    indices[i+2] = vertices.length-1;
                }
                else if(this.isEndVertex(i+2, vertices, indices))
                {
                    vertices.push(Vector3.copy(vertices[indices[i]]));
                    normals.push(Vector3.normalize(vertices[indices[i]]));
                    texCoords.push(1, texCoords[indices[i]*2+1]);

                    vertices.push(Vector3.copy(vertices[indices[i+1]]));
                    normals.push(Vector3.normalize(vertices[indices[i+1]]));
                    texCoords.push(1, texCoords[indices[i+1]*2+1]);

                    indices[i] = vertices.length-2;
                    indices[i+1] = vertices.length-1;
                }
            }
            else if(this.isSeamVertex(i+2, vertices, indices))
            {
                if(this.isEndVertex(i, vertices, indices) && this.isEndVertex(i+1, vertices, indices))
                {
                    vertices.push(Vector3.copy(vertices[indices[i+2]]));
                    normals.push(Vector3.normalize(vertices[indices[i+2]]));
                    texCoords.push(1, texCoords[indices[i+2]*2+1]);

                    indices[i+2] = vertices.length-1;
                }
                else if(this.isEndVertex(i, vertices, indices))
                {
                    vertices.push(Vector3.copy(vertices[indices[i+1]]));
                    normals.push(Vector3.normalize(vertices[indices[i+1]]));
                    texCoords.push(1, texCoords[indices[i+1]*2+1]);

                    vertices.push(Vector3.copy(vertices[indices[i+2]]));
                    normals.push(Vector3.normalize(vertices[indices[i+2]]));
                    texCoords.push(1, texCoords[indices[i+2]*2+1]);

                    indices[i+1] = vertices.length-2;
                    indices[i+2] = vertices.length-1;
                }
                else if(this.isEndVertex(i+1, vertices, indices))
                {
                    vertices.push(Vector3.copy(vertices[indices[i]]));
                    normals.push(Vector3.normalize(vertices[indices[i]]));
                    texCoords.push(1, texCoords[indices[i]*2+1]);

                    vertices.push(Vector3.copy(vertices[indices[i+2]]));
                    normals.push(Vector3.normalize(vertices[indices[i+2]]));
                    texCoords.push(1, texCoords[indices[i+2]*2+1]);

                    indices[i] = vertices.length-2;
                    indices[i+2] = vertices.length-1;
                }
            }
        }

        this.setVertices(vertices);
        this.setNormals(normals);
        this.setTextureCoordinates(texCoords);
        this.setIndices(indices);
        this.createDefaultVertexColors();
    }

    private isEndVertex(i: number, vertices: Vector3[], indices: number[]): boolean
    {
        if(vertices[indices[i]].x > 0)
            return true;
        else
            return false;
    }

    private isSeamVertex(i: number, vertices: Vector3[], indices: number[]): boolean
    {
        if(vertices[indices[i]].x == 0 && vertices[indices[i]].z <= 0)
            return true;
        else
            return false;
    }

    private createCentroids(vertices: Vector3[], v1: number, v2: number, v3: number): Vector3[]
    {
        const centroids = [];

        const centroid1 = Vector3.add(vertices[v1], vertices[v2]);
        centroid1.divideScalar(2);
        centroid1.normalize();
        centroids.push(centroid1);

        const centroid2 = Vector3.add(vertices[v2], vertices[v3]);
        centroid2.divideScalar(2);
        centroid2.normalize();
        centroids.push(centroid2);

        const centroid3 = Vector3.add(vertices[v3], vertices[v1]);
        centroid3.divideScalar(2);
        centroid3.normalize();
        centroids.push(centroid3);

        return centroids;
    }

    private subdivide(v1: number, v2: number, v3: number, c1: number, c2: number, c3: number): number[]
    {
        const triangles = [];
        triangles.push(v1, c1, c3);
        triangles.push(v2, c2, c1);
        triangles.push(v3, c3, c2);
        triangles.push(c1, c2, c3);
        return triangles;
    }

    private mergeSharedVertices(vertices: Vector3[], indices: number[]): [Vector3[], number[]]
    {
        const newVertices: Vector3[] = [];
        const newIndices: number[] = [];

        indices.forEach((elem: number) => {
            newIndices.push(elem);
        });

        for(let i=0; i < vertices.length; i++)
        {
            let duplicate = false;
            for(let j = 0; j < newVertices.length; j++)
            {
                if(vertices[i].equals(newVertices[j]))
                {
                    for(let k = 0; k < indices.length; k++)
                    {
                        if(indices[k] == i)
                            newIndices[k] = j;
                    }

                    duplicate = true;
                }   
            }

            if(!duplicate)
            {
                newVertices.push(vertices[i]);

                for(let k = 0; k < indices.length; k++)
                {
                    if(indices[k] == i)
                        newIndices[k] = newVertices.length-1;
                }
            }
        }

        return [newVertices, newIndices];
    }
}