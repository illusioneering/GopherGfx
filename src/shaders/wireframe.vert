#version 300 es

precision mediump float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

in vec3 position;

void main() 
{
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1);
}