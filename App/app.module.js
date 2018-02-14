'use strict';

var heavenApp = angular.module('heavenApp', ['ngRoute', 'ngAnimate', 'ngSanitize', 'firebase', 'ui.bootstrap', 'xeditable', 'checklist-model', 'toastr', 'bsLoadingOverlay', 'bsLoadingOverlaySpinJs'])
    .run(function (bsLoadingOverlayService) {
        bsLoadingOverlayService.setGlobalConfig({
            //templateUrl: 'App/shared/spinner-template.html'
            templateUrl: 'bsLoadingOverlaySpinJs'
        });
    });

