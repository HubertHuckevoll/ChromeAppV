"use strict";

app.controller('prefCtrl', function ($scope, $http, $timeout, $window, $log, prefsSvc, camsSvc) {

  $scope.prefs = null;
  $scope.selectedCamSet = 0;
  $scope.newSetName = '';
  $scope.availableCams = null;
  $scope.selectedCams = null;
  $scope.justStored = false;
  $scope.status = "";

  $scope.newCam = {
    country: '',
    location: '',
    desc: '',
    homepage: '',
    url: '',
    enabled: true
  };

  $scope.countries = [{"code":"AFG","country":"Afghanistan"},{"code":"ALA","country":"Åland Islands"},{"code":"ALB","country":"Albania"},{"code":"DZA","country":"Algeria"},{"code":"ASM","country":"American Samoa"},{"code":"AND","country":"Andorra"},{"code":"AGO","country":"Angola"},{"code":"AIA","country":"Anguilla"},{"code":"ATA","country":"Antarctica"},{"code":"ATG","country":"Antigua and Barbuda"},{"code":"ARG","country":"Argentina"},{"code":"ARM","country":"Armenia"},{"code":"ABW","country":"Aruba"},{"code":"AUS","country":"Australia"},{"code":"AUT","country":"Austria"},{"code":"AZE","country":"Azerbaijan"},{"code":"BHS","country":"Bahamas"},{"code":"BHR","country":"Bahrain"},{"code":"BGD","country":"Bangladesh"},{"code":"BRB","country":"Barbados"},{"code":"BLR","country":"Belarus"},{"code":"BEL","country":"Belgium"},{"code":"BLZ","country":"Belize"},{"code":"BEN","country":"Benin"},{"code":"BMU","country":"Bermuda"},{"code":"BTN","country":"Bhutan"},{"code":"BOL","country":"Bolivia, Plurinational State of"},{"code":"BES","country":"Bonaire, Sint Eustatius and Saba"},{"code":"BIH","country":"Bosnia and Herzegovina"},{"code":"BWA","country":"Botswana"},{"code":"BVT","country":"Bouvet Island"},{"code":"BRA","country":"Brazil"},{"code":"IOT","country":"British Indian Ocean Territory"},{"code":"BRN","country":"Brunei Darussalam"},{"code":"BGR","country":"Bulgaria"},{"code":"BFA","country":"Burkina Faso"},{"code":"BDI","country":"Burundi"},{"code":"KHM","country":"Cambodia"},{"code":"CMR","country":"Cameroon"},{"code":"CAN","country":"Canada"},{"code":"CPV","country":"Cape Verde"},{"code":"CYM","country":"Cayman Islands"},{"code":"CAF","country":"Central African Republic"},{"code":"TCD","country":"Chad"},{"code":"CHL","country":"Chile"},{"code":"CHN","country":"China"},{"code":"CXR","country":"Christmas Island"},{"code":"CCK","country":"Cocos (Keeling) Islands"},{"code":"COL","country":"Colombia"},{"code":"COM","country":"Comoros"},{"code":"COG","country":"Congo"},{"code":"COD","country":"Congo, the Democratic Republic of the"},{"code":"COK","country":"Cook Islands"},{"code":"CRI","country":"Costa Rica"},{"code":"CIV","country":"Côte d'Ivoire"},{"code":"HRV","country":"Croatia"},{"code":"CUB","country":"Cuba"},{"code":"CUW","country":"Curaçao"},{"code":"CYP","country":"Cyprus"},{"code":"CZE","country":"Czech Republic"},{"code":"DNK","country":"Denmark"},{"code":"DJI","country":"Djibouti"},{"code":"DMA","country":"Dominica"},{"code":"DOM","country":"Dominican Republic"},{"code":"ECU","country":"Ecuador"},{"code":"EGY","country":"Egypt"},{"code":"SLV","country":"El Salvador"},{"code":"GNQ","country":"Equatorial Guinea"},{"code":"ERI","country":"Eritrea"},{"code":"EST","country":"Estonia"},{"code":"ETH","country":"Ethiopia"},{"code":"FLK","country":"Falkland Islands (Malvinas)"},{"code":"FRO","country":"Faroe Islands"},{"code":"FJI","country":"Fiji"},{"code":"FIN","country":"Finland"},{"code":"FRA","country":"France"},{"code":"GUF","country":"French Guiana"},{"code":"PYF","country":"French Polynesia"},{"code":"ATF","country":"French Southern Territories"},{"code":"GAB","country":"Gabon"},{"code":"GMB","country":"Gambia"},{"code":"GEO","country":"Georgia"},{"code":"DEU","country":"Germany"},{"code":"GHA","country":"Ghana"},{"code":"GIB","country":"Gibraltar"},{"code":"GRC","country":"Greece"},{"code":"GRL","country":"Greenland"},{"code":"GRD","country":"Grenada"},{"code":"GLP","country":"Guadeloupe"},{"code":"GUM","country":"Guam"},{"code":"GTM","country":"Guatemala"},{"code":"GGY","country":"Guernsey"},{"code":"GIN","country":"Guinea"},{"code":"GNB","country":"Guinea-Bissau"},{"code":"GUY","country":"Guyana"},{"code":"HTI","country":"Haiti"},{"code":"HMD","country":"Heard Island and McDonald Islands"},{"code":"VAT","country":"Holy See (Vatican City State)"},{"code":"HND","country":"Honduras"},{"code":"HKG","country":"Hong Kong"},{"code":"HUN","country":"Hungary"},{"code":"ISL","country":"Iceland"},{"code":"IND","country":"India"},{"code":"IDN","country":"Indonesia"},{"code":"IRN","country":"Iran, Islamic Republic of"},{"code":"IRQ","country":"Iraq"},{"code":"IRL","country":"Ireland"},{"code":"IMN","country":"Isle of Man"},{"code":"ISR","country":"Israel"},{"code":"ITA","country":"Italy"},{"code":"JAM","country":"Jamaica"},{"code":"JPN","country":"Japan"},{"code":"JEY","country":"Jersey"},{"code":"JOR","country":"Jordan"},{"code":"KAZ","country":"Kazakhstan"},{"code":"KEN","country":"Kenya"},{"code":"KIR","country":"Kiribati"},{"code":"PRK","country":"Korea, Democratic People's Republic of"},{"code":"KOR","country":"Korea, Republic of"},{"code":"KWT","country":"Kuwait"},{"code":"KGZ","country":"Kyrgyzstan"},{"code":"LAO","country":"Lao People's Democratic Republic"},{"code":"LVA","country":"Latvia"},{"code":"LBN","country":"Lebanon"},{"code":"LSO","country":"Lesotho"},{"code":"LBR","country":"Liberia"},{"code":"LBY","country":"Libya"},{"code":"LIE","country":"Liechtenstein"},{"code":"LTU","country":"Lithuania"},{"code":"LUX","country":"Luxembourg"},{"code":"MAC","country":"Macao"},{"code":"MKD","country":"Macedonia, the former Yugoslav Republic of"},{"code":"MDG","country":"Madagascar"},{"code":"MWI","country":"Malawi"},{"code":"MYS","country":"Malaysia"},{"code":"MDV","country":"Maldives"},{"code":"MLI","country":"Mali"},{"code":"MLT","country":"Malta"},{"code":"MHL","country":"Marshall Islands"},{"code":"MTQ","country":"Martinique"},{"code":"MRT","country":"Mauritania"},{"code":"MUS","country":"Mauritius"},{"code":"MYT","country":"Mayotte"},{"code":"MEX","country":"Mexico"},{"code":"FSM","country":"Micronesia, Federated States of"},{"code":"MDA","country":"Moldova, Republic of"},{"code":"MCO","country":"Monaco"},{"code":"MNG","country":"Mongolia"},{"code":"MNE","country":"Montenegro"},{"code":"MSR","country":"Montserrat"},{"code":"MAR","country":"Morocco"},{"code":"MOZ","country":"Mozambique"},{"code":"MMR","country":"Myanmar"},{"code":"NAM","country":"Namibia"},{"code":"NRU","country":"Nauru"},{"code":"NPL","country":"Nepal"},{"code":"NLD","country":"Netherlands"},{"code":"NCL","country":"New Caledonia"},{"code":"NZL","country":"New Zealand"},{"code":"NIC","country":"Nicaragua"},{"code":"NER","country":"Niger"},{"code":"NGA","country":"Nigeria"},{"code":"NIU","country":"Niue"},{"code":"NFK","country":"Norfolk Island"},{"code":"MNP","country":"Northern Mariana Islands"},{"code":"NOR","country":"Norway"},{"code":"OMN","country":"Oman"},{"code":"PAK","country":"Pakistan"},{"code":"PLW","country":"Palau"},{"code":"PSE","country":"Palestinian Territory, Occupied"},{"code":"PAN","country":"Panama"},{"code":"PNG","country":"Papua New Guinea"},{"code":"PRY","country":"Paraguay"},{"code":"PER","country":"Peru"},{"code":"PHL","country":"Philippines"},{"code":"PCN","country":"Pitcairn"},{"code":"POL","country":"Poland"},{"code":"PRT","country":"Portugal"},{"code":"PRI","country":"Puerto Rico"},{"code":"QAT","country":"Qatar"},{"code":"REU","country":"Réunion"},{"code":"ROU","country":"Romania"},{"code":"RUS","country":"Russian Federation"},{"code":"RWA","country":"Rwanda"},{"code":"BLM","country":"Saint Barthélemy"},{"code":"SHN","country":"Saint Helena, Ascension and Tristan da Cunha"},{"code":"KNA","country":"Saint Kitts and Nevis"},{"code":"LCA","country":"Saint Lucia"},{"code":"MAF","country":"Saint Martin (French part)"},{"code":"SPM","country":"Saint Pierre and Miquelon"},{"code":"VCT","country":"Saint Vincent and the Grenadines"},{"code":"WSM","country":"Samoa"},{"code":"SMR","country":"San Marino"},{"code":"STP","country":"Sao Tome and Principe"},{"code":"SAU","country":"Saudi Arabia"},{"code":"SEN","country":"Senegal"},{"code":"SRB","country":"Serbia"},{"code":"SYC","country":"Seychelles"},{"code":"SLE","country":"Sierra Leone"},{"code":"SGP","country":"Singapore"},{"code":"SXM","country":"Sint Maarten (Dutch part)"},{"code":"SVK","country":"Slovakia"},{"code":"SVN","country":"Slovenia"},{"code":"SLB","country":"Solomon Islands"},{"code":"SOM","country":"Somalia"},{"code":"ZAF","country":"South Africa"},{"code":"SGS","country":"South Georgia and the South Sandwich Islands"},{"code":"SSD","country":"South Sudan"},{"code":"ESP","country":"Spain"},{"code":"LKA","country":"Sri Lanka"},{"code":"SDN","country":"Sudan"},{"code":"SUR","country":"Suriname"},{"code":"SJM","country":"Svalbard and Jan Mayen"},{"code":"SWZ","country":"Swaziland"},{"code":"SWE","country":"Sweden"},{"code":"CHE","country":"Switzerland"},{"code":"SYR","country":"Syrian Arab Republic"},{"code":"TWN","country":"Taiwan, Province of China"},{"code":"TJK","country":"Tajikistan"},{"code":"TZA","country":"Tanzania, United Republic of"},{"code":"THA","country":"Thailand"},{"code":"TLS","country":"Timor-Leste"},{"code":"TGO","country":"Togo"},{"code":"TKL","country":"Tokelau"},{"code":"TON","country":"Tonga"},{"code":"TTO","country":"Trinidad and Tobago"},{"code":"TUN","country":"Tunisia"},{"code":"TUR","country":"Turkey"},{"code":"TKM","country":"Turkmenistan"},{"code":"TCA","country":"Turks and Caicos Islands"},{"code":"TUV","country":"Tuvalu"},{"code":"UGA","country":"Uganda"},{"code":"UKR","country":"Ukraine"},{"code":"ARE","country":"United Arab Emirates"},{"code":"GBR","country":"United Kingdom"},{"code":"USA","country":"United States"},{"code":"UMI","country":"United States Minor Outlying Islands"},{"code":"URY","country":"Uruguay"},{"code":"UZB","country":"Uzbekistan"},{"code":"VUT","country":"Vanuatu"},{"code":"VEN","country":"Venezuela, Bolivarian Republic of"},{"code":"VNM","country":"Viet Nam"},{"code":"VGB","country":"Virgin Islands, British"},{"code":"VIR","country":"Virgin Islands, U.S."},{"code":"WLF","country":"Wallis and Futuna"},{"code":"ESH","country":"Western Sahara"},{"code":"YEM","country":"Yemen"},{"code":"ZMB","country":"Zambia"},{"code":"ZWE","country":"Zimbabwe"}];

  $scope.load = function()
  {
    $scope.availableCams = camsSvc.get();

    prefsSvc.get(function(data) {
      $scope.prefs = data;

      if ($scope.prefs.webcams.length > 0) {
        $scope.prefs.webcams[$scope.selectedCamSet].setCams.sort($scope.camSort);
      }
    });
  };

  $scope.addCam = function()
  {
    $scope.availableCams.push($scope.newCam);
    $scope.availableCams.sort($scope.camSort);
    $scope.status = "Webcam added.";
  };

  $scope.updateCam = function(idx)
  {
    $scope.availableCams.sort($scope.camSort);
    $scope.status = "Webcam updated.";
  };

  $scope.rmvCam = function(idx)
  {
    $scope.availableCams.splice(idx, 1);
    $scope.availableCams.sort($scope.camSort);
    $scope.status = "Webcam removed.";
  };

  $scope.toggleSet = function(idx) {
    $scope.selectedCamSet = idx;
  };

  $scope.addSet = function() {
    var newSet = {};

    if ($scope.newSetName !== '') {
      newSet.setName = $scope.newSetName;
      newSet.setCams = [];
      $scope.prefs.webcams.push(newSet);
      $scope.newSetName = '';
      $scope.selectedCamSet = $scope.prefs.webcams.length - 1;
    }
  };

  $scope.rmvSet = function(idx) {
    $scope.prefs.webcams.splice(idx, 1);
  };

  $scope.addCamToSet = function() {
    var alreadyIn = false;

    angular.forEach($scope.selectedCams, function(selectedCam, scIdx)
    {
      alreadyIn = false;
      angular.forEach($scope.prefs.webcams[$scope.selectedCamSet].setCams, function(camSetCam, cscIdx) {
        if (camSetCam.url == selectedCam.url) alreadyIn = true;
      });
      if (!alreadyIn) {
        $scope.prefs.webcams[$scope.selectedCamSet].setCams.push(selectedCam);
      }
    });
    $scope.prefs.webcams[$scope.selectedCamSet].setCams.sort($scope.camSort);
  };

  $scope.rmvCamFromSet = function(setIdx, camIdx) {
    $scope.prefs.webcams[setIdx].setCams.splice(camIdx, 1);
  };

  $scope.selectAllCams = function() {
    $scope.selectedCams = $scope.availableCams;
  };

  $scope.deselectAllCams = function() {
    $scope.selectedCams = null;
  };

  $scope.resetWidgetPos = function() {
    localStorage.removeItem('vineta.clock');
    localStorage.removeItem('vineta.location');
    localStorage.removeItem('vineta.weather');
    localStorage.removeItem('vineta.map');
    $scope.status = "Removed!";
  };

  $scope.apply = function() {
    prefsSvc.put($scope.prefs);
    camsSvc.put($scope.availableCams);
    $scope.justStored = true;
    $timeout(function() {
      var jetzt = new Date();
      $scope.justStored = false;
      $scope.$apply();
      $window.location.href = 'index.html?tstamp=' + jetzt.getTime();
    }, 500);
  };

  $scope.reset = function() {
    if (confirm("Do you really want to reset all preferences to their default values?")) {
      prefsSvc.reset(function(data) {
        $scope.prefs = data;
      });
    }
  };

  $scope.export = function(ev) {
    var today = new Date();
    var d = today.getDate();
    var m = today.getMonth()+1;//January is 0!`
    var y = today.getFullYear();
    if(d<10){d='0'+d}
    if(m<10){m='0'+m}
    today = y+'-'+m+'-'+d;

    window.URL = window.URL || window.webkitURL;
    var blob = new Blob([JSON.stringify($scope.availableCams)], {type: 'application/json'});
    $(ev.target).attr("href", window.URL.createObjectURL(blob));
    $(ev.target).attr("download", "webcams_"+today+".json");
    ev.cancelBubble = false;
  };

  $scope.import = function(files)
  {
    var file = files[0];
		if (file.name.search(/\.json$/i) != -1) {
			var reader = new FileReader();
			reader.onload = function(e) {
        $scope.availableCams = JSON.parse(reader.result);
        camsSvc.put($scope.availableCams);
        $scope.$apply();
			};
			reader.readAsText(file);
		} else {
			alert("File not supported!");
		}
  };

  $scope.camSort = function(a, b) {
    a = a.location + a.desc.toLowerCase();
    b = b.location + b.desc.toLowerCase();
    return (a < b) ? -1 : 1;
  };

  $scope.load();

});
