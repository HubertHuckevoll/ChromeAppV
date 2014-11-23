"use strict";

angular.module('meTools', []);

angular.module('meTools').directive('ngMeShowFade', function () {
    return function (scope, element, attrs) {
      scope.$watch(attrs.ngMeShowFade, function(value) {
        if (value == true) {
          element.animate({opacity: 1});
        } else {
          element.animate({opacity: 0});
        }
      });
    };
});

angular.module('meTools').directive('ngMeSlide', function () {
    return function (scope, element, attrs) {
      scope.$watch(attrs.ngMeSlide, function(value) {
        if (value === true) {
          element.slideDown('fast');
        } else {
          element.slideUp('fast');
        }
      });
    };
});

angular.module('meTools').directive('ngMeTab', function () {
    return function (scope, element, attrs)
    {
      var link = $("<a>").html(attrs.caption).addClass('tab');
      link.click(function() {
        $(attrs.anchor + ' .tab').removeClass('activeTab');
        link.addClass('activeTab');

        element.parent().find('div[ng-me-tab]').slideUp();
        element.parent().find('div[ng-me-tab="' + attrs.ngMeTab + '"]').slideDown();
      });

      $(attrs.anchor).append(link);

      if (attrs.active != undefined) {
        link.addClass('activeTab');
        element.css('display', 'block');
      } else {
        element.css('display', 'none');
      }
    };
});

angular.module('meTools').directive('ngMeNotify', function () {
    return function (scope, element, attrs)
    {
      scope.$watch(attrs.ngMeNotify, function(value) {
        if (value != '') {
          element.html(value).show('fast').delay(3500).hide('slow', function() {
            scope[attrs.ngMeNotify] = '';
            scope.$apply();
          });
        }
      });
    };
});

angular.module('meTools').directive('ngMeVer', function () {
  return function (scope, element, attrs)
  {
    $.get('ver.txt', function(data) {
      element.html(data);
    });
  };
});

angular.module('meTools').filter('zeropad', function() {
  return function(input, scope) {
    if ((input !== null) && (input.toString().length < 2)) {
      input = "0" + input.toString();
    }
    return input;
  }
});

angular.module('meTools').directive('ngMeFileChange', function() {
  return {
    restrict: "A",
    scope: {method:'&ngMeFileChange'},
    link: function (scope, element, attrs) {
      element.on('change', function(ev) {
        var f = element.context.files; // why the "context" ?!
        scope.method({files: f});
      });
    }
  };
});

