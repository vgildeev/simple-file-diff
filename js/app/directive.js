'use strict;'

angular.module('vg.testTask')
  .directive('fileInput', function() {
    return {
      restrict: 'E',
      scope: {
        file: '=ngModel'
      },
      template: "<div class='form-group'>" +
                  "<input type='file' />" +
                  "<p ng-show='fileName'>Content for {{fileName}}</p>" +
                  "<output><pre>{{text}}</pre></output>" +
                "</div>",
      replace: true,
      controller: ['$scope', '$element', function($scope,$element) {
        $element.find('input').on('change', function() {
          var file = this.files[0];
          $scope.file = file;
          $scope.fileName = file.name;
          $scope.readFile(file);
          $scope.$apply();
        });

        $scope.readFile = function(file) {
          if (!window.FileReader && !window.FileList) {
            return alert('Your browser does not support HTML5 File API');
          } else {
            var reader;
            reader = new FileReader();
            reader.readAsText(file);
            reader.onload =  function(event) {
              $scope.text = event.target.result;
              $scope.$apply();
            }
          }
        }
      }]
    };
  });
