var Alarm = function() {
  this.id = null;
  this.when = null;
  this.repeat = null;
  this.message = null;
  this.active = true;
}

Alarm.prototype.goOff = function() {
  if(this.active) {
    let notification = new Notification('Alarm-clock', {
      body: this.message,
      icon: 'images/alarm-clock.png',
    });
  }
}

Alarm.prototype.create = function(options) {
  let { id, when, repeat, message, active } = options;
  this.id = id || +new Date();
  this.when = when;
  this.repeat = repeat;
  this.message = message;
  this.active = active === undefined ? true : active;

  return this;
}

Alarm.prototype.toggle = function() {
  this.active = !this.active;
}

Alarm.prototype.toJSON = function() {
  let { id, when, repeat, message, active } = this;
  return { id, when, repeat, message, active };
}
