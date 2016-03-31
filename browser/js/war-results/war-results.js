app.directive('warResults', function ($rootScope, $state, $uibModal) {


    return {
        restrict: 'E',
        scope: {
            
        },
        templateUrl: 'js/war-results/war-results.html',
        link: function(scope){

            // scope.warResults = [];

            // scope.warResults = [
            //     'sdc', 'vdfvfrsvd', 'aaaaa', 'vdfsvd',
            // ]

            scope.showWarResults = function() {
                $uibModal.open({
                    animation: scope.animationsEnabled,
                    templateUrl: 'warResultsModal',
                    size: 'small',
                    scope: scope
                })

            }
            // scope.showWarResults();
            // console.log(scope.warResults);

            scope.$on('warHappened', function(data, args) {
                scope.warResults = args;
                console.log(scope.warResults);
                scope.$digest();
                scope.showWarResults();
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