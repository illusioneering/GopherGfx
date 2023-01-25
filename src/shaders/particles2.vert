#version 300 es

precision mediump float;

uniform mat3 modelMatrix;
uniform float layer;

in vec2 particlePosition;
in float particleSize;

in vec2 vertPosition;
in vec4 vertColor;
in vec2 texCoord;

out vec4 color;
out vec2 uv;

void main() 
{
    color = vertColor;
    uv = texCoord.xy; 
    vec3 worldPosition = modelMatrix * vec3(particlePosition + (vertPosition * particleSize), 1);
    gl_Position = vec4(worldPosition.x, worldPosition.y, layer, 1);
}