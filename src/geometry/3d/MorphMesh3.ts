import { Mesh3 } from "./Mesh3";
import { BoundingBox3 } from "../../math/BoundingBox3";
import { BoundingSphere } from "../../math/BoundingSphere";
import { Vector3 } from "../../math/Vector3";
import { MorphMaterial } from "../../materials/MorphMaterial";

export class MorphMesh3 extends Mesh3
{
    public morphAlpha: number;
    public morphTargetBoundingBox: BoundingBox3;
    public morphTargetBoundingSphere: BoundingSphere;
    public material: MorphMaterial;

    public morphTargetPositionBuffer: WebGLBuffer | null;
    public morphTargetNormalBuffer: WebGLBuffer | null;

    constructor()
    {
        // Call the superclass constructor
        super();

        this.morphAlpha = 0;

        this.morphTargetBoundingBox = new BoundingBox3();
        this.morphTargetBoundingSphere = new BoundingSphere();
        this.material = new MorphMaterial();

        this.morphTargetPositionBuffer = this.gl.createBuffer();
        this.morphTargetNormalBuffer = this.gl.createBuffer();
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

}