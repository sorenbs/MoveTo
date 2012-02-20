Crafty.c("MoveTo", {
	_speed: 2,

	_onmousedown: function (e) {
		this._target = { x: e.realX, y: e.realY };
		var dx = e.realX - this.x, dy = e.realY - this.y;
		this._movement = {
			x: (dx * this._speed) / (Math.sqrt(dx * dx + dy * dy)),
			y: (dy * this._speed) / (Math.sqrt(dx * dx + dy * dy))
		},
      this.trigger('NewDirection', this._movement);
	},

	moveTo: function(speed) {
		this._speed = speed;
		return this;
	},

	init: function () {
		this.requires("Mouse");

		Crafty.addEvent(this, Crafty.stage.elem, "mousedown", this._onmousedown);

		var norm = function (x, y) {
			absx = Math.abs(x);
			absy = Math.abs(y);

			if (absx > absy) {
				max = absx;
				min = absy;
			} else {
				max = absy;
				min = absx;
			}

			return max * Math.sqrt(1 + Math.pow(min / max, 2));
		};


		this.bind("EnterFrame", function () {

			if (this.disableControls || !this._target) {
				return;
			}

			// target reached. stop moving, jump the last part, clear the target, trigger Moved and NewDirection
			if (norm(this._target.x - this.x, this._target.y - this.y) < this._speed) {
				var prev_pos = {
					x: this.x,
					y: this.y
				};
				this._movement = {
					x: 0,
					y: 0
				};
				this.x = this._target.x;
				this.y = this._target.y;
				this._target = undefined;
				this.trigger('Moved', this.prev_pos);
				this.trigger('NewDirection', this._movement);
			};

			if (this._movement.x !== 0) {
				this.x += this._movement.x;
				this.trigger('Moved', { x: this.x - this._movement.x, y: this.y });
			};

			if (this._movement.y !== 0) {
				this.y += this._movement.y;
				this.trigger('Moved', { x: this.x, y: this.y - this._movement.y });
			}
		});
	}
});
