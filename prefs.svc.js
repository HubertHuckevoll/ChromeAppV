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

        chrome.storage.local.get('vineta.prefs', function(lPrefs) {
          if (lPrefs !== null) {
            prefs = angular.copy(lPrefs);
          }
        });

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
        chrome.storage.local.set('vineta.prefs', JSON.stringify(prefs));
      },

      reset: function(success) {
        chrome.storage.local.remove('vineta.prefs');
        this.get(success);
      }

    };
});