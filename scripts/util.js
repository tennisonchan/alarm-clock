var Util = (function() {

  function dateToDigit(date) {
    let dateObject = new Date(date);
    let digits = ['getHours', 'getMinutes', 'getSeconds'].map(function(func) {
      return dateObject[func] && dateObject[func]();
    });

    return digits;
  }

  function digitsToDate(digits) {
    while(digits.length < 4) {
      digits.push(0);
    }

    return new Date().setHours.apply(new Date(), digits);
  }

  function addZero(num) {
    return ('00' + num).slice(-2);
  }

  function getTimestampSecond(time) {
    return new Date(time).setMilliseconds(0);
  }

  function timeDiff(timeA, timeB) {
    let map = [3600000, 60000, 1000];
    let timestampA = dateToDigit(timeA).reduce((acc, time, i) => acc + time * map[i], 0);
    let timestampB = dateToDigit(timeB).reduce((acc, time, i) => acc + time * map[i], 0);

    return timestampA - timestampB;
  }

  return {
    addZero,
    dateToDigit,
    digitsToDate,
    getTimestampSecond,
    timeDiff,
  };

})()
