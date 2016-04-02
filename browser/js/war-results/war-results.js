app.directive('warResults', function ($rootScope, $state, $uibModal) {


    return {
        restrict: 'E',
        scope: {
            
        },
        templateUrl: 'js/war-results/war-results.html',
        link: function(scope){

            scope.winners = false;
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
                    // ,
                    // backdrop  : 'static',
                    // keyboard  : false
                })

            }

            scope.dismissModal = function () {
                // $uibModal.dismiss('cancel');
            }

            scope.showWinner = function () {
                scope.end = true;
                scope.warResults = false;
                // scope.victory = true;
            }

            scope.leaveGame = function () {
                //redirect to home page
                localStorage.clear();
                $state.go('home');
                //clear game from db
                console.log('right before broadcast in directive')
                scope.$emit('leave game')
            }
            // scope.showWarResults();
            // console.log(scope.warResults);

            scope.$on('warHappened', function(data, args) {
                scope.warResults = args;
                // console.log('war results directive', scope.warResults);
                // scope.$digest();
                scope.showWarResults();
            })

            scope.$on('gameEnded', function(data, args) {
                scope.victory = true;
                // scope.gameResults = args;
                scope.gameResults = args[0];
                scope.winners = args[1];
                // scope.$digest();
                console.log('game results winners', scope.winners);
                // scope.showGameResults();
            })

        }

    };

});
