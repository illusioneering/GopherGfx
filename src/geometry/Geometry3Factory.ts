import { Mesh3 } from './3d/Mesh3'
import { Line3, LineMode3 } from './3d/Line3'
import { Vector3 } from '../math/Vector3';
import { Quaternion } from '../math/Quaternion';

/**
 * This is a factory class for creating a variety of common geometries that can be drawn in a 3D scene.
 * Most of these geometries are Mesh3s, meaning they are constructed from triangles, but there are also
 * a few Line3 objects.  If you have a really complex 3D model, like an animated character, that geometry
 * will probably be stored in a 3D model file that can be loaded with the MeshLoader class.  In contrast
 * this factory is for creating simple geometries (cubes, spheres, cylinders, cones) that can be easily 
 * described by a mathematical function.
 */
export class Geometry3Factory
{
    public static createBox(width = 1, height = 1, depth = 1): Mesh3
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


        const mesh = new Mesh3();
        mesh.setVertices(vertices);
        mesh.setNormals(normals);
        mesh.setIndices(indices);
        mesh.setTextureCoordinates(uvs);
        return mesh;
    }

    public static createBoxLine(startPoint: Vector3, endPoint: Vector3, thickness: number): Mesh3
    {
        const mesh = this.createBox();

        const midpoint = Vector3.add(startPoint, endPoint);
        midpoint.multiplyScalar(0.5);
        mesh.position.copy(midpoint);

        mesh.rotation.lookAt(midpoint, endPoint, Vector3.UP);

        mesh.scale.set(thickness, thickness, Vector3.distanceBetween(startPoint, endPoint));
    
        return mesh;
    }

    public static createCone(radius = 1, height = 1, numSegments = 8): Mesh3
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


        const normals: number[] = [];

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

        // Bottom vertices
        for(let i=0; i <= numSegments; i++)
        {
            uvs.push((Math.cos(angle*i) + 1) / 2, (Math.sin(angle*i) - 1) / -2);
        }


        const mesh = new Mesh3();
        mesh.setVertices(vertices);
        mesh.setNormals(normals);
        mesh.setIndices(indices);
        mesh.setTextureCoordinates(uvs);
        return mesh;
    }

    public static createCylinder(numSegments = 20, radius = 1, height = 1): Mesh3
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

            vertices.push(Math.cos(angle) * radius, height/2, Math.sin(angle) * radius);
            vertices.push(Math.cos(angle) * radius, -height/2, Math.sin(angle) * radius);

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

            vertices.push(Math.cos(angle) * radius, height/2, Math.sin(angle) * radius);
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

            vertices.push(Math.cos(angle) * radius, -height/2, Math.sin(angle) * radius);
            normals.push(0, -1, 0);
            uvs.push(1 - i / numSegments, 1);
        }

        // Create the bottom disc triangles
        for(let i=0; i < numSegments; i++)
        {
            // Create a triangle from the center to the two added vertices
            indices.push(bottomCenterIndex, bottomCenterIndex+i+1, bottomCenterIndex+i+2);
        }


        const mesh = new Mesh3();
        mesh.setVertices(vertices);
        mesh.setNormals(normals);
        mesh.setIndices(indices);
        mesh.setTextureCoordinates(uvs);
        return mesh;
    }

    public static createPlane(width = 1, height = 1): Mesh3
    {
        const vertices: number[] = [];

        vertices.push(-width/2, -height/2, 0);
        vertices.push(width/2, -height/2, 0);
        vertices.push(width/2, height/2, 0);
        vertices.push(-width/2, height/2,0);


        const normals: number[] = [];

        // Back face
        normals.push(0, 0, -1);
        normals.push(0, 0, -1);
        normals.push(0, 0, -1);
        normals.push(0, 0, -1);
        

        const indices: number[] = [];

        indices.push(0, 2, 1);
        indices.push(2, 0, 3);


        const uvs: number[] = [];

        uvs.push(1, 1);
        uvs.push(0, 1);
        uvs.push(0, 0);
        uvs.push(1, 0);


        const mesh = new Mesh3();
        mesh.setVertices(vertices);
        mesh.setNormals(normals);
        mesh.setIndices(indices);
        mesh.setTextureCoordinates(uvs);
        return mesh;
    }

    public static createSphere(radius = 1, subdivisions=2): Mesh3
    {
        // Based on approach from 
        // https://www.danielsieger.com/blog/2021/01/03/generating-platonic-solids.html
        // https://www.danielsieger.com/blog/2021/03/27/generating-spheres.html


        let vertices: Vector3[] = [];
        let indices: number[] = [];
        const normals: Vector3[] = [];
        const texCoords: number[] = [];

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
            const newIndices: number[] = [];
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

        [vertices, indices] = this.mergeSphereVertices(vertices, indices);
        
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


        const mesh = new Mesh3();
        mesh.setVertices(vertices);
        mesh.setNormals(normals);
        mesh.setIndices(indices);
        mesh.setTextureCoordinates(texCoords);
        return mesh;
    }

    private static isEndVertex(i: number, vertices: Vector3[], indices: number[]): boolean
    {
        if(vertices[indices[i]].x > 0)
            return true;
        else
            return false;
    }

    private static isSeamVertex(i: number, vertices: Vector3[], indices: number[]): boolean
    {
        if(vertices[indices[i]].x == 0 && vertices[indices[i]].z <= 0)
            return true;
        else
            return false;
    }

    private static createCentroids(vertices: Vector3[], v1: number, v2: number, v3: number): Vector3[]
    {
        const centroids: Vector3[] = [];

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

    private static subdivide(v1: number, v2: number, v3: number, c1: number, c2: number, c3: number): number[]
    {
        const triangles: number[] = [];
        triangles.push(v1, c1, c3);
        triangles.push(v2, c2, c1);
        triangles.push(v3, c3, c2);
        triangles.push(c1, c2, c3);
        return triangles;
    }

    private static mergeSphereVertices(vertices: Vector3[], indices: number[]): [Vector3[], number[]]
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

    public static createLine(startPoint: Vector3, endPoint: Vector3): Line3
    {
        const line = new Line3(LineMode3.LINES);

        const vertices: number[] = [];
        vertices.push(startPoint.x, startPoint.y, startPoint.z);
        vertices.push(endPoint.x, endPoint.y, endPoint.z);

        line.setVertices(vertices);

        return line;
    }

    public static createAxes(size = 1): Line3
    {
        const axes = new Line3(LineMode3.LINES);
        
        const vertices: number[] = [];
        const colors: number[] = [];

         // X axis
         vertices.push(0, 0, 0);
         vertices.push(size, 0, 0);
         colors.push(1, 0, 0, 1);
         colors.push(1, 0, 0, 1);

         // Y axis
         vertices.push(0, 0, 0);
         vertices.push(0, size, 0);
         colors.push(0, 1, 0, 1);
         colors.push(0, 1, 0, 1);

         // Z axis
         vertices.push(0, 0, 0);
         vertices.push(0, 0, size);
         colors.push(0, 0, 1, 1);
         colors.push(0, 0, 1, 1);

         axes.setVertices(vertices);
         axes.setColors(colors);

         return axes;
    }
}