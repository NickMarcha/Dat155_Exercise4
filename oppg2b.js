"use strict";

/*
MODIFISERT FRA WebGL2.0/06/shadedCube
 */

// Må fylles ut TODO!


let program1;
let numVertices = 36;

let canvas;
let gl;

let projectionMatrix;
let modelViewMatrix;

let pointsArray = [];
let normalsArray = [];

let sphere;

let sphereNumVertices;
let program2;

let sphereVertices;
let sphereNormals;

let modelViewMatrixLoc_right;
let projectionMatrixLoc_right;
let normalMatrixLoc_right;

let modelViewMatrixLoc_left;
let projectionMatrixLoc_left;
let normalMatrixLoc_left;


let normalLoc_p2;
let positionLoc_p2;

let cylinder;
let cylinderVertices;
let cylinderNormals;
let cylinderNumVertices;

let nMatrix;

let nBuffer;
let normalLoc;
let vBuffer;
let positionLoc;

let lightX = 1.0;
let lightY = 1.0;
let lightZ = 1.0;

let lightPosition = vec4(lightX, lightY, lightZ, 1.0 );
let lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
let lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
let lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );


//TODO: Sett opp materialer for program1


let mat2AmbientColor = vec4( 0.19225, 0.19225, 0.19225, 1.0 );
let mat2DiffuseColor = vec4( 0.50754, 0.50754, 0.50754, 1.0);
let mat2specularColor = vec4( 0.508273, 0.508273, 0.508273, 1.0 );
let mat2shininess = 51.2;

let matBronzeAmbientColor = vec4( 0.2125, 0.1275, 0.054, 1.0 );
let matBronzeDiffuseColor = vec4( 0.714, 0.4284, 0.18144, 1.0);
let matBronzespecularColor = vec4( 0.393548, 0.271906, 0.166721, 1.0 );
let matBronzeshininess = 26.6;

let matGoldAmbientColor = vec4( 0.24725, 0.1995, 0.0745, 1.0 );
let matGoldDiffuseColor = vec4( 0.75164, 0.60648, 0.22648, 1.0);
let matGoldspecularColor = vec4( 0.6282281, 0.555802, 0.366065 , 1.0 );
let matGoldshininess = 51.2;

let matSilverAmbientColor = vec4( 0.19225, 0.19225, 0.19225, 1.0 );
let matSilverDiffuseColor = vec4( 0.50754, 0.50754, 0.50754, 1.0);
let matSilverspecularColor = vec4( 0.508273, 0.508273, 0.508273, 1.0 );
let matSilvershininess = 51.2;

let matPolishSilverAmbientColor = vec4( 0.23125, 0.23125, 0.23125, 1.0 );
let matPolishSilverDiffuseColor = vec4( 0.2775, 0.2775, 0.2775, 1.0);
let matPolishSilverspecularColor = vec4( 0.773911, 0.773911, 0.773911, 1.0 );
let matPolishSilvershininess = 89.6;

const leftSide = -1;
const rightSide = 1;

function updateLightX(value){
    lightX = parseInt(value);
}

function updateLightY(value){
    lightY = parseInt(value);
}

function updateLightZ(value){
    lightZ = parseInt(value);
}

