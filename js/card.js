'use strict';

(function () {
  window.drawingOnTeplate = function (data, template, replacement, box) {
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
})();
