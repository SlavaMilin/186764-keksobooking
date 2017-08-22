'use strict';

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

var tokioPinMap = document.querySelector('.tokyo__pin-map');
var longeTemplate = document.querySelector('#dialog__panel').content;

// get min and max value and return random value, between them.

var getRandomNumber = function (min, max) {
  return Math.round(Math.random() * (max - min) + min);
};

// function for sort. get array and return random position inside

var getRandomSort = function () {
  return Math.random() - 0.5;
};

// function, that take copy of constant and return object

var setDescription = function (inputSettings) {
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
  for (var i = 0; i < 8; i += 1) {
    hotelsSettings.author.avatar.push('img/avatars/user0' + (i + 1) + '.png');
    hotelsSettings.offer.price.push(getRandomNumber(inputSettings.price[0], inputSettings.price[1]));
    hotelsSettings.offer.type.push(inputSettings.type[getRandomNumber(0, inputSettings.type.length - 1)]);
    hotelsSettings.offer.rooms.push(getRandomNumber(inputSettings.rooms[0], inputSettings.rooms[1]));
    hotelsSettings.offer.guests.push(getRandomNumber(inputSettings.guests[0], inputSettings.guests[1]));
    hotelsSettings.offer.checkin.push(inputSettings.checkin[getRandomNumber(0, inputSettings.checkin.length - 1)]);
    hotelsSettings.offer.checkout.push(inputSettings.checkout[getRandomNumber(0, inputSettings.checkout.length - 1)]);
    hotelsSettings.offer.features.push(inputSettings.features[getRandomNumber(0, inputSettings.features.length - 1)]);
    hotelsSettings.location.x.push(getRandomNumber(inputSettings.location.x[0], inputSettings.location.x[1]));
    hotelsSettings.location.y.push(getRandomNumber(inputSettings.location.y[0], inputSettings.location.y[1]));
  }
  for (var a = 0; a < 8; a += 1) {
    hotelsSettings.offer.address.push(hotelsSettings.location.x[a] + ', ' + hotelsSettings.location.y[a]);
  }
  hotelsSettings.author.avatar.sort(getRandomSort);
  hotelsSettings.offer.features.sort(getRandomSort);
  return hotelsSettings;
};

// get data and drawing pins on site map

var drawingPins = function (inputSettings, inputPlace) {
  for (var b = 0; b < 8; b += 1) {
    var mapPin = '<div class="pin" style="left: ' + inputSettings.location.x[b] + 'px; top: ' + inputSettings.location.y[b] + 'px"><img src="' + inputSettings.author.avatar[b] + '" class="rounded" width="40" height="40"></div>';
    inputPlace.insertAdjacentHTML('afterbegin', mapPin);
  }
};

var drawingOnTeplate = function (data, template) {
  var cloneTemplate = template.cloneNode(true);
  cloneTemplate.

};

var hotelsData = setDescription(HOTEL_DESCRIPTION);
drawingPins(hotelsData, tokioPinMap);
drawingOnTeplate(hotelsData, longeTemplate);
