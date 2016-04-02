// app.directive('gameResults', function ($rootScope, $state, $uibModal) {


//     return {
//         restrict: 'E',
//         scope: {
            
//         },
//         templateUrl: 'js/game-results/game-results.html',
//         link: function(scope){

//             // scope.warResults = [];



//             scope.showGameResults = function() {
//                 $uibModal.open({
//                     animation: scope.animationsEnabled,
//                     templateUrl: 'gameResultsModal',
//                     scope: scope,
//                     windowClass: 'game-modal'
//                 })

//             }
//             // scope.showWarResults();
//             // console.log(scope.warResults);

//             scope.$on('gameEnded', function(data, args) {
//                 // scope.gameResults = args;
//                 console.log('got to the directive', scope.gameResults);
//                 scope.gameResults = args[0];
//                 scope.winner = args[1];
//                 scope.$digest();
//                 scope.showGameResults();
//             })

//             // socket.on('war results', function(warResults) {
//             //     console.log('@@@@@@@@@@war results inside the DIRECTIVE')
//             //     console.log('warResults', warResults)
//             //     scope.warResults = warResults;
//             //     scope.showWarResults();
//             // })
//             // scope.warResults = true;


//         }

//     };

// });
