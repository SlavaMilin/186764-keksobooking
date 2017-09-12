'use strict';

(function () {
  window.drawingPins = function (inputSettings, inputPlace, numberPins) {
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

  window.setPins = function (map, dialog, closeTable) {
    var boxTable = document.querySelector('#offer-dialog');
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
        replaceDialogData(window.hotelsData, index, boxTable);
        document.addEventListener('keydown', onDialogEscPush);
      }
    };
    var onPinPush = function (evt) {
      var index = evt.target.getAttribute('data-index');
      if (evt.target === pins[index] && evt.keyCode === window.ENTER_KEYCODE) {
        if (pinActive) {
          pins[pinActive].classList.remove(pinActiveClass);
        }
        pinActive = index;
        pins[index].classList.add(pinActiveClass);
        dialog.classList.remove(dialogClose);
        replaceDialogData(window.hotelsData, index, boxTable);
        document.addEventListener('keydown', onDialogEscPush);
      }
    };
    var onDialogEscPush = function (evt) {
      if (evt.keyCode === window.ESC_KEYCODE) {
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
  var replaceDialogData = function (data, index, box) {
    box.querySelector('.dialog__title img').setAttribute('src', data[index].author.avatar);
    box.querySelector('.lodge__title').textContent = data[index].offer.title;
    box.querySelector('.lodge__address').textContent = data[index].location.x + ', ' + data[index].location.y;
    box.querySelector('.lodge__price').textContent = data[index].offer.price + ' \u20BD/ночь';
    box.querySelector('.lodge__checkin-time').textContent = 'Заезд после ' + data[index].offer.checkin + ', выезд до ' + data[index].offer.checkout;
  };
})();
