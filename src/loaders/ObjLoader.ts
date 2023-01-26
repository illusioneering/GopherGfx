import { Mesh } from '../geometry/3d/Mesh'
import { GfxApp } from '../core/GfxApp';
import { StringParser } from './StringParser';

export class ObjLoader
{
/**
 * Loads an object file (.obj)
 * 
 * @param filename - The relative path to the object file
 * @param callback - An optional callback that is called when the file has been loaded
 * @returns A Mesh object containing the data loaded from the .obj file
 */    
    static load(filename: string, callback: ((loadedMesh: Mesh) => void) | null = null): Mesh
    {
        GfxApp.getInstance().assetManager.requestedAssets.push(filename);

        const mesh = new Mesh();

        fetch(filename).then((response: Response) => {
            if(!response.ok)
                throw new Error();
            return response.blob();
        })
        .then((data: Blob) => {
            data.text().then((text: string) => {
                ObjLoader.parse(text, mesh!);
                if(callback)
                {
                    callback(mesh!);
                }
                GfxApp.getInstance().assetManager.loadedAssets.push(filename);
            });
        })
        .catch(() => {
            GfxApp.getInstance().assetManager.errorAssets.push(filename);
            console.error('Unable to download file: ' + filename);
        });

        return mesh;
    }

/**
 * Parses the contents of an OBJ file and stores the data in a given Mesh object
 * 
 * @param obj - The contents of the object file as a string
 * @param mesh - The Mesh object to store the data in
 */
    private static parse(obj: string, mesh: Mesh)
    {
        const parser = new StringParser(obj);
        const vertices: number[] = [];
        const colors: number[] = [];
        const normals: number[] = [];
        const indices: number[] = [];
        const uvs: number[] = [];

        while(!parser.done())
        {
            const nextToken = parser.readToken();

            if(nextToken == 'v')
                this.parseVertex(parser.readLine(), vertices, colors);
            else if(nextToken == 'vn')
                this.parseNormal(parser.readLine(), normals);
            else if(nextToken == 'vt')
                this.parseTextureCoordinate(parser.readLine(), uvs);
            else if(nextToken == 'f')
                this.parseFace(parser.readLine(), indices);
            else
                parser.consumeLine();
        }

        mesh.setVertices(vertices);
        mesh.setColors(colors);
        mesh.setNormals(normals);
        mesh.setIndices(indices);

        // If the file did not contain vertex colors, then assign a default color
        if(colors.length == 0)
            mesh.createDefaultVertexColors();

        // If we have per vertex UVs, asign them to the mesh
        if(uvs.length / 2 == vertices.length / 3)
            mesh.setTextureCoordinates(uvs);
    }

/**
 * Parses a vertex line from an OBJ file and stores the data in the given arrays
 * 
 * @param line - The line containing the vertex data
 * @param vertices - The array to store the vertex positions
 * @param colors - The array to store the vertex colors
 */
    private static parseVertex(line: string[], vertices: number[], colors: number[])
    {
        vertices.push(Number(line[0]));
        vertices.push(Number(line[1]));
        vertices.push(Number(line[2]));

        if(line.length == 6)
        {
            colors.push(Number(line[3]));
            colors.push(Number(line[4]));
            colors.push(Number(line[5]));
            colors.push(1);
        }
    }

/**
 * Parses a normal line from an OBJ file
 * 
 * @param line - The normal line to be parsed
 * @param normals - An array to store the normal coordinates
 */    
    private static parseNormal(line: string[], normals: number[])
    {
        normals.push(Number(line[0]));
        normals.push(Number(line[1]));
        normals.push(Number(line[2]));
    }

/**
 * Parses a texture coordinate line from an OBJ file
 * 
 * @param line - The texture coordinate line to be parsed
 * @param uvs - An array to store the texture coordinates
 */
    private static parseTextureCoordinate(line: string[], uvs: number[])
    {
        uvs.push(Number(line[0]));
        uvs.push(Number(line[1]));
    }


/**
 * Parses a face line from an OBJ file
 * 
 * @param line - The face line to be parsed
 * @param indices - An array to store the face indices
 */
    private static parseFace(line: string[], indices: number[])
    {
        for(let i=0; i < 3; i++)
        {
            const index = line[i].split('/');
            indices.push(Number(index[0])-1);
        }
    }
}