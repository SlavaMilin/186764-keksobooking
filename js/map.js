'use strict';

var tokioPinMap = document.querySelector('.tokyo__pin-map');

var longeTemplate = document.querySelector('#lodge-template').content;
var replaceTable = document.querySelector('.dialog__panel');
var boxTable = document.querySelector('#offer-dialog');
var dialogCross = boxTable.querySelector('.dialog__close');

// constants of hottel settings

var HOTEL_DESCRIPTION = {
  author: {
    avatar: []
  },
  offer: {
    title: [
      'Большая уютная квартира',
      'Маленькая неуютная квартира',
      'Огромный прекрасный дворец',
      'Маленький ужасный дворец',
      'Красивый гостевой домик',
      'Некрасивый негостеприимный домик',
      'Уютное бунгало далеко от моря',
      'Неуютное бунгало по колено в воде'
    ],
    address: [],
    price: [1000, 1000000],
    type: ['flat', 'house', 'bungalo'],
    rooms: [1, 5],
    guests: [1, 20],
    checkin: ['12:00', '13:00', '14:00'],
    checkout: ['12:00', '13:00', '14:00'],
    features: [
      'wifi', 'dishwasher', 'parking',
      'washer', 'elevator', 'conditioner'
    ],
    description: '',
    photos: [],
  },
  location: {
    x: [300, 900],
    y: [100, 500]
  }
};
var NUMBER_PINS = 8;
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;
// get min and max value and return random value, between them.

var getRandomNumber = function (min, max) {
  return Math.round(Math.random() * (max - min) + min);
};

// function for sort. get array and return random position inside

var getRandomSort = function () {
  return Math.random() - 0.5;
};

// function, that take copy of constant and return object

var deepCopy = function deepCopy(obj) {
  if (typeof obj !== 'object' || !obj) {
    return obj;
  }
  var copy;
  if (Array.isArray(obj)) {
    copy = [];
    for (var i = 0; i < obj.length; i += 1) {
      copy[i] = deepCopy(obj[i]);
    }
    return copy;
  }
  if (Object.prototype.toString.call(obj) !== '[object Object]') {
    return obj;
  }
  copy = {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      copy[key] = deepCopy(obj[key]);
    }
  }
  return copy;
};

var sortingRandomArray = function (inputData, iteration) {
  var result = [];
  for (var i = 0; i < iteration; i += 1) {
    result.push(inputData[getRandomNumber(0, inputData.length - 1)]);
  }
  return result;
};

var choseRandomNumber = function (inputData, iteration) {
  var result = [];
  for (var i = 0; i < iteration; i += 1) {
    result.push(getRandomNumber(inputData[0], inputData[1]));
  }
  return result;
};

var getRandomResultInside = function (inputData, iteration) {
  var result = [];
  for (var i = 0; i < iteration; i += 1) {
    result.push([]);
    var copy = inputData.sort(getRandomSort);
    for (var j = 0; j < getRandomNumber(1, inputData.length); j += 1) {
      result[i].push(copy[j]);
    }
  }
  return result;
};

// get object and return changed independent object

var setDescription = function (inputSettings, numberPins) {
  var clone = deepCopy(inputSettings);
  clone.location.x = choseRandomNumber(clone.location.x, numberPins);
  clone.location.y = choseRandomNumber(clone.location.y, numberPins);
  for (var i = 0; i < numberPins; i += 1) {
    clone.author.avatar.push('img/avatars/user0' + (i + 1) + '.png');
    clone.offer.address.push(clone.location.x[i] + ', ' + clone.location.y[i]);
  }
  clone.author.avatar.sort(getRandomSort);
  clone.offer.title.sort(getRandomSort);
  clone.offer.price = choseRandomNumber(clone.offer.price, numberPins);
  clone.offer.type = sortingRandomArray(clone.offer.type, numberPins);
  clone.offer.rooms = choseRandomNumber(clone.offer.rooms, numberPins);
  clone.offer.guests = choseRandomNumber(clone.offer.guests, numberPins);
  clone.offer.checkin = sortingRandomArray(clone.offer.checkin, numberPins);
  clone.offer.checkout = sortingRandomArray(clone.offer.checkout, numberPins);
  clone.offer.features = getRandomResultInside(clone.offer.features, numberPins);
  return clone;
};

