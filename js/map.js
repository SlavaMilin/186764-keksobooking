'use strict';

var tokioPinMap = document.querySelector('.tokyo__pin-map');
var longeTemplate = document.querySelector('#lodge-template').content;
var replaceTable = document.querySelector('.dialog__panel');
var boxTable = document.querySelector('#offer-dialog');
var dialogCross = boxTable.querySelector('.dialog__close');

var NUMBER_PINS = 8;
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

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

var drawingPins = function (inputSettings, inputPlace, numberPins) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < numberPins; i += 1) {
    var newElement = document.createElement('div');
    var img = document.createElement('img');
    newElement.appendChild(img);
    newElement.setAttribute('style', 'left: ' + inputSettings[i].location.x + 'px; top: ' + inputSettings[i].location.y + 'px;');
    newElement.classList.add('pin');
    img.setAttribute('src', inputSettings[i].author.avatar);
    img.setAttribute('width', 40);
    img.setAttribute('height', 40);
    img.classList.add('rounded');
    fragment.appendChild(newElement);
  }
  inputPlace.appendChild(fragment);
};

var drawingOnTeplate = function (data, template, replacement, box) {
  var cloneTemplate = template.cloneNode(true);
  cloneTemplate.querySelector('.lodge__title').insertAdjacentText('afterbegin', data.offer.title);
  cloneTemplate.querySelector('.lodge__address').insertAdjacentText('afterbegin', data.location.x + ', ' + data.location.y);
  cloneTemplate.querySelector('.lodge__price').insertAdjacentText('afterbegin', data.offer.price + ' \u20BD/ночь');
  if (data.offer.type === 'flat') {
    cloneTemplate.querySelector('.lodge__type').insertAdjacentText('afterbegin', 'Квартира');
  } else if (data.offer.type === 'bungalo') {
    cloneTemplate.querySelector('.lodge__type').insertAdjacentText('afterbegin', 'Бунгало');
  } else {
    cloneTemplate.querySelector('.lodge__type').insertAdjacentText('afterbegin', 'Дом');
  }
  cloneTemplate.querySelector('.lodge__rooms-and-guests').insertAdjacentText('afterbegin', 'Для ' + data.offer.guests + ' гостей в ' + data.offer.rooms + ' комнатах');
  cloneTemplate.querySelector('.lodge__checkin-time').insertAdjacentText('afterbegin', 'Заезд после ' + data.offer.checkin + ', выезд до ' + data.offer.checkout);
  for (var i = 0; i < data.offer.features.length; i += 1) {
    var span = document.createElement('span');
    span.classList.add('feature__image', 'feature__image--' + data.offer.features[i]);
    cloneTemplate.querySelector('.lodge__features').appendChild(span);
  }
  cloneTemplate.querySelector('.lodge__description').insertAdjacentText('afterbegin', data.offer.description);
  box.querySelector('.dialog__title img').setAttribute('src', data.author.avatar);
  box.removeChild(replacement);
  box.appendChild(cloneTemplate);
};

var replaceDialogData = function (data, index, box) {
  box.querySelector('.dialog__title img').setAttribute('src', data[index].author.avatar);
  box.querySelector('.lodge__title').textContent = data[index].offer.title;
  box.querySelector('.lodge__address').textContent = data[index].location.x + ', ' + data[index].location.y;
  box.querySelector('.lodge__price').textContent = data[index].offer.price + ' \u20BD/ночь';
  box.querySelector('.lodge__checkin-time').textContent = 'Заезд после ' + data[index].offer.checkin + ', выезд до ' + data[index].offer.checkout;
};

var setPins = function (map, dialog, closeTable) {
  var pins = document.querySelectorAll('.pin:not(.pin__main)');
  var pinsImg = document.querySelectorAll('.pin:not(.pin__main) img');
  var pinActiveClass = 'pin--active';
  var dialogClose = 'hidden';
  var pinActive;

  var onPinClick = function (evt) {
    var index = evt.target.getAttribute('data-index');
    if (evt.target === pinsImg[index]) {
      if (pinActive) {
        pins[pinActive].classList.remove(pinActiveClass);
      }
      pinActive = index;
      pins[index].classList.add(pinActiveClass);
      dialog.classList.remove(dialogClose);
      replaceDialogData(hotelsData, index, boxTable);
      document.addEventListener('keydown', onDialogEscPush);
    }
  };
  var onPinPush = function (evt) {
    var index = evt.target.getAttribute('data-index');
    if (evt.target === pins[index] && evt.keyCode === ENTER_KEYCODE) {
      if (pinActive) {
        pins[pinActive].classList.remove(pinActiveClass);
      }
      pinActive = index;
      pins[index].classList.add(pinActiveClass);
      dialog.classList.remove(dialogClose);
      replaceDialogData(hotelsData, index, boxTable);
      document.addEventListener('keydown', onDialogEscPush);
    }
  };
  var onDialogEscPush = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      if (pinActive) {
        pins[pinActive].classList.remove(pinActiveClass);
      }
      dialog.classList.add(dialogClose);
      document.removeEventListener('keydown', onDialogEscPush);
    }
  };
  var onCrossClick = function () {
    if (pinActive) {
      pins[pinActive].classList.remove(pinActiveClass);
    }
    dialog.classList.add(dialogClose);
    document.removeEventListener('keydown', onDialogEscPush);
  };
  for (var i = 0; i < pinsImg.length; i += 1) {
    pinsImg[i].setAttribute('data-index', i);
    pins[i].setAttribute('data-index', i);
    pins[i].setAttribute('tabindex', 0);
  }
  map.addEventListener('click', onPinClick);
  map.addEventListener('keydown', onPinPush);
  document.addEventListener('keydown', onDialogEscPush);
  closeTable.addEventListener('click', onCrossClick);
};

var hotelsData = generateFromPattern(HOTEL_PATTERN, NUMBER_PINS);
drawingPins(hotelsData, tokioPinMap, NUMBER_PINS);
drawingOnTeplate(hotelsData[0], longeTemplate, replaceTable, boxTable);
setPins(tokioPinMap, boxTable, dialogCross);
