import { Node3 } from "../../core/Node3";
import { Vector3 } from "../../math/Vector3";
import { Color } from "../../math/Color";
import { Camera } from "../../core/Camera";
import { LightManager } from "../../lights/LightManager";
import { GfxApp } from "../../core/GfxApp";
import { BoundingBox3 } from "../../math/BoundingBox3";
import { UnlitMaterial } from '../../materials/UnlitMaterial';
import { Matrix4 } from "../../math/Matrix4";

export enum LineMode3
{
    LINES,
    LINE_STRIP,
    LINE_LOOP
}

/**
 * The base class for 3D lines.  This class extends Node3 so it can be added directly
 * to the GopherGfx 3D scene graph.  The class can draw line segments, line strips,
 * and line loops.  The vertices are interpreted differently depending upon the 
 * LineMode3 that is set.  WebGL only supports lines that are exactly 1 pixel
 * thick.  These can look a bit strange in 3D scenes because the thickness of the
 * line does not vary with the depth from the camera.  So, the lines that this 
 * class can draw are most useful as quick debugging aids.  To draw a more substantial 
 * "line" that actually behaves like it has some thickness in your 3D scene, you 
 * need to construct your line using triangles.  
 */
export class Line3 extends Node3
{
    protected readonly gl: WebGL2RenderingContext;

    public color: Color;
    public vertexCount: number;
    public lineMode: number;

    public readonly positionBuffer: WebGLBuffer | null;
    public readonly colorBuffer: WebGLBuffer | null;

    private colorUniform: WebGLUniformLocation | null;
    private useTextureUniform: WebGLUniformLocation | null;
    private textureUniform: WebGLUniformLocation | null;
    private modelViewUniform: WebGLUniformLocation | null;
    private projectionUniform: WebGLUniformLocation | null;
    private positionAttribute: number;
    private colorAttribute: number;
    private texCoordAttribute: number;

    /**
     * Flag that determines whether to use vertex colors.
     */
    public hasVertexColors: boolean;
    
    constructor(lineMode = LineMode3.LINE_STRIP)
    {
        super();

        this.color = new Color(1, 1, 1);
        this.vertexCount = 0;
        this.lineMode = lineMode;

        this.gl  = GfxApp.getInstance().renderer.gl;
        this.positionBuffer = this.gl.createBuffer();
        this.colorBuffer = this.gl.createBuffer();

        UnlitMaterial.shader.initialize(this.gl);
        this.colorUniform = UnlitMaterial.shader.getUniform(this.gl, 'materialColor');
        this.modelViewUniform = UnlitMaterial.shader.getUniform(this.gl, 'modelViewMatrix');
        this.projectionUniform = UnlitMaterial.shader.getUniform(this.gl, 'projectionMatrix');
        this.useTextureUniform = UnlitMaterial.shader.getUniform(this.gl, 'useTexture');
        this.textureUniform = UnlitMaterial.shader.getUniform(this.gl, 'textureImage');
        this.positionAttribute = UnlitMaterial.shader.getAttribute(this.gl, 'position');
        this.colorAttribute = UnlitMaterial.shader.getAttribute(this.gl, 'color');
        this.texCoordAttribute = UnlitMaterial.shader.getAttribute(this.gl, 'texCoord');   

        this.hasVertexColors = false;
    }

