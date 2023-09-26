import { Node3 } from "../../core/Node3";
import { Vector2 } from "../../math/Vector2";
import { Vector3 } from "../../math/Vector3";
import { Color } from "../../math/Color";
import { Material3 } from "../../materials/Material3";
import { GouraudMaterial } from "../../materials/GouraudMaterial";
import { Camera } from "../../core/Camera";
import { LightManager } from "../../lights/LightManager";
import { GfxApp } from "../../core/GfxApp";

/**
 * The base class for 3D triangle meshes.  This class extends Node3 so it can be added directly
 * to the GopherGfx 3D scene graph.  It is possible to create a new "empty" Mesh3 and then add
 * triangles to it.  Most of the routines in the Geometry3Factory do this.  Use those to create
 * a new Mesh3 for simple geometric shapes like spheres, cubes, etc.  Those routines also 
 * provide good examples of how to create your own custom mesh via code if you wish to create
 * something more complex via programming.  Triangle meshes can also be loaded from a variety 
 * of 3D file formats using the MeshLoader class.
 */
export class Mesh3 extends Node3
{
    protected readonly gl: WebGL2RenderingContext;

    public positionBuffer: WebGLBuffer | null;
    public normalBuffer: WebGLBuffer | null;
    public colorBuffer: WebGLBuffer | null;
    public indexBuffer: WebGLBuffer | null;
    public texCoordBuffer: WebGLBuffer | null;

    public vertexCount: number;
    public triangleCount: number;

    public positionCache: number[] | null;
    public normalCache: number[] | null;
    public colorCache: number[] | null;
    public indexCache: number[] | null;
    public texCoordCache: number[] | null;

    public material: Material3;

    /**
     * Flag that determines whether to use vertex colors.
     */
    public hasVertexColors: boolean;

    constructor()
    {
        super();

        this.gl  = GfxApp.getInstance().renderer.gl;

        this.positionBuffer = this.gl.createBuffer();
        this.normalBuffer = this.gl.createBuffer();
        this.colorBuffer = this.gl.createBuffer();
        this.indexBuffer = this.gl.createBuffer();
        this.texCoordBuffer = this.gl.createBuffer();

        this.vertexCount = 0;
        this.triangleCount = 0;

        this.positionCache = null;
        this.normalCache = null;
        this.colorCache = null;
        this.indexCache = null;
        this.texCoordCache = null;

        this.material = new GouraudMaterial();

        this.hasVertexColors = false;
    }

    draw(parent: Node3, camera: Camera, lightManager: LightManager): void
    {
        if(!this.visible)
            return;

        this.material.draw(this, camera, lightManager);

        this.children.forEach((elem: Node3) => {
            elem.draw(this, camera, lightManager);
        });
    }

    setVertices(vertices: Vector3[] | number[] | Float32Array, dynamicDraw = false): void
    {
        this.positionCache = null;

        if(vertices.length > 0)
        {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);

            if(vertices instanceof Float32Array)
            {
                if(dynamicDraw)
                    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.DYNAMIC_DRAW);
                else
                    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);

