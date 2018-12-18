(function(){
  'use strict';

  angular.module('app')  
  .directive('chooseFile', function() {
    return {
      scope: {
        fileName: '='      
      },
      link: function (scope, elem, attrs) {        
        var button = elem.find('button');
        var input = angular.element(elem[0].querySelector('input#fileInput'));
        button.bind('click', function() {          
          input[0].click();
        });
        input.bind('change', function(e) {
          scope.$apply(function() {
            var files = e.target.files;
            if (files[0]) {
              scope.fileName = files[0];
            } else {
              scope.fileName = null;
            }
          });
        });
      }
    };
  });
   
}());