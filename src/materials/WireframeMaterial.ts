// @ts-ignore
import wireframeVertexShader from '../shaders/wireframe.vert'
// @ts-ignore
import wireframeFragmentShader from '../shaders/wireframe.frag'

import { Material3 } from './Material3';
import { ShaderProgram } from './ShaderProgram';
import { Mesh3 } from '../geometry/3d/Mesh3';
import { Camera } from '../core/Camera';
import { Node3 } from '../core/Node3';
import { LightManager } from '../lights/LightManager';
import { Color } from '../math/Color';
import { Matrix4 } from '../math/Matrix4'


export class WireframeMaterial extends Material3
{
    public static shader = new ShaderProgram(wireframeVertexShader, wireframeFragmentShader);
    public static wireframeBuffers: Map<Mesh3, WebGLBuffer> = new Map();

    public color: Color;

    private positionAttribute: number;
    private modelViewUniform: WebGLUniformLocation | null;
    private projectionUniform: WebGLUniformLocation | null;
    private colorUniform: WebGLUniformLocation | null;

    constructor()
    {
        super();

        this.color = new Color(1, 1, 1, 1);

        WireframeMaterial.shader.initialize(this.gl);
        this.positionAttribute = WireframeMaterial.shader.getAttribute(this.gl, 'position');
        this.modelViewUniform = WireframeMaterial.shader.getUniform(this.gl, 'modelViewMatrix');
        this.projectionUniform = WireframeMaterial.shader.getUniform(this.gl, 'projectionMatrix');
        this.colorUniform = WireframeMaterial.shader.getUniform(this.gl, 'color');
    }

    draw(mesh: Mesh3, camera: Camera, lightManager: LightManager): void
    {
        if(!this.visible || mesh.triangleCount == 0)
            return;

        this.initialize();
            
        // Switch to this shader
        this.gl.useProgram(WireframeMaterial.shader.getProgram());

        // Set the uniform matrices
        this.gl.uniformMatrix4fv(this.modelViewUniform, false, Matrix4.multiply(camera.viewMatrix, mesh.localToWorldMatrix).mat);
        this.gl.uniformMatrix4fv(this.projectionUniform, false, camera.projectionMatrix.mat);
        this.gl.uniform4f(this.colorUniform, this.color.r, this.color.g, this.color.b, this.color.a);

        // // Set the vertex positions
        this.gl.enableVertexAttribArray(this.positionAttribute);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.positionBuffer);
        this.gl.vertexAttribPointer(this.positionAttribute, 3, this.gl.FLOAT, false, 0, 0);

        if(!WireframeMaterial.wireframeBuffers.get(mesh))
        {
            this.updateWireframeBuffer(mesh);
        }

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, WireframeMaterial.wireframeBuffers.get(mesh) as WebGLBuffer);
        this.gl.drawElements(this.gl.LINES, mesh.triangleCount * 6, this.gl.UNSIGNED_SHORT, 0);
    }

    public updateWireframeBuffer(mesh: Mesh3): void
    {
        let wireframeBuffer: WebGLBuffer | null | undefined;
        wireframeBuffer = WireframeMaterial.wireframeBuffers.get(mesh);

        if(!wireframeBuffer)
        {
            wireframeBuffer = this.gl.createBuffer();
            
            if(wireframeBuffer)
                WireframeMaterial.wireframeBuffers.set(mesh, wireframeBuffer);
        }

        const indexArray = new Uint16Array(mesh.triangleCount * 3);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
        this.gl.getBufferSubData(this.gl.ELEMENT_ARRAY_BUFFER, 0, indexArray);
        const indices = [... indexArray];

        const wireframeIndices: number[] = [];
        for(let i=0; i < mesh.triangleCount; i++)
        {
            wireframeIndices.push(indices[i*3]);
            wireframeIndices.push(indices[i*3+1]);

            wireframeIndices.push(indices[i*3+1]);
            wireframeIndices.push(indices[i*3+2]);

            wireframeIndices.push(indices[i*3+2]);
            wireframeIndices.push(indices[i*3]);
        }

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, wireframeBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(wireframeIndices), this.gl.STATIC_DRAW);
    }

    setColor(color: Color): void
    {
        this.color.copy(color);
    }

    getColor(): Color
    {
        return this.color;
    }
}