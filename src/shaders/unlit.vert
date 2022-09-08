#version 300 es

precision mediump float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

in vec3 position;
in vec4 color;
in vec2 texCoord;

out vec4 vertColor;
out vec2 uv;

void main() 
{
    vertColor = color;
    uv = texCoord.xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1);
}