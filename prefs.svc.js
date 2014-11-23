/* Factory providing a pref object */
app.factory('prefsSvc', function($http, camsSvc) {
    return {

      get: function(success)
      {
        var prefs = {
          slideTime: 8,
          showClock: false,
          showLocation: false,
          showWeather: false,
          showMap: false,
          osdOpacity: {opacity: 1},
          autoHideOverlays: false,
          displayMode: 'cover', /* contain */
          webcams: []
        };

        var lPrefs = JSON.parse(localStorage.getItem('vineta.prefs'));
        if (lPrefs !== null) {
          prefs = angular.copy(lPrefs);
        }

        if (prefs.webcams.length === 0) {
          var availableCams = camsSvc.get();
          var newSet = {};
          newSet.setName = 'default';
          newSet.setCams = angular.copy(availableCams);
          prefs.webcams.push(newSet);
        }

        success(prefs);
      },

      put: function(prefs) {
        localStorage.setItem('vineta.prefs', JSON.stringify(prefs));
      },

      reset: function(success) {
        localStorage.removeItem('vineta.prefs');
        this.get(success);
      }

    };
});