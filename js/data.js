'use strict';

(function () {
  window.NUMBER_PINS = 8;
  window.ESC_KEYCODE = 27;
  window.ENTER_KEYCODE = 13;
  var HOTEL_PATTERN = {
    author: {
      avatar: function (index) {
        return 'img/avatars/user0' + (index + 1) + '.png';
      }
    },
    location: {
      x: {_randomNumber: [300, 900]},
      y: {_randomNumber: [100, 500]}
    },
    offer: {
      title: function (index) {
        var data = [
          'Большая уютная квартира',
          'Маленькая неуютная квартира',
          'Огромный прекрасный дворец',
          'Маленький ужасный дворец',
          'Красивый гостевой домик',
          'Некрасивый негостеприимный домик',
          'Уютное бунгало далеко от моря',
          'Неуютное бунгало по колено в воде'
        ];
        return data[index];
      },
      address: [],
      price: {_randomNumber: [1000, 1000000]},
      type: {_randomValue: ['flat', 'house', 'bungalo']},
      rooms: {_randomNumber: [1, 5]},
      guests: {_randomNumber: [1, 20]},
      checkin: {_randomValue: ['12:00', '13:00', '14:00']},
      checkout: {_randomValue: ['12:00', '13:00', '14:00']},
      features: {
        _randomSet: [
          'wifi', 'dishwasher', 'parking',
          'washer', 'elevator', 'conditioner'
        ],
      },
      description: '',
      photos: [],
    }
  };
  var getRandomSort = function () {
    return Math.random() - 0.5;
  };
  var getRandomNumber = function (min, max) {
    return Math.round(Math.random() * (max - min) + min);
  };
  var getRandomValue = function (inputData) {
    var randomIndex = getRandomNumber(0, inputData.length - 1);
    return inputData[randomIndex];
  };
  var getRandomSet = function (inputData) {
    var copy = inputData.slice().sort(getRandomSort);
    var length = getRandomNumber(1, inputData.length);
    return copy.slice(0, length);
  };
  var getDataFromPattern = function (pattern, payload) {
    var stringType = Object.prototype.toString.call(pattern);
    if (stringType === '[object Object]') {
      if (pattern._randomValue) {
        return getRandomValue(pattern._randomValue);
      } else if (pattern._randomSet) {
        return getRandomSet(pattern._randomSet);
      } else if (pattern._randomNumber) {
        return getRandomNumber.apply(null, pattern._randomNumber);
      } else {
        var copy = {};
        for (var field in pattern) {
          if (pattern.hasOwnProperty(field)) {
            copy[field] = getDataFromPattern(pattern[field], payload);
          }
        }
        return copy;
      }
    } else if (stringType === '[object Function]') {
      return pattern(payload);
    }
    return pattern;
  };

  var generateFromPattern = function (pattern, quantity) {
    var result = [];
    for (var i = 0; i < quantity; i += 1) {
      var data = getDataFromPattern(pattern, i);
      result.push(data);
    }
    return result;
  };
  window.hotelsData = generateFromPattern(HOTEL_PATTERN, window.NUMBER_PINS);
})();
