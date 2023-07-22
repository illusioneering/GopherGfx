import { Mesh } from '../geometry/3d/Mesh'
import { Transform3 } from '../core/Transform3'
import { GfxApp } from '../core/GfxApp'
import { MeshParser } from './MeshParser'
import { Document, WebIO } from '@gltf-transform/core';

export class MeshLoader
{
    static loadGLTF(filename: string, callback: ((rootNode: Transform3) => void) | null = null, recursive = true): Transform3
    {

        GfxApp.getInstance().assetManager.requestedAssets.push(filename);

        const root = new Transform3();

        const io = new WebIO();
        io.read(filename).then((document: Document) => {
            
            MeshParser.parseGLTF(document, root);
            if(callback)
            {
                callback(root);
            }
            GfxApp.getInstance().assetManager.loadedAssets.push(filename);

        })
        .catch(() => {
            GfxApp.getInstance().assetManager.errorAssets.push(filename);
            console.error('Unable to fetch GLTF file: ' + filename);
        });

        return root;
    }

    /**
     * Loads an OBJ file
     * 
     * @param filename - The relative path to the OBJ file
     * @param callback - An optional callback that is called when the file has been loaded
     * @returns A Mesh object containing the data loaded from the file
     */  
    static loadOBJ(filename: string, callback: ((loadedMesh: Mesh) => void) | null = null): Mesh
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

                MeshParser.parseOBJ(text, mesh);
                if(callback)
                {
                    callback(mesh);
                }
                GfxApp.getInstance().assetManager.loadedAssets.push(filename);

            });
        })
        .catch(() => {
            GfxApp.getInstance().assetManager.errorAssets.push(filename);
            console.error('Unable to load OBJ file: ' + filename);
        });

        return mesh;
    }

    /**
     * Loads a PLY file
     * 
     * @param filename - The relative path to the PLY file
     * @param callback - An optional callback that is called when the file has been loaded
     * @returns A Mesh object containing the data loaded from the file
     */  
    static loadPLY(filename: string, callback: ((loadedMesh: Mesh) => void) | null = null): Mesh
    {
        GfxApp.getInstance().assetManager.requestedAssets.push(filename);

        const mesh = new Mesh();

        fetch(filename).then((response: Response) => {
            if(!response.ok)
                throw new Error();
            return response.blob();
        })
        .then((data: Blob) => {
            data.arrayBuffer().then((buffer: ArrayBuffer) => {

                MeshParser.parsePLY(buffer, mesh);
                if(callback)
                {
                    callback(mesh);
                }
                GfxApp.getInstance().assetManager.loadedAssets.push(filename);

            });
        })
        .catch(() => {
            GfxApp.getInstance().assetManager.errorAssets.push(filename);
            console.error('Unable to load PLY file: ' + filename);
        });

        return mesh;
    }
}