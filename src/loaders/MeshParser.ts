import { Mesh3 } from '../geometry/3d/Mesh3'
import { Node3 } from '../core/Node3'
import { Color } from '../math/Color'
import { StringParser } from './StringParser';
import { Document, Node, Primitive } from '@gltf-transform/core';

export class MeshParser
{
    /**
     * Parses the contents of an OBJ file and stores the data in a given Mesh object
     * 
     * @param obj - The contents of the object file as a string
     * @param mesh - The Mesh object to store the data
     */
    static parseOBJ(obj: string, mesh: Mesh3)
    {
        const parser = new StringParser(obj);
        const vertices: number[] = [];
        const colors: number[] = [];
        const normals: number[] = [];
        const uvs: number[] = [];

        const indices: number[] = [];
        const uvIndices: number[] = [];

        while(!parser.done())
        {
            const nextToken = parser.readToken();

            if(nextToken == 'v')
                this.parseOBJVertex(parser.readLine(), vertices, colors);
            else if(nextToken == 'vn')
                this.parseOBJNormal(parser.readLine(), normals);
            else if(nextToken == 'vt')
                this.parseOBJTextureCoordinate(parser.readLine(), uvs);
            else if(nextToken == 'f')
                this.parseOBJFace(parser.readLine(), indices, uvIndices);
            else
                parser.consumeLine();
        }

        // We have per triangle UVs
        if(uvIndices.length > 0)
        {
            const texCoordIndexed: boolean[] = [];
            const texCoords: number[] = [];

            const numVertices = vertices.length / 3;
            for(let i=0; i < numVertices; i++)
            {
                texCoords.push(0, 0);
                texCoordIndexed.push(false);
            }

            for(let i=0; i < indices.length; i++)
            {   
                // vertex has no texture coordinate yet
                if(!texCoordIndexed[indices[i]])
                {
                    texCoords[indices[i]*2] = uvs[uvIndices[i]*2];
                    texCoords[indices[i]*2+1] = uvs[uvIndices[i]*2+1];
                    texCoordIndexed[indices[i]] = true;
                }
                // shared vertex has a different texture coordinate than the one already stored
                // create a copy of the vertex with the new texture coordinate
                else if(texCoords[indices[i]*2] != uvs[uvIndices[i]*2] || texCoords[indices[i]*2+1] != uvs[uvIndices[i]*2+1])
                {
                    vertices.push(vertices[indices[i]*3]);
                    vertices.push(vertices[indices[i]*3+1]);
                    vertices.push(vertices[indices[i]*3+2]);
                    normals.push(normals[indices[i]*3]);
                    normals.push(normals[indices[i]*3+1]);
                    normals.push(normals[indices[i]*3+2]);

                    if(colors.length > 0)
                    {
                        colors.push(colors[indices[i]*3]);
                        colors.push(colors[indices[i]*3+1]);
                        colors.push(colors[indices[i]*3+2]);
                    }

                    texCoords.push(uvs[uvIndices[i]*2]);
                    texCoords.push(uvs[uvIndices[i]*2+1]);

                    indices[i] = texCoordIndexed.length;
                    texCoordIndexed.push(true);
                }
            }

            mesh.setTextureCoordinates(texCoords);
        }
        // We have per vertex UVs
        else if(uvs.length / 2 == vertices.length / 3)
        {
            mesh.setTextureCoordinates(uvs);
        }

        mesh.setVertices(vertices);
        mesh.setNormals(normals);
        mesh.setIndices(indices);

        if(colors.length > 0)
            mesh.setColors(colors);
    }

