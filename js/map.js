'use strict';

var tokioPinMap = document.querySelector('.tokyo__pin-map');
var longeTemplate = document.querySelector('#lodge-template').content;
var replaceTable = document.querySelector('.dialog__panel');
var boxTable = document.querySelector('#offer-dialog');

// constants of hottel settings

var HOTEL_DESCRIPTION = {
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
  location: {
    x: [300, 900],
    y: [100, 500]
  }
};
var NUMBER_PINS = 8;

// get min and max value and return random value, between them.

var getRandomNumber = function (min, max) {
  return Math.round(Math.random() * (max - min) + min);
};

// function for sort. get array and return random position inside

var getRandomSort = function () {
  return Math.random() - 0.5;
};

// function, that take copy of constant and return object

var setDescription = function (inputSettings, numberPins) {
  var hotelsSettings = {
    author: {
      avatar: [],
    },
    offer: {
      title: inputSettings.title.sort(getRandomSort),
      address: [],
      price: [],
      type: [],
      rooms: [],
      guests: [],
      checkin: [],
      checkout: [],
      features: [],
      description: inputSettings.description,
      photos: inputSettings.photos
    },
    location: {
      x: [],
      y: []
    }
  };
  for (var i = 0; i < numberPins; i += 1) {
    var randomNumberFeatures = getRandomNumber(1, inputSettings.features.length - 1);
    var sortingInputSettings = inputSettings.features.sort(getRandomSort);
    hotelsSettings.author.avatar.push('img/avatars/user0' + (i + 1) + '.png');
    hotelsSettings.offer.price.push(getRandomNumber(inputSettings.price[0], inputSettings.price[1]));
    hotelsSettings.offer.type.push(inputSettings.type[getRandomNumber(0, inputSettings.type.length - 1)]);
    hotelsSettings.offer.rooms.push(getRandomNumber(inputSettings.rooms[0], inputSettings.rooms[1]));
    hotelsSettings.offer.guests.push(getRandomNumber(inputSettings.guests[0], inputSettings.guests[1]));
    hotelsSettings.offer.checkin.push(inputSettings.checkin[getRandomNumber(0, inputSettings.checkin.length - 1)]);
    hotelsSettings.offer.checkout.push(inputSettings.checkout[getRandomNumber(0, inputSettings.checkout.length - 1)]);
    hotelsSettings.offer.features.push([]);
    for (var j = 0; j < randomNumberFeatures; j += 1) {
      hotelsSettings.offer.features[i].push(sortingInputSettings[j]);
    }
    hotelsSettings.location.x.push(getRandomNumber(inputSettings.location.x[0], inputSettings.location.x[1]));
    hotelsSettings.location.y.push(getRandomNumber(inputSettings.location.y[0], inputSettings.location.y[1]));
    hotelsSettings.offer.address.push(hotelsSettings.location.x[i] + ', ' + hotelsSettings.location.y[i]);
  }
  hotelsSettings.author.avatar.sort(getRandomSort);
  hotelsSettings.offer.features.sort(getRandomSort);
  return hotelsSettings;
};

// get data and drawing pins on site map

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

var hotelsData = setDescription(HOTEL_DESCRIPTION, NUMBER_PINS);
drawingPins(hotelsData, tokioPinMap, NUMBER_PINS);
drawingOnTeplate(hotelsData, longeTemplate, replaceTable, boxTable);
