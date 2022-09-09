// @ts-ignore
import gouraudVertexShader from '../shaders/gouraud.vert'
// @ts-ignore
import gouraudFragmentShader from '../shaders/gouraud.frag'

import { Material3 } from './Material3';
import { ShaderProgram } from './ShaderProgram';
import { Mesh } from '../geometry/3d/Mesh';
import { Camera } from '../core/Camera';
import { Transform3 } from '../core/Transform3';
import { LightManager } from '../lights/LightManager';
import { Texture } from './Texture';
import { Vector3 } from '../math/Vector3'
import { Color } from '../math/Color' 

export class GouraudMaterial extends Material3
{
    public texture: Texture | null;
    public ambientColor: Color;
    public diffuseColor: Color;
    public specularColor: Color;
    public shininess: number;

    private static shader = new ShaderProgram(gouraudVertexShader, gouraudFragmentShader);

    private kAmbientUniform: WebGLUniformLocation | null;
    private kDiffuseUniform: WebGLUniformLocation | null;
    private kSpecularUniform: WebGLUniformLocation | null;
    private shininessUniform: WebGLUniformLocation | null;
    
    private textureUniform: WebGLUniformLocation | null;
    private useTextureUniform: WebGLUniformLocation | null;

    private eyePositionUniform: WebGLUniformLocation | null;
    private modelUniform: WebGLUniformLocation | null;
    private viewUniform: WebGLUniformLocation | null;
    private projectionUniform: WebGLUniformLocation | null;
    private normalUniform: WebGLUniformLocation | null;

    private numLightsUniform: WebGLUniformLocation | null;
    private lightTypesUniform: WebGLUniformLocation | null;
    private lightPositionsUniform: WebGLUniformLocation | null;
    private ambientIntensitiesUniform: WebGLUniformLocation | null;
    private diffuseIntensitiesUniform: WebGLUniformLocation | null;
    private specularIntensitiesUniform: WebGLUniformLocation | null;

    private positionAttribute: number;
    private normalAttribute: number;
    private colorAttribute: number;
    private texCoordAttribute: number;

    constructor()
    {
        super();

        this.texture = null;
        this.ambientColor = new Color(1, 1, 1);
        this.diffuseColor = new Color(1, 1, 1);
        this.specularColor = new Color(0, 0, 0);
        this.shininess = 30;

        GouraudMaterial.shader.initialize(this.gl);

        this.kAmbientUniform = GouraudMaterial.shader.getUniform(this.gl, 'kAmbient');
        this.kDiffuseUniform = GouraudMaterial.shader.getUniform(this.gl, 'kDiffuse');
        this.kSpecularUniform = GouraudMaterial.shader.getUniform(this.gl, 'kSpecular');
        this.shininessUniform = GouraudMaterial.shader.getUniform(this.gl, 'shininess');

        this.textureUniform = GouraudMaterial.shader.getUniform(this.gl, 'textureImage');
        this.useTextureUniform = GouraudMaterial.shader.getUniform(this.gl, 'useTexture');

        this.eyePositionUniform = GouraudMaterial.shader.getUniform(this.gl, 'eyePosition');
        this.viewUniform = GouraudMaterial.shader.getUniform(this.gl, 'viewMatrix');
        this.modelUniform = GouraudMaterial.shader.getUniform(this.gl, 'modelMatrix');
        this.projectionUniform = GouraudMaterial.shader.getUniform(this.gl, 'projectionMatrix');
        this.normalUniform = GouraudMaterial.shader.getUniform(this.gl, 'normalMatrix');

        this.numLightsUniform = GouraudMaterial.shader.getUniform(this.gl, 'numLights');
        this.lightTypesUniform = GouraudMaterial.shader.getUniform(this.gl, 'lightTypes');
        this.lightPositionsUniform = GouraudMaterial.shader.getUniform(this.gl, 'lightPositions');
        this.ambientIntensitiesUniform = GouraudMaterial.shader.getUniform(this.gl, 'ambientIntensities');
        this.diffuseIntensitiesUniform = GouraudMaterial.shader.getUniform(this.gl, 'diffuseIntensities');
        this.specularIntensitiesUniform = GouraudMaterial.shader.getUniform(this.gl, 'specularIntensities');

        this.positionAttribute = GouraudMaterial.shader.getAttribute(this.gl, 'position');
        this.normalAttribute = GouraudMaterial.shader.getAttribute(this.gl, 'normal');
        this.colorAttribute = GouraudMaterial.shader.getAttribute(this.gl, 'color');
        this.texCoordAttribute = GouraudMaterial.shader.getAttribute(this.gl, 'texCoord');   
    }

    draw(mesh: Mesh, transform: Transform3, camera: Camera, lightManager: LightManager): void
    {
        if(!this.visible || mesh.triangleCount == 0)
            return;

        this.initialize();

        // Switch to this shader
        this.gl.useProgram(GouraudMaterial.shader.getProgram());

        // Set the camera uniforms
        const cameraPosition = new Vector3();
        cameraPosition.applyMatrix(camera.worldMatrix);
        this.gl.uniform3f(this.eyePositionUniform, cameraPosition.x, cameraPosition.y, cameraPosition.z);
        this.gl.uniformMatrix4fv(this.modelUniform, false, transform.worldMatrix.mat);
        this.gl.uniformMatrix4fv(this.viewUniform, false, camera.viewMatrix.mat);
        this.gl.uniformMatrix4fv(this.projectionUniform, false, camera.projectionMatrix.mat);
        this.gl.uniformMatrix4fv(this.normalUniform, false, transform.worldMatrix.inverse().transpose().mat);

        // Set the material property uniforms
        this.gl.uniform3f(this.kAmbientUniform, this.ambientColor.r, this.ambientColor.g, this.ambientColor.b);
        this.gl.uniform3f(this.kDiffuseUniform, this.diffuseColor.r, this.diffuseColor.g, this.diffuseColor.b);
        this.gl.uniform3f(this.kSpecularUniform,this.specularColor.r, this.specularColor.g, this.specularColor.b);
        this.gl.uniform1f(this.shininessUniform, this.shininess);

        // Set the light uniforms
        this.gl.uniform1i(this.numLightsUniform, lightManager.getNumLights());
        this.gl.uniform1iv(this.lightTypesUniform, lightManager.lightTypes);
        this.gl.uniform3fv(this.lightPositionsUniform, lightManager.lightPositions);
        this.gl.uniform3fv(this.ambientIntensitiesUniform, lightManager.ambientIntensities);
        this.gl.uniform3fv(this.diffuseIntensitiesUniform, lightManager.diffuseIntensities);
        this.gl.uniform3fv(this.specularIntensitiesUniform, lightManager.specularIntensities);

        // Set the vertex positions
        this.gl.enableVertexAttribArray(this.positionAttribute);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.positionBuffer);
        this.gl.vertexAttribPointer(this.positionAttribute, 3, this.gl.FLOAT, false, 0, 0);

        // Set the vertex normals
        this.gl.enableVertexAttribArray(this.normalAttribute);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.normalBuffer);
        this.gl.vertexAttribPointer(this.normalAttribute, 3, this.gl.FLOAT, false, 0, 0);

        // Set the vertex colors
        this.gl.enableVertexAttribArray(this.colorAttribute);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.colorBuffer);
        this.gl.vertexAttribPointer(this.colorAttribute, 4, this.gl.FLOAT, false, 0, 0);

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