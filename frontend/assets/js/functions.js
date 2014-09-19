'use strict';
window.PlayIT = {
	get_cookie: function() {
		var re = /(?:(?:^|.*;\s*)chalmersItAuth\s*\=\s*([^;]*).*$)|^.*$/;
		return document.cookie.replace(re, "$1");
	}
};