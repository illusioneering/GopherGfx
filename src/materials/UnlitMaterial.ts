// @ts-ignore
import unlitVertexShader from '../shaders/unlit.vert'
// @ts-ignore
import unlitFragmentShader from '../shaders/unlit.frag'

import { Material3 } from './Material3';
import { ShaderProgram } from './ShaderProgram';
import { Mesh } from '../geometry/3d/Mesh';
import { Camera } from '../core/Camera';
import { Transform3 } from '../core/Transform3';
import { LightManager } from '../lights/LightManager';
import { Texture } from './Texture';
import { Color } from '../math/Color' 
import { Matrix4 } from '../math/Matrix4'

export class UnlitMaterial extends Material3
{
    public texture: Texture | null;
    public color: Color;

    private static shader = new ShaderProgram(unlitVertexShader, unlitFragmentShader);
    
    private colorUniform: WebGLUniformLocation | null;
    private textureUniform: WebGLUniformLocation | null;
    private useTextureUniform: WebGLUniformLocation | null;

    private modelViewUniform: WebGLUniformLocation | null;
    private projectionUniform: WebGLUniformLocation | null;

    private positionAttribute: number;
    private colorAttribute: number;
    private texCoordAttribute: number;

    constructor()
    {
        super();

        this.texture = null;
        this.color = new Color(1, 1, 1);

        UnlitMaterial.shader.initialize(this.gl);

        this.colorUniform = UnlitMaterial.shader.getUniform(this.gl, 'color');
        this.textureUniform = UnlitMaterial.shader.getUniform(this.gl, 'textureImage');
        this.useTextureUniform = UnlitMaterial.shader.getUniform(this.gl, 'useTexture');

        this.modelViewUniform = UnlitMaterial.shader.getUniform(this.gl, 'modelViewMatrix');
        this.projectionUniform = UnlitMaterial.shader.getUniform(this.gl, 'projectionMatrix');

        this.positionAttribute = UnlitMaterial.shader.getAttribute(this.gl, 'position');
        this.colorAttribute = UnlitMaterial.shader.getAttribute(this.gl, 'color');
        this.texCoordAttribute = UnlitMaterial.shader.getAttribute(this.gl, 'texCoord');   
    }

    draw(mesh: Mesh, transform: Transform3, camera: Camera, lightManager: LightManager): void
    {
        if(!this.visible || mesh.triangleCount == 0)
            return;

        this.initialize();

        // Switch to this shader
        this.gl.useProgram(UnlitMaterial.shader.getProgram());

        // Set the camera uniforms
        this.gl.uniformMatrix4fv(this.modelViewUniform, false, Matrix4.multiply(transform.worldMatrix, camera.viewMatrix).mat);
        this.gl.uniformMatrix4fv(this.projectionUniform, false, camera.projectionMatrix.mat);

        // Set the material property uniforms
        this.gl.uniform4f(this.colorUniform, this.color.r, this.color.g, this.color.b, this.color.a);

        // Set the vertex colors
        this.gl.enableVertexAttribArray(this.colorAttribute);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.colorBuffer);
        this.gl.vertexAttribPointer(this.colorAttribute, 4, this.gl.FLOAT, false, 0, 0);

        // Set the vertex positions
        this.gl.enableVertexAttribArray(this.positionAttribute);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.positionBuffer);
        this.gl.vertexAttribPointer(this.positionAttribute, 3, this.gl.FLOAT, false, 0, 0);

        if(this.texture)
        {
            // Activate the texture in the shader
            this.gl.uniform1i(this.useTextureUniform, 1);

            // Set the texture
            this.gl.activeTexture(this.gl.TEXTURE0 + this.texture.id)
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture.texture);
            this.gl.uniform1i(this.textureUniform, this.texture.id);

            // Set the texture coordinates
            this.gl.enableVertexAttribArray(this.texCoordAttribute);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.texCoordBuffer);
            this.gl.vertexAttribPointer(this.texCoordAttribute, 2, this.gl.FLOAT, false, 0, 0);
        }
        else
        {
            // Disable the texture in the shader
            this.gl.uniform1i(this.useTextureUniform, 0);
        }

        // Draw the triangles
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
        this.gl.drawElements(this.gl.TRIANGLES, mesh.triangleCount*3, this.gl.UNSIGNED_SHORT, 0);
    }
}