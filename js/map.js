'use strict';

(function () {
  var tokioPinMap = document.querySelector('.tokyo__pin-map');
  var longeTemplate = document.querySelector('#lodge-template').content;
  var replaceTable = document.querySelector('.dialog__panel');
  var boxTable = document.querySelector('#offer-dialog');
  var dialogCross = boxTable.querySelector('.dialog__close');

  window.drawingPins(window.hotelsData, tokioPinMap, window.NUMBER_PINS);
  window.drawingOnTeplate(window.hotelsData[0], longeTemplate, replaceTable, boxTable);
  window.setPins(tokioPinMap, boxTable, dialogCross);
})();
