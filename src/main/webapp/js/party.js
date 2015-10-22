var app = angular.module('partyApp', [])
    .factory('partyService', function() {
        // TODO: create a service to encapsulate logic, eg: search monster
        var partyService = {
            search: function(no) {
                var mon;
                $.ajax({
                        url: 'https://raw.githubusercontent.com/morelchang/dqmsl-party/master/data/monster-' + no + '.json',
                        dataType: 'json',
                        async: false,
                    })
                    .done(function(data) {
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

                        mon = r;
                    })
                    .fail(function(jqXHR, textStatus) {
                        console.log('failed to get data: ' + jqXHR.responseText);
                    });
                    return mon;
                }
        };
        return partyService;
    })
    .controller('searchMonsterController', ['$scope', 'partyService', function($scope, partyService) {
        $scope.search = function() {
            // cleanup
            $scope.error = '';

            // read from json data
            var mon = partyService.search(this.searchNo);
            if (mon) {
                // render to search result section
                $scope.result = mon;
                return;
            }

            $scope.result = null;
            $scope.error = 'not found';
        }; 
    }])
    .controller('ranchController', ['$scope', function($s) {
        this.monsters = {};
    }]);
