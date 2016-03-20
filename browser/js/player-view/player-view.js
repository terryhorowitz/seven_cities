app.config(function ($stateProvider) {

    $stateProvider.state('playerView', {
        url: '/player-view',
        controller: 'PlayerViewController',
        templateUrl: 'js/player-view/player-view.html'
    });

});

app.controller('PlayerViewController', function ($scope, $state) {



});