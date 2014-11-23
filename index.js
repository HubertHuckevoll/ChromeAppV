"use strict";

var app = angular.module('vineta', ['meTools']);

app.controller('vinetaCtrl', function ($scope, $http, $timeout, prefsSvc) {

  $scope.prefs = null;

  $scope.selectedCamSet = {};

  $scope.visibleCam = {},
  $scope.weather = {'temp': 'n/a'},
  $scope.visibleIdx = -1,
  $scope.run = null,
  $scope.runCaption = 'Start',

  $scope.showChrome = false;
  $scope.delayChromeH = null;

  $scope.clockHours = "00";
  $scope.clockMins = "00";
  $scope.clockSecTick = false;

  $scope.mapUrl = '';
  $scope.mapCoord = '0/0';

  $scope.load = function() {

    prefsSvc.get(function(data) {
      $scope.prefs = data;
      console.log($scope.prefs);
      $scope.selectedCamSet = $scope.prefs.webcams[0];
      $scope.startStop();
    });
  };

  $scope.startStop = function() {
    if ($scope.run != null) {
      $scope.pause();
    } else {
      $scope.start();
    }
  };

  $scope.start = function() {
    $scope.runCaption = 'Pause';
    $scope.rotate();
  };

  $scope.stop = function() {
    if ($scope.run != null) {
      $timeout.cancel($scope.run);
      $scope.run = null;
      $scope.visibleIdx = -1;
      $scope.visibleCam = {},
      $scope.runCaption = 'Start';
    }
  };

  $scope.pause = function() {
    if ($scope.run != null) {
      $timeout.cancel($scope.run);
      $scope.run = null;
      $scope.runCaption = 'Start';
    }
  };

  $scope.jump = function(idx) {
    if ($scope.run != null) {
      $timeout.cancel($scope.run);
      $scope.run = null;
      $scope.visibleIdx = idx-1; // -1 => because rotate increments
      $scope.rotate();
    }
  };

  $scope.enableDisableWebcam = function()  {
    prefsSvc.put($scope.prefs);
  };

  $scope.rotate = function() {
    do {
      $scope.visibleIdx++;
      if ($scope.visibleIdx == $scope.selectedCamSet.setCams.length) $scope.visibleIdx = 0;
    } while ($scope.selectedCamSet.setCams[$scope.visibleIdx].enabled === false);

    $scope.visibleCam = $scope.selectedCamSet.setCams[$scope.visibleIdx];
    $scope.visibleCam.rotate = true;
    $scope.setWeather();
    $scope.setMap();
    $scope.run = $timeout($scope.rotate, $scope.prefs.slideTime * 1000);
  };

  $scope.setWeather = function() {
    $scope.weather.temp = 'n/a';
    $http.jsonp("http://api.openweathermap.org/data/2.5/weather?q=" + encodeURIComponent($scope.visibleCam.location) + ",de&units=metric&callback=JSON_CALLBACK").success(function(data) {
      if (data.cod != '404') {
        $scope.weather.temp = parseInt(data.main.temp);
      }
    });
  };

  $scope.setMap = function() {
    $http.get("http://nominatim.openstreetmap.org/search?format=json&polygon=0&q="+encodeURIComponent($scope.visibleCam.location)).success(function(data) {
      $scope.mapUrl = 'http://staticmap.openstreetmap.de/staticmap.php?center='+data[0].lat+','+data[0].lon+'&zoom=10&size=288x216&maptype=mapnik&markers='+data[0].lat+','+data[0].lon+',ltblu-pushpin';
      $scope.mapCoord = '10/'+data[0].lat+'/'+data[0].lon;   // needed for link to full map
    });
  };

  $scope.gotoCamHomepage = function(url) {
    window.open(url);
  };

  $scope.gotoFullMap = function() {
    window.open("http://www.openstreetmap.org/#map="+$scope.mapCoord);
  };

  $scope.showControlPanel = function() {
    $scope.delayChromeH = $timeout(function() {
      $scope.showChrome = true;
    }, 100);
  };

  $scope.hideControlPanel = function() {
    $timeout.cancel($scope.delayChromeH);
    $scope.showChrome = false;
  };

  $scope.updateClock = function() {
    $timeout(function() {
      var z = new Date();
      $scope.clockHours = z.getHours();
      $scope.clockMins = z.getMinutes();
      $scope.clockSecTick = !$scope.clockSecTick;
      $scope.updateClock();
    }, 1000);
  };

  $scope.setChanged = function() {
    $scope.stop();
    $scope.start();
  };

  $scope.load();
  $scope.updateClock();

});
