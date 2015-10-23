function Mon(data) {
    _.extend(this, data);
    this.original = data;
    this.calTotal();
};

Mon.prototype.withStars = function(stars) {
    this.stars = stars;
    this.hp = this.starup(this.original.hp, stars);
    this.mp = this.starup(this.original.mp, stars);
    this.att = this.starup(this.original.att, stars);
    this.def = this.starup(this.original.def, stars);
    this.dex = this.starup(this.original.dex, stars);
    this.int = this.starup(this.original.int, stars);
    this.calTotal();
}

Mon.prototype.calTotal = function() {
    this.total = this.hp + this.mp + this.att + this.def + this.dex + this.int;
}

Mon.prototype.fusion = function(fusionerValue, fusioneeValue) {
   var r = Math.ceil(fusionerValue / 50) + Math.ceil(fusioneeValue / 50);
   console.log('reuslt=' + r + '(' + fusionerValue + '/50)+(' + fusioneeValue + '/50)=' + Math.ceil(fusionerValue / 50) + ' + ' + Math.ceil(fusioneeValue / 50));
   return r;
}

Mon.prototype.starup = function(value, stars) {
    if (!stars || stars <= 0) {
        return value;
    }

    var result = value;
    stars = (stars > 4) ? 4 : stars;
    for (var i = 0; i < stars; i++) {
       result += this.fusion(result, value);
    }
    return result;
};

Mon.parsePartyFetchJson = function(json) {
    var r = _.extend({}, json);
    r.icon = 'http://dqmsl-search.net' + json.icon;
    r.att = json.offense;
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

    return new Mon(r);
};

function Mobi(mon, stars) {
    this.stars = stars ? 0 : stars;
    this.mon = mon;
}

var app = angular.module('partyApp', [])
    .service('partyService', function() {
        this.monsterFromPartyFetchJson = function(json) {
            var r = new Mon(json);
            return r;
        };
        this.search = function(no) {
            var service = this;
            var mon;
            $.ajax({
                url: 'https://raw.githubusercontent.com/morelchang/dqmsl-party/master/data/monster-' + no + '.json',
                dataType: 'json',
                async: false
            })
            .done(function(data) {
                mon = Mon.parsePartyFetchJson(data);
            })
            .fail(function(jqXHR, textStatus) {
                console.log('failed to get data: ' + jqXHR.responseText);
            });
            return mon;
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
