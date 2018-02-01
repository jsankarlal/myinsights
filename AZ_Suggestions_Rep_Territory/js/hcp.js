(function(global) {
    function Hcp() {
     // Constructor
    };
    
    Hcp.prototype.bindHcpEvents = function() {
        var _this = this,
            $document = $(document),
            $newsFeed = $('#news-feed');
        
        $(document).on('click', '.navigate-to-native', function(event) {
            event.preventDefault();
            _this.navigateToAccount({accountId: $(this).attr('data-account-id'), type: $(this).attr('data-type')});
        });

        $(document).on('navigate-to-native', function(event, eventData) {
            event.preventDefault();
            _this.navigateToAccount(eventData);
        });

        $(document).on('show.bs.tab', '.line a[data-toggle="tab"]', function(e) {
            console.log(e.target);// newly activated tab
            console.log(e.relatedTarget);// previous active tab
            $(e.target).closest('.card-view').addClass('show-detail');
        });

        $(document).on('click', '.back-button', function() {
            event.preventDefault();
            $(this).closest('.card-view').removeClass('show-detail');
            _this.consoleLog('Click Back Button', $(this).closest('.card-view').find('.card-title')[0]);
        });
        
        $(document).click(function() {
            var $targetEl = $(event.target);
            if ($targetEl.closest('#news-feed').length < 1) {
                $newsFeed.collapse('hide');
            }
           
        });
        
        $(document).on('click', '.news-feed-show', function() {
            $newsFeed.collapse('toggle');
        });

        $(document).on('click', '.news-feed-show', function() {
            $newsFeed.collapse('toggle');
        });

        $(document).on('click', '.news-feed-cancel', function() {
            $newsFeed.collapse('hide');
        });

        $(document).on('show.bs.collapse', '#news-feed', function() {
            $newsFeed.addClass('max-height-80vh');
        });
        
        $(document).on('hide.bs.collapse', '#news-feed', function() {
            $newsFeed.removeClass('max-height-80vh');
        });

        $(document).on('click', '.tab-pane .line', function(event) {
            $(this).addClass('active');
            $(this).siblings().removeClass('active'); 
        });
        
        $(document).on('hcp-loaded suggestion-loaded', function(event) {
            _this.consoleLog('hcp-loaded suggestion-loaded EVENT');
        });

        $document.on('hcp-parsed', function(e) {
            _this.renderHcp();
        });

        $document.on('hcp-loaded', function(e) {
            _this.renderRelationshipCharts();
        });

        $document.on('shown.bs.modal', '#popup-modal', function() {
            _this.renderRelationshipCharts();
        });
    }
    
    Hcp.prototype.renderHcp = function() {
        var _this = this;
        //fillTemplate(container, templateObj, object, appendFlag, callback)
        // var grouped = _.mapValues(_.groupBy(resource.hcp, 'type'),
        //                   clist => clist.map(resource.hcp => _.omit(resource.hcp, 'make')));

        _this.consoleLog('renderHcp ', resource.hcp);
        resource.hcp = resource.hcp.reduce(function(r, a) {
            r[a.type] = r[a.type] || [];
            r[a.type].push(a);
            return r;
        }, Object.create(null));
        _this.consoleLog('renderHcp ', resource.hcp);

        _this.fillTemplate(_this.hcp.detailsContainer, componentsTemplate[_this.hcpDetailTemplatePath], resource.hcp.person, false);
        _this.fillTemplate(_this.hcp.listContainer, componentsTemplate[_this.hcpListTemplatePath], resource.hcp.person, false);
        _this.fillTemplate(_this.hospital.detailsContainer, componentsTemplate[_this.hcpDetailTemplatePath], resource.hcp.business, false);
        _this.fillTemplate(_this.hospital.listContainer, componentsTemplate[_this.hcpListTemplatePath], resource.hcp.business, false);
        $(document).trigger('hcp-loaded');
    }
    
    Hcp.prototype.buildHcp = function() {
        var _this = this;
            _this.hcpDataPath = '/staticJson/hcp.json';
        
        $.ajax({
            method: 'GET',
            url: _this.hcpDataPath,
            type: 'json',
            success: function(data) {
                var path = this.url;
                resource.hcp = data;
                _this.renderHcp();
            },

            error: function(err) {
            }
        });
    }
    
    Hcp.prototype.init = function() {
        var _this = this;
        _this.hcp = {};
        _this.hospital = {};
        _this.hcp.listContainer = $('#hcp-list');
        _this.hcp.detailsContainer = $('#hcp-details');
        _this.hospital.listContainer = $('#hospital-list');
        _this.hospital.detailsContainer = $('#hospital-details');
        _this.hcpListTemplatePath = 'hcp-list';
        _this.hcpDetailTemplatePath = 'hcp-detail';
        _this.addSpinner(_this.hcp.listContainer);
        _this.addSpinner(_this.hcp.detailsContainer);
        if (applicationHost == 'iRep') {
            try {
                /* _this.clmQueryRecord(_this.queryConfig.accounts, function(result) {
                    if (result.success == true) {
                        _this.consoleLog('account- clmQueryRecord', result[_this.queryConfig.accounts.object]);
                        _this.parseAccounts(result[_this.queryConfig.accounts.object]);
                    } else {
                        _this.consoleLog('account clmQueryRecord - response', result);
                    }
                }); */
                _this.dsRunQuery(_this.queryConfig.accounts).then(function(accounts) {
                    _this.consoleLog('My Accounts - through DS library', accounts.length);
                    _this.parseAccounts(accounts);
                });
                
            } catch (error) {
                _this.consoleLog('Error', error);
            }
            
        } else {
            _this.buildHcp();
        }
        
        _this.bindHcpEvents();
            
    }
    
    _.extend(Hcp.prototype, Queries.prototype);
    global.Hcp = Hcp;
}(this));

$(function() {
    var hcp = new Hcp();
    hcp.init();
});