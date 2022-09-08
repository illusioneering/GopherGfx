#version 300 es

precision mediump float;

uniform mat3 modelMatrix;
uniform float layer;

in vec2 position;
in vec4 color;
in vec2 texCoord;

out vec4 vertColor;
out vec2 uv;

void main() 
{
    vertColor = color;
    uv = texCoord.xy; 
    vec3 worldPosition = modelMatrix * vec3(position, 1);
    gl_Position = vec4(worldPosition.x, worldPosition.y, layer, 1);
}