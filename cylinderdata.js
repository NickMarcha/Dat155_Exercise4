
"use strict";

let cylinderSelf;

class CylinderData{

    constructor(numSlices, numStacks, caps){

        var slices = 36;
        if(numSlices) slices = numSlices;
        var stacks = 1;
        if(numStacks) stacks = numStacks;
        var capsFlag = true;
        if(caps==false) capsFlag = caps;

        cylinderSelf = this;


        cylinderSelf.data = {};

        cylinderSelf.top = 0.5;
        cylinderSelf.bottom = -0.5;
        cylinderSelf.radius = 0.5;
        cylinderSelf.topCenter = [0.0, cylinderSelf.top, 0.0];
        cylinderSelf.bottomCenter = [0.0, cylinderSelf.bottom, 0.0];


        cylinderSelf.sideColor = [1.0, 0.0, 0.0, 1.0];
        cylinderSelf.topColor = [0.0, 1.0, 0.0, 1.0];
        cylinderSelf.bottomColor = [0.0, 0.0, 1.0, 1.0];


        cylinderSelf.cylinderVertexCoordinates = [];
        cylinderSelf.cylinderNormals = [];
        cylinderSelf.cylinderVertexColors = [];
        cylinderSelf.cylinderTextureCoordinates = [];

        // side

        for(let j=0; j<stacks; j++) {
            var stop = cylinderSelf.bottom + (j+1)*(cylinderSelf.top-cylinderSelf.bottom)/stacks;
            var sbottom = cylinderSelf.bottom + j*(cylinderSelf.top-cylinderSelf.bottom)/stacks;
            var topPoints = [];
            var bottomPoints = [];
            var topST = [];
            var bottomST = [];
            for(var i =0; i<slices; i++) {
                var theta = 2.0*i*Math.PI/slices;
                topPoints.push([cylinderSelf.radius*Math.sin(theta), stop, cylinderSelf.radius*Math.cos(theta), 1.0]);
                bottomPoints.push([cylinderSelf.radius*Math.sin(theta), sbottom, cylinderSelf.radius*Math.cos(theta), 1.0]);
            };

            topPoints.push([0.0, stop, cylinderSelf.radius, 1.0]);
            bottomPoints.push([0.0,  sbottom, cylinderSelf.radius, 1.0]);


            for(let i=0; i<slices; i++) {
                var a = topPoints[i];
                var d = topPoints[i+1];
                var b = bottomPoints[i];
                var c = bottomPoints[i+1];
                var u = [b[0]-a[0], b[1]-a[1], b[2]-a[2]];
                var v = [c[0]-b[0], c[1]-b[1], c[2]-b[2]];

                var normal = [
                    u[1]*v[2] - u[2]*v[1],
                    u[2]*v[0] - u[0]*v[2],
                    u[0]*v[1] - u[1]*v[0]
                ];

                var mag = Math.sqrt(normal[0]*normal[0] + normal[1]*normal[1] + normal[2]*normal[2])
                normal = [normal[0]/mag, normal[1]/mag, normal[2]/mag];
                cylinderSelf.cylinderVertexCoordinates.push([a[0], a[1], a[2], 1.0]);
                cylinderSelf.cylinderVertexColors.push(cylinderSelf.sideColor);
                cylinderSelf.cylinderNormals.push([normal[0], normal[1], normal[2]]);
                cylinderSelf.cylinderTextureCoordinates.push([(i+1)/slices, j*(cylinderSelf.top-cylinderSelf.bottom)/stacks]);

                cylinderSelf.cylinderVertexCoordinates.push([b[0], b[1], b[2], 1.0]);
                cylinderSelf.cylinderVertexColors.push(cylinderSelf.sideColor);
                cylinderSelf.cylinderNormals.push([normal[0], normal[1], normal[2]]);
                cylinderSelf.cylinderTextureCoordinates.push([i/slices, (j-1)*(cylinderSelf.top-cylinderSelf.bottom)/stacks]);

                cylinderSelf.cylinderVertexCoordinates.push([c[0], c[1], c[2], 1.0]);
                cylinderSelf.cylinderVertexColors.push(cylinderSelf.sideColor);
                cylinderSelf.cylinderNormals.push([normal[0], normal[1], normal[2]]);
                cylinderSelf.cylinderTextureCoordinates.push([(i+1)/slices, (j-1)*(cylinderSelf.top-cylinderSelf.bottom)/stacks]);

                cylinderSelf.cylinderVertexCoordinates.push([a[0], a[1], a[2], 1.0]);
                cylinderSelf.cylinderVertexColors.push(cylinderSelf.sideColor);
                cylinderSelf.cylinderNormals.push([normal[0], normal[1], normal[2]]);
                cylinderSelf.cylinderTextureCoordinates.push([(i+1)/slices, j*(cylinderSelf.top-cylinderSelf.bottom)/stacks]);

                cylinderSelf.cylinderVertexCoordinates.push([c[0], c[1], c[2], 1.0]);
                cylinderSelf.cylinderVertexColors.push(cylinderSelf.sideColor);
                cylinderSelf.cylinderNormals.push([normal[0], normal[1], normal[2]]);
                cylinderSelf.cylinderTextureCoordinates.push([(i+1)/slices, (j-1)*(cylinderSelf.top-cylinderSelf.bottom)/stacks]);

                cylinderSelf.cylinderVertexCoordinates.push([d[0], d[1], d[2], 1.0]);
                cylinderSelf.cylinderVertexColors.push(cylinderSelf.sideColor);
                cylinderSelf.cylinderNormals.push([normal[0], normal[1], normal[2]]);
                cylinderSelf.cylinderTextureCoordinates.push([(i+1)/slices, j*(cylinderSelf.top-cylinderSelf.bottom)/stacks]);
            };
        };

        var topPoints = [];
        var bottomPoints = [];
        for(let i =0; i<slices; i++) {
            let theta = 2.0*i*Math.PI/slices;
            topPoints.push([cylinderSelf.radius*Math.sin(theta), cylinderSelf.top, cylinderSelf.radius*Math.cos(theta), 1.0]);
            bottomPoints.push([cylinderSelf.radius*Math.sin(theta), cylinderSelf.bottom, cylinderSelf.radius*Math.cos(theta), 1.0]);
        };
        topPoints.push([0.0, cylinderSelf.top, cylinderSelf.radius, 1.0]);
        bottomPoints.push([0.0,  cylinderSelf.bottom, cylinderSelf.radius, 1.0]);

        if(capsFlag) {

            //top

            for(let i=0; i<slices; i++) {
                normal = [0.0, 1.0, 0.0];
                var a = [0.0, cylinderSelf.top, 0.0, 1.0];
                var b = topPoints[i];
                var c = topPoints[i+1];
                cylinderSelf.cylinderVertexCoordinates.push([a[0], a[1], a[2], 1.0]);
                cylinderSelf.cylinderVertexColors.push(cylinderSelf.topColor);
                cylinderSelf.cylinderNormals.push(normal);
                cylinderSelf.cylinderTextureCoordinates.push([0, 1]);

                cylinderSelf.cylinderVertexCoordinates.push([b[0], b[1], b[2], 1.0]);
                cylinderSelf.cylinderVertexColors.push(cylinderSelf.topColor);
                cylinderSelf.cylinderNormals.push(normal);
                cylinderSelf.cylinderTextureCoordinates.push([0, 1]);

                cylinderSelf.cylinderVertexCoordinates.push([c[0], c[1], c[2], 1.0]);
                cylinderSelf.cylinderVertexColors.push(cylinderSelf.topColor);
                cylinderSelf.cylinderNormals.push(normal);
                cylinderSelf.cylinderTextureCoordinates.push([0, 1]);
            };

            //bottom

            for(let i=0; i<slices; i++) {
                normal = [0.0, -1.0, 0.0];
                var a = [0.0, cylinderSelf.bottom, 0.0, 1.0];
                var b = bottomPoints[i];
                var c = bottomPoints[i+1];
                cylinderSelf.cylinderVertexCoordinates.push([a[0], a[1], a[2], 1.0]);
                cylinderSelf.cylinderVertexColors.push(cylinderSelf.bottomColor);
                cylinderSelf.cylinderNormals.push(normal);
                cylinderSelf.cylinderTextureCoordinates.push([0, 1]);

                cylinderSelf.cylinderVertexCoordinates.push([b[0], b[1], b[2], 1.0]);
                cylinderSelf.cylinderVertexColors.push(cylinderSelf.bottomColor);
                cylinderSelf.cylinderNormals.push(normal);
                cylinderSelf.cylinderTextureCoordinates.push([0, 1]);

                cylinderSelf.cylinderVertexCoordinates.push([c[0], c[1], c[2], 1.0]);
                cylinderSelf.cylinderVertexColors.push(cylinderSelf.bottomColor);
                cylinderSelf.cylinderNormals.push(normal);
                cylinderSelf.cylinderTextureCoordinates.push([0, 1]);
            };

        };

        cylinderSelf.data.TriangleVertices = cylinderSelf.cylinderVertexCoordinates;
        cylinderSelf.data.TriangleNormals = cylinderSelf.cylinderNormals;
        cylinderSelf.data.TriangleVertexColors = cylinderSelf.cylinderVertexColors;
        cylinderSelf.data.TextureCoordinates = cylinderSelf.cylinderTextureCoordinates;
        cylinderSelf.data.rotate = this.rotate;
        cylinderSelf.data.translate = this.translate;
        cylinderSelf.data.scale = this.scale;
        return cylinderSelf.data;
    }










