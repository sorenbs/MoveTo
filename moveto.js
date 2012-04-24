Crafty.c("MoveTo", {
	_speed: 2,

	_onmousedown: function (e) {
		if (this.disregardMouseInput) {
			return;
		}
		// clear any existing EnterFrame handlers
		this._stopMoving();

		this._target = { x: e.realX, y: e.realY };
		this.bind("EnterFrame", this._enterFrame);
	},

	_stopMoving: function () {
		this._target = undefined;
		this.unbind("EnterFrame", this._enterFrame);
	},

	_enterFrame: function () {
		if (this.disableControls || !this._target) {
			return;
		}

		// target (almost) reached - jump the last part.
		// We could be more fancy (circular check instead of square), but don't want to pay the sqrt penalty each frame.
		if (Math.abs(this._target.x - this.x) < this._speed && Math.abs(this._target.y - this.y) < this._speed) {
			var prev_pos = {
				x: this.x,
				y: this.y
			};
			this.x = this._target.x;
			this.y = this._target.y;

			this._stopMoving();

			this.trigger('Moved', prev_pos);
			this.trigger('NewDirection', { x: 0, y: 0 });
			return;
		};

		// Pixels to move are calculated from location and target every frame to handle the case when something else (IE, collision detection logic) changes our position.
		// Some cleaver optimization could probably eliminate the sqrt cost...
		var dx = this._target.x - this.x, dy = this._target.y - this.y, oldX = this.x, oldY = this.y,
		movX = (dx * this._speed) / (Math.sqrt(dx * dx + dy * dy)),
		movY = (dy * this._speed) / (Math.sqrt(dx * dx + dy * dy));

		// Triggered when direction changes - either because of a mouse click, or something external
		if (Math.abs(movX - this.oldDirection.x) > 0.1 || Math.abs(movY - this.oldDirection.y) > 0.1) {
			this.trigger("NewDirection", { x: movX, y: movY })
		}
		this.oldDirection = { x: movX, y: movY };

		// Moved triggered twice to allow for better collision logic (like moving along diagonal walls)
		this.x += movX;
		this.trigger('Moved', { x: oldX, y: this.y });
		this.y += movY;
		this.trigger('Moved', { x: this.x, y: oldY });
	},

	moveTo: function (speed) {
		this._speed = speed;
		return this;
	},

	init: function () {
		this.requires("Mouse");
		this.oldDirection = { x: 0, y: 0 }

		Crafty.addEvent(this, Crafty.stage.elem, "mousedown", this._onmousedown);

	}
});