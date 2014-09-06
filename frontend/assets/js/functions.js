'use strict';
window.PlayIT = {
	get_cookie: function(cookie_name) {
		var re = new RegExp('(?:(?:^|.*;\s*)' + cookie_name + '\s*\=\s*([^;]*).*$)|^.*$');
		return document.cookie.replace(re, "$1");
	}
};