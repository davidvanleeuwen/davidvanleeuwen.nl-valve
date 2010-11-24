var hyperlink_rules = {
    'a.external:click' : function(e) {
        if (!e.ctrlKey && !e.altKey && !e.shiftKey) {
          window.open(this.href);
          return false;
        }
    }
};
Event.addBehavior(hyperlink_rules);

var form_rules = {
	'.field' : function(e) {
		var fieldLabel = this.previous('[for=' + this.id + ']');
		if (fieldLabel) {
			fieldLabel.hide();
			this.value = fieldLabel.innerHTML;
		}
	},
	'.field:focus' : function(e) {
		var fieldLabel = this.previous('[for=' + this.id + ']');
		if (this.value === fieldLabel.innerHTML) {
			this.value = '';
		}
		this.className = this.className.replace('-off','-on');
	},
	'.field:blur' : function(e) {
		var fieldLabel = this.previous('[for=' + this.id + ']');
		if(this.value === '') {
			this.value = fieldLabel.innerHTML;
		}
		this.className = this.className.replace('-on','-off');
	}
};
Event.addBehavior(form_rules);

var socket_rules = {
	'body' : function(e) {
		if(!"WebSocket" in window) {
			this.insert({
				top: '<div class="warning"><p>Your browser probably doesn\'t support websockets or there\'s something terribly wrong. Sorry :-(</p></div>' 
			});
		} 
		var mouse = new vsocket(this, {
			socketserver: 'www.davidvanleeuwen.nl'
		});
		
		// flash settings
		var reg = new RegExp('www');
		var path = window.location.pathname;
		if(path.match(reg)) {
			WEB_SOCKET_SWF_LOCATION = 'http://davidvanleeuwen.nl:3000/socket.io/lib/vendor/web-socket-js/WebSocketMain.swf';
		} else {
			WEB_SOCKET_SWF_LOCATION = 'http://www.davidvanleeuwen.nl:3000/socket.io/lib/vendor/web-socket-js/WebSocketMain.swf';
		}
	}
};
Event.addBehavior(socket_rules);

/*
 bleh IE8
*/

document.createElement('header');
document.createElement('footer');
