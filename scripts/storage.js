(function(window) {
  'use strict';

  let _store = window.localStorage;
  let _key = 'app';

  let Storage = function(key) {
    _key = key;

    if(!_store[_key] || _store[_key] === '[]') {
      this.loadDummyData();
    }
  }

  Storage.prototype.find = function(id, callback) {
    let items = this.findAll();
    let item = items.filter((item) => id === item.id);

    callback && callback(item[0] || {});
  }

  Storage.prototype.findAll = function(callback) {
    let items = JSON.parse(_store[_key] || '[]');
    callback && callback(items);

    return items;
  }

  Storage.prototype.save = function(newItem, callback) {
    let items = this.findAll();
    let isUpdate = items.filter((item) => item.id === newItem.id);

    if(isUpdate.length) {
      let items = items.map(function(item) {
        if(item.id === newItem.id) {
          for(let prop in newItem) {
            item[prop] = newItem[prop];
          }
        }
        return item;
      });
    } else {
      items.push(newItem);
    }

    setStorage(items);

    callback && callback(newItem);
  }

  function setStorage(object) {
    _store[_key] = JSON.stringify(object);
  }

  Storage.prototype.delete = function(id, callback) {
    let oldItems = this.findAll();
    let items = oldItems.filter((item) => item.id.toString() !== id.toString());
    setStorage(items);

    callback && callback(items.length !== oldItems.length);
  }

  Storage.prototype.loadDummyData = function(color, callback) {
    let now = new Date().setMilliseconds(0);
    setStorage([{
      id: +now,
      when: +now + 60000,
      repeat: 0,
      message: "Demo: Check out this Awesome alarm!",
      active: true
    }]);
  }

  window.Storage = Storage;
})(window);
