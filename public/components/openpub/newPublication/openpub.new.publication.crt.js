(function() {

    "use strict";
    
    angular
        .module('openpub')
        .controller('newPubController', function(auth, $scope, $mdSidenav, $mdDialog, $state, $mdToast, $location, $stateParams, pubService, pubListCategoryService, pubListService) {
        
        var vm = this;
        vm.auth = auth.ref;
        vm.user = auth.ref.$getAuth();
        
        vm.htmlVariable = "";
        vm.readonly = false;
        vm.removable = true;
        vm.authenticateUser = authenticateUser;
        vm.researchAreas = pubListCategoryService.getAllElements();
        vm.name = "";
        vm.description = "";
        vm.authers = [];
        vm.tags = [];
        vm.pubListId = $stateParams.pubListID;
        vm.url = "";
        vm.isPublic = false;
        vm.researchArea = null;
        vm.peerReviewed = false;
        vm.venue = "";
        vm.clickedFirstTime = false;

        vm.CreateElement = function () {
            vm.clickedFirstTime = true;
            if(vm.name != null && vm.description != null && vm.researchArea != null && vm.authers.length != 0 && vm.url != null && vm.venue != null){
                var newPub = pubService.CreateNewObject(vm.name, 
                                                        vm.description, 
                                                        vm.authers, 
                                                        $stateParams.pubListId,
                                                        vm.url,
                                                        vm.user.displayName,
                                                        vm.user.uid,
                                                        vm.isPublic, 
                                                        vm.tags,
                                                        vm.researchArea.$id,
                                                        vm.peerReviewed,
                                                        vm.venue);
                pubService.AddElement(newPub)
                .then(function(createdPub) {
                    newPub = createdPub;
                    $location.path('/pub/' + createdPub.$id);
                });
            }
        };

        function authenticateUser(){
            if(vm.user == null){
                vm.auth.$onAuthStateChanged(function(firebaseUser) {
                    if(firebaseUser == null) {
                        $location.path('/auth');
                    } else {
                        vm.user = firebaseUser;
                        vm.researchAreas = pubListCategoryService.getAllElements();
                        if($stateParams.pubListId == null) {
                            vm.pubList = pubService.findByID($stateParams.pubListId);
                            if(vm.pubList.userID != vm.user.uid) {
                                $location.path('/myPubList');
                            }
                        }
                    }
                });
            }
        }
        
    });

})();           