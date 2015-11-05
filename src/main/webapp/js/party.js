function Mon(data) {
    _.extend(this, data);
    this.original = data;
    this.calTotal();

    // initialie skills
    this.skills = [];
    for (var i = 0; i < 4; i++) {
        if (i < this.original.skills.length) {
            var original = this.original.skills[i];
            this.skills[i] = _.extend({fixed: true, original: original}, original);
            continue;
        }
        this.skills[i] = undefined;
    }
};

Mon.resists = {
    VERY_WEEK: 0,
    WEEK: 1,
    NORMAL: 2,
    LITTLE: 3,
    LOT: 4,
    HELF: 5,
    VOID: 6,
    REFLECT: 7,
    ABSORB: 8,
};

Mon.prototype.emptySkillCount = function() {
    return _.filter(this.skills, function(s) {
        return !s || !s.fixed;
    }).length;
}

Mon.prototype.addNewSkills = function(skills) {
    if (!skills || !skills.length || skills.length <= 0) {
        return;
    }

    var n = 0;
    for (var i = 0; i < 4; i++) {
        var s = this.skills[i];
        if (s && s.fixed) {
            continue;
        }
        if (n >= skills.length) {
            break;
        }
        this.skills[i] = skills[n];
        this.skills[i].fixed = false;
        n++;
    }
}

Mon.prototype.resetSkills = function() {
    for (var i = 0; i < this.skills.length; i++) {
        var s = this.skills[i];
        if (s && !s.fixed) {
            this.skills[i] = null;
        }
    }
}

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
    // formatting skills
    r.skills = [];
    _.each(json.skills, function(s, index) {
        // ignore something like 'type' in response
        if (!s.name) {
            return;
        }
        r.skills.push(s);
    });

    return new Mon(r);
};

Mon.parseSkillTypes = function(skillTypesJson, skillsJson) {
    var skills = [];
    for (var id in skillsJson) {
        skills.push({id: id, name: skillsJson[id]});
    }

    var types = [];
    for (var id in skillTypesJson) {
        types.push({
            id: id,
            name: skillTypesJson[id],
            skills: _.filter(skills, function(s) {
                if ((id.length === 2 && s.id.length === 4) ||
                    (id.length === 3 && s.id.length === 5)) {
                    if (s.id.startsWith(id)) {
                        s.typeId = id;
                        s.typeName = skillTypesJson[id];
                        return true;
                    }
                }
                return false;
            })
        });
    }
    return types;
};

