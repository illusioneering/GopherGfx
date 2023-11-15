#version 300 es

precision mediump float;

#define POINT_LIGHT 0
#define DIRECTIONAL_LIGHT 1

const int MAX_LIGHTS = 8;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 normalMatrix;
uniform vec3 eyePosition;

uniform int numLights;
uniform int lightTypes[MAX_LIGHTS];
uniform vec3 lightPositions[MAX_LIGHTS];
uniform vec3 ambientIntensities[MAX_LIGHTS];
uniform vec3 diffuseIntensities[MAX_LIGHTS];
uniform vec3 specularIntensities[MAX_LIGHTS];

uniform vec3 kAmbient;
uniform vec3 kDiffuse;
uniform vec3 kSpecular;
uniform float shininess;
uniform int blinn;

uniform float morphAlpha;

in vec3 position;
in vec3 normal;
in vec4 color;
in vec2 texCoord;
in vec3 morphTargetPosition;
in vec3 morphTargetNormal;

out vec4 vertColor;
out vec2 uv;

void main() 
{
    // Compute the final vertex position and normal
    vec3 worldPosition, worldNormal;
    if(morphAlpha > 0.0f)
    {
        worldPosition = mix(position, morphTargetPosition, morphAlpha);
        worldPosition = (modelMatrix * vec4(worldPosition, 1)).xyz;
        worldNormal = mix(normal, morphTargetNormal, morphAlpha);
        worldNormal = normalize((normalMatrix * vec4(worldNormal, 0)).xyz);

    }
    else
    {
        worldPosition = (modelMatrix * vec4(position, 1)).xyz;
        worldNormal = normalize((normalMatrix * vec4(normal, 0)).xyz);
    }

    vec3 illumination = vec3(0, 0, 0);
    for(int i=0; i < numLights; i++)
    {
        // Ambient component
        illumination += kAmbient * ambientIntensities[i];

        // Compute the vector from the vertex position to the light
        vec3 l;
        if(lightTypes[i] == DIRECTIONAL_LIGHT)
            l = normalize(lightPositions[i]);
        else
            l = normalize(lightPositions[i] - worldPosition);

        // Diffuse component
        float diffuseComponent = max(dot(worldNormal, l), 0.0);
        illumination += diffuseComponent * kDiffuse * diffuseIntensities[i];

        // Compute the vector from the vertex to the eye
        vec3 e = normalize(eyePosition - worldPosition);

        // Blinn-Phong reflection model
        if(blinn != 0)
        {
            // Compute the halfway vector
            vec3 h = normalize(l + e);

            // Specular component
            float specularComponent = pow(max(dot(h, worldNormal), 0.0), shininess);
            illumination += specularComponent * kSpecular * specularIntensities[i];
        }
        else
        {
            // Compute the light vector reflected about the normal
            vec3 r = reflect(-l, worldNormal);

            // Specular component
            float specularComponent = pow(max(dot(e, r), 0.0), shininess);
            illumination += specularComponent * kSpecular * specularIntensities[i];
        }
    }

    vertColor = color;
    vertColor.rgb *= illumination;

    uv = texCoord.xy; 

    gl_Position = projectionMatrix * viewMatrix * vec4(worldPosition, 1);
}