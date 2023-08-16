// @ts-ignore
import particleVertexShader from '../../shaders/particles2.vert'
// @ts-ignore
import particleFragmentShader from '../../shaders/particles2.frag'

import { Mesh2 } from './Mesh2'
import { Node2 } from '../../core/Node2'
import { ShaderProgram } from '../../materials/ShaderProgram';
import { GfxApp } from '../../core/GfxApp';
import { Vector2 } from '../../math/Vector2';

/**
 * Represents a 2D particle system
 */
export class Particles2 extends Node2
{
    /**
     * The template shape used to render each particle.
     */
    public readonly baseParticle: Mesh2;

    /**
     * The number of particles to render.
     */
    public readonly numParticles: number;

    /**
     * Array containing positions for each particle instance.
     */
    public particlePositions: Vector2[];

    /**
     * Array containing sizes for each particle instance.
     */
    public particleSizes: number[];

    public static shader = new ShaderProgram(particleVertexShader, particleFragmentShader);

    private readonly gl: WebGL2RenderingContext;

    private colorUniform: WebGLUniformLocation | null;
    private modelUniform: WebGLUniformLocation | null;
    private layerUniform: WebGLUniformLocation | null;

    private textureUniform: WebGLUniformLocation | null;
    private useTextureUniform: WebGLUniformLocation | null;

    private particlePositionAttribute: number;
    private particleSizeAttribute: number;

    private vertPositionAttribute: number;
    private vertColorAttribute: number;
    private texCoordAttribute: number;

    private particlePositionBuffer: WebGLBuffer | null;
    private particleSizeBuffer: WebGLBuffer | null;

