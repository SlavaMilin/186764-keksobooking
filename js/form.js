'use strict';

(function () {
  var form = document.querySelector('.notice__form');
  var timeIn = form.querySelector('#timein');
  var timeOut = form.querySelector('#timeout');
  var price = form.querySelector('#price');
  var capacity = form.querySelector('#capacity');
  var timeList = ['12:00', '13:00', '14:00'];
  var priceMinList = [0, 1000, 5000, 10000];

  var validateTime = function (evt, time, timeValues) {
    time.value = timeValues.indexOf(evt.target.value) ? evt.target.value : timeValues[0];
  };
  var validateType = function (evt) {
    price.min = priceMinList[evt.target.selectedIndex] ? priceMinList[evt.target.selectedIndex] : priceMinList[0];
  };
  var validateNumber = function (evt) {
    var changeAvailability = function (target, value1, value2, value3, value4) {
      target[0].disabled = value1;
      target[1].disabled = value2;
      target[2].disabled = value3;
      target[3].disabled = value4;
    };
    switch (evt.target.value) {
      case '1':
        changeAvailability(capacity, true, true, false, true);
        break;
      case '2':
        changeAvailability(capacity, true, false, false, true);
        break;
      case '3':
        changeAvailability(capacity, false, false, false, true);
        break;
      case '100':
        changeAvailability(capacity, true, true, true, false);
    }
  };
  var onInputChange = function (evt) {
    if (evt.target.id === 'timeout') {
      validateTime(evt, timeIn, timeList);
    } else if (evt.target.id === 'timein') {
      validateTime(evt, timeOut, timeList);
    } else if (evt.target.id === 'type') {
      validateType(evt);
    } else if (evt.target.id === 'room_number') {
      validateNumber(evt);
    }
  };
  form.addEventListener('change', onInputChange);
})();
