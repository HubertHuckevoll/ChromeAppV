app.directive('ngMeWebcam', function () {
    return function (scope, element, attrs)
    {
      var fadeTime = 750;
      var pImg = new Image();
      var pImg = $(pImg);
      var jetzt = new Date();
      var nUrl = '';
      var overlays = $();
      if (scope.prefs.showLocation) overlays = overlays.add('.location');
      if (scope.prefs.showWeather)  overlays = overlays.add('.weather');
      if (scope.prefs.showMap)      overlays = overlays.add('.map');

      pImg.load(function()
      {
        overlays.animate({opacity: 0}, fadeTime);
        element.animate({opacity: 0}, fadeTime, function() {
          element.empty();
          element.css('background-image', 'url('+nUrl+')');
          $('.place').html(scope.visibleCam.location);
          $('.placeDesc').html(scope.visibleCam.desc);
          if (scope.weather.temp != 'n/a') {
            $('.weather').html(scope.weather.temp + "&deg;&nbsp;C");
          } else {
            $('.weather').html('');
          }
          $('.map').attr("src", scope.mapUrl);
          overlays.animate({opacity: scope.prefs.osdOpacity.opacity}, fadeTime);
          element.animate({opacity: 1}, fadeTime);
        });
      });

      scope.$watch(attrs.ngMeWebcam, function(url)
      {
        if (url !== undefined) {
          jetzt = new Date();
          jetzt = jetzt.getTime();
          nUrl = (url.indexOf('?') != -1) ? url + '&tstamp=' + jetzt : url + '?tstamp=' + jetzt;

          pImg.attr('src', nUrl);
        }
      });
    };
});

app.directive('ngMeMousehover', function () {
    return function (scope, element, attrs) {
      var delayH = null;
      element.on("mouseenter", function(ev) {
        delayH = window.setTimeout(function() {
          $("#tooltip").attr('src', attrs.ngMeMousehover).fadeIn();
        }, 1000);
      });
      element.on("mouseleave", function(ev) {
        window.clearTimeout(delayH);
        $("#tooltip").fadeOut();
      });
    };
});

app.directive('ngMeMoveFade', function ($timeout) {
    return function (scope, element, attrs) {
      var delayH = null;
      element.on('mousemove', function(ev) {
        if (scope.prefs.autoHideOverlays == true) {
          var targets = ".location,.map,.weather";
          $timeout.cancel(delayH);
          $(targets).fadeIn('fast');
          delayH = $timeout(function() {
            $(targets).fadeOut('slow');
          }, 3000);
        }
      });
    };
});

/*
  Used for the control panel
*/
app.directive('ngMeRollFade', function () {
    return function (scope, element, attrs) {
      scope.$watch(attrs.ngMeRollFade, function(value) {
        if (value == true) {
          element.animate({height: '100%', opacity: '1'});
        } else {
          element.animate({height: '40px', opacity: '0'});
        }
      });
    };
});

/*
  Draggable Widget
*/
app.directive('ngMeWidget', function() {
  return {
    restrict: 'AE',
    link: function (scope, element, attrs)
    {
      element.attr('draggable', true);

      var offsetX = null;
      var offsetX = null;
      var wN = attrs['name']; // widget class = name

      chrome.storage.local.get('vineta.'+wN, function(wPrefs) {
        if (wPrefs != null) {
          element.css({
            'left': wPrefs.posX,
            'top': wPrefs.posY,
            'bottom': 'auto',
            'right': 'auto'
          });
        }
      });

      element.on('dragstart', function(ev) {
        element.css('border', '2px dashed tomato');
        offsetX = ev.originalEvent.screenX - ev.target.offsetLeft;
        offsetY = ev.originalEvent.screenY - ev.target.offsetTop;
      });

      element.parent().on('dragover', function(ev) {
        if (ev.preventDefault) {
          ev.preventDefault(); // Necessary. Allows us to drop.
        }
        //ev.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
        return false;
      });

      element.on('dragend', function(ev) {
        var wPrefs = {};
        wPrefs.posX = ev.originalEvent.screenX - offsetX;
        wPrefs.posY = ev.originalEvent.screenY - offsetY;
        console.log(ev.originalEvent.screenX, offsetX);
        //console.log(wPrefs.posY);

        chrome.storage.local.set('vineta.'+wN, JSON.stringify(wPrefs));

        element.css('border', 'none');
        element.css({
          'left': wPrefs.posX,
          'top': wPrefs.posY,
          'bottom': 'auto',
          'right': 'auto'
        });
        ev.stopPropagation();
        ev.preventDefault();
        return false;
      });
    }
  };
});

