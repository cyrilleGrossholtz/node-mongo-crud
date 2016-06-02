'use strict';

/* Filters */

angular.module('mongoDBCRUDFilters', []).
  filter('test', [function() {
    return function(field) {
        return field;
    }
  }]);
