(function(global) {
    function Suggestions() {
     // Constructor
    };
    
    Suggestions.prototype.bindSuggestionsEvents = function() {
        var _this = this,
            $document = $(document);
        $document.on('click', '[data-account-id]', function(e) {
            var $this = $(this);
               
        });

        $document.on('suggestion-parsed', function(e) {
            _this.renderSuggestions();
        });
    }
    
     Suggestions.prototype.renderSuggestions = function() {
        var _this = this;
        //fillTemplate(container, templateObj, object, appendFlag, callback)
        _this.fillTemplate(_this.suggestion.listContainer, componentsTemplate[_this.suggestionListTemplatePath], resource.suggestions, false);
        _this.fillTemplate(_this.suggestion.detailsContainer, componentsTemplate[_this.suggestionDetailTemplatePath], resource.suggestions, false);
    
        $(document).trigger('suggestion-loaded');
    }
    
    Suggestions.prototype.buildSuggestions = function() {
        var _this = this;
            _this.suggestionDataPath = '/staticJson/suggestions.json';
      
        $.ajax({
            method: 'GET',
            url: _this.suggestionDataPath,
            type: 'json',
            success: function(data) {
                resource.suggestions = data;
                _this.renderSuggestions();
            },

            error: function(err) {
            }
        });
    }
    
    Suggestions.prototype.init = function() {
        var _this = this;
        _this.suggestion = {};
        _this.suggestion.listContainer = $('#suggestions-list');
        _this.suggestion.detailsContainer = $('#suggestion-details');
        _this.addSpinner(_this.suggestion.listContainer);
        _this.addSpinner(_this.suggestion.detailsContainer);
        _this.suggestionListTemplatePath = 'suggestion-list';
        _this.suggestionDetailTemplatePath = 'suggestion-detail';
        _this.bindSuggestionsEvents();
        if (_this.application != 'iRep') {
        //    _this.buildSuggestions();
            try {
                /* _this.clmQueryRecord(_this.queryConfig.suggestions, function(result) {
                    if (result.success == true) {
                        _this.consoleLog('suggestion', result[_this.queryConfig.suggestions.object]);
                        _this.parseSuggestions(result[_this.queryConfig.suggestions.object]);
                    } else {
                        _this.consoleLog('suggestion - response', result);
                    }
                }); */
                _this.dsRunQuery(_this.queryConfig.suggestions).then(function(suggestions) {
                    _this.consoleLog('My suggestions through DS library', suggestions);
                    _this.parseSuggestions(suggestions);
                });
            } catch (error) {
                _this.consoleLog('Error', error);
            }
        }
            
    }
    
    _.extend(Suggestions.prototype, Queries.prototype);
    global.Suggestions = Suggestions;
}(this));

$(function() {
    var suggestions = new Suggestions();
    suggestions.init();
});