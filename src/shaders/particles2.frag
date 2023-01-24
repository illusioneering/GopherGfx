#version 300 es

precision mediump float;

uniform vec4 materialColor;
uniform int useTexture;
uniform sampler2D textureImage;

in vec4 color;
in vec2 uv;

out vec4 fragColor;

void main() 
{
    fragColor = materialColor * color;

    if(useTexture != 0)
    {
        fragColor *= texture(textureImage, uv);
    }
}