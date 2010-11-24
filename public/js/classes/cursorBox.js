cursorBox = Class.create({
	initialize: function(element, options){
		this.element = $(element);
		this.options = Object.extend({
			enabled: true,
			socket: ''
		}, options || { });
		
		if(this.element) {
			if(this.options.enabled) {
				this.startCursorBox();
			}
		}
		this.box = this.element.down('.cursortxt');
		this.box.update('place your <br />cursor here');
		this.collected = this.element.up().down('.count');
		this.interval;
		this.running = false;
		this.finished = false;
		this.seconds;
	},
	startCursorBox: function() {
		this.addEventlisteners();
	},
	addEventlisteners: function() {
		Event.observe(this.element, 'mouseover', this.startCountdown.bindAsEventListener(this));
		Event.observe(this.element, 'mouseout', this.pauseCountdown.bindAsEventListener(this));
		document.observe('cursorBox:collected', this.addCollectedCursor.bindAsEventListener(this));
	},
	startCountdown: function(event) {
		if(this.running == false) {
			this.seconds = 3;
			this.interval = setInterval(this.updateCursorBox.bind(this), 1000);
			this.element.down('.cursortxt').update('grabbing...');
			this.running = true;
		}
	},
	updateCursorBox: function() {
		if(this.seconds != 0) {
			this.box.setStyle({'font-size': '28px'});
			this.box.update(this.seconds);
			this.seconds--;
		} else {
			this.box.setStyle({'font-size': '18px'});
			this.box.update("got it! thanks <br / >+1");
			clearInterval(this.interval);
			this.finished = true;
			var amount = parseInt(this.collected.down('.collected').innerHTML);
			var c = amount+1;
			this.collected.down('.collected').update(c.toString());
			this.options.socket.send('{"collected": "add"}');
		}
	},
	pauseCountdown: function() {
		if (this.finished == false) {
			clearInterval(this.interval);
			this.box.setStyle({'font-size': '16px'});
			this.box.update("I need some time to grab your cursor!");
			this.running = false;
		}
	},
	addCollectedCursor: function(event) {
		var amount = event.memo.amount;
		this.collected.down('.collected').update(amount);
	}
});
