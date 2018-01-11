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
    }
    
    Suggestions.prototype.renderSuggestions = function() {
        var _this = this;
        //fillTemplate(container, templateObj, object, appendFlag, callback)
        _this.fillTemplate(_this.suggestion.listContainer, resource[_this.suggestionListTemplatePath], resource[ _this.suggestionDataPath], false);
        _this.fillTemplate(_this.suggestion.detailsContainer, resource[_this.suggestionDetailTemplatePath], resource[ _this.suggestionDataPath], false);
        
    }
    
    Suggestions.prototype.buildSuggestions = function() {
        var _this = this;
            _this.suggestionListTemplatePath = '/templates/components/suggestionslist.html';
            _this.suggestionDetailTemplatePath = '/templates/components/suggestiondetail.html';
            _this.suggestionDataPath = '/staticJson/suggestions.json';
        _this.fetchResource(_this.suggestionListTemplatePath, 'html').then(function() {
            return _this.fetchResource(_this.suggestionDetailTemplatePath, 'html');
        }).then(function() {
            return _this.fetchResource(_this.suggestionDataPath, 'json');
        }).then(function() {
            _this.renderSuggestions();
        });
    }
    
    Suggestions.prototype.init = function() {
        var _this = this;
        _this.suggestion = {};
        _this.suggestion.listContainer = $('#suggestions-list');
        _this.suggestion.detailsContainer = $('#suggestion-details');
        _this.addSpinner(_this.suggestion.listContainer);
        _this.addSpinner(_this.suggestion.detailsContainer);
        if (_this.application != 'iRep') {
            _this.buildSuggestions();
        }
            
    }
    
    _.extend(Suggestions.prototype, Util.prototype);
    global.Suggestions = Suggestions;
}(this));

$(function() {
    var suggestions = new Suggestions();
    suggestions.init();
});