var app = angular.module('cliApp', []);



app.controller('cliCtrl', function($scope, $http) {
    $scope.loadList = function() {
        $http.get('/api/clilist').success(function(res) {
            $scope.prdList = res;
            console.log(res);
        })
    };
    $scope.loadList();

    $scope.statusCls = function(x) {
        var status = x.Status;
        // var btnObj = angular.element($event.currentTarget);
        if (status == true) {
            return "w3-btn w3-indigo";
        } else {
            return "w3-btn w3-white w3-border"
        };
    };
    $scope.statusAct = function(x) {
        if (x.Status == true) {
            return "Active"
        } else {
            return "Inactive"
        };
    };


})