    /**
     * Parses a vertex line from an OBJ file
     * 
     * @param line - The line containing the vertex data
     * @param vertices - The array to store the vertex positions
     * @param colors - The array to store the vertex colors
     */
    private static parseOBJVertex(line: string[], vertices: number[], colors: number[])
    {
        vertices.push(Number(line[0]));
        vertices.push(Number(line[1]));
        vertices.push(Number(line[2]));

        if(line.length > 3)
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
    private static parseOBJNormal(line: string[], normals: number[])
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
    private static parseOBJTextureCoordinate(line: string[], uvs: number[])
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
    private static parseOBJFace(line: string[], indices: number[], uvIndices: number[])
    {
        for(let i=0; i < 3; i++)
        {
            const index = line[i].split('/');
            indices.push(Number(index[0])-1);

             // texture coordinate
             if(index.length > 1 && index[1] != '')
             {
                 uvIndices.push(Number(index[1])-1);
             }
        }
    }

    /**
     * Parses the contents of a PLY file and stores the data in a given Mesh object
     * This function works for both ASCII or binary PLY files.
     * 
     * @param ply - The contents of the PLY file as an ArrayBuffer
     * @param mesh - The Mesh object to store the data
     */
    static parsePLY(ply: ArrayBuffer, mesh: Mesh3): void
    {
        const buffer = new Uint8Array(ply);
        const decoder = new TextDecoder();

        // Extract the header
        let done = false;
        let header = '';
        let currentByte = 0;
        const windowLength = 512;
        while(!done)
        {
            const headerBuffer = buffer.subarray(currentByte, currentByte + windowLength);
            currentByte += windowLength;
            header += decoder.decode(headerBuffer);
            const endOfHeader = header.indexOf('end_header');
            if(endOfHeader > 0)
            {
                header = header.substring(0, endOfHeader + 10);
                currentByte = endOfHeader + 11;
                done = true;
            }
        }

        // Parse the header
        const headerParser = new StringParser(header);

        if(headerParser.readToken() != 'ply' || headerParser.readToken() != 'format')
        {
            console.error('Unable to parse PLY');
            return;
        }

        const format = headerParser.readToken();
        headerParser.consumeLine();
        
        if(format == 'ascii')
        {
            const dataBuffer = buffer.subarray(currentByte);
            const dataParser = new StringParser(decoder.decode(dataBuffer));
            this.parsePLYAscii(headerParser, dataParser, mesh);
        }
        else if(format == 'binary_little_endian')
        {
            this.parsePLYBinary(headerParser, new DataView(ply, currentByte), mesh, true);
        }
        else if(format == 'binary_big_endian')
        {
            this.parsePLYBinary(headerParser, new DataView(ply, currentByte), mesh, false);
        }
        else
        {
            console.error('Unable to parse PLY');
            return;
        }
    }

    private static parsePLYAscii(headerParser: StringParser, dataParser: StringParser, mesh: Mesh3): void
    {
        let numVertices = 0;
        let numFaces = 0;
        const vertices: number[] = [];
        const colors: number[] = [];
        const normals: number[] = [];
        const uvs: number[] = [];

        const indices: number[] = [];
        const faceUvs: number[] = [];
        
        while(!headerParser.done())
        {
            const nextToken = headerParser.readToken();

            if(nextToken == 'element')
            {
                const line = headerParser.readLine();
                if(line[0] == 'vertex')
                {
                    numVertices = Number(line[1]);

                    let xIndex = -1;
                    let yIndex = -1;
                    let zIndex = -1;
                    let nxIndex = -1;
                    let nyIndex = -1;
                    let nzIndex = -1;
                    let uIndex = -1;
                    let vIndex = -1;
                    let redIndex = -1;
                    let greenIndex = -1;
                    let blueIndex = -1;
                    let alphaIndex = -1;

                    let propertyIndex = 0;
                    while(headerParser.peek() == 'property')
                    { 
                        const propertyLine = headerParser.readLine();
                        if(propertyLine[1] == 'float')
                        {
                            if(propertyLine[2] == 'x')
                                xIndex = propertyIndex;
                            else if(propertyLine[2] == 'y')
                                yIndex = propertyIndex;
                            else if(propertyLine[2] == 'z')
                                zIndex = propertyIndex;
                            else if(propertyLine[2] == 'nx')
                                nxIndex = propertyIndex;
                            else if(propertyLine[2] == 'ny')
                                nyIndex = propertyIndex;
                            else if(propertyLine[2] == 'nz')
                                nzIndex = propertyIndex;
                            else if(propertyLine[2] == 'texture_u')
                                uIndex = propertyIndex;
                            else if(propertyLine[2] == 'texture_v')
                                vIndex = propertyIndex;
                        }
                        else if(propertyLine[1] == 'uchar')
                        {
                            if(propertyLine[2] == 'red')
                                redIndex = propertyIndex;
                            else if(propertyLine[2] == 'green')
                                greenIndex = propertyIndex;
                            else if(propertyLine[2] == 'blue')
                                blueIndex = propertyIndex;
                            else if(propertyLine[2] == 'alpha')
                                alphaIndex = propertyIndex;
                        }

                        propertyIndex++;
                    }

                    const properties: number[] = [];
                    for(let i=0; i < propertyIndex; i++)
                    {
                        properties.push(0);
                    }

                    for(let i=0; i < numVertices; i++)
                    {
                        for(let j=0; j < propertyIndex; j++)
                            properties[j] = dataParser.readNumber();

                        if(xIndex >= 0 && yIndex >= 0 && zIndex >= 0)
                            vertices.push(properties[xIndex], properties[yIndex], properties[zIndex]);

                        if(nxIndex >= 0 && nyIndex >= 0 && nzIndex >= 0)
                            normals.push(properties[nxIndex], properties[nyIndex], properties[nzIndex]);

                        if(uIndex >= 0 && vIndex >= 0)
                            uvs.push(properties[uIndex], properties[vIndex]);

                        if(redIndex >= 0 && greenIndex >= 0 && blueIndex >= 0)
                        {
                            if(alphaIndex >= 0)
                                colors.push(properties[redIndex] / 255, properties[greenIndex] / 255, properties[blueIndex] / 255, properties[alphaIndex] / 255);
                            else
                                colors.push(properties[redIndex] / 255, properties[greenIndex] / 255, properties[blueIndex] / 255, 1);
                        }
                    }
                }
                else if(line[0] == 'face')
                {
                    numFaces = Number(line[1]);

                    const INDICES = 0;
                    const TEXCOORDS = 1;
                    const elementOrder: number[] = [];

                    while(headerParser.peek() == 'property')
                    {
                        const propertyLine = headerParser.readLine();
                        if  (propertyLine[1] == 'list' && 
                            (propertyLine[2] == 'uchar' || propertyLine[2] == 'char') && 
                            (propertyLine[3] == 'int' || propertyLine[3] == 'uint') && 
                            (propertyLine[4] == 'vertex_indices' || propertyLine[4] == 'vertex_index'))
                        {
                            elementOrder.push(INDICES);
                        }
                        else if (propertyLine[1] == 'list' && 
                                (propertyLine[2] == 'uchar' || propertyLine[2] == 'char') && 
                                (propertyLine[3] == 'float' || propertyLine[3] == 'double') && 
                                (propertyLine[4] == 'texcoord'))
                        {
                            elementOrder.push(TEXCOORDS);
                        }
                    }

                    for(let i=0; i < numFaces; i++)
                    {
                        for(let j=0; j < elementOrder.length; j++)
                        {
                            if(elementOrder[j] == INDICES)
                            {
                                const numFaceIndices = dataParser.readNumber();
                                for(let k=0; k < numFaceIndices; k++)
                                    indices.push(dataParser.readNumber());
                            }
                            else if(elementOrder[j] == TEXCOORDS)
                            {
                                const numTexCoords = dataParser.readNumber();
                                for(let k=0; k < numTexCoords; k++)
                                    faceUvs.push(dataParser.readNumber());
                            }
                        }
                    }
                }
                else
                {
                    console.error('Unable to parse PLY');
                    return;
                }
            }
            else
            {
                headerParser.consumeLine();
            }
        }

        // If we have per vertex UVs
        if(uvs.length > 0)
        {
            mesh.setTextureCoordinates(uvs);
        }
        // If we have per triangle UVs
        else if(faceUvs.length > 0)
        {
            const texCoordIndexed: boolean[] = [];
            const texCoords: number[] = [];

            const numVertices = vertices.length / 3;
            for(let i=0; i < numVertices; i++)
            {
                texCoords.push(0, 0);
                texCoordIndexed.push(false);
            }

            for(let i=0; i < indices.length; i++)
            {   
                // vertex has no texture coordinate yet
                if(!texCoordIndexed[indices[i]])
                {
                    texCoords[indices[i]*2] = faceUvs[i*2];
                    texCoords[indices[i]*2+1] = faceUvs[i*2+1];
                    texCoordIndexed[indices[i]] = true;
                }
                // shared vertex has a different texture coordinate than the one already stored
                // create a copy of the vertex with the new texture coordinate
                else if(texCoords[indices[i]*2] != faceUvs[i*2] || texCoords[indices[i]*2+1] != faceUvs[i*2+1])
                {
                    vertices.push(vertices[indices[i]*3]);
                    vertices.push(vertices[indices[i]*3+1]);
                    vertices.push(vertices[indices[i]*3+2]);
                    normals.push(normals[indices[i]*3]);
                    normals.push(normals[indices[i]*3+1]);
                    normals.push(normals[indices[i]*3+2]);

                    if(colors.length > 0)
                    {
                        colors.push(colors[indices[i]*3]);
                        colors.push(colors[indices[i]*3+1]);
                        colors.push(colors[indices[i]*3+2]);
                    }

                    texCoords.push(faceUvs[i*2]);
                    texCoords.push(faceUvs[i*2+1]);

                    indices[i] = texCoordIndexed.length;
                    texCoordIndexed.push(true);
                }
            }

            mesh.setTextureCoordinates(texCoords);
        }

        mesh.setVertices(vertices);
        mesh.setColors(colors);
        mesh.setNormals(normals);
        mesh.setIndices(indices);
    }

    private static parsePLYBinary(headerParser: StringParser, data: DataView, mesh: Mesh3, little_endian = true): void
    {
        let numVertices = 0;
        let numFaces = 0;
        const vertices: number[] = [];
        const colors: number[] = [];
        const normals: number[] = [];
        const uvs: number[] = [];

        const indices: number[] = [];
        const faceUvs: number[] = [];

        let totalBytes = 0;
        while(!headerParser.done())
        {
            const nextToken = headerParser.readToken();

            if(nextToken == 'element')
            {
                const line = headerParser.readLine();
                if(line[0] == 'vertex')
                {
                    const vertexStart = totalBytes;

                    numVertices = Number(line[1]);

                    let propertyBytes = 0;
                    let xBytes = -1;
                    let yBytes = -1;
                    let zBytes = -1;
                    let nxBytes = -1;
                    let nyBytes = -1;
                    let nzBytes = -1;
                    let uBytes = -1;
                    let vBytes = -1;
                    let redBytes = -1;
                    let greenBytes = -1;
                    let blueBytes = -1;
                    let alphaBytes = -1;

                    while(headerParser.peek() == 'property')
                    { 
                        const propertyLine = headerParser.readLine();
                        if(propertyLine[1] == 'float')
                        {
                            if(propertyLine[2] == 'x')
                                xBytes = propertyBytes;
                            else if(propertyLine[2] == 'y')
                                yBytes = propertyBytes;
                            else if(propertyLine[2] == 'z')
                                zBytes = propertyBytes;
                            else if(propertyLine[2] == 'nx')
                                nxBytes = propertyBytes;
                            else if(propertyLine[2] == 'ny')
                                nyBytes = propertyBytes;
                            else if(propertyLine[2] == 'nz')
                                nzBytes = propertyBytes;
                            else if(propertyLine[2] == 'texture_u')
                                uBytes = propertyBytes;
                            else if(propertyLine[2] == 'texture_v')
                                vBytes = propertyBytes;

                            propertyBytes+=4;
                        }
                        else if(propertyLine[1] == 'uchar' || propertyLine[1] == 'char')
                        {
                            if(propertyLine[2] == 'red')
                                redBytes = propertyBytes;
                            else if(propertyLine[2] == 'green')
                                greenBytes = propertyBytes;
                            else if(propertyLine[2] == 'blue')
                                blueBytes = propertyBytes;
                            else if(propertyLine[2] == 'alpha')
                                alphaBytes = propertyBytes;

                            propertyBytes+=1;
                        }  
                        else if(propertyLine[1] == 'short' || propertyLine[1] == 'ushort')
                        {
                            propertyBytes+=2;
                        }
                        else if(propertyLine[1] == 'int' || propertyLine[1] == 'uint')
                        {
                            propertyBytes+=4;
                        }
                        else if(propertyLine[1] == 'double')
                        {
                            propertyBytes+=8;
                        }
                    }

                    for(let i=0; i < numVertices; i++)
                    {
                        if(xBytes >= 0 && yBytes >= 0 && zBytes >= 0)
                        {
                            vertices.push(data.getFloat32(vertexStart + i*propertyBytes + xBytes, little_endian));
                            vertices.push(data.getFloat32(vertexStart + i*propertyBytes + yBytes, little_endian));
                            vertices.push(data.getFloat32(vertexStart + i*propertyBytes + zBytes, little_endian));
                        }

                        if(nxBytes >= 0 && nyBytes >= 0 && nzBytes >= 0)
                        {
                            normals.push(data.getFloat32(vertexStart + i*propertyBytes + nxBytes, little_endian));
                            normals.push(data.getFloat32(vertexStart + i*propertyBytes + nyBytes, little_endian));
                            normals.push(data.getFloat32(vertexStart + i*propertyBytes + nzBytes, little_endian));
                        }

                        if(uBytes >= 0 && vBytes >= 0)
                        {
                            uvs.push(data.getFloat32(vertexStart + i*propertyBytes + uBytes, little_endian));
                            uvs.push(data.getFloat32(vertexStart + i*propertyBytes + vBytes, little_endian));
                        }

                        if(redBytes >= 0 && greenBytes >= 0 && blueBytes >= 0)
                        {
                            if(alphaBytes >= 0)
                                colors.push(data.getUint8(vertexStart + i*propertyBytes + redBytes) / 255, 
                                    data.getUint8(vertexStart + i*propertyBytes + greenBytes) / 255, 
                                    data.getUint8(vertexStart + i*propertyBytes + blueBytes) / 255, 
                                    data.getUint8(vertexStart + i*propertyBytes + alphaBytes) / 255);
                            else
                                colors.push(data.getUint8(vertexStart + i*propertyBytes + redBytes) / 255, 
                                    data.getUint8(vertexStart+ i*propertyBytes + greenBytes) / 255, 
                                    data.getUint8(vertexStart + i*propertyBytes + blueBytes) / 255, 
                                    1);
                        }
                    }

                    totalBytes += numVertices * propertyBytes;
                }
                else if(line[0] == 'face')
                {
                    numFaces = Number(line[1]);
                    let faceBytes = totalBytes;

                    const INDICES = 0;
                    const TEXCOORDS = 1;
                    const elementOrder: number[] = [];

                    while(headerParser.peek() == 'property')
                    {
                        const propertyLine = headerParser.readLine();
                        if  (propertyLine[1] == 'list' && 
                            (propertyLine[2] == 'uchar' || propertyLine[2] == 'char') && 
                            (propertyLine[3] == 'int' || propertyLine[3] == 'uint') && 
                            (propertyLine[4] == 'vertex_indices' || propertyLine[4] == 'vertex_index'))
                        {
                            elementOrder.push(INDICES);
                        }
                        else if (propertyLine[1] == 'list' && 
                                (propertyLine[2] == 'uchar' || propertyLine[2] == 'char') && 
                                (propertyLine[3] == 'float') && 
                                (propertyLine[4] == 'texcoord'))
                        {
                            elementOrder.push(TEXCOORDS);
                        }
                    }

                    for(let i=0; i < numFaces; i++)
                    {
                        for(let j=0; j < elementOrder.length; j++)
                        {
                            if(elementOrder[j] == INDICES)
                            {
                                const numFaceIndices = data.getUint8(faceBytes);
                                faceBytes+=1;

                                for(let k=0; k < numFaceIndices; k++)
                                {
                                    indices.push(data.getUint32(faceBytes, little_endian));
                                    faceBytes+=4;
                                }
                            }
                            else if(elementOrder[j] == TEXCOORDS)
                            {
                                const numTexCoords = data.getUint8(faceBytes);
                                faceBytes+=1;

                                for(let k=0; k < numTexCoords; k++)
                                {
                                    faceUvs.push(data.getFloat32(faceBytes, little_endian));
                                    faceBytes+=4;
                                }
                            }
                        }
                    }
                }
                else
                {
                    console.error('Unable to parse PLY');
                    return;
                }
            }
            else
            {
                headerParser.consumeLine();
            }
        }

        // If we have per vertex UVs
        if(uvs.length > 0)
        {
            mesh.setTextureCoordinates(uvs);
        }
        // If we have per triangle UVs
        else if(faceUvs.length > 0)
        {
            const texCoordIndexed: boolean[] = [];
            const texCoords: number[] = [];

            const numVertices = vertices.length / 3;
            for(let i=0; i < numVertices; i++)
            {
                texCoords.push(0, 0);
                texCoordIndexed.push(false);
            }

            for(let i=0; i < indices.length; i++)
            {   
                // vertex has no texture coordinate yet
                if(!texCoordIndexed[indices[i]])
                {
                    texCoords[indices[i]*2] = faceUvs[i*2];
                    texCoords[indices[i]*2+1] = faceUvs[i*2+1];
                    texCoordIndexed[indices[i]] = true;
                }
                // shared vertex has a different texture coordinate than the one already stored
                // create a copy of the vertex with the new texture coordinate
                else if(texCoords[indices[i]*2] != faceUvs[i*2] || texCoords[indices[i]*2+1] != faceUvs[i*2+1])
                {
                    vertices.push(vertices[indices[i]*3]);
                    vertices.push(vertices[indices[i]*3+1]);
                    vertices.push(vertices[indices[i]*3+2]);
                    normals.push(normals[indices[i]*3]);
                    normals.push(normals[indices[i]*3+1]);
                    normals.push(normals[indices[i]*3+2]);

                    if(colors.length > 0)
                    {
                        colors.push(colors[indices[i]*3]);
                        colors.push(colors[indices[i]*3+1]);
                        colors.push(colors[indices[i]*3+2]);
                    }

                    texCoords.push(faceUvs[i*2]);
                    texCoords.push(faceUvs[i*2+1]);

                    indices[i] = texCoordIndexed.length;
                    texCoordIndexed.push(true);
                }
            }

            mesh.setTextureCoordinates(texCoords);
        }

        mesh.setVertices(vertices);
        mesh.setColors(colors);
        mesh.setNormals(normals);
        mesh.setIndices(indices);
    }


    /**
     * Parses the contents of a GLTF file and stores the scene in a Node3 object
     * 
     * @param document - The contents of the GLTF file
     * @param transform - The transform to store the data
     */
    static parseGLTF(document: Document, transform: Node3): void
    {
        const root = document.getRoot();
        root.listNodes().forEach((node) => {
            this.parseGLTFRecursive(node, transform);
        });
    }

    /**
     * Recusrively parses a node in the GLTF file and stores the data in a Node3 object
     * 
     * @param node - The current node to parse in the GLTF file
     * @param transform - The transform to store the data
     */
    private static parseGLTFRecursive(node: Node, parentTransform: Node3): void
    {
        let transform: Node3;

        const gltfMesh = node.getMesh();
        if(gltfMesh)
        {
            const primitives = gltfMesh.listPrimitives();

            if(primitives.length == 1)
            { 
                transform = this.parseGLTFPrimitive(primitives[0]);
            }
            else if(primitives.length > 1)
            {
                transform = new Node3();

                primitives.forEach((primitive) => {
                    transform.add(this.parseGLTFPrimitive(primitive));
                });
            }
            else
            {
                transform = new Node3();
            }
        }
        else
        {
            transform = new Node3();
        }   

        const position = node.getTranslation();
        const rotation = node.getRotation();
        const scale = node.getScale();

        transform.position.set(position[0], position[1], position[2]);
        transform.rotation.set(rotation[0], rotation[1], rotation[2], rotation[3]);
        transform.scale.set(scale[0], scale[1], scale[2]);
        
        parentTransform.add(transform);
    
        node.listChildren().forEach((child) => {
            this.parseGLTFRecursive(child, transform);
        });
    }

    private static parseGLTFPrimitive(primitive: Primitive): Mesh3
    {
        const positions = primitive.getAttribute('POSITION');
        const normals = primitive.getAttribute('NORMAL');
        const colors = primitive.getAttribute('COLOR_0');
        const uvs = primitive.getAttribute('TEXCOORD_0');
        const indices = primitive.getIndices();
        const material = primitive.getMaterial();

        const mesh = new Mesh3();

        if(positions)
        {
            mesh.setVertices(positions.getArray() as Float32Array);
        }

        if(normals)
        {
            mesh.setNormals(normals.getArray() as Float32Array);
        }
        
        if(colors)
        {
            mesh.setColors(colors.getArray() as Float32Array);
        }

        if(uvs)
        {
            mesh.setTextureCoordinates(uvs.getArray() as Float32Array);
        }

        if(indices)
        {
            mesh.setIndices(indices.getArray() as Uint16Array);
        }

        if(material)
        {
            const materialColor = material.getBaseColorFactor();
            mesh.material.setColor(new Color(materialColor[0], materialColor[1], materialColor[2], materialColor[3]));
        }
        
        return mesh;
    }
}