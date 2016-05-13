'use strict;'

angular.module('vg.simpleFileDiff',[])
  .directive('fileDiff', function() {
    return {
      restrict: 'E',
      scope: {
        fileOne: '=',
        fileTwo: '='
      },
      template: "<output>" +
                  "<div class='text-center form-group'>" +
                    "<button class='btn btn-primary btn-block js-diff'>Diff</button>" +
                  "</div>" +
                  "<pre ng-show='resultLines.length'>" +
                    "<div ng-repeat='line in resultLines'>{{line}}<div>" +
                  "</pre>" +
                "</output>",
      replace: true,
      controller: [
        '$scope',
        '$element',
        '$q',
        function($scope,$element,$q) {
          $scope.resultLines = [];

          function readFile(file) {
            var reader,
                deferred = $q.defer();
            reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function(event) {
              deferred.resolve(event.target.result);
            }

            return deferred.promise;
          }

          function findLCSMatrix(f1,f2) {
            var f1Len,f2Len;

            f1Len = f1.length;
            f2Len = f2.length;
            lcsMatrix = [];

            for (var i = 0; i <= f1Len; i++) lcsMatrix.push([0]);
            for (var j = 0; j < f2Len; j++) lcsMatrix[0].push(0);

            for(var i = 0; i < f1Len; i++) {
              for(var j = 0; j < f2Len; j++) {
                if (f1[i].trim() === f2[j].trim())
                  lcsMatrix[i+1][j+1] = lcsMatrix[i][j]+1;
                else
                  lcsMatrix[i+1][j+1] = Math.max(lcsMatrix[i+1][j], lcsMatrix[i][j+1]);
              }
            }

            return lcsMatrix;
          }

          function printDiff(X, Y, C, i, j){
            if (i > 0 && j > 0 && X[i-1].trim() === Y[j-1].trim()) {
              printDiff(X, Y,C, i-1, j-1)
              $scope.resultLines.push( i + '  ' + X[i-1] );
            } else {
              if (j > 0 && (i == 0 || C[i][j-1] >= C[i-1][j])) {
                printDiff(X, Y,C, i, j-1)
                if ( j !== i )
                  $scope.resultLines.push( (j || (i+1)) + '+ ' + Y[j-1] );
              } else if (i > 0 && (j == 0 || C[i][j-1] < C[i-1][j])) {
                printDiff(X, Y,C, i-1, j)
                if ( (i-1) === j && Y[j]) {
                  $scope.resultLines.push( (i || (j+1)) + '* ' + X[i-1] + '|' + Y[j] );
                } else {
                  $scope.resultLines.push( (i || j) + '- ' + X[i-1] );
                }
              }
            }
          }

          $element.find('button').on('click', function() {
            if (!window.FileReader && !window.FileList)
              return alert('Your browser does not support HTML5 File API');

            if ($scope.fileOne.name && $scope.fileTwo.name) {
              var f1,f2;
              $scope.resultLines.length = 0;

              readFile($scope.fileOne)
                .then(function(result) { f1 = result.split('\n'); })
                .then(function(){ return readFile($scope.fileTwo); })
                .then(function(result){
                  f2 = result.split('\n');
                  if (f1 && f2) {
                    var lcsMatrix, f1Len, f2Len;
                    f1Len = f1.length;
                    f2Len = f2.length;
                    lcsMatrix = findLCSMatrix(f1,f2);

                    printDiff(f1, f2, lcsMatrix, f1Len, f2Len);
                  }
                });
            } else alert('Pls select 2 files');
          });
        }]
    };
  });
