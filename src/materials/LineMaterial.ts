import { GfxApp } from '../core/GfxApp';
import { Color } from '../math/Color' 
import { Line3 } from '../geometry/3d/Line3'
import { Line2 } from '../geometry/2d/Line2'
import { Camera } from '../core/Camera';
import { Matrix4 } from '../math/Matrix4'
import { UnlitMaterial } from './UnlitMaterial';
import { Material2 } from './Material2';

export class LineMaterial
{
    public visible: boolean;
    public color: Color;

    private colorUniform3d: WebGLUniformLocation | null;
    private useTextureUniform3d: WebGLUniformLocation | null;
    private textureUniform3d: WebGLUniformLocation | null;
    private modelViewUniform3d: WebGLUniformLocation | null;
    private projectionUniform3d: WebGLUniformLocation | null;
    private positionAttribute3d: number;
    private colorAttribute3d: number;
    private texCoordAttribute3d: number;

    private colorUniform2d: WebGLUniformLocation | null;
    private useTextureUniform2d: WebGLUniformLocation | null;
    private textureUniform2d: WebGLUniformLocation | null;
    private modelUniform2d: WebGLUniformLocation | null;
    private layerUniform2d: WebGLUniformLocation | null;
    private positionAttribute2d: number;
    private colorAttribute2d: number;
    private texCoordAttribute2d: number;

    protected readonly gl: WebGL2RenderingContext;

    constructor()
    {
        this.visible = true;
        this.color = new Color(1, 1, 1);

        this.gl  = GfxApp.getInstance().renderer.gl;

        UnlitMaterial.shader.initialize(this.gl);
        this.colorUniform3d = UnlitMaterial.shader.getUniform(this.gl, 'materialColor');
        this.modelViewUniform3d = UnlitMaterial.shader.getUniform(this.gl, 'modelViewMatrix');
        this.projectionUniform3d = UnlitMaterial.shader.getUniform(this.gl, 'projectionMatrix');
        this.useTextureUniform3d = UnlitMaterial.shader.getUniform(this.gl, 'useTexture');
        this.textureUniform3d = UnlitMaterial.shader.getUniform(this.gl, 'textureImage');
        this.positionAttribute3d = UnlitMaterial.shader.getAttribute(this.gl, 'position');
        this.colorAttribute3d = UnlitMaterial.shader.getAttribute(this.gl, 'color');
        this.texCoordAttribute3d = UnlitMaterial.shader.getAttribute(this.gl, 'texCoord');   
  
        Material2.shader.initialize(this.gl);
        this.colorUniform2d = Material2.shader.getUniform(this.gl, 'materialColor');
        this.modelUniform2d = Material2.shader.getUniform(this.gl, 'modelMatrix');
        this.layerUniform2d = Material2.shader.getUniform(this.gl, 'layer');
        this.useTextureUniform2d = Material2.shader.getUniform(this.gl, 'useTexture');
        this.textureUniform2d = Material2.shader.getUniform(this.gl, 'textureImage');
        this.positionAttribute2d = Material2.shader.getAttribute(this.gl, 'position');
        this.colorAttribute2d = Material2.shader.getAttribute(this.gl, 'color');
        this.texCoordAttribute2d = Material2.shader.getAttribute(this.gl, 'texCoord');
    }


    draw3d(line: Line3, camera: Camera): void
    {
        if(!this.visible || line.vertexCount < 2)
            return;

        // Switch to this shader
        this.gl.useProgram(UnlitMaterial.shader.getProgram());

        // Disable the texture in the shader
        this.gl.uniform1i(this.useTextureUniform3d, 0);
        this.gl.disableVertexAttribArray(this.texCoordAttribute3d);

        // Set the camera uniforms
        this.gl.uniformMatrix4fv(this.modelViewUniform3d, false, Matrix4.multiply(line.worldMatrix, camera.viewMatrix).mat);
        this.gl.uniformMatrix4fv(this.projectionUniform3d, false, camera.projectionMatrix.mat);

        // Set the material property uniforms
        this.gl.uniform4f(this.colorUniform3d, this.color.r, this.color.g, this.color.b, this.color.a);

        // Set the vertex colors
        this.gl.enableVertexAttribArray(this.colorAttribute3d);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, line.colorBuffer);
        this.gl.vertexAttribPointer(this.colorAttribute3d, 4, this.gl.FLOAT, false, 0, 0);

        // Set the vertex positions
        this.gl.enableVertexAttribArray(this.positionAttribute3d);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, line.positionBuffer);
        this.gl.vertexAttribPointer(this.positionAttribute3d, 3, this.gl.FLOAT, false, 0, 0);

        // Draw the lines
        this.gl.drawArrays(line.glLineMode(), 0, line.vertexCount)
    }

    draw2d(line: Line2): void
    {
        if(!this.visible || line.vertexCount < 2)
            return;

        // Switch to this shader
        this.gl.useProgram(Material2.shader.getProgram());

        // Disable the texture in the shader
        this.gl.uniform1i(this.useTextureUniform2d, 0);
        this.gl.disableVertexAttribArray(this.texCoordAttribute2d);

        // Set the model matrix uniform
        this.gl.uniformMatrix3fv(this.modelUniform2d, false, line.worldMatrix.mat);

        // Set the material property uniforms
        this.gl.uniform4f(this.colorUniform2d, this.color.r, this.color.g, this.color.b, this.color.a);

        // Set the layer uniform
        this.gl.uniform1f(this.layerUniform2d, line.layer);

        // Set the vertex colors
        this.gl.enableVertexAttribArray(this.colorAttribute2d);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, line.colorBuffer);
        this.gl.vertexAttribPointer(this.colorAttribute2d, 4, this.gl.FLOAT, false, 0, 0);

        // Set the vertex positions
        this.gl.enableVertexAttribArray(this.positionAttribute2d);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, line.positionBuffer);
        this.gl.vertexAttribPointer(this.positionAttribute2d, 2, this.gl.FLOAT, false, 0, 0);

        // Draw the lines
        this.gl.drawArrays(line.glLineMode(), 0, line.vertexCount)
    }
}