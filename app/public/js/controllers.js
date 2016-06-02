'use strict';

/* Controllers */

var controllers = angular.module('mongoDBCRUDControllers', []);


controllers.controller('listCtrl', ['$scope', '$location', 'Restangular', 'list', 'helper', function($scope, $location, Restangular, list, helper) {
        /**
         * Save the original queried object for rollback
         */
        var original = list;


        /**
         * Display var
         */
        $scope.title = 'Databases';
        $scope.type = 'connexion';
        $scope.lists = helper.checkResult(Restangular.copy(original));
        $scope.JSONObject = JSON.stringify($scope.lists);
        console.log($scope.lists);
        $scope.input = {};
        $scope.input.newDatabase = '';
        /**
         * construction of the table
         */
        $scope.order = false;
        var columnsArgs = {
            templateToApply: {
                name: '<div class="ngCellText"><a href="#/db/{{row.getProperty(col.field)}}/">{{row.getProperty(col.field)}}</a></div>'
            },
            columnAtEnd: [{
                    field: 'delete',
                    displayName: 'delete',
                    cellTemplate: '<div><a ng-click="remove({id:row.getProperty(\'name\')})">X</a></div>'
                }]
        };
        $scope.columns;
        $scope.$watch('order', function() {
            console.log("ordered:" + $scope.order);
            columnsArgs.sort = $scope.order;
            $scope.columns = helper.getAllColumns($scope.lists, columnsArgs);
            $scope.gridOptions = {data: 'lists', columnDefs: 'columns'};

        });

        $scope.add = function() {
            console.log('add', $scope.input.newDatabase);
            if ($scope.input.newDatabase == "" || $scope.input.newDatabase == undefined) {
                console.log("empty name", $scope.input.newDatabase);
                $("#newDatabase").parent().addClass("has-error").removeClass("has-success");
                $("#newDatabase").addClass("btn-danger").removeClass("btn-success");
                return;
            }
            Restangular.one('db', $scope.dbid).one("collection", $scope.input.newCollection).post().then(function(res, err) {
                if (err) {
                    console.log(err);
                    $("#newCollection").parent().addClass("has-error").removeClass("has-success");
                    $("#newCollection").addClass("btn-danger").removeClass("btn-success");
                } else {
                    $("#newCollection").parent().addClass("has-success").removeClass("has-error");
                    $("#newCollection").addClass("btn-success").removeClass("btn-danger");
                }
                //Not possible to create an empty DB ?
                /*
                 $scope.lists = helper.checkResult(Restangular.copy(res));
                 $scope.columns = helper.getAllColumns($scope.lists, columnsArgs);
                 */
                $location.path('/db/' + $scope.input.newDatabase);
            });
        };

        $scope.remove = function(id) {
            console.log("remove(" + id.id + ")");
            Restangular.one('db', id.id).remove().then(function(res, err) {
                console.log("res", res);
                console.log("err", err);
                if (err) {
                    //todo
                    return;
                }
                $scope.lists = helper.checkResult(Restangular.copy(res));
            });
        }


    }]);
