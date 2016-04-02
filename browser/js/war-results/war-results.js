app.directive('warResults', function ($rootScope, $state, $uibModal) {


    return {
        restrict: 'E',
        scope: {
            
        },
        templateUrl: 'js/war-results/war-results.html',
        link: function(scope){

            scope.winner = false;
            scope.victory = false;
            scope.end = false;

            // scope.warResults = [];

            // scope.warResults = [
            //     'sdc', 'vdfvfrsvd', 'aaaaa', 'vdfsvd', 'klscnsdkf', 'jfosiefjoso', 'jsdfoies', 'fcjsidioer', 'jsfihf'
            // ]

            scope.showWarResults = function() {
                $uibModal.open({
                    animation: scope.animationsEnabled,
                    templateUrl: 'warResultsModal',
                    scope: scope,
                    windowClass: 'war-modal'
                })

            }

            scope.dismissModal = function () {

            }

            scope.showWinner = function () {
                scope.end = true;
                scope.warResults = false;
                scope.victory = false;
            }

            scope.leaveGame = function () {

            }
            // scope.showWarResults();
            // console.log(scope.warResults);

            scope.$on('warHappened', function(data, args) {
                scope.warResults = args;
                console.log('war results directive', scope.warResults);
                scope.$digest();
                scope.showWarResults();
            })

            scope.$on('gameEnded', function(data, args) {
                scope.victory = true;
                // scope.gameResults = args;
                scope.gameResults = args[0];
                scope.winner = args[1];
                scope.$digest();
                console.log('game results directive', scope.gameResults);
                // scope.showGameResults();
            })

            // socket.on('war results', function(warResults) {
            //     console.log('@@@@@@@@@@war results inside the DIRECTIVE')
            //     console.log('warResults', warResults)
            //     scope.warResults = warResults;
            //     scope.showWarResults();
            // })
            // scope.warResults = true;


        }

    };

});
