app.directive('tokens', function ($rootScope, $state) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/tokens/tokens.html',
        link: function (scope) {

            scope.coins = 0;
            scope.militaryLoss = 0;
            scope.militaryVictory = 0;

        }

    };

});
