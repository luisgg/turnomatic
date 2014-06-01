// --------
// File:        turno.js
// Description: javascript code for the main window of 'turnomatic'
// Author:      Luis Antonio Garcia Gisbert <luisgg@gmail.com> 

// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation; either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License along 
// with this program; if not, write to the Free Software Foundation, Inc., 
// 51 Franklin St, Fifth Floor, Boston MA 02110-1301 USA
// --------

// --------
// The images of the digits for the turnomatic counter and related javascript code was introduced by
// Ray Hammond <ray.hammond77@gmail.com> to build a flip_clock as part of a serie of HTML5 canvas examples
// published in github (https://github.com/rheh/HTML5-canvas-projects/tree/master/)
// --------

// --------
// Most of the code to simulate the marquee was taken from the example posted
// by Ashwani Tyagi (http://www.c-sharpcorner.com/authors/18ddf7/ashwani-tyagi.aspx)
// in http://www.c-sharpcorner.com/UploadFile/18ddf7/how-to-get-marquee-feature-without-marquee-tag-in-html5/
// --------

// Global variable
var turn_face = null,
    turn_face_inv = null,
	turn_ctx = null;

var IMG_HEIGHT = 451,
	IMG_WIDTH = 1200,
	DIGIT_HEIGHT = IMG_HEIGHT,
	DIGIT_WIDTH = 263,
	xPositions = null,
	xSecondStartPos = 0,
	secondWidth = 0,
	secondHeight = 0;

var last_time = '0000';
var remote_win ;

var SC_YPOS = 60;
var SC_boxwidth = 1060;
var SC_X = SC_boxwidth;
var SC_xgap = 100;
var SC_scrollhandle = null;

var SC_MAX=9;
var SC_MIN=1;

function dokey(e) {
//	alert(e.keyCode);
	switch (e.keyCode) {
		case 107:
		case 187:
			inc_scroll();
			break;
		case 109:
		case 189:
			dec_scroll();
			break;
		case 171:
		case 13:
		case 39:
		case 40:
		case 34:
			inc_counter();
			break;
		case 173:
		case 37:
		case 38:
		case 33:
			dec_counter();
			break;
		case 27:
		case 8:
			set_counter();
			break;
		case 84:
			set_text();
			break;

	}
}

function inc_counter(){
	document.getElementById('counter').value++ ;
	document.getElementById('counter_force').value = document.getElementById('counter').value;
	return false;
}

function dec_counter(){
	document.getElementById('counter').value-- ;
	document.getElementById('counter_force').value = document.getElementById('counter').value;
	return false;
}

function set_counter() {
	var newcount = prompt("Valor del contador",document.getElementById('counter').value);
	if (newcount != null) {
		document.getElementById('counter_force').value = newcount;
		document.getElementById('counter').value = newcount;
	}
	return false;
}

function set_text() {
	var newtext = prompt("Texto Marquesina",document.getElementById('scrolltext').value);
	if (newtext != null) {
		document.getElementById('scrolltext').value = newtext ;
		document.getElementById('scroll_forcetext').value = newtext ;
	} 
	return false;
	
}

function inc_scroll() {
	sc_current = document.getElementById('scrollspeed').value ;
	if (sc_current < SC_MAX ) {
		sc_current++ ;
		document.getElementById('scrollspeed').value = sc_current ;
		update_scroll();
	}

}

function dec_scroll() {
	sc_current = document.getElementById('scrollspeed').value ;
	if (sc_current > SC_MIN ) {
		sc_current-- ;
		document.getElementById('scrollspeed').value = sc_current ;
		update_scroll();
	}

}

function update_scroll() {
	if (SC_scrollhandle) {
		clearInterval(SC_scrollhandle);
	}
	SC_scrollhandle = setInterval(function () { moveBanner() }, 95-10*document.getElementById('scrollspeed').value)
		
}


function clearCanvas() {
	 // clear canvas
	turn_ctx.clearRect(0, 0, IMG_HEIGHT, IMG_WIDTH);
}

function pad2(number) {
	return (number < 10 ? '0' : '') + number;
}

function pad4(number) {
	if (number<=9999) { number = ("000"+number).slice(-4); }
  	return number;
}

function draw() {
	
//	var currentTime = new Date(),
//		time = pad2(currentTime.getHours()) + pad2(currentTime.getMinutes()) + pad2(currentTime.getSeconds()),
//		iDigit;
	time = pad4(document.getElementById('counter').value);
	console.log(time);
	clearCanvas();
	
	if (time != last_time) {
		// Draw the HHHH digits onto the canvas
		for(iDigit = 0; iDigit < 4; iDigit++) {
			drawHHMMDigit_inv(last_time, iDigit);
		}
		last_time = time;
	} else {
		// Draw the HHHH digits onto the canvas
		for(iDigit = 0; iDigit < 4; iDigit++) {
			drawHHMMDigit(time, iDigit);
		}
	}

	
	// Draw scalled second digits
//	turn_ctx.drawImage(turn_face, time.substr(4, 1) * DIGIT_WIDTH, 0, DIGIT_WIDTH, DIGIT_HEIGHT, xSecondStartPos, 20, secondWidth, secondHeight);
//	turn_ctx.drawImage(turn_face, time.substr(5, 1) * DIGIT_WIDTH, 0, DIGIT_WIDTH, DIGIT_HEIGHT, xSecondStartPos + secondWidth, 20, secondWidth, secondHeight);
	// check speed scroll
	if ( document.getElementById('scroll_forcespeed').value ) {
		document.getElementById('scrollspeed').value = document.getElementById('scroll_forcespeed').value ;
		document.getElementById('scroll_forcespeed').value = "";
		update_scroll();
	}
}

