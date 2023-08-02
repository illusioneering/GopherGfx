import { FileWriter } from './FileWriter'
import { Mesh3 } from '../geometry/3d/Mesh3'
import { Node3 } from '../core/Node3'
import { Document, Format, WebIO, Node, Buffer } from '@gltf-transform/core'; 

export class MeshWriter
{
    static saveOBJ(filename: string, mesh: Mesh3): void
    {
        let output = '# Generated by GopherGfx\n';
        output += '# Vertices: ' + mesh.vertexCount + '\n';
        output += '# Faces: ' + mesh.triangleCount + '\n';
        output += '\n';

        const vertices = mesh.getVertices();
        const colors = mesh.getColors();
        const normals = mesh.getNormals();
        const uvs = mesh.getTextureCoordinates();
        const indices = mesh.getIndices();

        for(let i = 0; i < mesh.vertexCount; i++)
        {
            output += 'v ' + vertices[i*3].toFixed(6) + ' '  + vertices[i*3+1].toFixed(6) + ' '  + vertices[i*3+2].toFixed(6) + ' ' +
                colors[i*4].toFixed(6) + ' '  + colors[i*4+1].toFixed(6) + ' '  + colors[i*4+2].toFixed(6) + '\n';

            output += 'vn ' + normals[i*3].toFixed(6) + ' '  + normals[i*3+1].toFixed(6) + ' '  + normals[i*3+2].toFixed(6) + '\n';
            output += 'vt ' + uvs[i*2].toFixed(6) + ' '  + uvs[i*2+1].toFixed(6) + '\n';
        }

        output += '\n';

        for(let i = 0; i < indices.length; i+=3)
        {
            output += 'f ' + (indices[i]+1) + ' '  + (indices[i+1]+1) + ' '  + (indices[i+2]+1) + '\n';
        }
        
        FileWriter.saveAscii(filename, output);
    }

    static savePLY(filename: string, mesh: Mesh3, binary = true): void
    {
        const vertices = mesh.getVertices();
        const normals = mesh.getNormals();
        const colors = mesh.getColors();
        const uvs = mesh.getTextureCoordinates();
        const indices = mesh.getIndices();

        let header = 'ply\n';

        if(binary)
        {
            header += 'format binary_little_endian 1.0\n';
        }
        else
        {
            header += 'format ascii 1.0\n';
        }

        header += 'comment Generated by GopherGfx\n';

        header += 'element vertex ' + mesh.vertexCount + '\n';
        header += 'property float x\n';
        header += 'property float y\n';
        header += 'property float z\n';
        
        header += 'property float nx\n';
        header += 'property float ny\n';
        header += 'property float nz\n';

        header += 'property float texture_u\n';
        header += 'property float texture_v\n';
        
        header += 'property uchar red\n';
        header += 'property uchar green\n';
        header += 'property uchar blue\n';
        header += 'property uchar alpha\n';

        header += 'element face ' + mesh.triangleCount + '\n';
        header += 'property list uchar int vertex_indices\n'
        header += 'end_header\n';
        
        if(binary)
        {
            // Encode the text from the header as binary data
            const encoder = new TextEncoder();
            const headerData = encoder.encode(header);

            // Compute the size of the binary array buffer
            const bytesPerVertex = 36;
            const bytesPerFace = 13;
            const buffer = new ArrayBuffer(headerData.length + mesh.vertexCount * bytesPerVertex + mesh.triangleCount * bytesPerFace);

            // Copy header data into the buffer
            const output = new Uint8Array(buffer);
            output.set(headerData, 0);

            // Create a data view into the buffer
            const view = new DataView(buffer);

            let byteCounter = headerData.length;
            for(let i = 0; i < mesh.vertexCount; i++)
            {
                view.setFloat32(byteCounter, vertices[i*3], true); 
                byteCounter+=4;

                view.setFloat32(byteCounter, vertices[i*3+1], true); 
                byteCounter+=4;

                view.setFloat32(byteCounter, vertices[i*3+2], true); 
                byteCounter+=4;

                view.setFloat32(byteCounter, normals[i*3], true); 
                byteCounter+=4;

                view.setFloat32(byteCounter, normals[i*3+1], true); 
                byteCounter+=4;

                view.setFloat32(byteCounter, normals[i*3+2], true); 
                byteCounter+=4;

                view.setFloat32(byteCounter, uvs[i*2], true); 
                byteCounter+=4;

                view.setFloat32(byteCounter, uvs[i*2+1], true); 
                byteCounter+=4;

                view.setUint8(byteCounter, Math.floor(colors[i*4]*255)); 
                byteCounter+=1;

                view.setUint8(byteCounter, Math.floor(colors[i*4+1]*255)); 
                byteCounter+=1;

                view.setUint8(byteCounter, Math.floor(colors[i*4+2]*255)); 
                byteCounter+=1;

                view.setUint8(byteCounter, Math.floor(colors[i*4+3]*255)); 
                byteCounter+=1;
            }

            for(let i = 0; i <  mesh.triangleCount; i++)
            {
                view.setUint8(byteCounter, 3);
                byteCounter+=1;

                view.setInt32(byteCounter, indices[i*3], true);
                byteCounter+=4;

                view.setInt32(byteCounter, indices[i*3+1], true);
                byteCounter+=4;

                view.setInt32(byteCounter, indices[i*3+2], true);
                byteCounter+=4;
            }

            FileWriter.saveBinary(filename, output);
        }
        else
        {
            let output = header;

            for(let i = 0; i < mesh.vertexCount; i++)
            {
                output += vertices[i*3].toFixed(6) + ' '  + vertices[i*3+1].toFixed(6) + ' '  + vertices[i*3+2].toFixed(6);
                output += ' ' + normals[i*3].toFixed(6) + ' '  + normals[i*3+1].toFixed(6) + ' '  + normals[i*3+2].toFixed(6);
                output += ' ' + uvs[i*2].toFixed(6) + ' '  + uvs[i*2+1].toFixed(6);
                output += ' ' + Math.floor(colors[i*4]*255) + ' '  + Math.floor(colors[i*4+1]*255) + ' '  + Math.floor(colors[i*4+2]*255) + ' '  + Math.floor(colors[i*4+3]*255);
                output += '\n';
            }

            for(let i = 0; i < indices.length; i+=3)
            {
                output += '3 ' + indices[i] + ' '  + indices[i+1] + ' '  + indices[i+2] + '\n';
            }
            
            FileWriter.saveAscii(filename, output);
        }
    }

