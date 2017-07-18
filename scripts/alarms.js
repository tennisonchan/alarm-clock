let Alarms = (function(Alarm, Storage, Util) {
  let _this = {};
  let _alarms = {};
  let _timer = null;
  let _storage = null;
  let _timestamps = {}
  let _updateFunction = null;

  function init(){
    _storage = new Storage('alarm-clock');
    _storage.findAll((alarms) => {
      alarms.forEach(function(alarm) {
        _timestamps[alarm.when] = alarm.id;
        _alarms[alarm.id] = new Alarm().create(alarm);
      })
    });

    _timer = setInterval(secondTimer, 1000);
  }

  function secondTimer() {
    let timestamp = Util.getTimestampSecond(new Date());
    let alarmName = _timestamps[timestamp];

    if(alarmName) {
      let alarm = get(alarmName);
      alarm.goOff();
      _updateFunction();
    }
  }

  function create(options) {
    let { when, repeat, message } = options;

    when = Util.getTimestampSecond(when);

    let alarm = new Alarm().create({
      when: when,
      repeat: 0,
      message: message
    });

    _storage.save(alarm.toJSON(), () => {
      _timestamps[when] = alarm.id;
      _alarms[alarm.id] = alarm;
    });
  }

  function get(id) {
    return _alarms[id] || null;
  }

  function clear(id) {
    _storage.delete(id, () => {
      let alarm = _alarms[id];
      delete _timestamps[alarm.when];
      delete _alarms[id];
    });
  }

  function getAll() {
    let alarmsList = [];
    for(let alarmName in _alarms) {
      alarmsList.push(_alarms[alarmName]);
    }

    return alarmsList;
  }

  function setUpdateFunction(updateFunction) {
    _updateFunction = updateFunction;
  }

  _this.get = get;
  _this.create = create;
  _this.clear = clear;
  _this.getAll = getAll;
  _this.setUpdateFunction = setUpdateFunction;

  init();

  return _this;
})(Alarm, Storage, Util)

window.Alarms = Alarms;