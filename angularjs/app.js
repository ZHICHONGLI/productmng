var app = angular.module('myApp', ['ui.bootstrap']);
app.directive('formList', function() {
    var directive = {};
    directive.restrict = 'E', 'A';
    directive.templateUrl = "/templates/formlist.html";
    //directive.scope = {};
    return directive;
});
app.directive('onlyNumbers', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function(inputs) {
                if (inputs == undefined) return ''
                var transedInput = inputs.replace(/[^0-9+.]/g, '');
                if (transedInput != inputs) {
                    modelCtrl.$setViewValue(transedInput);
                    modelCtrl.$render();
                }
                return transedInput;
            });
        }
    };
});
app.controller('prodCtrl', function($scope, $http, $uibModal, $log, $document) {

    $scope.loadList = function() {
        $http.get('/api/products').success(function(res) {
            $scope.prdList = res;
            console.log(res);
        })
    };
    $scope.loadList();

    $scope.addPrd = function() {
        $scope.message = "Add Product Button Clicked";
        console.log($scope.message);

        var modalInstance = $uibModal.open({
            templateUrl: 'templates/modaladd.html',
            controller: ModalInstanceCtrl,
            scope: $scope,
            windowClass: 'app-modal-window',
            resolve: {
                userForm: function() {
                    return $scope.userForm;
                }
            }
        });

        modalInstance.result.then(function(selectedItem) {
            $scope.selected = selectedItem;
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    //    $scope.newPrd = { id: , Name: "", Description: "", Price: , Stock: , Packing: "" };
    $scope.newPrd = {};
    $scope.addName;
    $scope.addDes;
    $scope.addPrice;
    $scope.addStc;
    $scope.addPkg;
    $scope.testObj;

    $scope.freshPrd = function(res) {
        $scope.prdList = res;
        $scope.newPrd = {};
    };
    $scope.delPrd = function(x) {
        $scope.delObj = x;
        var modalInstance = $uibModal.open({
            templateUrl: 'templates/modaldel.html',
            controller: ModalInstanceCtrl,
            scope: $scope,
            // windowClass: 'app-modal-window',
            resolve: {
                userForm: function() {
                    return $scope.userForm;
                }
            }
        });

        modalInstance.result.then(function(selectedItem) {
            $scope.selected = selectedItem;
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.statusChange = function(x, $event) {
        var newStatus = !x.Status;
        var idx = x._id;
        var btnObj = angular.element($event.currentTarget);
        //console.log(btnObj[0].className);
        //var btnCls = btnObj[0].className;

        $http.put('/api/products/changesta/' + idx, { Status: newStatus }).success(function(res) {
            console.log("status change done");
            x.Status = newStatus;
            /*      if (newStatus == false) {
                      btnObj[0].className = "w3-btn w3-dark-grey";
                  } else {
                      btnObj[0].className = "w3-btn w3-indigo";
                  };

              */
        }).error(function(res) {
            console.log("status change failed");
        });
    };
    $scope.statusCls = function(x) {
        var status = x.Status;
        // var btnObj = angular.element($event.currentTarget);
        if (status == true) {
            return "w3-btn w3-indigo";
        } else {
            return "w3-btn w3-white w3-border"
        };
    }
    $scope.editPrd = function(x) {
        // $scope.originalPrd = angular.copy(x);
        $scope.editObj = angular.copy(x);
        //console.log($scope.editObj);
        $scope.message = "Add Product Button Clicked";
        console.log($scope.message);

        var modalInstance = $uibModal.open({
            templateUrl: 'templates/modaledit.html',
            controller: ModalInstanceCtrl,
            scope: $scope,
            windowClass: 'app-modal-window',
            resolve: {
                userForm: function() {
                    return $scope.userForm;
                }
            }
        });

        modalInstance.result.then(function(selectedItem) {
            $scope.selected = selectedItem;
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    var preStock;
    $scope.stockEdit = function(x) {
        $scope.activeItem = x;
        preStock = angular.copy(x.Stock);
        console.log(preStock);
    };
    $scope.updateStock = function(x) {
        $scope.activeItem = {};
        $http.put('/api/products/changeqty/' + x._id, { "Stock": x.Stock }).success(function(res) {
            console.log("stock updated");
        }).error(function(res) {
            console.log("stock update failed");
            x.Stock = preStock;
        })
    };
    $scope.hideStock = function(x) {
        x.Stock = preStock;
        $scope.activeItem = {};
    };
    $scope.statusAct = function(x) {
        if (x.Status == true) {
            return "Active"
        } else {
            return "Inactive"
        };
    }

});

var ModalInstanceCtrl = function($scope, $uibModalInstance, userForm, $http) {

    $scope.submitForm = function() {
        if ($scope.form.userForm.$valid) {
            console.log('user form is in scope');
            $uibModalInstance.close('closed');
        } else {
            console.log('userform is not in scope');
        }
    };
    $scope.saveNew = function() {
        console.log($scope.newPrd);
        $http.post('/api/products/', $scope.newPrd).success(function(res) {
            console.log("add succ");
            //$scope.prdList = res;
            // console.log(res);
            $scope.freshPrd(res);
            $uibModalInstance.close('closed');
        }).error(function(res) {
            console.log("add error");
        });
    };
    $scope.saveEdit = function() {
        console.log($scope.editObj);
        var idx = $scope.editObj._id;
        $http.put('/api/products/' + idx, $scope.editObj).success(function(res) {
            console.log('edit done');
            $scope.freshPrd(res);
            $uibModalInstance.close('closed');
        }).error(function(res) {
            console.log("edit err");
        });
    };
    $scope.delComfirm = function() {
        var idx = $scope.delObj._id;
        $http.delete('/api/products/' + idx).success(function(res) {
            console.log("delete done");
            $scope.freshPrd(res);
            $uibModalInstance.close('closed');
        }).error(function(res) {
            console.log('delete err');
        })
    };
    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };


};