app.directive('warResults', function ($rootScope, $state, $uibModal) {


    return {
        restrict: 'E',
        scope: {
            
        },
        templateUrl: 'js/war-results/war-results.html',
        link: function(scope){

            scope.winners = false;
            // scope.victory = false;
            scope.end = false;

            // scope.warResults = [];

            // scope.warResults = [
            //     'sdc', 'vdfvfrsvd', 'aaaaa', 'vdfsvd', 'klscnsdkf', 'jfosiefjoso', 'jsdfoies', 'fcjsidioer', 'jsfihf'
            // ]

            scope.showWarResults = function() {
                var modalInstance = $uibModal.open({
                    animation: scope.animationsEnabled,
                    templateUrl: 'warResultsModal',
                    scope: scope,
                    windowClass: 'war-modal',
                    controller: function() {
                        scope.closeModal = function(){
                           modalInstance.close();
                        }
                    }
                    ,
                    backdrop  : 'static',
                    keyboard  : false
                })

            }

            // console.log('war results', scope.warResults)

            // scope.showWarResults();

            // scope.dismissModal = function () {
            //     $uibModal.dismiss('cancel');
            // }

            scope.showWinner = function () {
                scope.end = true;
                scope.warResults = false;
            }

            scope.leaveGame = function () {
                //redirect to home page
                localStorage.clear();
                $state.go('home');
                //clear game from db
                scope.$emit('leave game')
            }

            scope.$on('warHappened', function(data, args) {
                scope.warResults = args;
                scope.showWarResults();
            })

            scope.$on('gameEnded', function(data, args) {
                scope.victory = true;
                scope.gameResults = args[0];
                scope.winners = args[1];
            })

        }

    };

});