        translate(x, y, z){
            for(var i=0; i<cylinderSelf.cylinderVertexCoordinates.length; i++) {
                cylinderSelf.cylinderVertexCoordinates[i][0] += x;
                cylinderSelf.cylinderVertexCoordinates[i][1] += y;
                cylinderSelf.cylinderVertexCoordinates[i][2] += z;
            };
        }

        scale(sx, sy, sz){
            for(var i=0; i<cylinderSelf.cylinderVertexCoordinates.length; i++) {
                cylinderSelf.cylinderVertexCoordinates[i][0] *= sx;
                cylinderSelf.cylinderVertexCoordinates[i][1] *= sy;
                cylinderSelf.cylinderVertexCoordinates[i][2] *= sz;
                cylinderSelf.cylinderNormals[i][0] /= sx;
                cylinderSelf.cylinderNormals[i][1] /= sy;
                cylinderSelf.cylinderNormals[i][2] /= sz;
            };
        }

        radians( degrees ) {
            return degrees * Math.PI / 180.0;
        }

        rotate( angle, axis) {

            var d = Math.sqrt(axis[0]*axis[0] + axis[1]*axis[1] + axis[2]*axis[2]);

            var x = axis[0]/d;
            var y = axis[1]/d;
            var z = axis[2]/d;

            var c = Math.cos( radians(angle) );
            var omc = 1.0 - c;
            var s = Math.sin( radians(angle) );

            var mat = [
                [ x*x*omc + c,   x*y*omc - z*s, x*z*omc + y*s ],
                [ x*y*omc + z*s, y*y*omc + c,   y*z*omc - x*s ],
                [ x*z*omc - y*s, y*z*omc + x*s, z*z*omc + c ]
            ];

            for(var i=0; i<cylinderSelf.cylinderVertexCoordinates.length; i++) {
                var u = [0, 0, 0];
                var v = [0, 0, 0];
                for( var j =0; j<3; j++)
                    for( var k =0 ; k<3; k++) {
                        u[j] += mat[j][k]*cylinderSelf.cylinderVertexCoordinates[i][k];
                        v[j] += mat[j][k]*cylinderSelf.cylinderNormals[i][k];
                    };
                for( var j =0; j<3; j++) {
                    cylinderSelf.cylinderVertexCoordinates[i][j] = u[j];
                    cylinderSelf.cylinderNormals[i][j] = v[j];
                };
            };
        }




}