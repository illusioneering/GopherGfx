// @ts-ignore
import shapeVertexShader from '../shaders/material2.vert'
// @ts-ignore
import shapeFragmentShader from '../shaders/material2.frag'

import { GfxApp } from '../core/GfxApp';
import { ShaderProgram } from './ShaderProgram';
import { Mesh2 } from '../geometry/2d/Mesh2';
import { Color } from '../math/Color' 
import { Texture } from './Texture';

/**
 * Represents a Material for use in 2D graphics
 * @export
 * @class Material2
 */
export class Material2
{
    /**
     * Controls the visibility of the material (false = hidden)
     * 
     * @memberof Material2
     */
    public visible: boolean;

    /**
     * Controls the color of the material (defaults to white)
     * 
     * @memberof Material2
     */
    public color: Color;

    /**
     * Controls the draw mode of the material (one of gl.POINTS, gl.LINES,
     * gl.LINE_STRIP, gl.LINE_LOOP, gl.TRIANGLES, gl.TRIANGLE_STRIP,
     * gl.TRIANGLE_FAN)
     * 
     * @memberof Material2
     */
    public drawMode: number;

    /**
     * Controls the texture of the material. Can be null, meaning no texture.
     * 
     * @memberof Material2
     */
    public texture: Texture | null;

    private readonly gl: WebGL2RenderingContext;

    /**
     * Shaders to use for all materials
     * 
     * @constructor
     * @memberof Material2
     * @static
     */
    public static shader = new ShaderProgram(shapeVertexShader, shapeFragmentShader);

    private colorUniform: WebGLUniformLocation | null;
    private modelUniform: WebGLUniformLocation | null;
    private layerUniform: WebGLUniformLocation | null;

    private textureUniform: WebGLUniformLocation | null;
    private useTextureUniform: WebGLUniformLocation | null;

    private positionAttribute: number;
    private colorAttribute: number;
    private texCoordAttribute: number;

    /**
    * Constructs a new Material2, defaulting to a white textureless line loop
    */
    constructor()
    {
        this.gl  = GfxApp.getInstance().renderer.gl;

        this.visible = true;
        this.color = new Color(1, 1, 1);
        this.drawMode = this.gl.LINE_LOOP;
        this.texture = null;
        
        Material2.shader.initialize(this.gl);

        this.colorUniform = Material2.shader.getUniform(this.gl, 'materialColor');
        this.modelUniform = Material2.shader.getUniform(this.gl, 'modelMatrix');
        this.layerUniform = Material2.shader.getUniform(this.gl, 'layer');

        this.textureUniform = Material2.shader.getUniform(this.gl, 'textureImage');
        this.useTextureUniform = Material2.shader.getUniform(this.gl, 'useTexture');

        this.positionAttribute = Material2.shader.getAttribute(this.gl, 'position');
        this.colorAttribute = Material2.shader.getAttribute(this.gl, 'color');
        this.texCoordAttribute = Material2.shader.getAttribute(this.gl, 'texCoord');
    }

    /**
     * Copies an existing Material2 to this one
     * 
     * @param box - The Material2 to copy
     */
    copy(mat: Material2): void
    {
        this.visible = mat.visible;
        this.color.copy(mat.color);
        this.drawMode = mat.drawMode;
        this.texture = mat.texture;
    }

    /**
     * Draws a shape with this material and a given transform
     * 
     * @param shape - The shape to draw with this material
     * @param transform - The transform where the shape should be drawn
     */
    draw(mesh: Mesh2): void
    {
        if(!this.visible || mesh.vertexCount == 0)
            return;

        // Switch to this shader
        this.gl.useProgram(Material2.shader.getProgram());

        // Set the model matrix uniform
        this.gl.uniformMatrix3fv(this.modelUniform, false, mesh.localToWorldMatrix.mat);

        // Set the material property uniforms
        this.gl.uniform4f(this.colorUniform, this.color.r, this.color.g, this.color.b, this.color.a);

        // Set the layer uniform
        this.gl.uniform1f(this.layerUniform, mesh.layer);

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

        // Set the vertex positions
        this.gl.enableVertexAttribArray(this.positionAttribute);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.positionBuffer);
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
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.texCoordBuffer);
            this.gl.vertexAttribPointer(this.texCoordAttribute, 2, this.gl.FLOAT, false, 0, 0);
        }
        else
        {
            // Disable the texture in the shader
            this.gl.uniform1i(this.useTextureUniform, 0);
            this.gl.disableVertexAttribArray(this.texCoordAttribute);
        }

        // Draw the shape
        this.gl.drawArrays(this.drawMode, 0, mesh.vertexCount);
    }
}