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
    .directive('ngEnter', function() {
        return function(scope, elem, attrs) {
            elem.bind('keydown keypress', function(event) {
                if (event.which === 13) {
                    scope.$apply(function() {
                        scope.$eval(attrs.ngEnter);
                    });
                    event.preventDefault();
                }
            });
        };
    })
    .service('partyService', function() {
        this.monsterFromPartyFetchJson = function(json) {
            var r = new Mon(json);
            return r;
        };
        this.search = function(no) {
            var service = this;
            var dfd = $.Deferred();
            // TODO: angularjs way to fetch?
            $.ajax({
                url: 'https://raw.githubusercontent.com/morelchang/dqmsl-party/master/data/monster-' + no + '.json',
                dataType: 'json',
                async: false
            })
            .done(function(data) {
                var mon = Mon.parsePartyFetchJson(data);
                dfd.resolve(mon);
            })
            .fail(function(jqXHR, textStatus) {
                console.log('failed to get data: ' + jqXHR.responseText);
                dfd.reject(jqXHR.responseText);
            });

            return dfd;
        };
        this.searchMultiple = function(values) {
            if (!_.contains(values, ',')) {
                return this.search(values);
            }

            var dfd = $.Deferred();
            values = values.replace(/^\s*(.*)\s*/g, '$1');
            values = values.split(/\s*,\s*/);
            var service = this;
            var result = [];
            _.each(values, function(no, idx) {
                if (!no) {
                    return;
                }
                service.search(no).done(function(mo) {
                    result.push(mo);
                    if (idx === values.length - 1) {
                        dfd.resolve(result);
                    }
                });
            });
            return dfd;
        };
    })
    .controller('searchMonsterController', ['$scope', 'partyService', function($scope, partyService) {
        $scope.search = function() {
            // cleanup
            this.error = '';

            // read from json data
            partyService.search(this.searchNo)
                .done(function(mon) {
                    if (mon) {
                        // render to search result section
                        $scope.result = mon;
                        return;
                    }
                }).fail(function(error) {
                    $scope.result = null;
                    $scope.error = 'search failed:' + error;
                });
        };
        $scope.searchMultiple = function() {
            // cleanup
            this.error = '';

            // read from json data
            partyService.searchMultiple(this.searchNo)
                .done(function(mons) {
                    if (mons.length > 0) {
                        // render to search result section
                        $scope.results = mons;
                        return;
                    }
                });
        };
        $scope.saveResult = function() {
            $.cookie('searchNo', this.searchNo);
            this.error = 'result saved';
        }
        $scope.loadSaved = function() {
            this.searchNo = $.cookie('searchNo');
            this.searchMultiple();
        }
    }])
    .controller('ranchController', ['$scope', function($s) {
        this.monsters = {};
    }]);