var drawingPins = function (inputSettings, inputPlace, numberPins) {
  var fragment = document.createDocumentFragment();
  for (var b = 0; b < numberPins; b += 1) {
    var newElement = document.createElement('div');
    var img = document.createElement('img');
    newElement.appendChild(img);
    newElement.setAttribute('style', 'left: ' + inputSettings.location.x[b] + 'px; top: ' + inputSettings.location.y[b] + 'px;');
    newElement.classList.add('pin');
    img.setAttribute('src', inputSettings.author.avatar[b]);
    img.setAttribute('width', 40);
    img.setAttribute('height', 40);
    img.classList.add('rounded');
    fragment.appendChild(newElement);
  }
  inputPlace.appendChild(fragment);
};

var drawingOnTeplate = function (data, template, replacement, box) {
  var cloneTemplate = template.cloneNode(true);
  cloneTemplate.querySelector('.lodge__title').insertAdjacentText('afterbegin', data.offer.title[0]);
  cloneTemplate.querySelector('.lodge__address').insertAdjacentText('afterbegin', data.offer.address[0]);
  cloneTemplate.querySelector('.lodge__price').innerHTML = data.offer.price[0] + ' \&#x20bd;/ночь';
  if (data.offer.type[0] === 'flat') {
    cloneTemplate.querySelector('.lodge__type').insertAdjacentText('afterbegin', 'Квартира');
  } else if (data.offer.type[0] === 'bungalo') {
    cloneTemplate.querySelector('.lodge__type').insertAdjacentText('afterbegin', 'Бунгало');
  } else {
    cloneTemplate.querySelector('.lodge__type').insertAdjacentText('afterbegin', 'Дом');
  }
  cloneTemplate.querySelector('.lodge__rooms-and-guests').insertAdjacentText('afterbegin', 'Для ' + data.offer.guests[0] + ' гостей в ' + data.offer.rooms[0] + ' комнатах');
  cloneTemplate.querySelector('.lodge__checkin-time').insertAdjacentText('afterbegin', 'Заезд после ' + data.offer.checkin[0] + ', выезд до ' + data.offer.checkout[0]);
  for (var i = 0; i < data.offer.features[0].length; i += 1) {
    var span = document.createElement('span');
    span.classList.add('feature__image', 'feature__image--' + data.offer.features[0][i]);
    cloneTemplate.querySelector('.lodge__features').appendChild(span);
  }
  cloneTemplate.querySelector('.lodge__description').insertAdjacentText('afterbegin', data.offer.description[0]);
  box.querySelector('.dialog__title img').setAttribute('src', data.author.avatar[0]);
  box.removeChild(replacement);
  box.appendChild(cloneTemplate);
};

var replaceDialogData = function (data, index, box) {
  box.querySelector('.lodge__title').textContent = data.offer.title[index];
  box.querySelector('.lodge__address').textContent = data.offer.address[index];
  box.querySelector('.lodge__price').innerHTML = data.offer.price[index] + ' \&#x20bd;/ночь';
  box.querySelector('.lodge__checkin-time').textContent = 'Заезд после ' + data.offer.checkin[index] + ', выезд до ' + data.offer.checkout[index];
};

var setPins = function (map, dialog, closeTable) {
  var pins = document.querySelectorAll('.pin:not(.pin__main)');
  var pinsImg = document.querySelectorAll('.pin:not(.pin__main) img');
  var pinActive = 'pin--active';
  var dialogClose = 'hidden';

  var deleteActivePin = function (element) {
    element.classList.remove(pinActive);
  };
  var onPinClick = function (evt) {
    var index = evt.target.getAttribute('data-index');
    if (evt.target === pinsImg[index]) {
      pins.forEach(deleteActivePin);
      pins[index].classList.add(pinActive);
      dialog.classList.remove(dialogClose);
      replaceDialogData(hotelsData, index, boxTable);
      document.addEventListener('keydown', onDialogEscPush);
    }
  };
  var onPinPush = function (evt) {
    var index = evt.target.getAttribute('data-index');
    if (evt.target === pins[index] && evt.keyCode === ENTER_KEYCODE) {
      pins.forEach(deleteActivePin);
      pins[index].classList.add(pinActive);
      dialog.classList.remove(dialogClose);
      replaceDialogData(hotelsData, index, boxTable);
      document.addEventListener('keydown', onDialogEscPush);
    }
  };
  var onDialogEscPush = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      dialog.classList.add(dialogClose);
      pins.forEach(deleteActivePin);
      document.removeEventListener('keydown', onDialogEscPush);
    }
  };
  var onCrossClick = function () {
    pins.forEach(deleteActivePin);
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

var hotelsData = setDescription(HOTEL_DESCRIPTION, NUMBER_PINS);
drawingPins(hotelsData, tokioPinMap, NUMBER_PINS);
drawingOnTeplate(hotelsData, longeTemplate, replaceTable, boxTable);
setPins(tokioPinMap, boxTable, dialogCross);
