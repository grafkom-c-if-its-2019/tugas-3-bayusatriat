(function() {

  glUtils.SL.init({ callback: function() { main(); } });

  function main() {
    
    var canvas = document.getElementById("glcanvas");
    var gl = glUtils.checkWebGL(canvas);

    var vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex);
    var fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);
    var program = glUtils.createProgram(gl, vertexShader, fragmentShader);

    gl.useProgram(program);

	var lines1 = new Float32Array(566);
	for (i = 0; i < 140; i++) {
		lines1[i * 2] = Math.sin(i / 180 * Math.PI) * 0.25 - 0.45;
		lines1[i * 2 + 1] = Math.cos(i / 180 * Math.PI) * 0.3 + 0.225;
	}
	for (i = 0; i < 140; i++) {
		lines1[i * 2 + 280] = Math.sin((i + 40) / 180 * Math.PI) * 0.25 - 0.45;
		lines1[i * 2 + 281] = Math.cos((i + 40) / 180 * Math.PI) * 0.3 - 0.225;
	}
	lines1[560] = -0.45; lines1[561] = -0.525;
	lines1[562] = -0.55; lines1[563] = -0.525;
	lines1[564] = -0.55; lines1[565] = 0.525;
	
	var lines2 = new Float32Array(362);
	for (i = 0; i < 181; i++) {
		lines2[i * 2] = Math.sin(i / 180 * Math.PI) * 0.15 - 0.45;
		lines2[i * 2 + 1] = Math.cos(i / 180 * Math.PI) * 0.15 + 0.225;
	}
	
	var lines3 = new Float32Array(362);
	for (i = 0; i < 181; i++) {
		lines3[i * 2] = Math.sin(i / 180 * Math.PI) * 0.15 - 0.45;
		lines3[i * 2 + 1] = Math.cos(i / 180 * Math.PI) * 0.15 - 0.225;
	}

    var triangles1 = new Float32Array([
	0.3, -0.525,
	0.3, 0.525,
	0.2, 0.525,
	0.2, -0.525]);

	var triangles2 = new Float32Array(724);
	for (i = 0; i < 181; i++) {
		triangles2[i * 4] = Math.sin(i / 180 * Math.PI) * 0.25 + 0.3;
		triangles2[i * 4 + 1] = Math.cos(i / 180 * Math.PI) * 0.3 + 0.225;
		triangles2[i * 4 + 2] = Math.sin(i / 180 * Math.PI) * 0.15 + 0.3;
		triangles2[i * 4 + 3] = Math.cos(i / 180 * Math.PI) * 0.15 + 0.225;
	}
	  
	var triangles3 = new Float32Array(724);
	for (i = 0; i < 181; i++) {
		triangles3[i * 4] = Math.sin(i / 180 * Math.PI) * 0.25 + 0.3;
		triangles3[i * 4 + 1] = Math.cos(i / 180 * Math.PI) * 0.3 - 0.225;
		triangles3[i * 4 + 2] = Math.sin(i / 180 * Math.PI) * 0.15 + 0.3;
		triangles3[i * 4 + 3] = Math.cos(i / 180 * Math.PI) * 0.15 - 0.225;
	}

    // Link antara CPU Memory dengan GPU Memory
    var triangleVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, triangles1, gl.STATIC_DRAW);

    // Link untuk attribute
    var vPosition = gl.getAttribLocation(program, 'vPosition');
    gl.vertexAttribPointer(
      vPosition,	// variabel yang memegang posisi attribute di shader
      2,			// jumlah elemen per atribut
      gl.FLOAT,		// tipe data atribut
      gl.FALSE,
      0,			// ukuran byte tiap vertex
      0				// offset dari posisi elemen di array
    );
    gl.enableVertexAttribArray(vPosition);

	var translation = gl.getUniformLocation(program, 'translation');
    var translationVector = [0.0, 0.0, 0.0];
    gl.uniform3fv(translation, translationVector);

    var thetaLocation = gl.getUniformLocation(program, 'theta');
    var theta = 0.0;

    var scaleXLocation = gl.getUniformLocation(program, 'scaleX');
    var scaleYLocation = gl.getUniformLocation(program, 'scaleY');
    var scaleX = 1.0;
    var scaleY = 1.0;
    var melebar = 1;
	
	var theta_temp;
	var scaleX_temp;
	var scaleY_temp;

    function render() {
      // Bersihkan layar jadi hitam
      gl.clearColor(0.56, 0.67, 0.86, 1.0);
  
      // Bersihkan buffernya canvas
      gl.clear(gl.COLOR_BUFFER_BIT);

	  scaleX_temp = scaleX;
	  theta_temp = theta;

      theta += 0.0101;
	 
      if (scaleX >= 1) melebar = -1;
      else if (scaleX <= -1) melebar = 1;
      scaleX += 0.0101 * melebar;

	drawA(gl.LINE_LOOP, lines1, 1);
	drawA(gl.LINE_LOOP, lines2, 1);
	drawA(gl.LINE_LOOP, lines3, 1);
    drawA(gl.TRIANGLE_FAN, triangles1, 2);
	drawA(gl.TRIANGLE_FAN, triangles2, 2);
	drawA(gl.TRIANGLE_FAN, triangles3, 2);
    requestAnimationFrame(render);
    }
	render();
	
	function drawA(type, vertices, cek) {
    var n = vertices.length / 2;
	
	if (cek == 2) {
		gl.uniform1f(thetaLocation, 0.0);
		gl.uniform1f(scaleXLocation, scaleX_temp);
		gl.uniform1f(scaleYLocation, scaleY);
	}
	else {
		gl.uniform1f(thetaLocation, theta_temp);
		gl.uniform1f(scaleXLocation, 1.0);
		gl.uniform1f(scaleYLocation, scaleY);
	}
	
	var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var aPosition = gl.getAttribLocation(program, 'aPosition');
    if (aPosition < 0) {
      console.log('Failed to get the storage location of aPosition');
      return -1;
    }

    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);
    if (n < 0) {
      console.log('Failed to set the positions of the vertices');
      return;
    }
    gl.drawArrays(type, 0, n);
  }
  }
})();
