#version 300 es

in vec4 aPosition;
in vec4 aNormal;
out vec3 N, L, E;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform vec4 lightPosition;
uniform mat3 normalMatrix;

void main()
{
    vec3 pos = (modelViewMatrix *aPosition).xyz;

    // check for directional light

    if(lightPosition.w == 0.0) L = normalize(lightPosition.xyz);
    else L = normalize( lightPosition.xyz - pos );

    E =  -normalize(pos);
    N = normalize( normalMatrix*aNormal.xyz);

    gl_Position = projectionMatrix * modelViewMatrix * aPosition;

}