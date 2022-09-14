// @ts-ignore
import shapeVertexShader from '../shaders/shape.vert'
// @ts-ignore
import shapeFragmentShader from '../shaders/shape.frag'

import { GfxApp } from '../core/GfxApp';
import { ShaderProgram } from './ShaderProgram';
import { Shape } from '../geometry/2d/Shape';
import { Transform2 } from '../core/Transform2'
import { Color } from '../math/Color' 
import { Texture } from './Texture';

export class Material2
{
    public visible: boolean;
    public color: Color;
    public drawMode: number;
    public texture: Texture | null;

    private readonly gl: WebGL2RenderingContext;
    private static shader = new ShaderProgram(shapeVertexShader, shapeFragmentShader);

    private colorUniform: WebGLUniformLocation | null;
    private modelUniform: WebGLUniformLocation | null;
    private layerUniform: WebGLUniformLocation | null;

    private textureUniform: WebGLUniformLocation | null;
    private useTextureUniform: WebGLUniformLocation | null;

    private positionAttribute: number;
    private colorAttribute: number;
    private texCoordAttribute: number;

    constructor()
    {
        this.gl  = GfxApp.getInstance().renderer.gl;

        this.visible = true;
        this.color = new Color(1, 1, 1);
        this.drawMode = this.gl.LINE_LOOP;
        this.texture = null;
        
        Material2.shader.initialize(this.gl);

        this.colorUniform = Material2.shader.getUniform(this.gl, 'color');
        this.modelUniform = Material2.shader.getUniform(this.gl, 'modelMatrix');
        this.layerUniform = Material2.shader.getUniform(this.gl, 'layer');

        this.textureUniform = Material2.shader.getUniform(this.gl, 'textureImage');
        this.useTextureUniform = Material2.shader.getUniform(this.gl, 'useTexture');

        this.positionAttribute = Material2.shader.getAttribute(this.gl, 'position');
        this.colorAttribute = Material2.shader.getAttribute(this.gl, 'color');
        this.texCoordAttribute = Material2.shader.getAttribute(this.gl, 'texCoord');
    }

    copy(mat: Material2): void
    {
        this.visible = mat.visible;
        this.color.copy(mat.color);
        this.drawMode = mat.drawMode;
        this.texture = mat.texture;
    }

    draw(shape: Shape, transform: Transform2): void
    {
        if(!this.visible || shape.vertexCount == 0)
            return;

        // Switch to this shader
        this.gl.useProgram(Material2.shader.getProgram());

        // Set the model matrix uniform
        this.gl.uniformMatrix3fv(this.modelUniform, false, transform.worldMatrix.mat);

        // Set the material property uniforms
        this.gl.uniform4f(this.colorUniform, this.color.r, this.color.g, this.color.b, this.color.a);

        // Set the layer uniform
        this.gl.uniform1f(this.layerUniform, transform.layer);

        // Set the vertex colors
        this.gl.enableVertexAttribArray(this.colorAttribute);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, shape.colorBuffer);
        this.gl.vertexAttribPointer(this.colorAttribute, 4, this.gl.FLOAT, false, 0, 0);

        // Set the vertex positions
        this.gl.enableVertexAttribArray(this.positionAttribute);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, shape.positionBuffer);
        this.gl.vertexAttribPointer(this.positionAttribute, 2, this.gl.FLOAT, false, 0, 0);

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
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, shape.texCoordBuffer);
            this.gl.vertexAttribPointer(this.texCoordAttribute, 2, this.gl.FLOAT, false, 0, 0);
        }
        else
        {
            // Disable the texture in the shader
            this.gl.uniform1i(this.useTextureUniform, 0);
        }

        // Draw the shape
        this.gl.drawArrays(this.drawMode, 0, shape.vertexCount);
    }
}