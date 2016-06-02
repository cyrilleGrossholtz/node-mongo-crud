'use strict';


// Declare app level module which depends on filters, and services
var app = angular.module('mongoDBCRUD', [
    'ngRoute',
    'ngGrid',
    'restangular',
    'mongoDBCRUDControllers',
    'mongoDBCRUDFilters',
    'mongoDBCRUDDirectives'
]).
        config(['$routeProvider', 'RestangularProvider', function($routeProvider, RestangularProvider) {
                $routeProvider.
                        when('/', {
                            controller: 'listCtrl',
                            templateUrl: 'public/partials/list.html',
                            resolve: {
                                list: function(Restangular) {
                                    return Restangular.all('list').getList();
                                }
                            }
                        }).
                        when('/db/:db', {
                            controller: 'dbCtrl',
                            templateUrl: 'public/partials/list.html',
                            resolve: {
                                db: function(Restangular, $route) {
                                    console.log(Restangular.one('db', $route.current.params.db));
                                    return Restangular.one('db', $route.current.params.db).getList();
                                }
                            }
                        }).
                        when('/db/:db/collection/:collectionId', {
                            controller: 'collectionCtrl',
                            templateUrl: 'public/partials/list.html',
                            resolve: {
                                col: function(Restangular, $route) {
                                    return Restangular.one('db', $route.current.params.db).one('collection', $route.current.params.collectionId).getList();
                                }
                            }
                        }).
                        when('/db/:db/collection/:collectionId/document/:documentId', {
                            controller: 'documentCtrl',
                            templateUrl: 'public/partials/list.html',
                            resolve: {
                                doc: function(Restangular, $route) {
                                    return Restangular.one('db', $route.current.params.db).one('collection', $route.current.params.collectionId).one('document', $route.current.params.documentId).get();
                                }
                            }
                        }).
                        //when('/new', {controller: CreateCtrl, templateUrl: 'detail.html'}).
                        otherwise({redirectTo: '/'});

                RestangularProvider.setRestangularFields({
                    id: '_id'
                });

                RestangularProvider.setRequestInterceptor(function(elem, operation, what) {
                    if (operation === 'put') {
                        elem._id = undefined;//You canot try to change id's
                        return elem;
                    }
                    return elem;
                })

            }]);


