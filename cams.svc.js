/* Factory providing a pref object */
app.factory('camsSvc', function($http) {
    return {

      cams: [{
        country: 'GER',
        location: 'Insel Rügen - Dranske',
        desc: 'Ferienhaus Rügen',
        homepage: 'http://www.ruegen-ferienhaus-ostsee.de/index.php?content=webcam_ruegen',
        url: 'http://webcam.hte-web.de/webcam_pic.jpg',
        enabled: true
      }],

      get: function()
      {
        if (typeof chrome !== "undefined" && typeof chrome.app !== "undefined" && chrome.app.isInstalled) {
          // The ID of the extension we want to talk to.
          var vinetaExtId = "jpillleejdekbceagkoncjcgdagbiogm"; // vineta extension

          // Make a simple request:
          chrome.runtime.sendMessage(vinetaExtId, {question: 'Dummy'},
            function(response) {
              console.log(response.answer);
          });
        }

        chrome.storage.local.get('vineta.availableCams', function(lcams) {
          if (lcams !== null) {
            this.cams = angular.copy(lcams);
          }
        });

        return this.cams;
      },

      put: function(cams) {
        chrome.storage.local.set('vineta.availableCams', JSON.stringify(cams));
      },

      reset: function() {
        chrome.storage.locale.remove('vineta.availableCams');
      }

    };
});