controllers.controller('dbCtrl', ['$scope', '$route', 'Restangular', 'db', 'helper', function($scope, $route, Restangular, db, helper) {
        /**
         * Save the original queried object for rollback
         */
        var original = db;
        /**
         * Display var
         */
        $scope.title = 'Collections';
        $scope.type = 'database';
        $scope.dbid = $route.current.params.db;
        $scope.db = helper.checkResult(Restangular.copy(original));
        $scope.JSONObject = JSON.stringify($scope.db);
        $scope.input = {};
        $scope.input.newCollection = '';
        console.log($scope.db);
        /**
         * construction of the table
         */
        $scope.order = false;
        var columnsArgs = {
            templateToApply: {
                name: '<div class="ngCellText"><a href="#/db/{{dbid}}/collection/{{row.getProperty(col.field).substring(row.getProperty(col.field).indexOf(\'.\')+1)}}/">{{row.getProperty(col.field).substring(row.getProperty(col.field).indexOf(\'.\')+1)}}</a></div>'
            },
            columnAtEnd: [{
                    field: 'delete',
                    displayName: 'delete',
                    cellTemplate: '<div><a ng-click="remove({id:row.getProperty(\'name\')})">X</a></div>'
                }]
        };
        $scope.$watch('order', function() {
            console.log("ordered:" + $scope.order);
            columnsArgs.sort = $scope.order;
            $scope.columns = helper.getAllColumns($scope.db, columnsArgs);
            $scope.gridOptions = {data: 'db', columnDefs: 'columns'};

        });
        /**
         * Functions for CRUD purpose
         */

        $scope.add = function() {
            console.log('add', $scope.input.newCollection);
            if ($scope.input.newCollection == "" || $scope.input.newCollection == undefined) {
                console.log("empty name", $scope.input.newCollection);
                $("#newCollection").parent().addClass("has-error").removeClass("has-success");
                $("#newCollection").addClass("btn-danger").removeClass("btn-success");
                return;
            }
            Restangular.one('db', $scope.dbid).one("collection", $scope.input.newCollection).post().then(function(res, err) {
                if (err) {
                    console.log(err);
                    $("#newCollection").parent().addClass("has-error").removeClass("has-success");
                    $("#newCollection").addClass("btn-danger").removeClass("btn-success");
                } else {
                    $("#newCollection").parent().addClass("has-success").removeClass("has-error");
                    $("#newCollection").addClass("btn-success").removeClass("btn-danger");
                }
                //console.log("res",res)
                //if (res.length == 2) {
                //    $route.reload();
                //}
                $scope.db = helper.checkResult(Restangular.copy(res));
                $scope.columns = helper.getAllColumns($scope.db, columnsArgs);
            });
        };

        $scope.remove = function(id) {
            console.log("remove(" + id.id + ")");
            console.log("remove(" + (typeof (id.id)) + ")");
            id.id = (id.id).substring(id.id.indexOf('.') + 1);
            Restangular.one('db', $scope.dbid).one('collection', id.id).remove().then(function(res, err) {
                console.log("res", res);
                console.log("err", err);
                if (err) {
                    //todo
                    return;
                }
                $scope.db = helper.checkResult(Restangular.copy(res));

            });
        };

    }]);
controllers.controller('collectionCtrl', ['$scope', '$location', '$route', 'Restangular', 'col', 'helper', function($scope, $location, $route, Restangular, col, helper) {
        /**
         * Save the original queried object for rollback
         */
        var original = col;
        /**
         * Display var
         */
        $scope.title = 'Documents';
        $scope.type = 'collection';
        $scope.dbid = $route.current.params.db;
        $scope.collectionid = $route.current.params.collectionId;
        $scope.collection = helper.checkResult(Restangular.copy(original));
        $scope.JSONObject = JSON.stringify($scope.collection);
        $scope.displayAddButton = true;
        $scope.input = {};
        console.log($scope.collection);
        /**
         * construction of the table
         */
        $scope.order = false;
        var columnsArgs = {
            templateToApply: {
                _id: '<div class="ngCellText"><a href="#/db/{{dbid}}/collection/{{collectionid}}/document/{{row.getProperty(col.field)}}">{{row.getProperty(col.field)}}</a></div>'
            },
            columnAtEnd: [{
                    field: 'delete',
                    displayName: 'delete',
                    cellTemplate: '<div><a ng-click="remove({id:row.getProperty(\'_id\')})">X</a></div>'
                }]
        };
        $scope.columns = helper.getAllColumns($scope.collection, columnsArgs);
        $scope.gridOptions = {data: 'collection', columnDefs: 'columns'};


        $scope.$watch('order', function() {
            console.log("ordered:" + $scope.order);
            columnsArgs.sort = $scope.order;
            $scope.columns = helper.getAllColumns($scope.collection, columnsArgs);
            $scope.gridOptions = {data: 'collection', columnDefs: 'columns'};

        });


        /**
         * Functions for CRUD purpose
         */
        $scope.save = function() {
            $scope.collection.put().then(function(project) {
                $location.path('/db/' +
                        $route.current.params.db +
                        "/collection/" +
                        $scope.collection._id.$oid
                        );
            });
        };
        $scope.add = function() {
            Restangular.one('db', $scope.dbid).one("collection", $scope.collectionid).one("document", "create").post().then(function(res, err) {
                if (err) {
                    console.log(err);
                    $("#newDocument").parent().addClass("has-error").removeClass("has-success");
                    $("#newDocument").addClass("btn-danger").removeClass("btn-success");
                } else {
                    $("#newDocument").parent().addClass("has-success").removeClass("has-error");
                    $("#newDocument").addClass("btn-success").removeClass("btn-danger");
                }
                console.log(res);
                $scope.collection = helper.checkResult(Restangular.copy(res));
                $scope.columns = helper.getAllColumns($scope.collection, columnsArgs);
            });
        };
        $scope.remove = function(id) {
            console.log("remove(" + id.id + ")");
            Restangular.one('db', $scope.dbid).one('collection', $scope.collectionid).one('document', id.id).remove().then(function(res, err) {
                console.log("res", res);
                console.log("err", err);
                if (err) {
                    //todo
                    return;
                }
                console.log(res);
                $scope.collection = helper.checkResult(Restangular.copy(res));
                $scope.columns = helper.getAllColumns($scope.collection, columnsArgs);
            });
        };
    }]);


