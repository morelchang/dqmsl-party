function Mon(data) {
    _.extend(this, data);
    this.original = data;
    this.calTotal();
};

Mon.prototype.withStars = function(stars) {
    this.stars = stars ? parseInt(stars) : 0;
    this.hp = this.starup(this.original.hp, stars);
    this.mp = this.starup(this.original.mp, stars);
    this.att = this.starup(this.original.att, stars);
    this.def = this.starup(this.original.def, stars);
    this.dex = this.starup(this.original.dex, stars);
    this.int = this.starup(this.original.int, stars);
    this.calTotal();
    return this;
}

Mon.prototype.calTotal = function() {
    this.total = this.hp + this.mp + this.att + this.def + this.dex + this.int;
    return this;
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
        this.search = function(expr) {
            var service = this;
            var dfd = $.Deferred();
            // parse search string
            var g = expr = expr.split('[');
            var no = g[0];
            var stars = g[1] ? g[1].replace(']', '') : 0;
            // TODO: angularjs way to fetch?
            $.ajax({
                url: 'https://raw.githubusercontent.com/morelchang/dqmsl-party/master/data/monster-' + no + '.json',
                dataType: 'json',
            })
            .done(function(data) {
                var mon = Mon.parsePartyFetchJson(data);
                dfd.resolve(mon.withStars(stars));
            })
            .fail(function(jqXHR, textStatus) {
                console.log('failed to get data: ' + jqXHR.responseText);
                dfd.reject(jqXHR.responseText);
            });

            return dfd;
        };
        this.searchMultiple = function(values) {
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
                }).always(function() {
                    // multiple result
                    if (result.length === values.length) {
                        dfd.resolve(_.sortBy(result, 'no'));
                    }
                });
            });
            return dfd;
        };
    })
    .controller('searchMonsterController', ['$scope', 'partyService', function($scope, partyService) {
        $scope.searchMultiple = function() {
            // cleanup
            this.error = '';

            // validate input
            if (!this.searchNo) {
                return;
            }

            // read from json data
            partyService.searchMultiple(this.searchNo)
                .done(function(mons) {
                    if (!mons.length) {
                        $scope.result = null;
                        $scope.error = 'search result:0';
                        return;
                    }
                    // render to search result section
                    $scope.error = 'search result:' + mons.length;
                    $scope.results = mons;
                }).fail(function(error) {
                    $scope.result = null;
                    $scope.error = 'search failed:' + error;
                }).always(function() {
                    $scope.$apply();
                });
        };
        $scope.changeStars = function (index, stars) {
            this.results[index].withStars(stars);
            this.sort();
        };
        $scope.sort = function(by) {
            // reverse order if sort same column again
            if (by && this.sortBy === by) {
                this.results.reverse();
                return;
            }

            // sort by column argument in order: by -> this.sortBy -> 'no'
            this.sortBy =  by ? by : (this.sortBy ? this.sortBy : 'no');
            // sorting
            var sortBy = this.sortBy;
            this.results.sort(function(a, b) {
                return b[sortBy] - a[sortBy];
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
