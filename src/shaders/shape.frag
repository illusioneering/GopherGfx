#version 300 es

precision mediump float;

uniform vec4 materialColor;
uniform int useTexture;
uniform sampler2D textureImage;

in vec4 vertColor;
in vec2 uv;

out vec4 fragColor;

void main() 
{
    fragColor = materialColor * vertColor;

    if(useTexture != 0)
    {
        fragColor *= texture(textureImage, uv);
    }
}