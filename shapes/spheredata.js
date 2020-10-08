
"use strict";

let self;

class SphereData{

    constructor(numSubdivisions){
        var subdivisions = 3;
        if(numSubdivisions) subdivisions = numSubdivisions;

        self = this;
        self.data = {};

        //var radius = 0.5;

        self.sphereVertexCoordinates = [];
        self.sphereVertexCoordinatesNormals = [];
        self.sphereVertexColors = [];
        self.sphereTextureCoordinates = [];
        self.sphereNormals = [];

        self.va = vec4(0.0, 0.0, -1.0,1);
        self.vb = vec4(0.0, 0.942809, 0.333333, 1);
        self.vc = vec4(-0.816497, -0.471405, 0.333333, 1);
        self.vd = vec4(0.816497, -0.471405, 0.333333,1);

        this.tetrahedron(this.va, this.vb, this.vc, this.vd, subdivisions);

        self.data.TriangleVertices = this.sphereVertexCoordinates;
        self.data.TriangleNormals = this.sphereNormals;
        self.data.TriangleVertexColors = this.sphereVertexColors;
        self.data.TextureCoordinates = this.sphereTextureCoordinates;
        self.data.rotate = this.rotate;
        self.data.translate = this.translate;
        self.data.scale = this.scale;
        return this.data;
    }





    triangle(a, b, c) {

        self.sphereVertexCoordinates.push([a[0],a[1], a[2], 1]);
        self.sphereVertexCoordinates.push([b[0],b[1], b[2], 1]);
        self.sphereVertexCoordinates.push([c[0],c[1], c[2], 1]);

        // normals are vectors

        self.sphereNormals.push([a[0],a[1], a[2]]);
        self.sphereNormals.push([b[0],b[1], b[2]]);
        self.sphereNormals.push([c[0],c[1], c[2]]);

        self.sphereVertexColors.push([(1+a[0])/2.0, (1+a[1])/2.0, (1+a[2])/2.0, 1.0]);
        self.sphereVertexColors.push([(1+b[0])/2.0, (1+b[1])/2.0, (1+b[2])/2.0, 1.0]);
        self.sphereVertexColors.push([(1+c[0])/2.0, (1+c[1])/2.0, (1+c[2])/2.0, 1.0]);

        self.sphereTextureCoordinates.push([0.5*Math.acos(a[0])/Math.PI, 0.5*Math.asin(a[1]/Math.sqrt(1.0-a[0]*a[0]))/Math.PI]);
        self.sphereTextureCoordinates.push([0.5*Math.acos(b[0])/Math.PI, 0.5*Math.asin(b[1]/Math.sqrt(1.0-b[0]*b[0]))/Math.PI]);
        self.sphereTextureCoordinates.push([0.5*Math.acos(c[0])/Math.PI, 0.5*Math.asin(c[1]/Math.sqrt(1.0-c[0]*c[0]))/Math.PI]);

        //sphereTextureCoordinates.push([0.5+Math.asin(a[0])/Math.PI, 0.5+Math.asin(a[1])/Math.PI]);
        //sphereTextureCoordinates.push([0.5+Math.asin(b[0])/Math.PI, 0.5+Math.asin(b[1])/Math.PI]);
        //sphereTextureCoordinates.push([0.5+Math.asin(c[0])/Math.PI, 0.5+Math.asin(c[1])/Math.PI]);

    }



    divideTriangle(a, b, c, count) {
        if ( count > 0 ) {

            var ab = mix( a, b, 0.5);
            var ac = mix( a, c, 0.5);
            var bc = mix( b, c, 0.5);

            ab = normalize(ab, true);
            ac = normalize(ac, true);
            bc = normalize(bc, true);

            self.divideTriangle( a, ab, ac, count - 1 );
            self.divideTriangle( ab, b, bc, count - 1 );
            self.divideTriangle( bc, c, ac, count - 1 );
            self.divideTriangle( ab, bc, ac, count - 1 );
        }
        else {
            self.triangle( a, b, c );
        }
    }


    tetrahedron(a, b, c, d, n) {
        self.divideTriangle(a, b, c, n);
        self.divideTriangle(d, c, b, n);
        self.divideTriangle(a, d, b, n);
        self.divideTriangle(a, c, d, n);
    }




    translate(x, y, z){
        for(var i=0; i<self.sphereVertexCoordinates.length; i++) {
            self.sphereVertexCoordinates[i][0] += x;
            self.sphereVertexCoordinates[i][1] += y;
            self.sphereVertexCoordinates[i][2] += z;
        };
    }

    scale(sx, sy, sz){
        for(var i=0; i<self.sphereVertexCoordinates.length; i++) {
            self.sphereVertexCoordinates[i][0] *= sx;
            self.sphereVertexCoordinates[i][1] *= sy;
            self.sphereVertexCoordinates[i][2] *= sz;
            self.sphereNormals[i][0] /= sx;
            self.sphereNormals[i][1] /= sy;
            self.sphereNormals[i][2] /= sz;
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

        for(var i=0; i<self.sphereVertexCoordinates.length; i++) {
            var u = [0, 0, 0];
            var v = [0, 0, 0];
            for( var j =0; j<3; j++)
                for( var k =0 ; k<3; k++) {
                    u[j] += mat[j][k]*self.sphereVertexCoordinates[i][k];
                    v[j] += mat[j][k]*self.sphereNormals[i][k];
                };
            for( var j =0; j<3; j++) {
                self.sphereVertexCoordinates[i][j] = u[j];
                self.sphereNormals[i][j] = v[j];
            };
        };
    }
    //for(var i =0; i<sphereVertexCoordinates.length; i++) console.log(sphereTextureCoordinates[i]);




}