function drawHHMMDigit(time, unit) {
	turn_ctx.drawImage(turn_face, time.substr(unit,1) * DIGIT_WIDTH, 0, DIGIT_WIDTH, DIGIT_HEIGHT, xPositions[unit], 0, DIGIT_WIDTH, DIGIT_HEIGHT);
}

function drawHHMMDigit_inv(time, unit) {
	turn_ctx.drawImage(turn_face_inv, time.substr(unit,1) * DIGIT_WIDTH, 0, DIGIT_WIDTH, DIGIT_HEIGHT, xPositions[unit], 0, DIGIT_WIDTH, DIGIT_HEIGHT);
}

function imgLoaded() {
	// Image loaded event complete.  Start the timer
	setInterval(draw, 1000);
}

function init() {
	// Grab the turn element
	var canvas = document.getElementById('turn'),
		iHHMMGap = 0,
		iSSGap = 0;
		// iHHMMGap = 25

	// Canvas supported?
	if (canvas.getContext('2d')) {
		turn_ctx = canvas.getContext('2d');
		document.onkeydown = dokey;

		// Load the turn face image
		turn_face_inv = new Image();
		turn_face_inv.src = 'flip_clock_inv.png';
		turn_face = new Image();
		turn_face.src = 'flip_clock.png';
		turn_face.onload = imgLoaded;

		xPositions = Array(DIGIT_WIDTH * 0,
							DIGIT_WIDTH * 1,
							(DIGIT_WIDTH * 2) + iHHMMGap,
							(DIGIT_WIDTH * 3) + iHHMMGap)
							
		xSecondStartPos = xPositions[3] + DIGIT_WIDTH + iSSGap;
		
		secondWidth = DIGIT_WIDTH * 0.25;
		secondHeight = DIGIT_HEIGHT * 0.25;
		
	} else {
		alert("Canvas not supported!");
	}

	var SC_canvas = document.getElementById("marquee");
	if (SC_canvas.getContext) {
        	var SC_ctx = SC_canvas.getContext("2d");
		// Set the banner text attributes
		SC_ctx.fillStyle = "blue";
		SC_ctx.shadowOffsetX = 4;
		SC_ctx.shadowOffsetY = 4;
		SC_ctx.shadowBlur = 3;
		SC_ctx.shadowColor = "grey";
		//                ctx.font = "30px verdana";
		SC_ctx.font = "italic 40pt Calibri";
		// Call the moveBanner() function repeatedly every 40 microseconds
		update_scroll();
		// SC_scrollhandle = setInterval(function () { moveBanner() }, 40)
	} else {
		alert("Canvas not supported!");
	}

	open_remote();
}

function moveBanner() {
	var SC_canvas = document.getElementById("marquee");
	if (SC_canvas.getContext) {
		var SC_ctx = SC_canvas.getContext("2d");
		// Clear the screen
		SC_ctx.clearRect(0, 0, SC_boxwidth, 100);
 		// Display the text in the new position
		// var text = "Ejemplo de mensaje de texto bastante largo para mostrar";
		var text = document.getElementById('scrolltext').value;
		if (text) {
			SC_ctx.fillText(text, SC_X, SC_YPOS);
			var metrics = SC_ctx.measureText(text);
			var SC_width = metrics.width;
        	        var n = 1;
                	while ( (SC_X + n*(SC_width + SC_xgap)) < SC_boxwidth ) {
                        	SC_ctx.fillText(text, (SC_X + n*(SC_width + SC_xgap)), SC_YPOS);
	                        n++;
        	        }

                	SC_X -= 3;
	                // If the banner has reached the left end of the screen, resent the x-coordinate
        	        if (SC_X < -SC_width) {

			//                    X = 500
				SC_X = SC_X + SC_width + SC_xgap;
        	        }
		}

	}
}

function open_remote() {
	close_remote();
	document.getElementById('counter_force').value = document.getElementById('counter').value ;
	document.getElementById('scroll_forcetext').value = document.getElementById('scrolltext').value  ;

	remote_win=window.open("remote.html","_blank","height=200,width=400,status=yes,toolbar=no,menubar=no,location=no");
	return false;
}

function close_remote() {
	if (remote_win) {
		remote_win.close();
	}
	remote_win= null ;
	return false;
}