    static saveGLTF(filename: string, transform: Node3): void
    {
        const doc = MeshWriter.createGLTF(transform);
        MeshWriter.writeJSON(filename, doc); 
    }

    static saveGLB(filename: string, transform: Node3): void
    {
        const doc = MeshWriter.createGLTF(transform);
        const io = new WebIO();
        io.writeBinary(doc).then((data: Uint8Array) => {
            FileWriter.saveBinary(filename, data);
        });
    }

    private static createGLTF(transform: Node3): Document
    {
        const doc = new Document();
        const buffer = doc.createBuffer();
        const scene = doc.createScene();
        const node = doc.createNode();
        scene.addChild(node);

        MeshWriter.createGLTFRecursive(transform, doc, buffer, node);

        return doc;
    }

    private static createGLTFRecursive(transform: Node3, doc: Document, buffer: Buffer, node: Node)
    {
        const position = transform.getPosition();
        const rotation = transform.getRotation();
        const scale = transform.getScale();
        node.setTranslation([position.x, position.y, position.z]);
        node.setRotation([rotation.x, rotation.y, rotation.z, rotation.w]);
        node.setScale([scale.x, scale.y, scale.z]);

        if(transform instanceof Mesh3)
        {
            const vertices = transform.getVertices();
            const normals = transform.getNormals();
            const colors = transform.getColors();
            const uvs = transform.getTextureCoordinates();
            const indices = transform.getIndices();

            const mesh = doc.createMesh();
            node.setMesh(mesh);

            const gltfPosition = doc
                .createAccessor()
                .setArray(new Float32Array(vertices))
                .setType("VEC3")
                .setBuffer(buffer);

            const gltfNormals = doc
                .createAccessor()
                .setArray(new Float32Array(normals))
                .setType("VEC3")
                .setBuffer(buffer);

            const gltfColors = doc
                .createAccessor()
                .setArray(new Float32Array(colors))
                .setType("VEC4")
                .setBuffer(buffer);

            const gltfUVs = doc
                .createAccessor()
                .setArray(new Float32Array(uvs))
                .setType("VEC2")
                .setBuffer(buffer);

            const gltfIndices = doc
                .createAccessor()
                .setArray(new Uint32Array(indices))
                .setType("SCALAR")
                .setBuffer(buffer);

            const materialColor = transform.material.getColor();
            const material = doc.createMaterial()
                .setBaseColorFactor([materialColor.r, materialColor.g, materialColor.b, materialColor.a]);

            const primitive = doc
                .createPrimitive()
                .setAttribute("POSITION", gltfPosition)
                .setAttribute("NORMAL", gltfNormals)
                .setAttribute("COLOR_0", gltfColors)
                .setAttribute("TEXCOORD_0", gltfUVs)
                .setIndices(gltfIndices)
                .setMaterial(material);

            mesh.addPrimitive(primitive);
        }

        for(let i=0; i < transform.children.length; i++)
        {
            const child = doc.createNode();
            node.addChild(child);

            MeshWriter.createGLTFRecursive(transform.children[i], doc, buffer, child);
        }
    }

    private static async writeJSON(filename: string, doc: Document): Promise<void>
    {
        const io = new WebIO();
        const { json, resources } = await io.writeJSON(doc, {format: Format.GLTF, basename: filename});

        const base64url = await new Promise((r) => {
            const reader = new FileReader();
            reader.onload = () => r(reader.result);
            reader.readAsDataURL(new Blob([resources[filename + '.bin']]));
        });

        json.buffers![0].uri = base64url as string;

        FileWriter.saveAscii(filename, JSON.stringify(json, null, 2));
    } 
}