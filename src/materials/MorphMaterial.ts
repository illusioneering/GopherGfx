// @ts-ignore
import morphVertexShader from '../shaders/morph.vert'
// @ts-ignore
import morphFragmentShader from '../shaders/morph.frag'

import { Material3 } from './Material3';
import { ShaderProgram } from './ShaderProgram';
import { MorphMesh3 } from '../geometry/3d/MorphMesh3';
import { Mesh3 } from '../geometry/3d/Mesh3';
import { Camera } from '../core/Camera';
import { LightManager } from '../lights/LightManager';
import { Texture } from './Texture';
import { Vector3 } from '../math/Vector3'
import { Color } from '../math/Color' 

export class MorphMaterial extends Material3
{
    public static shader = new ShaderProgram(morphVertexShader, morphFragmentShader);
    private static wireframeBuffers: Map<Mesh3, WebGLBuffer> = new Map();

    public texture: Texture | null;
    public ambientColor: Color;
    public diffuseColor: Color;
    public specularColor: Color;
    public shininess: number;
    public blinn: boolean;

    private kAmbientUniform: WebGLUniformLocation | null;
    private kDiffuseUniform: WebGLUniformLocation | null;
    private kSpecularUniform: WebGLUniformLocation | null;
    private shininessUniform: WebGLUniformLocation | null;
    private blinnUniform: WebGLUniformLocation | null;
    
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

    private morphAlphaUniform: WebGLUniformLocation | null;
    private morphTargetPositionAttribute: number;
    private morphTargetNormalAttribute: number;

    public wireframe: boolean;

    constructor()
    {
        super();

        this.texture = null;
        this.ambientColor = new Color(1, 1, 1);
        this.diffuseColor = new Color(1, 1, 1);
        this.specularColor = new Color(0, 0, 0);
        this.shininess = 30;
        this.blinn = false;

        MorphMaterial.shader.initialize(this.gl);

        this.kAmbientUniform = MorphMaterial.shader.getUniform(this.gl, 'kAmbient');
        this.kDiffuseUniform = MorphMaterial.shader.getUniform(this.gl, 'kDiffuse');
        this.kSpecularUniform = MorphMaterial.shader.getUniform(this.gl, 'kSpecular');
        this.shininessUniform = MorphMaterial.shader.getUniform(this.gl, 'shininess');
        this.blinnUniform = MorphMaterial.shader.getUniform(this.gl, 'blinn');

        this.textureUniform = MorphMaterial.shader.getUniform(this.gl, 'textureImage');
        this.useTextureUniform = MorphMaterial.shader.getUniform(this.gl, 'useTexture');

        this.eyePositionUniform = MorphMaterial.shader.getUniform(this.gl, 'eyePosition');
        this.viewUniform = MorphMaterial.shader.getUniform(this.gl, 'viewMatrix');
        this.modelUniform = MorphMaterial.shader.getUniform(this.gl, 'modelMatrix');
        this.projectionUniform = MorphMaterial.shader.getUniform(this.gl, 'projectionMatrix');
        this.normalUniform = MorphMaterial.shader.getUniform(this.gl, 'normalMatrix');

        this.numLightsUniform = MorphMaterial.shader.getUniform(this.gl, 'numLights');
        this.lightTypesUniform = MorphMaterial.shader.getUniform(this.gl, 'lightTypes');
        this.lightPositionsUniform = MorphMaterial.shader.getUniform(this.gl, 'lightPositions');
        this.ambientIntensitiesUniform = MorphMaterial.shader.getUniform(this.gl, 'ambientIntensities');
        this.diffuseIntensitiesUniform = MorphMaterial.shader.getUniform(this.gl, 'diffuseIntensities');
        this.specularIntensitiesUniform = MorphMaterial.shader.getUniform(this.gl, 'specularIntensities');

        this.positionAttribute = MorphMaterial.shader.getAttribute(this.gl, 'position');
        this.normalAttribute = MorphMaterial.shader.getAttribute(this.gl, 'normal');
        this.colorAttribute = MorphMaterial.shader.getAttribute(this.gl, 'color');
        this.texCoordAttribute = MorphMaterial.shader.getAttribute(this.gl, 'texCoord');   

        this.morphAlphaUniform = MorphMaterial.shader.getUniform(this.gl, 'morphAlpha');
        this.morphTargetPositionAttribute = MorphMaterial.shader.getAttribute(this.gl, 'morphTargetPosition');
        this.morphTargetNormalAttribute = MorphMaterial.shader.getAttribute(this.gl, 'morphTargetNormal');   

        this.wireframe = false;
    }

