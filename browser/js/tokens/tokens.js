app.directive('tokens', function ($rootScope, $state) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/tokens/tokens.html',
        link: function (scope) {

            scope.numCoins = 0;
            scope.numMilitary = 0;

        }

    };

});
