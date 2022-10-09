#version 300 es

precision mediump float;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 normalMatrix;

in vec3 position;
in vec3 normal;
in vec4 color;
in vec2 texCoord;

out vec3 vertPosition;
out vec3 vertNormal;
out vec4 vertColor;
out vec2 uv;

void main() 
{
    // Compute the final vertex position and normal
    vertPosition = (modelMatrix * vec4(position, 1)).xyz;
    vertNormal = normalize((normalMatrix * vec4(normal, 0)).xyz);
    vertColor = color;
    uv = texCoord.xy; 
    gl_Position = projectionMatrix * viewMatrix * vec4(vertPosition, 1);
}