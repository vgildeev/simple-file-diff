'use strict';

angular.module('vg.testTask',['vg.simpleFileDiff'])
  .config(['$compileProvider', function($compileProvider) {
    $compileProvider.debugInfoEnabled(false);
  }]);