var app = angular.module('partyApp', ['pascalprecht.translate'])
    .config(function($translateProvider) {
        $translateProvider.useStaticFilesLoader({
            prefix: 'lang/',
            suffix: '.json'
        });
        $translateProvider.registerAvailableLanguageKeys(['en', 'zh'], {
            'en_*': 'en',
            'zh_*': 'zh'
        }).determinePreferredLanguage();
    })
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
    .directive('dpSkillSelector', function() {
        // TODO: using link, and scope.watch?
        return function(scope, element, attrs) {
            element.click(function() {
                $('.skillPicker').show();
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

            var no, stars, skillIds;
            // parse search string
            var split = expr.split('(');
            if (split[1]) {
                skillIds = split[1].replace(')', '').split('|');
            }

            split = split[0].split('[');
            if (split[1]) {
                stars = split[1].replace(']', '');
            }

            no = split[0];

            // TODO: angularjs way to fetch?
            $.ajax({
                url: 'https://raw.githubusercontent.com/morelchang/dqmsl-party/master/data/monster-' + no + '.json',
                dataType: 'json',
            })
            .done(function(data) {
                var mon = Mon.parsePartyFetchJson(data);
                var newSkills = [];
                _.each(skillIds, function(id) {
                    _.each(service.skillTypes, function(type) {
                        _.each(type.skills, function(skill) {
                            if (skill.id === id) {
                                newSkills.push(skill);
                            }
                        });
                    });
                });
                mon.addNewSkills(newSkills);
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
        this.listSkills = function() {
            var dfd = $.Deferred();
            if (this.skillTypes) {
                dfd.resolve(this.skillTypes);
                return dfd;
            }

            var service = this;
            $.ajax({
                url: 'https://raw.githubusercontent.com/morelchang/dqmsl-party/master/data/skillTypes.json',
                dataType: 'json',
                async: false
            }).done(function(skillTypesData) {
                $.ajax({
                    url: 'https://raw.githubusercontent.com/morelchang/dqmsl-party/master/data/skills.json',
                    dataType: 'json',
                    async: false,
                }).done(function(skillsData) {
                    var skillTypes = Mon.parseSkillTypes(skillTypesData, skillsData);
                    // cached in service
                    service.skillTypes = skillTypes;
                    dfd.resolve(skillTypes);
                })
            }).fail(function(jqXHR, textStatus) {
                console.log('failed to get data: ' + jqXHR.responseText);
                dfd.reject(jqXHR, textStatus);
            });
            return dfd;
        };

        this.listSkills();
    })
    .controller('searchMonsterController', ['$scope', 'partyService', '$translate', function($scope, partyService, $translate) {
        $scope.init = function() {
            // search immediately if search string in hash of url
            var initSearchKey = decodeURIComponent(window.location.hash.substr(1));
            if (initSearchKey) {
                this.searchNo = initSearchKey;
                this.searchMultiple();
            }

            // load skillTypes
            partyService.listSkills().done(function(skills) {
                $scope.availableSkills = skills;
                // TODO: scope applying happens here?
                //$scope.$apply();
            });
        };
        $scope.hashToSearch = function() {
            // TODO: angularjs provide routing function?
            window.location.hash = encodeURIComponent(this.searchNo);
            this.searchMultiple();
        };
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
                        $translate('search result:').then(function(t) {
                            $scope.error = t + '0';
                        });
                        return;
                    }
                    // render to search result section
                    $translate('search result:').then(function(t) {
                        $scope.error = t + mons.length;
                    });
                    $scope.results = mons;
                    $scope.sort();
                }).fail(function(error) {
                    $scope.result = null;
                    $translate('search failed:').then(function(t) {
                        $scope.error = t + error;
                    });
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
                this.sortByAsc = this.sortByAsc ? !this.sortByAsc : true;
                return;
            }

            // sort by column argument in order: by -> this.sortBy -> 'no'
            this.sortBy =  by ? by : (this.sortBy ? this.sortBy : 'no');
            this.sortByAsc = false;
            // sorting
            var sortBy = this.sortBy;
            this.results.sort(function(a, b) {
                // loop prop with '.'
                var sortProps = sortBy.split('.');
                var aProp = a;
                var bProp = b;
                for (var i = 0; i < sortProps.length; i++) {
                    aProp = aProp[sortProps[i]];
                    bProp = bProp[sortProps[i]];
                    // map order if comapring resist
                    if (i > 0 && sortProps[i - 1] === 'resist') {
                        // default to 'NORMAL'
                        aProp = aProp || 'NORMAL';
                        bProp = bProp || 'NORMAL';

                        aProp = Mon.resists[aProp];
                        bProp = Mon.resists[bProp];
                    }
                }

                // sorting asc by default
                if (!bProp || aProp > bProp) {
                    return -1;
                } else if (!aProp || aProp < bProp) {
                    return 1;
                }
                return 0;
            });
        };
        $scope.removeMonster = function(mon) {
            $scope.results = _.without($scope.results, _.findWhere(this.results, mon));
            $translate('remove success:').then(function(t) {
                $scope.error = t + newMons.length;
            });
        };
        $scope._serializeMon = function(mon) {
            var r = mon;
            var save = '';
            save += r.no + (r.stars > 0 ? '[' + r.stars + ']' : '');
            save += '(' + _.compact(_.map(r.skills, function(s) {
                if (s && !s.fixed) {
                    return s.id;
                }
                return '';
            })).join('|') + ')';
            return save;
        };
        $scope._serializeMons = function(mons) {
            var results = mons;
            var save = '';
            _.each(results, function(r) {
                save += $scope._serializeMon(r);
                save += ',';
            });
            save = save.substring(0, save.length - 1);
            return save;
        };
        $scope.saveResult = function() {
            // make result into save format
            var save = this._serializeMons(this.results);
            
            // persist to cookie
            this.persist('save', save);
            if (this.sortBy) {
                this.persist('save-sortBy', this.sortBy);
            }
            this.error = 'result saved';
        };
        $scope.loadSaved = function() {
            this.searchNo = this.readPersist('save');
            this.sortBy = this.readPersist('save-sortBy');
            this.searchMultiple();
        };
        $scope.addToSaved = function() {
            var persisted = this._serializeMons(this.results);

            // read from json data
            var persistRanch = this.readPersist('save');
            if (persistRanch) {
                persisted = persistRanch + ',' + persisted;
            }
            this.persist('save', persisted);

            // load for all saved
            partyService.searchMultiple(persisted)
                .done(function(mons) {
                    // render to search result section
                    $scope.results = mons;
                    $scope.sort();

                    $translate('added success:').then(function(t) {
                        $scope.error = t + newMons.length;
                    });
                }).fail(function(error) {
                    $translate('search failed:').then(function(t) {
                        $scope.error = t + error;
                    });
                }).always(function() {
                    $scope.$apply();
                });
        };
        $scope.readPersist = function(key) {
            if (Storage) {
                return window.localStorage.getItem(key);
            } else {
                return $.cookie(key);
            }
        };
        $scope.persist = function(key, value) {
            if (Storage) {
                window.localStorage.setItem(key, value);
            } else {
                $.cookie(key, value);
            }
        };

        $scope.openSelectSkills = function(mon) {
            // TODO: scope problem for scope.selectSkill()?
            $scope.currentSelectSkillMon = mon;
            $scope.selectedSkills = [];
        };
        $scope.resetSkills = function(mon) {
            mon.resetSkills();
        };
        $scope.selectSkill = function(skill) {
            // cancel select
            if (skill.selected) {
                skill.selected = false;
                $scope.selectedSkills = _.without($scope.selectedSkills, _.findWhere($scope.selectedSkills, {id: skill.id}));
                return;
            }

            var mon = this.currentSelectSkillMon;
            if ($scope.selectedSkills.length >= mon.emptySkillCount()) {
                // TODO: warning message
                return;
            }
            skill.selected = true;
            $scope.selectedSkills.push(skill);
        };
        $scope.confirmSelectSkills = function() {
            $('.skillPicker').hide();
            // apply skills to mon
            var mon = $scope.currentSelectSkillMon;
            mon.addNewSkills($scope.selectedSkills);

            // clear selection
            this.cancelSelectSkills();
        };
        $scope.cancelSelectSkills = function() {
            $('.skillPicker').hide();
            _.each($scope.availableSkills, function(type) {
                _.each(type.skills, function(skill) {
                    skill.selected = false;
                });
            });
            $scope.currentSelectSkillMon = null;
        };
    }])
    .controller('ranchController', ['$scope', function($s) {
        this.monsters = {};
    }]);
