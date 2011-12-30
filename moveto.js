Crafty.c("MoveTo", {
	_speed: 2,

	init: function () {
		this.target = null;
		this.requires("Mouse");
		Crafty.addEvent(this, Crafty.stage.elem, "mousedown", function (e) {
			this._target = { x: e.realX, y: e.realY };
			var dx = e.realX - this.x, dy = e.realY - this.y;
			this._movement.x = (dx * this._speed) / (Math.sqrt(dx * dx + dy * dy));
			this._movement.y = (dy * this._speed) / (Math.sqrt(dx * dx + dy * dy));
			this.trigger('NewDirection', this._movement);

		});
		this.bind("EnterFrame", function () {
			if (this.disableControls || !this._movement || !this._target) return;
			if (Math.abs(this._target.x - this.x) < this._speed || Math.abs(this._target.y - this.y) < this._speed) {
				this._movement = { x: 0, y: 0 }
				this.trigger('NewDirection', this._movement);
			}

			if (this._movement.x !== 0) {
				this.x += this._movement.x;
				this.trigger('Moved', { x: this.x - this._movement.x, y: this.y });
			}
			if (this._movement.y !== 0) {
				this.y += this._movement.y;
				this.trigger('Moved', { x: this.x, y: this.y - this._movement.y });
			}
		});
	}
});