var shadedCube = function() {



    var vertices = [
        vec4( -0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5, -0.5, -0.5, 1.0 ),
        vec4( -0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5, -0.5, -0.5, 1.0 )
    ];



    var ctm;
    var viewerPos;

    var xAxis = 0;
    var yAxis = 1;
    var zAxis = 2;
    var axis = 0;
    var theta = vec3(0, 0, 0);

    var thetaLoc;

    var flag = false;

    /////////////////////////////////
    sphere = new SphereData(5);
    sphere.scale(1.5, 1.5, 1.5);

    sphereVertices = sphere.TriangleVertices;
    sphereNormals = sphere.TriangleNormals;
    sphereNumVertices = sphereVertices.length;


    cylinder = new CylinderData(72,3, true);
    cylinder.scale(1.5,1.5,1.5);

    cylinderVertices = cylinder.TriangleVertices;
    cylinderNormals = cylinder.TriangleNormals;
    cylinderNumVertices = cylinderVertices.length;
    /////////////////////////////////

    function quad(a, b, c, d) {

        var t1 = subtract(vertices[b], vertices[a]);
        var t2 = subtract(vertices[c], vertices[b]);
        var normal = cross(t1, t2);
        normal = vec3(normal);


        pointsArray.push(vertices[a]);
        normalsArray.push(normal);
        pointsArray.push(vertices[b]);
        normalsArray.push(normal);
        pointsArray.push(vertices[c]);
        normalsArray.push(normal);
        pointsArray.push(vertices[a]);
        normalsArray.push(normal);
        pointsArray.push(vertices[c]);
        normalsArray.push(normal);
        pointsArray.push(vertices[d]);
        normalsArray.push(normal);
    }


    function colorCube()
    {
        quad( 1, 0, 3, 2 );
        quad( 2, 3, 7, 6 );
        quad( 3, 0, 4, 7 );
        quad( 6, 5, 1, 2 );
        quad( 4, 5, 6, 7 );
        quad( 5, 4, 0, 1 );
    }


    window.onload = function init() {
        canvas = document.getElementById( "gl-canvas" );

        gl = canvas.getContext('webgl2');
        if (!gl) { alert( "WebGL 2.0 isn't available" ); }


        gl.viewport( 0, 0, canvas.width, canvas.height );
        gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

        gl.enable(gl.DEPTH_TEST);

        //
        //  Load shaders and initialize attribute buffers
        //


        //TODO: Initialiser program1

        program1 = initShaders(gl,"./shaders/vshader1.glsl", "./shaders/fshader1.glsl")
        program2 = initShaders( gl, "./shaders/vshader2.glsl", "./shaders/fshader2.glsl" );

        projectionMatrix = ortho(-5, 5, -5, 5, -5,  5);



        colorCube();
        pointsArray = pointsArray.concat(sphereVertices);
        pointsArray = pointsArray.concat(cylinderVertices);
        normalsArray = normalsArray.concat(sphereNormals);
        normalsArray = normalsArray.concat(cylinderNormals);

        viewerPos = vec3(0.0, 0.0, -20.0 );




        document.getElementById("ButtonX").onclick = function(){axis = xAxis;};
        document.getElementById("ButtonY").onclick = function(){axis = yAxis;};
        document.getElementById("ButtonZ").onclick = function(){axis = zAxis;};
        document.getElementById("ButtonT").onclick = function(){flag = !flag;};
        ///////////////////////////////////////////////////
        ///////////////////////////////////////////////////


        settupBuffAndUniform(program2,matGoldAmbientColor,matGoldDiffuseColor,matGoldspecularColor,matGoldshininess, normalLoc_p2,positionLoc_p2);

        //TODO: Sett opp buffere og uniform-variabler for program1

        settupBuffAndUniform(program1,matBronzeAmbientColor,matBronzeDiffuseColor,matBronzespecularColor,matBronzeshininess,normalLoc,positionLoc);

        modelViewMatrixLoc_left = gl.getUniformLocation(program1, "modelViewMatrix");
        projectionMatrixLoc_left = gl.getUniformLocation(program1, "projectionMatrix");
        normalMatrixLoc_left = gl.getUniformLocation(program1, "normalMatrix");

        modelViewMatrixLoc_right = gl.getUniformLocation(program2, "modelViewMatrix");
        projectionMatrixLoc_right = gl.getUniformLocation(program2, "projectionMatrix");
        normalMatrixLoc_right = gl.getUniformLocation(program2, "normalMatrix");

        render();
    }

    function settupBuffAndUniform(program, matAmb,matDiff,matSpec,matShiny, nLoc,pLoc){
        var ambientProduct = mult(lightAmbient, matAmb);
        var diffuseProduct = mult(lightDiffuse, matDiff);
        var specularProduct = mult(lightSpecular, matSpec);


        gl.useProgram(program);

        nBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
        gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );


        nLoc = gl.getAttribLocation(program, "aNormal");
        gl.vertexAttribPointer(nLoc, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(nLoc);


        vBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

        pLoc = gl.getAttribLocation(program, "aPosition");
        gl.vertexAttribPointer(pLoc, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(pLoc);


        modelViewMatrixLoc_left = gl.getUniformLocation(program, "modelViewMatrix");
        projectionMatrixLoc_left = gl.getUniformLocation(program, "projectionMatrix");
        normalMatrixLoc_left = gl.getUniformLocation(program, "normalMatrix");


        gl.uniform4fv( gl.getUniformLocation(program,
            "ambientProduct"),flatten(ambientProduct) );
        gl.uniform4fv( gl.getUniformLocation(program,
            "diffuseProduct"),flatten(diffuseProduct) );
        gl.uniform4fv( gl.getUniformLocation(program,
            "specularProduct"),flatten(specularProduct) );
        gl.uniform4fv( gl.getUniformLocation(program,
            "lightPosition"),flatten(lightPosition) );
        gl.uniform1f( gl.getUniformLocation(program,
            "shininess"),matShiny );


        gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),
            false, flatten(projectionMatrix));
    }

    function drawCube(program, side){
        modelViewMatrix = mat4();
        modelViewMatrix = mult(modelViewMatrix, translate(side * 3.5, 0.0, 0.0));
        modelViewMatrix = mult(modelViewMatrix, scale(1.5,1.5,1.5));

        modelViewMatrix = mult(modelViewMatrix, rotate(theta[xAxis], vec3(1, 0, 0) ));
        modelViewMatrix = mult(modelViewMatrix, rotate(theta[yAxis], vec3(0, 1, 0) ));
        modelViewMatrix = mult(modelViewMatrix, rotate(theta[zAxis], vec3(0, 0, 1) ));

        gl.uniformMatrix4fv( gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelViewMatrix) );

        //Merk: Trenger ikke å oppdatere og sende normalMatrix for program1 - tenk over hvorfor ikke
        if(side === rightSide){
            nMatrix = normalMatrix(modelViewMatrix, true);
            gl.uniformMatrix4fv( projectionMatrixLoc_right, false, flatten(projectionMatrix));
            gl.uniformMatrix3fv(normalMatrixLoc_right, false, flatten(nMatrix))
        }

        gl.drawArrays( gl.TRIANGLES, 0, numVertices);
    }

    function drawSphere(program, side){
        modelViewMatrix = mat4();
        modelViewMatrix = mult(modelViewMatrix, translate(side * 2.0, 3.0, 0.0));
        modelViewMatrix = mult(modelViewMatrix, rotate(theta[xAxis], vec3(1, 0, 0) ));
        modelViewMatrix = mult(modelViewMatrix, rotate(theta[yAxis], vec3(0, 1, 0) ));
        modelViewMatrix = mult(modelViewMatrix, rotate(theta[zAxis], vec3(0, 0, 1) ));
        gl.uniformMatrix4fv( gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelViewMatrix) );

        if(side === rightSide){
            nMatrix = normalMatrix(modelViewMatrix, true);
            gl.uniformMatrix4fv( projectionMatrixLoc_right, false, flatten(projectionMatrix));
            gl.uniformMatrix3fv(normalMatrixLoc_right, false, flatten(nMatrix))
        }


        gl.drawArrays( gl.TRIANGLES, numVertices, sphereNumVertices);
    }

    function drawCylinder(program, side){
        modelViewMatrix = mat4();
        modelViewMatrix = mult(modelViewMatrix, translate(side * 2.0, -2.0, 0.0));
        modelViewMatrix = mult(modelViewMatrix, rotate(theta[xAxis], vec3(1, 0, 0) ));
        modelViewMatrix = mult(modelViewMatrix, rotate(theta[yAxis], vec3(0, 1, 0) ));
        modelViewMatrix = mult(modelViewMatrix, rotate(theta[zAxis], vec3(0, 0, 1) ));

        gl.uniformMatrix4fv( gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelViewMatrix) );

        if(side === rightSide){
            nMatrix = normalMatrix(modelViewMatrix, true);
            gl.uniformMatrix4fv( projectionMatrixLoc_right, false, flatten(projectionMatrix));
            gl.uniformMatrix3fv(normalMatrixLoc_right, false, flatten(nMatrix))
        }

        gl.drawArrays( gl.TRIANGLES, numVertices + sphereNumVertices, cylinderNumVertices);
    }

    var render = function(){

        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        if(flag) theta[axis] += 2.0;

        lightPosition = vec4(lightX, lightY, lightZ, 0.0 );


        //TODO: Tegn figurer ved å bruke program1 i tillegg

        //Program2
        gl.useProgram(program2);


        gl.uniform4fv( gl.getUniformLocation(program2,
            "lightPosition"),flatten(lightPosition) );

        //Program2: tegn sphere
        drawSphere(program2, rightSide)


        //Program2: tegn cube
        drawCube(program2, rightSide)

        //sphereProgram: tegn cylinder
        drawCylinder(program2, rightSide)


        //Program1
        gl.useProgram(program1);


        gl.uniform4fv( gl.getUniformLocation(program1,
            "lightPosition"),flatten(lightPosition) );

        //Program2: tegn sphere
        drawSphere(program1, leftSide)


        //Program2: tegn cube
        drawCube(program1, leftSide)

        //sphereProgram: tegn cylinder
        drawCylinder(program1, leftSide)

        requestAnimationFrame(render);
    }

}



shadedCube();


