function Mon(json) {
    _.extend(this, json);
    var r = this;
    r.icon = 'http://dqmsl-search.net' + json.icon;
    r.off = json.offense;
    r.def = json.defense;
    r.dex = json.dexterity;
    r.int = json.intelligent;
    r.rank = json.rank.name;
    r.type = json.type.name;
    r.system = json.system.name;
    // formating resistances
    r.resist = {};
    _.each(json.resistances['@keys'], function(resistType, index) {
        var resistName = resistType.name;
        var resistItem = json.resistances['@items'][index];
        if (resistItem['@ref']) {
            resistItem = _.findWhere(json.resistances['@items'], {'@id': resistItem['@ref']});
        }
        r.resist[resistName] = resistItem.name;
    });
};

Mon.prototype.star = function(n) {
    // TODO: implement N stars status
};

var app = angular.module('partyApp', [])
    .factory('partyService', function() {
        return {
            monsterFromPartyFetchJson: function(json) {
                var r = new Mon(json);
                return r;
            },
            search: function(no) {
                var service = this;
                var mon;
                $.ajax({
                        url: 'https://raw.githubusercontent.com/morelchang/dqmsl-party/master/data/monster-' + no + '.json',
                        dataType: 'json',
                        async: false
                    })
                    .done(function(data) {
                        mon = service.monsterFromPartyFetchJson(data);
                    })
                    .fail(function(jqXHR, textStatus) {
                        console.log('failed to get data: ' + jqXHR.responseText);
                    });
                    return mon;
                }
        };
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
