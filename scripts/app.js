let App = (function(window, _, Alarms, Util) {
  let selectors = {
    addAlarmButton: document.querySelector('#add-alarm-button'),
    alarmList: document.querySelector('.alarm-list__list'),
    alarmIncrease: document.querySelectorAll('.increase'),
    alarmDecrease: document.querySelectorAll('.decrease'),
    alarmDigitInput: document.querySelectorAll('.alarm-digit-input'),
    alarmMessage: document.querySelector('#alarm-message-input'),
    listGroupItemTemplate: document.querySelector('#list-group-item-template'),
    noAlarmSetTemplate: document.querySelector('#no-alarm-set-template'),
    alarmClose: document.querySelectorAll('.close'),
  }

  function init() {
    setAlarmDigit(new Date());
    Alarms.setUpdateFunction(renderAlarmsList);
    renderAlarmsList();

    if (window.Notification && Notification.permission !== "granted") {
      Notification.requestPermission(function(status) {
        if (Notification.permission !== status) {
          Notification.permission = status;
        }
      });
    }

    document.addEventListener('click', function(evt) {
      if (evt.target.classList.contains('close')) {
        Alarms.clear(evt.target.dataset.id);
        renderAlarmsList();
      }
      if(evt.target.classList.contains('active-alarm-input')) {
        let { dataset, checked } = evt.target;
        let id = dataset.activeId;
        document.querySelector(`#alarm-${id}`).classList.toggle('active-alarm', checked);
        toggleAlarm(id, checked);
      }
    });

    selectors.addAlarmButton.addEventListener('click', function() {
      let alarmTime = getAlarmDate();

      createAlarm(alarmTime, selectors.alarmMessage.value);
      selectors.alarmMessage.value = '';
    });

    selectors.alarmIncrease.forEach(function(selector){
      selector.addEventListener('click', function(evt) {
        let input = evt.currentTarget.nextElementSibling;
        let cycle = Number(evt.currentTarget.dataset.cycle);
        let value = Number(input.value);

        input.value = Util.addZero((value + 1) % cycle);
      });
    });

    selectors.alarmDecrease.forEach(function(selector){
      selector.addEventListener('click', function(evt) {
        let input = evt.currentTarget.previousElementSibling;
        let cycle = Number(evt.currentTarget.dataset.cycle);
        let value = Number(input.value);

        input.value = Util.addZero((value - 1 + cycle) % cycle);
      });
    });
  }

  function setAlarmDigit(date) {
    let digits = Util.dateToDigit(new Date(date));

    selectors.alarmDigitInput.forEach(function(selector){
      let cycle = Number(selector.dataset.cycle);
      let digit = Number(selector.dataset.digit);
      let value = Number(digits[digit]);

      selector.value = Util.addZero(value % cycle);
    });
  }

  function getAlarmDate() {
    let results = [];

    selectors.alarmDigitInput.forEach(function(selector){
      let digit = Number(selector.dataset.digit);
      let value = Number(selector.value);

      results[digit] = value;
    });

    return Util.digitsToDate(results);
  }

  function createAlarm(when, message, repeat) {
    Alarms.create({
      when: when,
      repeat: 0,
      message: message
    });

    renderAlarmsList();
  }

  function toggleAlarm(id, force) {
    let alarm = Alarms.get(id);

    if(alarm) {
      alarm.toggle(force);
    }
  }

  function renderAlarmsList() {
    let alarms = Alarms.getAll();

    while (selectors.alarmList.hasChildNodes()) {
      selectors.alarmList.removeChild(selectors.alarmList.lastChild);
    }

    if(alarms.length) {
      alarms.forEach(function(alarmObject) {
        let alarmListItemElement = createAlarmListItem(alarmObject);
        selectors.alarmList.innerHTML += alarmListItemElement;
      });
    } else {
      selectors.alarmList.innerHTML = _.template(selectors.noAlarmSetTemplate.textContent)();
    }
  }

  function createAlarmListItem(options) {
    let { when, repeat, message, id, active } = options;
    let timeDisplay = Util.dateToDigit(when).slice(0, 2).map(Util.addZero).join(':');
    let wentOff = Util.timeDiff(when, new Date()) < 1000;

    return _.template(selectors.listGroupItemTemplate.textContent)({
      when, repeat, message, id, active, timeDisplay, wentOff
    });
  }

  window.addEventListener('load', init);

})(window, _, Alarms, Util)