    draw(mesh: Mesh3, camera: Camera, lightManager: LightManager): void
    {
        if(!(mesh instanceof MorphMesh3) || !this.visible || mesh.triangleCount == 0)
            return;

        // Initialize all the gl parameters for this shader
        this.initialize();

        // Switch to this shader
        this.gl.useProgram(MorphMaterial.shader.getProgram());

        // Set the camera uniforms
        const worldMatrix = mesh.localToWorldMatrix;
        const cameraPosition = new Vector3();
        cameraPosition.transformPoint(camera.localToWorldMatrix);
        this.gl.uniform3f(this.eyePositionUniform, cameraPosition.x, cameraPosition.y, cameraPosition.z);
        this.gl.uniformMatrix4fv(this.modelUniform, false, worldMatrix.mat);
        this.gl.uniformMatrix4fv(this.viewUniform, false, camera.viewMatrix.mat);
        this.gl.uniformMatrix4fv(this.projectionUniform, false, camera.projectionMatrix.mat);
        this.gl.uniformMatrix4fv(this.normalUniform, false, worldMatrix.inverse().transpose().mat);

        // Set the material property uniforms
        this.gl.uniform3f(this.kAmbientUniform, this.ambientColor.r, this.ambientColor.g, this.ambientColor.b);
        this.gl.uniform3f(this.kDiffuseUniform, this.diffuseColor.r, this.diffuseColor.g, this.diffuseColor.b);
        this.gl.uniform3f(this.kSpecularUniform,this.specularColor.r, this.specularColor.g, this.specularColor.b);
        this.gl.uniform1f(this.shininessUniform, this.shininess);
        this.gl.uniform1i(this.blinnUniform, Number(this.blinn));

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
        if(mesh.hasVertexColors)
        {
            this.gl.enableVertexAttribArray(this.colorAttribute);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.colorBuffer);
            this.gl.vertexAttribPointer(this.colorAttribute, 4, this.gl.FLOAT, false, 0, 0);
        }
        else
        {
            this.gl.disableVertexAttribArray(this.colorAttribute);
            this.gl.vertexAttrib4f(this.colorAttribute, 1, 1, 1, 1);
        }

        // Update the morph targets
        this.gl.uniform1f(this.morphAlphaUniform, mesh.morphAlpha);
        if(mesh.morphAlpha > 0)
        {
            // Set the morph target positions
            this.gl.enableVertexAttribArray(this.morphTargetPositionAttribute);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.morphTargetPositionBuffer);
            this.gl.vertexAttribPointer(this.morphTargetPositionAttribute, 3, this.gl.FLOAT, false, 0, 0);

            // Set the morph target normals
            this.gl.enableVertexAttribArray(this.morphTargetNormalAttribute);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.morphTargetNormalBuffer);
            this.gl.vertexAttribPointer(this.morphTargetNormalAttribute, 3, this.gl.FLOAT, false, 0, 0);
        }
        else
        {
            this.gl.disableVertexAttribArray(this.morphTargetPositionAttribute);
            this.gl.disableVertexAttribArray(this.morphTargetNormalAttribute);
        }

        if(this.wireframe)
        {
            // Disable the texture in the shader
            this.gl.uniform1i(this.useTextureUniform, 0);
            this.gl.disableVertexAttribArray(this.texCoordAttribute);

            if(!MorphMaterial.wireframeBuffers.get(mesh))
            {
                this.updateWireframeBuffer(mesh);
            }

            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, MorphMaterial.wireframeBuffers.get(mesh) as WebGLBuffer);
            this.gl.drawElements(this.gl.LINES, mesh.triangleCount * 6, this.gl.UNSIGNED_SHORT, 0);
        }
        else
        {
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
                this.gl.disableVertexAttribArray(this.texCoordAttribute);
            }

            // Draw the triangles
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
            this.gl.drawElements(this.gl.TRIANGLES, mesh.triangleCount*3, this.gl.UNSIGNED_SHORT, 0);
        }
    }

    public updateWireframeBuffer(mesh: Mesh3): void
    {
        let wireframeBuffer: WebGLBuffer | null | undefined;
        wireframeBuffer = MorphMaterial.wireframeBuffers.get(mesh);

        if(!wireframeBuffer)
        {
            wireframeBuffer = this.gl.createBuffer();
            
            if(wireframeBuffer)
                MorphMaterial.wireframeBuffers.set(mesh, wireframeBuffer);
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
        this.ambientColor.copy(color);
        this.diffuseColor.copy(color);
        this.specularColor.copy(color);
    }

    getColor(): Color
    {
        return this.diffuseColor;
    }
}