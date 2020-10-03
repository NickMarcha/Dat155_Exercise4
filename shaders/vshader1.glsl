#version 300 es

in vec4 aPosition;
in vec3 aNormal;
//in vec4 aColor;
out vec4 vColor;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform vec4 farge;

uniform vec4 ambientProduct, diffuseProduct, specularProduct;
uniform vec4 lightPosition;
uniform float shininess;

void main() {

    vec3 pos = -(modelViewMatrix * aPosition).xyz;

    //fixed light postion

    vec3 light = lightPosition.xyz;
    //vec3 light = (modelViewMatrix * lightPosition).xyz
    vec3 L = normalize( light - pos );


    vec3 E = normalize( -pos );
    vec3 H = normalize( L + E );

    vec4 NN = vec4(aNormal,0);

    // Transform vertex normal into eye coordinates

    vec3 N = normalize( (modelViewMatrix*NN).xyz);

    // Compute terms in the illumination equation
    vec4 ambient = ambientProduct;

    float Kd = max( dot(L, N), 0.0 );
    vec4  diffuse = Kd*diffuseProduct;

    float Ks = pow( max(dot(N, H), 0.0), shininess );
    vec4  specular = Ks * specularProduct;

    if( dot(L, N) < 0.0 ) {
        specular = vec4(0.0, 0.0, 0.0, 1.0);
    }

    gl_Position = projectionMatrix * modelViewMatrix *aPosition;
    vColor = ambient + diffuse +specular;

    vColor.a = 1.0;
  }