    createFromBox(box: BoundingBox3)
    {      
         const vertices: number[] = [];

         // Bottom rectangle
         vertices.push(box.max.x, box.min.y, box.max.z);
         vertices.push(box.max.x, box.min.y, box.min.z);
         vertices.push(box.min.x, box.min.y, box.min.z);
         vertices.push(box.min.x, box.min.y, box.max.z);
         vertices.push(box.max.x, box.min.y, box.max.z);
         vertices.push(box.min.x, box.min.y, box.max.z);
         vertices.push(box.max.x, box.min.y, box.min.z);
         vertices.push(box.min.x, box.min.y, box.min.z);

         // Top rectangle
         vertices.push(box.max.x, box.max.y, box.max.z);
         vertices.push(box.max.x, box.max.y, box.min.z);
         vertices.push(box.min.x, box.max.y, box.min.z);
         vertices.push(box.min.x, box.max.y, box.max.z);
         vertices.push(box.max.x, box.max.y, box.max.z);
         vertices.push(box.min.x, box.max.y, box.max.z);
         vertices.push(box.max.x, box.max.y, box.min.z);
         vertices.push(box.min.x, box.max.y, box.min.z);
         
         // Sides
         vertices.push(box.max.x, box.min.y, box.max.z);
         vertices.push(box.max.x, box.max.y, box.max.z);
         vertices.push(box.max.x, box.min.y, box.min.z);
         vertices.push(box.max.x, box.max.y, box.min.z);
         vertices.push(box.min.x, box.min.y, box.min.z);
         vertices.push(box.min.x, box.max.y, box.min.z);
         vertices.push(box.min.x, box.min.y, box.max.z);
         vertices.push(box.min.x, box.max.y, box.max.z);

         this.setVertices(vertices);

         this.lineMode = LineMode3.LINES;
    }

    draw(parent: Node3, camera: Camera, lightManager: LightManager): void
    {
        if(!this.visible)
            return;

        // Switch to this shader
        this.gl.useProgram(UnlitMaterial.shader.getProgram());

        // Disable the texture in the shader
        this.gl.uniform1i(this.useTextureUniform, 0);
        this.gl.disableVertexAttribArray(this.texCoordAttribute);

        // Set the camera uniforms
        this.gl.uniformMatrix4fv(this.modelViewUniform, false, Matrix4.multiply(camera.viewMatrix, this.localToWorldMatrix).mat);
        this.gl.uniformMatrix4fv(this.projectionUniform, false, camera.projectionMatrix.mat);

        // Set the material property uniforms
        this.gl.uniform4f(this.colorUniform, this.color.r, this.color.g, this.color.b, this.color.a);

        // Set the vertex colors
        if(this.hasVertexColors)
        {
            this.gl.enableVertexAttribArray(this.colorAttribute);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
            this.gl.vertexAttribPointer(this.colorAttribute, 4, this.gl.FLOAT, false, 0, 0);
        }
        else
        {
            this.gl.disableVertexAttribArray(this.colorAttribute);
            this.gl.vertexAttrib4f(this.colorAttribute, 1, 1, 1, 1);
        } 

        // Set the vertex positions
        this.gl.enableVertexAttribArray(this.positionAttribute);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.vertexAttribPointer(this.positionAttribute, 3, this.gl.FLOAT, false, 0, 0);

        // Draw the lines
        this.gl.drawArrays(this.glLineMode(), 0, this.vertexCount);

        this.children.forEach((elem: Node3) => {
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

            this.boundingBox.computeBounds(vArray);
            this.boundingSphere.computeBounds(vArray, this.boundingBox);
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

            this.hasVertexColors = true;
        }
        else
        {
            this.hasVertexColors = false;
        }
    }

    getVertices(): number[]
    {
        const vertexArray = new Float32Array(this.vertexCount * 3);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.getBufferSubData(this.gl.ARRAY_BUFFER, 0, vertexArray);
        return [... vertexArray];
    }

    getColors(): number[]
    {
        const colorArray = new Float32Array(this.vertexCount * 4);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.getBufferSubData(this.gl.ARRAY_BUFFER, 0, colorArray);
        return [... colorArray];
    }

    public createDefaultVertexColors(): void
    {
        const colors: number[] = [];

        for(let i=0; i < this.vertexCount; i++)
            colors.push(1, 1, 1, 1);

        this.setColors(colors);
    }

    public glLineMode(): number
    {
        if(this.lineMode == LineMode3.LINES)
            return this.gl.LINES;
        else if(this.lineMode == LineMode3.LINE_STRIP)
            return this.gl.LINE_STRIP;
        else
            return this.gl.LINE_LOOP;  
    }
}