'use strict';

/* Services */


app.factory('helper', function() {

    var bannedName = ["route", "reqParams", "parentResource", "restangularCollection", "restangularEtag","create","options"];
    return {
        getAllColumns: function(listOfObjects, columnsArgs) {
            var renameColumns = columnsArgs.hasOwnProperty("renameColumns") ? columnsArgs.renameColumns : {};
            var templateToApply = columnsArgs.hasOwnProperty("templateToApply") ? columnsArgs.templateToApply : {};
            var columnAtEnd = columnsArgs.hasOwnProperty("columnAtEnd") ? columnsArgs.columnAtEnd : {};
            var sort = columnsArgs.hasOwnProperty("sort") ? columnsArgs.sort : false;
            var res = [];
            var add = {};
            for (var i in listOfObjects) {
                for (var j in listOfObjects[i]) {
                    add = {field: j, displayName: renameColumns.hasOwnProperty(j) ? renameColumns[j] : j};
                    if (!isFunction(listOfObjects[i][j])
                            && !isBanned(add)
                            && !isAlreadyInArrray(add, res)) {
                        if (templateToApply.hasOwnProperty(j))
                            add.cellTemplate = templateToApply[j];
                        res.push(add);
                    }
                }
            }
            var k = 0;
            res = sort ? _.sortBy(res, function(item) {
                i = 0;
                return item.displayName.replace(/_/g, "zz");
            }) : _.sortBy(res, function(item) {
                k++;
                var cpt = 0;
                while (item.displayName.charAt(cpt) === '_')
                    cpt++;
                return k + 1000 * cpt;
            });
            for(i in columnAtEnd) {
                res[res.length] = {
                    field:columnAtEnd[i].field,
                    displayName:columnAtEnd[i].displayName,
                    cellTemplate:columnAtEnd[i].cellTemplate
                }
            }
            return res;
        },
        typeFunction : function(elem) {
            //console.log("typeFunction("+elem+") = "+(_.isArray(elem) ? 'array' : _.isObject(elem) ? 'obj' : _.isFunction(elem) ? 'function' : 'txt'));
            return _.isArray(elem) ? 'array' : _.isObject(elem) ? 'obj' : _.isFunction(elem) ? 'function' : 'text';
        },
        checkResult: function(result) {
            if(!result || result.length == 0) {
                return [{"Note": "No results"}];
            }
            else return result;
        },
        bannedNames: function() {
            return bannedName;
        }
    }

    function isFunction(functionToCheck) {
        var getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    }

    function isBanned(object) {
        for (var i in bannedName) {
            if (object.field == bannedName[i])
                return  true;
        }
        return false;
    }
    function isAlreadyInArrray(object, array) {
        for (var i in array) {
            if (object.field == array[i].field) {
                return true;
            }
        }
        return false;
    }

});