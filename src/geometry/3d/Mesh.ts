import { Transform3 } from "../../core/Transform3";
import { Vector2 } from "../../math/Vector2";
import { Vector3 } from "../../math/Vector3";
import { Color } from "../../math/Color";
import { Material3 } from "../../materials/Material3";
import { GouraudMaterial } from "../../materials/GouraudMaterial";
import { Camera } from "../../core/Camera";
import { LightManager } from "../../lights/LightManager";
import { GfxApp } from "../../core/GfxApp";
import { BoundingBox3 } from "../../math/BoundingBox3";
import { BoundingSphere } from "../../math/BoundingSphere";

export class Mesh extends Transform3
{
    protected readonly gl: WebGL2RenderingContext;

    public positionBuffer: WebGLBuffer | null;
    public normalBuffer: WebGLBuffer | null;
    public colorBuffer: WebGLBuffer | null;
    public indexBuffer: WebGLBuffer | null;
    public texCoordBuffer: WebGLBuffer | null;
    public morphTargetPositionBuffer: WebGLBuffer | null;
    public morphTargetNormalBuffer: WebGLBuffer | null;

    public vertexCount: number;
    public triangleCount: number;

    public material: Material3;
    public morphTargetBoundingBox: BoundingBox3;
    public morphTargetBoundingSphere: BoundingSphere;

    constructor()
    {
        super();

        this.gl  = GfxApp.getInstance().renderer.gl;

        this.positionBuffer = this.gl.createBuffer();
        this.normalBuffer = this.gl.createBuffer();
        this.colorBuffer = this.gl.createBuffer();
        this.indexBuffer = this.gl.createBuffer();
        this.texCoordBuffer = this.gl.createBuffer();
        this.morphTargetPositionBuffer = this.gl.createBuffer();
        this.morphTargetNormalBuffer = this.gl.createBuffer();

        this.vertexCount = 0;
        this.triangleCount = 0;

        this.material = new GouraudMaterial();
        this.morphTargetBoundingBox = new BoundingBox3();
        this.morphTargetBoundingSphere = new BoundingSphere();
    }

    draw(parent: Transform3, camera: Camera, lightManager: LightManager): void
    {
        if(!this.visible)
            return;

        this.material.draw(this, this, camera, lightManager);

        this.children.forEach((elem: Transform3) => {
            elem.draw(this, camera, lightManager);
        });
    }

    setVertices(vertices: Vector3[] | number[], dynamicDraw = false): void
    {
        if(vertices.length > 0)
        {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);

            if(typeof vertices[0] === 'number')
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

    setNormals(normals: Vector3[] | number[], dynamicDraw = false): void
    {
        if(normals.length > 0)
        {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);

            if(typeof normals[0] === 'number')
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

    setColors(colors: Color[] | number[], dynamicDraw = false): void
    {
        if(colors.length > 0)
        {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);

            if(typeof colors[0] === 'number')
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
        }
    }

    setTextureCoordinates(texCoords: Vector2[] | number[], dynamicDraw = false): void
    {
        if(texCoords.length > 0)
        {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);

            if(typeof texCoords[0] === 'number')
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

    setIndices(indices: Vector3[] | number[], dynamicDraw = false): void
    {
        if(indices.length > 0)
        {
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

            if(typeof indices[0] === 'number')
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

    setMorphTargetVertices(vertices: Vector3[] | number[], dynamicDraw = false, computeBounds = true): void
    {
        if(vertices.length > 0)
        {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.morphTargetPositionBuffer);

            if(typeof vertices[0] === 'number')
            {
                if(dynamicDraw)
                    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices as number[]), this.gl.DYNAMIC_DRAW);
                else
                    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices as number[]), this.gl.STATIC_DRAW);

                this.morphTargetBoundingBox.computeBounds(vertices);
                this.morphTargetBoundingSphere.computeBounds(vertices, this.morphTargetBoundingBox);
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

                this.morphTargetBoundingBox.computeBounds(vArray);
                this.morphTargetBoundingSphere.computeBounds(vArray, this.morphTargetBoundingBox);
            }
        }
    }

    setMorphTargetNormals(normals: Vector3[] | number[], dynamicDraw = false): void
    {
        if(normals.length > 0)
        {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.morphTargetNormalBuffer);

            if(typeof normals[0] === 'number')
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

    getVertices(): number[]
    {
        const vertexArray = new Float32Array(this.vertexCount * 3);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.getBufferSubData(this.gl.ARRAY_BUFFER, 0, vertexArray);
        return [... vertexArray];
    }

    getNormals(): number[]
    {
        const normalArray = new Float32Array(this.vertexCount * 3);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
        this.gl.getBufferSubData(this.gl.ARRAY_BUFFER, 0, normalArray);
        return [... normalArray];
    }

    getColors(): number[]
    {
        const colorArray = new Float32Array(this.vertexCount * 4);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.getBufferSubData(this.gl.ARRAY_BUFFER, 0, colorArray);
        return [... colorArray];
    }

    getTextureCoordinates(): number[]
    {
        const texCoordArray = new Float32Array(this.vertexCount * 2);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);
        this.gl.getBufferSubData(this.gl.ARRAY_BUFFER, 0, texCoordArray);
        return [... texCoordArray];
    }

    getIndices(): number[]
    {
        const indexArray = new Uint16Array(this.triangleCount * 3);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.getBufferSubData(this.gl.ELEMENT_ARRAY_BUFFER, 0, indexArray);
        return [... indexArray];
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
;
        this.boundingBox.computeBounds(vertices);
        this.boundingSphere.computeBounds(vertices, this.boundingBox);
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
}