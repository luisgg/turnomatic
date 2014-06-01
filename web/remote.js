// --------
// File:        remote.js
// Description: javascript code for the 'remote control' window of 'turnomatic'
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


// Global variable
OLD_SC_TEXT="";
OLD_SC_SPEED="";
OLD_COUNTER="";
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

	}
}

function inc_scroll() {
	if ( document.getElementById('r_scrollspeed').value < SC_MAX ) {
		document.getElementById('r_scrollspeed').value++ ;
		update_scroll();
	}
}

function dec_scroll() {
	if ( document.getElementById('r_scrollspeed').value > SC_MIN ) {
		document.getElementById('r_scrollspeed').value-- ;
		update_scroll();
	}
}

function inc_counter(){
//	window.opener.document.getElementById('counter').value++ ;
	document.getElementById('r_counter').value++ ;
	set_parent_counter();
	return false;
}

function dec_counter() {
//	window.opener.document.getElementById('counter').value-- ;
	document.getElementById('r_counter').value-- ;
	set_parent_counter();
	return false;
}

function remote_refresh() {
	new_counter = document.getElementById('r_counter').value
	if ( window.opener.document.getElementById('counter_force').value ) {
		new_counter = window.opener.document.getElementById('counter_force').value ;
		document.getElementById('r_counter').value = new_counter ;
		window.opener.document.getElementById('counter_force').value = "" ;
	} else if ( new_counter != OLD_COUNTER ) {
		window.opener.document.getElementById('counter').value = new_counter ;
		
	}
	OLD_COUNTER =  new_counter  ;

	new_sc_text = document.getElementById('r_scrolltext').value ;
	if ( window.opener.document.getElementById('scroll_forcetext').value ) {
		new_sc_text = window.opener.document.getElementById('scroll_forcetext').value ;
		document.getElementById('r_scrolltext').value = new_sc_text ;
		window.opener.document.getElementById('scroll_forcetext').value = "" ;
	} else if ( new_sc_text != OLD_SC_TEXT ) {
		window.opener.document.getElementById('scrolltext').value = new_sc_text ;
		
	}
	OLD_SC_TEXT =  new_sc_text  ;
	
	if ( window.opener.document.getElementById('scroll_forcespeed').value ) {
		sc_new_speed = window.opener.document.getElementById('scroll_forcespeed').value ;
	} else {
		sc_new_speed = window.opener.document.getElementById('scrollspeed').value ;
	}
	document.getElementById('r_scrollspeed').value =  sc_new_speed ;
	document.getElementById('r_showspeed').value = sc_new_speed ;
 
//	document.getElementById('r_scrolltext').value = window.opener.document.getElementById('scrolltext').value ;
}

function set_counter() {
//	var newcount = prompt("Valor del contador",document.getElementById('counter').value);
//	if (newcount != null) {
//		document.getElementById('counter').value = newcount;
//	}
	return false;
}

function set_parent_counter() {
	window.opener.document.getElementById('counter').value = document.getElementById('r_counter').value ;
	return false ;
}

function set_parent_scroll() {
	window.opener.document.getElementById('scrolltext').value = document.getElementById('r_scrolltext').value ;
	return false ;
}

function closeParent() {
//    var w = window.opener;
//    window.opener = self;
//    w.close();
	window.opener.close();
}

function init() {
	// Grab the turn element
	document.onkeydown = dokey;
	setInterval(remote_refresh, 500);
}

function update_scroll() {
	window.opener.document.getElementById('scroll_forcespeed').value = document.getElementById('r_scrollspeed').value
	document.getElementById('r_showspeed').value = document.getElementById('r_scrollspeed').valueAsNumber
}