controllers.controller('documentCtrl', ['$scope', '$location', '$route', 'Restangular', 'doc', 'helper', function($scope, $location, $route, Restangular, doc, helper) {
        /**
         * Check integrity
         */
        if (_.isUndefined(doc)) {
            alert("Problème sur le serveur, Merci de contacter l'administrateur");
            $location.path('/');
            return;
        }

        /**
         * Save the original queried object for rollback
         */
        var original = doc;
        /**
         * Display var
         */
        $scope.title = 'Document detail';
        $scope.type = 'document';
        $scope.displaySaveButton = true;
        $scope.dbid = $route.current.params.db;
        $scope.collectionid = $route.current.params.collectionId;
        $scope.documentid = $route.current.params.documentId;
        $scope.document = [helper.checkResult(Restangular.copy(original))];
        $scope.JSONObject = JSON.stringify($scope.document);
        $scope.field = {displayName: 0, field: 0};
        $scope.input = {};
        /**
         * construction of the table
         */
        $scope.order = false;
        var columnsArgs = {};
        $scope.$watch('order', function() {
            console.log("ordered:" + $scope.order);
            columnsArgs.sort = $scope.order;
            $scope.columns = helper.getAllColumns([$scope.document], columnsArgs);
        });


        /*
         * updated mechanism
         */
        $scope.btnUpdate = -1;
        var unregisterWatchDocumentGlobal = $scope.$watch('document', function() {
            if ($scope.btnUpdate == -1) {
                $scope.btnUpdate = 0;
            } else {
                $scope.btnUpdate = 1;
                unregisterWatchDocumentGlobal();
            }
        }, true);
        /**
         * Functions for CRUD purpose
         */

        $scope.isClean = function() {
            return angular.equals(original, $scope.document);
        }

        $scope.destroy = function() {
            original.remove().then(function() {
                $location.path('/db/' +
                        $route.current.params.db +
                        "/collection/" +
                        $route.current.params.collection
                        );
            });
        };
        $scope.save = function() {
            console.log("saving!");
            $scope.document[0].put().then(function(res) {
                console.log("saved!", res);
                $scope.document[0] = Restangular.copy(res);
                $scope.JSONObject = JSON.stringify($scope.document);
                $scope.btnUpdate = -1;
                unregisterWatchDocumentGlobal = $scope.$watch('document', function() {
                    if ($scope.btnUpdate == -1) {
                        $scope.btnUpdate = 2;
                    } else {
                        $scope.btnUpdate = 1;
                        unregisterWatchDocumentGlobal();
                    }
                }, true);
            });
        };

    }
]);