    /**
     * Create a new instance of a particle system.
     * 
     * @param baseParticle The template shape for each particle
     */
    constructor(baseParticle: Mesh2, numParticles: number)
    {
        super();

        this.gl  = GfxApp.getInstance().renderer.gl;

        this.baseParticle = baseParticle;
        this.numParticles = numParticles;

        this.particlePositions = [];
        this.particleSizes = [];

        for(let i=0; i < this.numParticles; i++)
        {
            this.particlePositions.push(new Vector2());
            this.particleSizes.push(1);
        }

        this.particlePositionBuffer = this.gl.createBuffer();
        this.particleSizeBuffer = this.gl.createBuffer();

        Particles2.shader.initialize(this.gl);

        this.colorUniform = Particles2.shader.getUniform(this.gl, 'materialColor');
        this.modelUniform = Particles2.shader.getUniform(this.gl, 'modelMatrix');
        this.layerUniform = Particles2.shader.getUniform(this.gl, 'layer');

        this.textureUniform = Particles2.shader.getUniform(this.gl, 'textureImage');
        this.useTextureUniform = Particles2.shader.getUniform(this.gl, 'useTexture');

        this.particlePositionAttribute = Particles2.shader.getAttribute(this.gl, 'particlePosition');
        this.particleSizeAttribute = Particles2.shader.getAttribute(this.gl, 'particleSize');

        this.vertPositionAttribute = Particles2.shader.getAttribute(this.gl, 'vertPosition');
        this.vertColorAttribute = Particles2.shader.getAttribute(this.gl, 'vertColor');
        this.texCoordAttribute = Particles2.shader.getAttribute(this.gl, 'texCoord');

        const particlePositionArray: number[] = [];
        for(let i=0; i < this.particlePositions.length; i++)
                particlePositionArray.push(this.particlePositions[i].x, this.particlePositions[i].y);
    
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.particlePositionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(particlePositionArray), this.gl.DYNAMIC_DRAW);
    
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.particleSizeBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.particleSizes), this.gl.DYNAMIC_DRAW);
    }

    /**
     * @returns The template shape used to render each particle.
     */
    getBaseParticle(): Mesh2
    {
        return this.baseParticle;
    }

    /**
     * Update the particle positions and/or sizes
     * 
     * @param updatePositions - Whether to update the particle positions (defaults to true)
     * @param updateSizes - Whether to update the particle sizes (defaults to false)
     */
    update(updatePositions = true, updateSizes = false): void
    {
        if(updatePositions)
        {
            const particlePositionArray: number[] = [];
            for(let i=0; i < this.particlePositions.length; i++)
                particlePositionArray.push(this.particlePositions[i].x, this.particlePositions[i].y);

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.particlePositionBuffer);
            this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, new Float32Array(particlePositionArray));
        }
        
        if(updateSizes)
        {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.particleSizeBuffer);
            this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, new Float32Array(this.particleSizes));
        }
    }

    /**
     * Draw the particle system
     */
    draw(): void
    {
        if(!this.visible)
            return;

         // Switch to this shader
         this.gl.useProgram(Particles2.shader.getProgram());

         // Set the model matrix uniform
         this.gl.uniformMatrix3fv(this.modelUniform, false, this.localToWorldMatrix.mat);
 
         // Set the material property uniforms
         this.gl.uniform4f(this.colorUniform, 
            this.baseParticle.material.color.r, 
            this.baseParticle.material.color.g, 
            this.baseParticle.material.color.b, 
            this.baseParticle.material.color.a);
 
         // Set the layer uniform
         this.gl.uniform1f(this.layerUniform, this.layer);

         // Set the particle positions
         this.gl.enableVertexAttribArray(this.particlePositionAttribute);
         this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.particlePositionBuffer);
         this.gl.vertexAttribPointer(this.particlePositionAttribute, 2, this.gl.FLOAT, false, 0, 0);
         this.gl.vertexAttribDivisor(this.particlePositionAttribute, 1);

         // Set the particle sizes
         this.gl.enableVertexAttribArray(this.particleSizeAttribute);
         this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.particleSizeBuffer);
         this.gl.vertexAttribPointer(this.particleSizeAttribute, 1, this.gl.FLOAT, false, 0, 0);
         this.gl.vertexAttribDivisor(this.particleSizeAttribute, 1);
 
         // Set the vertex colors
        if(this.baseParticle.hasVertexColors)
        {
            this.gl.enableVertexAttribArray(this.vertColorAttribute);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.baseParticle.colorBuffer);
            this.gl.vertexAttribPointer(this.vertColorAttribute, 4, this.gl.FLOAT, false, 0, 0);
        }
        else
        {
            this.gl.disableVertexAttribArray(this.vertColorAttribute);
            this.gl.vertexAttrib4f(this.vertColorAttribute, 1, 1, 1, 1);
        }

 
         // Set the vertex positions
         this.gl.enableVertexAttribArray(this.vertPositionAttribute);
         this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.baseParticle.positionBuffer);
         this.gl.vertexAttribPointer(this.vertPositionAttribute, 2, this.gl.FLOAT, false, 0, 0);
 
         if(this.baseParticle.material.texture)
         {
             // Activate the texture in the shader
             this.gl.uniform1i(this.useTextureUniform, 1);
 
             // Set the texture
             this.gl.activeTexture(this.gl.TEXTURE0 + this.baseParticle.material.texture.id)
             this.gl.bindTexture(this.gl.TEXTURE_2D, this.baseParticle.material.texture.texture);
             this.gl.uniform1i(this.textureUniform, this.baseParticle.material.texture.id);
 
             // Set the texture coordinates
             this.gl.enableVertexAttribArray(this.texCoordAttribute);
             this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.baseParticle.texCoordBuffer);
             this.gl.vertexAttribPointer(this.texCoordAttribute, 2, this.gl.FLOAT, false, 0, 0);
         }
         else
         {
             // Disable the texture in the shader
             this.gl.uniform1i(this.useTextureUniform, 0);
             this.gl.disableVertexAttribArray(this.texCoordAttribute);
         }
 
        // Draw the shape
        this.gl.drawArraysInstanced(this.baseParticle.material.drawMode, 0, this.baseParticle.vertexCount, this.numParticles);

        // Reset the divisors so it doesn't break other shaders
        this.gl.vertexAttribDivisor(this.particlePositionAttribute, 0);
        this.gl.vertexAttribDivisor(this.particleSizeAttribute, 0);

        this.children.forEach((elem: Node2) => {
            elem.draw();
        });
    }
}