                this.vertexCount = vertices.length / 3;
                const vArray = Array.from(vertices);
                this.boundingBox.computeBounds(vArray);
                this.boundingSphere.computeBounds(vArray, this.boundingBox);
            }
            else if(typeof vertices[0] === 'number')
            {
                if(dynamicDraw)
                    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices as number[]), this.gl.DYNAMIC_DRAW);
                else
                    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices as number[]), this.gl.STATIC_DRAW);
                
                this.vertexCount = vertices.length / 3;
                this.boundingBox.computeBounds(vertices);
                this.boundingSphere.computeBounds(vertices, this.boundingBox);
            }
            else
            {
                const vArray: number[] = [];
                (vertices as Vector3[]).forEach((elem: Vector3) =>
                {
                    vArray.push(elem.x, elem.y, elem.z);
                });

                if(dynamicDraw)
                    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vArray), this.gl.DYNAMIC_DRAW);
                else
                    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vArray), this.gl.STATIC_DRAW);

                this.vertexCount = vertices.length;
                this.boundingBox.computeBounds(vArray);
                this.boundingSphere.computeBounds(vArray, this.boundingBox);
            }      
        }
    }

    setNormals(normals: Vector3[] | number[] | Float32Array, dynamicDraw = false): void
    {
        this.normalCache = null;

        if(normals.length > 0)
        {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);

            if(normals instanceof Float32Array)
            {
                if(dynamicDraw)
                    this.gl.bufferData(this.gl.ARRAY_BUFFER, normals, this.gl.DYNAMIC_DRAW);
                else
                    this.gl.bufferData(this.gl.ARRAY_BUFFER, normals, this.gl.STATIC_DRAW);

            }
            else if(typeof normals[0] === 'number')
            {
                if(dynamicDraw)
                    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(normals as number[]), this.gl.DYNAMIC_DRAW);
                else
                    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(normals as number[]), this.gl.STATIC_DRAW);
            }
            else
            {
                const nArray: number[] = [];
                (normals as Vector3[]).forEach((elem: Vector3) =>
                {
                    nArray.push(elem.x, elem.y, elem.z);
                });
                
                if(dynamicDraw)
                    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(nArray), this.gl.DYNAMIC_DRAW);
                else
                    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(nArray), this.gl.STATIC_DRAW);
            }
        }
    }

    setColors(colors: Color[] | number[] | Float32Array, dynamicDraw = false): void
    {
        this.colorCache = null;

        if(colors.length > 0)
        {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);

            if(colors instanceof Float32Array)
            {
                if(dynamicDraw)
                    this.gl.bufferData(this.gl.ARRAY_BUFFER, colors, this.gl.DYNAMIC_DRAW);
                else
                    this.gl.bufferData(this.gl.ARRAY_BUFFER, colors, this.gl.STATIC_DRAW);

            }
            else if(typeof colors[0] === 'number')
            {
                if(dynamicDraw)
                    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors as number[]), this.gl.DYNAMIC_DRAW);
                else
                    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors as number[]), this.gl.STATIC_DRAW);
            }
            else
            {
                const cArray: number[] = [];
                (colors as Color[]).forEach((elem: Color) =>
                {
                    cArray.push(elem.r, elem.g, elem.b, elem.a);
                });
                
                if(dynamicDraw)
                    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(cArray), this.gl.DYNAMIC_DRAW);
                else
                    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(cArray), this.gl.STATIC_DRAW);
            }

            this.hasVertexColors = true;
        }
        else
        {
            this.hasVertexColors = false;
        }
    }

    setTextureCoordinates(texCoords: Vector2[] | number[] | Float32Array, dynamicDraw = false): void
    {
        this.texCoordCache = null;

        if(texCoords.length > 0)
        {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);

            if(texCoords instanceof Float32Array)
            {
                if(dynamicDraw)
                    this.gl.bufferData(this.gl.ARRAY_BUFFER, texCoords, this.gl.DYNAMIC_DRAW);
                else
                    this.gl.bufferData(this.gl.ARRAY_BUFFER, texCoords, this.gl.STATIC_DRAW);

            }
            else if(typeof texCoords[0] === 'number')
            {
                if(dynamicDraw)
                    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(texCoords as number[]), this.gl.DYNAMIC_DRAW);
                else
                    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(texCoords as number[]), this.gl.STATIC_DRAW);
            }
            else
            {
                const tArray: number[] = [];
                (texCoords as Vector2[]).forEach((elem: Vector2) =>
                {
                    tArray.push(elem.x, elem.y);
                });
                
                if(dynamicDraw)
                    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(tArray), this.gl.DYNAMIC_DRAW);
                else
                    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(tArray), this.gl.STATIC_DRAW);
            }
        }
    }

    setIndices(indices: Vector3[] | number[] | Uint16Array, dynamicDraw = false): void
    {
        this.indexCache = null;

        if(indices.length > 0)
        {
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

            if(indices instanceof Uint16Array)
            {
                this.triangleCount = indices.length / 3;

                if(dynamicDraw)
                    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, indices, this.gl.DYNAMIC_DRAW);
                else
                    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, indices, this.gl.STATIC_DRAW);
            }
            else if(typeof indices[0] === 'number')
            {
                this.triangleCount = indices.length / 3;

                if(dynamicDraw)
                    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices as number[]), this.gl.DYNAMIC_DRAW);
                else
                    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices as number[]), this.gl.STATIC_DRAW);
            }
            else
            {
                this.triangleCount = indices.length;
                const iArray: number[] = [];
                (indices as Vector3[]).forEach((elem: Vector3) =>
                {
                    iArray.push(elem.x, elem.y, elem.z);
                });
                
                if(dynamicDraw)
                    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(iArray), this.gl.DYNAMIC_DRAW);
                else
                    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(iArray), this.gl.STATIC_DRAW);
            }
        }
    }

    setArrayBuffer(values: Vector3[] | number[], buffer: WebGLBuffer | null, dynamicDraw = false): void
    {
        if(values.length > 0)
        {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);

            if(typeof values[0] === 'number')
            {
                if(dynamicDraw)
                    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(values as number[]), this.gl.DYNAMIC_DRAW);
                else
                    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(values as number[]), this.gl.STATIC_DRAW);
            }
            else
            {
                const nArray: number[] = [];
                (values as Vector3[]).forEach((elem: Vector3) =>
                {
                    nArray.push(elem.x, elem.y, elem.z);
                });
                
                if(dynamicDraw)
                    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(nArray), this.gl.DYNAMIC_DRAW);
                else
                    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(nArray), this.gl.STATIC_DRAW);
            }
        }
    }

    getVertices(): number[]
    {
        if(!this.positionCache)
        {
            const vertexArray = new Float32Array(this.vertexCount * 3);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
            this.gl.getBufferSubData(this.gl.ARRAY_BUFFER, 0, vertexArray);
            this.positionCache = [... vertexArray];
        }

        return this.positionCache;
    }

    getNormals(): number[]
    {
        if(!this.normalCache)
        {
            const normalArray = new Float32Array(this.vertexCount * 3);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
            this.gl.getBufferSubData(this.gl.ARRAY_BUFFER, 0, normalArray);
            this.normalCache = [... normalArray];
        }

        return this.normalCache;
    }

    getColors(): number[]
    {
        if(!this.colorCache)
        {
            const colorArray = new Float32Array(this.vertexCount * 4);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
            this.gl.getBufferSubData(this.gl.ARRAY_BUFFER, 0, colorArray);
            this.colorCache = [... colorArray];
        }

        return this.colorCache;
    }

    getTextureCoordinates(): number[]
    {
        if(!this.texCoordCache)
        {
            const texCoordArray = new Float32Array(this.vertexCount * 2);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);
            this.gl.getBufferSubData(this.gl.ARRAY_BUFFER, 0, texCoordArray);
            this.texCoordCache = [... texCoordArray];
        }

        return this.texCoordCache;
    }

    getIndices(): number[]
    {
        if(!this.indexCache)
        {
            const indexArray = new Uint16Array(this.triangleCount * 3);
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            this.gl.getBufferSubData(this.gl.ELEMENT_ARRAY_BUFFER, 0, indexArray);
            this.indexCache = [... indexArray];
        }

        return this.indexCache;
    }

    getArrayBuffer(buffer: WebGLBuffer | null): number[]
    {
        const valueArray = new Float32Array(this.vertexCount * 3);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.getBufferSubData(this.gl.ARRAY_BUFFER, 0, valueArray);
        return [... valueArray];
    }

    public createDefaultVertexColors(): void
    {
        const colors: number[] = [];

        for(let i=0; i < this.vertexCount; i++)
            colors.push(1, 1, 1, 1);

        this.setColors(colors);
    }

    public computeBounds(vertices: Vector3[] | number[] | null): void
    {
        if(!vertices)
        {
            vertices = this.getVertices();
        } 
        
        if(vertices.length == 0)
            return;

        this.boundingBox.computeBounds(vertices);
        this.boundingSphere.computeBounds(vertices, this.boundingBox);
        
        this.localBoundsDirty = true;
        this.worldBoundsDirty = true;
    }

    public mergeSharedVertices(): void
    {
        const vArray = this.getVertices();
        const nArray = this.getNormals();
        const cArray = this.getColors();
        const uvArray = this.getTextureCoordinates();

        const vertices: Vector3[] = [];
        const normals: Vector3[] = [];
        const colors: Color[] = [];
        const uvs: Vector2[] = [];
        const indices = this.getIndices();

        // Copy the vertices, normals, and colors into Vector3 arrays for convenience
        for(let i=0; i < vArray.length; i+=3)
        {
            vertices.push(new Vector3(vArray[i], vArray[i+1], vArray[i+2]));
            normals.push(new Vector3(nArray[i], nArray[i+1], nArray[i+2]));
            colors.push(new Color(cArray[i], cArray[i+1], cArray[i+2]));
        }

        // Copy the uvs into a Vector2 arrays for convenience
        for(let i=0; i < uvArray.length; i+=2)
        {
            uvs.push(new Vector2(uvArray[i], uvArray[i+1]));
        }

        const newVertices: Vector3[] = [];
        const newNormals: Vector3[] = [];
        const newColors: Color[] = [];
        const newUVs: Vector2[] = [];
        const newIndices: number[] = indices.slice();
        const counts: number[] = [];

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

                    newNormals[j].add(normals[i]);
                    newColors[j].add(colors[i]);
                    newUVs[j].add(uvs[i]);
                    counts[j]++;
                    duplicate = true;
                }   
            }

            if(!duplicate)
            {
                newVertices.push(vertices[i]);
                newNormals.push(normals[i]);
                newColors.push(colors[i]);
                newUVs.push(uvs[i]);
                counts.push(1);

                for(let k = 0; k < indices.length; k++)
                {
                    if(indices[k] == i)
                        newIndices[k] = newVertices.length-1;
                }
            }
        }

        for(let i=0; i < newVertices.length; i++)
        {
            newNormals[i].multiplyScalar(1 / counts[i]);
            newColors[i].multiplyScalar(1 / counts[i]);
            newUVs[i].multiplyScalar(1 / counts[i]);
        }

        this.setVertices(newVertices);
        this.setNormals(newNormals);
        this.setColors(newColors);
        this.setTextureCoordinates(newUVs);
        this.setIndices(newIndices);
    }

    public createInstance(copyTransform = true): Mesh3
    {
        const instance = new Mesh3();
        instance.positionBuffer = this.positionBuffer;
        instance.normalBuffer = this.normalBuffer;
        instance.colorBuffer = this.colorBuffer;
        instance.indexBuffer = this.indexBuffer;
        instance.texCoordBuffer = this.texCoordBuffer;
        instance.vertexCount = this.vertexCount;
        instance.triangleCount = this.triangleCount;
        instance.material = this.material;
        instance.visible = this.visible;
        instance.boundingBox = this.boundingBox;
        instance.boundingSphere = this.boundingSphere;
        instance.localBoundsDirty = true;
        instance.worldBoundsDirty = true;

        if(copyTransform)
        {
            instance._position.copy(this._position);
            instance._rotation.copy(this._rotation);
            instance._scale.copy(this._scale);
            instance.localToParentMatrix.copy(this.localToParentMatrix);
            instance.localToWorldMatrix.copy(this.localToWorldMatrix);
            instance.localMatrixDirty = this.localMatrixDirty;
            instance.worldMatrixDirty = true;
        }

        return instance;
    }
}