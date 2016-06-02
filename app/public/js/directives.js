'use strict';
/* Directives */


angular.module('mongoDBCRUDDirectives', [])
        .directive('dbElement', ['$compile', 'helper', function($compile, helper) {
                return {
                    restrict: 'A',
                    link: function(scope, element, attrs) {
                        console.log("DBELEMENT : element : ", scope.element);
                        console.log("DBELEMENT : field : ", scope.field.displayName);
                        console.log("DBELEMENT : displayed : ", scope.element[scope.field.field]);

                        scope.typeFunction = function() {
                            return helper.typeFunction(scope.element[scope.field.field]);
                        };
                        scope.remove = function() {
                            switch (helper.typeFunction(scope.element)) {
                                case 'array':
                                    console.log('Delete element in array :' + scope.element[scope.field.field])
                                    scope.element.splice(scope.field.field, 1);
                                    console.log(scope.element);
                                    break;
                                case 'obj':
                                case 'function':
                                case 'text':
                                    console.log('Delete element :' + scope.element[scope.field.field])
                                    delete scope.element[scope.field.field];
                                    console.log(scope.element);
                                    break;
                                default:
                                    console.log('could not delete unrecognise element :' + scope.typeFunction())
                                    break;
                            }
                        }
                        scope.$watch('typeFunction()', function() {
                            if (scope.typeFunction() == 'array' || scope.typeFunction() == 'obj') {
                                $(element).children().append(
                                        '   <div ng-switch-when="array" class="input-group"><span class="input-group-addon">{{field.displayName}}</span><button type="button" class="btn form-control" ng-click="remove()">X</button><div db-list element="element" field="field"></div></div>' +
                                        '   <div ng-switch-when="obj" class="input-group"><span class="input-group-addon">{{field.displayName}}</span><button type="button" class="btn form-control" ng-click="remove()">X</button><div db-list element="element" field="field"></div></div>'
                                        );
                                $compile(element.contents())(scope);
                            }
                        },true);
                    },
                    scope: {
                        element: "=",
                        field: "="
                    }
                    , template:
                            '<div ng-switch="typeFunction()">' +
                            '   <div ng-switch-when="text" class="input-group"><span class="input-group-addon">{{field.displayName}}</span><input ng-model="element[field.displayName]" class="form-control"/><span class="input-group-btn"><button class="btn btn-default" type="button" ng-click="remove()">X</button></span></div>' +
                            '   <div ng-switch-when="function">function - should not be here !</div>' +
                            '</div>'
                };
            }])
        .directive('dbList', ['helper', function(helper) {
                return {
                    restrict: 'A',
                    link: function(scope, element, attrs) {
                        console.log("DBLIST : element : ", scope.element);
                        console.log("DBLIST : field : ", scope.field);
                        console.log("DBLIST : element[field] : ", scope.element[scope.field.field]);



                        var columnsArgs = {
                            sort: false
                        };
                        //scope.columns = helper.getAllColumns([scope.element[scope.field.field]], columnsArgs);
                        scope.$watch("element[field.field]", function() {
                            console.log("$watch");
                            scope.columns = helper.getAllColumns([scope.element[scope.field.field]], columnsArgs);
                            console.log(scope.columns);
                        }, true)
                        console.log("DBLIST : columns", scope.columns);
                        /*
                         * type of vars
                         */
                        scope.typesOfVars = ['text', 'array', 'object'];
                        scope.class = {'text': 'ig-text', 'array': 'ig-array', 'object': 'ig-object'};
                        scope.selectedType = scope.typesOfVars[0];
                        scope.typeFunction = function() {
                            return helper.typeFunction(scope.element[scope.field.field]);
                        };
                        scope.addElement = function() {
                            if (scope.newElement == "" || scope.newElement == undefined) {
                                $("#newElement").parent().addClass("has-error");
                                return false;
                            }
                            var toBeAdded;
                            switch (scope.selectedType) {
                                case 'text':
                                    toBeAdded = scope.newElement;
                                    console.log("AddText:", toBeAdded);
                                    break;
                                case 'array' :
                                    toBeAdded = new Array(scope.newElement);
                                    console.log("AddArray:", toBeAdded);
                                    break;
                                case 'object' :
                                    if (scope.identifier == undefined || helper.bannedNames().indexOf(scope.identifier) >= 0) {
                                        $("#newElement").parent().addClass("has-error");
                                        return false;
                                    }
                                    toBeAdded = {};
                                    toBeAdded[scope.identifier] = scope.newElement;
                                    console.log("AddObject:", toBeAdded);
                                    break;
                                default:
                                    alert("Type not found\n...Aborted");
                                    return false;

                            }



                            switch (helper.typeFunction(scope.element[scope.field.field])) {
                                case 'obj':
                                    console.log("InObject = {", scope.objectIdentifier, ':', toBeAdded, '}');
                                    if (scope.element[scope.field.field].hasOwnProperty(scope.objectIdentifier)
                                            && !confirm("object already contains this identifier :\nid = " + JSON.stringify(scope.objectIdentifier) + "\nold value = " + JSON.stringify(scope.element[scope.field.field][scope.objectIdentifier]) + "\nnew value = " + JSON.stringify(toBeAdded) + "\nReplace ?")) {
                                        return;
                                    }
                                    scope.element[scope.field.field][scope.objectIdentifier] = toBeAdded;
                                    break;
                                case 'array':
                                    console.log("InArray = [", scope.newElement, ']');
                                    scope.element[scope.field.field].push(toBeAdded);
                                    break;
                                default:
                                    alert("InSomething else ? -> not allowed :", helper.typeFunction(scope.element[scope.field.field]));
                            }

                        }
                    },
                    scope: {
                        element: "=",
                        field: "="
                    }
                    ,
                    template:
                            '<div class="listItem" ng-class="typeFunction()" >' +
                            '   <div ng-repeat="col in columns track by $index">' +
                            '       <div db-element element="element[field.field]" field="col"></div>' +
                            '   </div>' +
                            '   <div class="input-group" ng-class="class[selectedType]">' +
                            '       <input id="objectIdentifier" type="text" class="form-control" ng-model="objectIdentifier" placeholder="objectIdentifier">' +
                            '       <select class="form-control" ng-model="selectedType" ng-options="c for c in typesOfVars"></select>' +
                            '       <input id="identifier" type="text" class="form-control" ng-model="identifier" placeholder="Identifier">' +
                            '       <input id="newElement" type="text" class="form-control" ng-model="newElement" placeholder="Element">' +
                            '       <span class="input-group-btn">' +
                            '           <button class="btn btn-default" type="button" ng-click="addElement()">Add</button>' +
                            '       </span>' +
                            '   </div>' +
                            '</div>'
                }
            }]);
 