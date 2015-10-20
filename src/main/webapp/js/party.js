var app = angular.module('partyApp', [])
    .controller('searchMonsterController', function($scope) {
        $scope.search = function() {
            // read from json data
            $.getJSON('https://raw.githubusercontent.com/morelchang/dqmsl-party/master/data/monster-' + this.searchNo + '.json')
                .done(function(data) {
                    // cleanup
                    $scope.error = '';

                    // formating basic values
                    var r = data;
                    r.icon = 'http://dqmsl-search.net' + r.icon;
                    r.off = r.offense;
                    r.def = r.defense;
                    r.dex = r.dexterity;
                    r.int = r.intelligent;
                    r.rank = r.rank.name;
                    r.type = r.type.name;
                    r.system = r.system.name;
                    // formating resistances
                    r.resist = {};
                    _.each(r.resistances['@keys'], function(resistType, index) {
                        var resistName = resistType.name;
                        var resistItem = r.resistances['@items'][index];
                        if (resistItem['@ref']) {
                            resistItem = _.findWhere(r.resistances['@items'], {'@id': resistItem['@ref']});
                        }
                        r.resist[resistName] = resistItem.name;
                    });

                    $scope.$apply(function() {
                        $scope.result = r;
                    });
                })
                .fail(function(jqXHR, textStatus) {
                    $scope.$apply(function() {
                        $scope.result = null;
                        $scope.error = 'failed to get data: ' + jqXHR.responseText;
                    });
                });
            // render to search result section
        }; 
    });
