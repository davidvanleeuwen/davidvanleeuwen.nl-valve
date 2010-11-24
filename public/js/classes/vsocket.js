/**
 *  Debounce extension
 *  Source: http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
 * 
 *  Throttle extension
 *  Source: http://benalman.com/projects/jquery-throttle-debounce-plugin/
 */
Object.extend(Function.prototype, {
	debounce: function(threshold, execAsap) {
		var func = this, 
			timeout;
	    return function debounced () {
	        var obj = this, args = arguments;
	        function delayed () {
	            if (!execAsap) {
	                func.apply(obj, args);
				}
	            timeout = null; 
	        };
	        if (timeout) {
	            clearTimeout(timeout);
			} else if (execAsap) {
	            func.apply(obj, args);
			}
	        timeout = setTimeout(delayed, threshold || 100); 
	    };
	},
	throttle: function(delay, no_trailing, callback) {
		var timeout_id,
			last_exec = 0,
			func = this;
		if ( typeof no_trailing !== 'boolean' ) {
			debounce_mode = callback;
			callback = no_trailing;
			no_trailing = undefined;
		}
		return function throttled() {
			var that = this,
				elapsed = +new Date() - last_exec,
				args = arguments;
			function exec() {
				last_exec = +new Date();
				func.apply( that, args );
			};
			function clear() {
				timeout_id = undefined;
			};
			timeout_id && clearTimeout( timeout_id );
			if ( debounce_mode === undefined && elapsed > delay ) {
				exec();
			}
		};
	}
});
/**
 *  Websockets are awesome!
 * 
 */
vsocket = Class.create({
	initialize: function(element, options){
		this.element = $(element);
		this.options = Object.extend({
			enabled: true,
			socketserver: ''
		}, options || { });
		
		this.socket = '';
		if(this.element) {
			if(this.options.enabled) {
				this.connectToSocket();
			}
		}
	},
	connectToSocket: function() {
		this.socket = new io.Socket(this.options.socketserver, {
			transports: ['websocket', 'flashsocket'],
			port: 3000
		});
		this.socket.connect();
		this.addEventlisteners();
	},
	addEventlisteners: function() {
		this.socket.on('connect', this.connectedToSocket.bindAsEventListener(this));
		this.socket.on('message', this.setMousePosition.bindAsEventListener(this));
		Event.observe(this.element, 'mousemove', this.sendMousePosition.bindAsEventListener(this));
	},
	connectedToSocket: function(e) {
		var cursor_box = new cursorBox(this.element.down('.cursor'), {socket: this.socket});
	},
	setMousePosition: function(response) {
		var message = response.evalJSON();
		if(message.connected) {
			var user = message.connected;
			//console.log('User connected:', user);
			if(!$('mouse_'+user)) {
				this.element.insert({
					top: new Element('div', {'class': 'mouse', 'id': 'mouse_'+user})
				});
			}
		} else if(message.position) {
			var z = message.position.data.message.position;
			var user = message.position.data.user;
			if($('mouse_'+user)) {
				// only works when the website is centered with e.g. margin: auto
				$('mouse_'+user).setStyle({
					left: (document.viewport.getWidth() - parseInt(z.w))/2 + parseInt(z.xpos)+'px',
					top: z.ypos+'px'
				});
			} else if(!$('mouse_'+user)) {
				this.element.insert({
					top: new Element('div', {'class': 'mouse', 'id': 'mouse_'+user})
				});
			}
		} else if(message.disconnected) {
			var user = message.disconnected;
			//console.log('User disconnected:', user);
			if($('mouse_'+user)) {
				$('mouse_'+user).remove();
			}
		} else if(message.collected) {
			document.fire('cursorBox:collected', {amount: message.collected.data.amount});
		}
	},
	sendMousePosition: function(event) {
		var params = new Hash();
		params.set('xpos', event.pointerX());
		params.set('ypos', event.pointerY());
		params.set('w', document.viewport.getWidth());
		params.set('h', document.viewport.getHeight());
		this.socket.send('{"position": '+params.toJSON()+'}');
	}.throttle(35)
});
