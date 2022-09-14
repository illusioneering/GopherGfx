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
import { BoundingSphere } from "../../math/BoundingSphere"

export class Mesh extends Transform3
{
    protected readonly gl: WebGL2RenderingContext;

    public positionBuffer: WebGLBuffer | null;
    public normalBuffer: WebGLBuffer | null;
    public colorBuffer: WebGLBuffer | null;
    public indexBuffer: WebGLBuffer | null;
    public texCoordBuffer: WebGLBuffer | null;

    public vertexCount: number;
    public triangleCount: number;

    public material: Material3;

    public boundingBox: BoundingBox3;
    public boundingSphere: BoundingSphere;
    
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

        // default material
        this.material = new GouraudMaterial();

        this.boundingBox = new BoundingBox3();
        this.boundingSphere = new BoundingSphere();
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

    setVertices(vertices: Vector3[] | number[], usage = this.gl.STATIC_DRAW): void
    {
        if(vertices.length > 0)
        {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);

            let vArray: number[];
            if(typeof vertices[0] === 'number')
            {
                vArray = vertices as number[];
                
            }
            else
            {
                vArray = [];
                (vertices as Vector3[]).forEach((elem: Vector3) =>
                {
                    vArray.push(elem.x, elem.y, elem.z);
                });
            }
            
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vArray), usage);
            this.vertexCount = vArray.length / 3;

            this.computeBounds(vertices); 
        }
    }

    setNormals(normals: Vector3[] | number[], usage = this.gl.STATIC_DRAW): void
    {
        if(normals.length > 0)
        {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);

            if(typeof normals[0] === 'number')
            {
                this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(normals as number[]), usage);
            }
            else
            {
                const nArray: number[] = [];
                (normals as Vector3[]).forEach((elem: Vector3) =>
                {
                    nArray.push(elem.x, elem.y, elem.z);
                });
                
                this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(nArray), usage);
            }
        }
    }

    setColors(colors: Color[] | number[], usage = this.gl.STATIC_DRAW): void
    {
        if(colors.length > 0)
        {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);

            if(typeof colors[0] === 'number')
            {
                this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors as number[]), usage);
            }
            else
            {
                const cArray: number[] = [];
                (colors as Color[]).forEach((elem: Color) =>
                {
                    cArray.push(elem.r, elem.g, elem.b, elem.a);
                });
                
                this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(cArray), usage);
            }
        }
    }

    setTextureCoordinates(texCoords: Vector2[] | number[], usage = this.gl.STATIC_DRAW): void
    {
        if(texCoords.length > 0)
        {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);

            if(typeof texCoords[0] === 'number')
            {
                this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(texCoords as number[]), usage);
            }
            else
            {
                const tArray: number[] = [];
                (texCoords as Vector2[]).forEach((elem: Vector2) =>
                {
                    tArray.push(elem.x, elem.y);
                });
                
                this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(tArray), usage);
            }
        }
    }

    setIndices(indices: Vector3[] | number[], usage = this.gl.STATIC_DRAW): void
    {
        if(indices.length > 0)
        {
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

            if(typeof indices[0] === 'number')
            {
                this.triangleCount = indices.length / 3;
                this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices as number[]), usage);
            }
            else
            {
                this.triangleCount = indices.length;
                const iArray: number[] = [];
                (indices as Vector3[]).forEach((elem: Vector3) =>
                {
                    iArray.push(elem.x, elem.y, elem.z);
                });
                
                this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(iArray), usage);
            }
        }
    }

    setArrayBuffer(values: Vector3[] | number[], buffer: WebGLBuffer | null, usage = this.gl.STATIC_DRAW): void
    {
        if(values.length > 0)
        {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);

            if(typeof values[0] === 'number')
            {
                this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(values as number[]), usage);
            }
            else
            {
                const nArray: number[] = [];
                (values as Vector3[]).forEach((elem: Vector3) =>
                {
                    nArray.push(elem.x, elem.y, elem.z);
                });
                
                this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(nArray), usage);
            }
        }
    }

    getVertices(): number[]
    {
        const vertexArray = new Float32Array(this.vertexCount * 3);
        this.gl.bindBuffer(this.gl.COPY_READ_BUFFER, this.positionBuffer);
        this.gl.getBufferSubData(this.gl.COPY_READ_BUFFER, 0, vertexArray);
        return [... vertexArray];
    }

    getNormals(): number[]
    {
        const normalArray = new Float32Array(this.vertexCount * 3);
        this.gl.bindBuffer(this.gl.COPY_READ_BUFFER, this.normalBuffer);
        this.gl.getBufferSubData(this.gl.COPY_READ_BUFFER, 0, normalArray);
        return [... normalArray];
    }

    getColors(): number[]
    {
        const colorArray = new Float32Array(this.vertexCount * 4);
        this.gl.bindBuffer(this.gl.COPY_READ_BUFFER, this.colorBuffer);
        this.gl.getBufferSubData(this.gl.COPY_READ_BUFFER, 0, colorArray);
        return [... colorArray];
    }

    getTextureCoordinates(): number[]
    {
        const texCoordArray = new Float32Array(this.vertexCount * 2);
        this.gl.bindBuffer(this.gl.COPY_READ_BUFFER, this.texCoordBuffer);
        this.gl.getBufferSubData(this.gl.COPY_READ_BUFFER, 0, texCoordArray);
        return [... texCoordArray];
    }

    getIndices(): number[]
    {
        const indexArray = new Uint16Array(this.triangleCount * 3);
        this.gl.bindBuffer(this.gl.COPY_READ_BUFFER, this.indexBuffer);
        this.gl.getBufferSubData(this.gl.COPY_READ_BUFFER, 0, indexArray);
        return [... indexArray];
    }

    getArrayBuffer(buffer: WebGLBuffer | null): number[]
    {
        const valueArray = new Float32Array(this.vertexCount * 3);
        this.gl.bindBuffer(this.gl.COPY_READ_BUFFER, buffer);
        this.gl.getBufferSubData(this.gl.COPY_READ_BUFFER, 0, valueArray);
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

        if(typeof vertices[0] === 'number')
        {
            const vArray = vertices as number[];

            this.boundingBox.max.set(vArray[0], vArray[1], vArray[2]);
            this.boundingBox.min.set(vArray[0], vArray[1], vArray[2]);
            
            for(let i=0; i < vArray.length; i+=3)
            {
                if(vArray[i] > this.boundingBox.max.x)
                    this.boundingBox.max.x = vArray[i];
                if(vArray[i] < this.boundingBox.min.x)
                    this.boundingBox.min.x = vArray[i];

                if(vArray[i+1] > this.boundingBox.max.y)
                    this.boundingBox.max.y = vArray[i+1];
                if(vArray[i+1] < this.boundingBox.min.y)
                    this.boundingBox.min.y = vArray[i+1];

                if(vArray[i+2] > this.boundingBox.max.z)
                    this.boundingBox.max.z = vArray[i+2];
                if(vArray[i+2] < this.boundingBox.min.z)
                    this.boundingBox.min.z = vArray[i+2];    
            }
        }
        else
        {
            this.boundingBox.max.copy((vertices as Vector3[])[0]);
            this.boundingBox.min.copy((vertices as Vector3[])[0]);

            (vertices as Vector3[]).forEach((elem: Vector3) =>
            {
                if(elem.x > this.boundingBox.max.x)
                    this.boundingBox.max.x = elem.x;
                if(elem.x < this.boundingBox.min.x)
                    this.boundingBox.min.x = elem.x;

                if(elem.y > this.boundingBox.max.y)
                    this.boundingBox.max.y = elem.y;
                if(elem.y < this.boundingBox.min.y)
                    this.boundingBox.min.y =elem.y;

                if(elem.z > this.boundingBox.max.z)
                    this.boundingBox.max.z = elem.z;
                if(elem.z < this.boundingBox.min.z)
                    this.boundingBox.min.z = elem.z;
            });
        }

        this.boundingSphere.center.copy(this.boundingBox.min);
        this.boundingSphere.center.add(this.boundingBox.max);
        this.boundingSphere.center.multiplyScalar(0.5);
        this.boundingSphere.radius = 0;
        if(typeof vertices[0] === 'number')
        {
            const vArray = vertices as number[];
            for(let i=0; i < vArray.length; i+=3)
            {
                const distance = Math.sqrt(
                    (vArray[i] - this.boundingSphere.center.x) * (vArray[i] - this.boundingSphere.center.x) +
                    (vArray[i+1] - this.boundingSphere.center.y) * (vArray[i+1] - this.boundingSphere.center.y) +
                    (vArray[i+2] - this.boundingSphere.center.z) * (vArray[i+2] - this.boundingSphere.center.z)
                );
                
                if(distance > this.boundingSphere.radius)
                    this.boundingSphere.radius = distance;
            }
        }
        else
        {
            (vertices as Vector3[]).forEach((elem: Vector3) =>
            {
                const distance = elem.distanceTo(this.boundingSphere.center);

                if(distance > this.boundingSphere.radius)
                    this.boundingSphere.radius = distance;
            });
        }
    }
}