//jscs:disable
appData = {
     product_map: [{
         Id: '',
         Name: ''
     }],
     accountId:'',
     currentUser: {
         Id: '',
         territoryId: ''
     },
     childTerrIds: [],
     subordinateUserIds: [],
     subordinateUsers: [],
     recordtype_map: { //best practice is to actually store this in a unique object per SFDC object
         Call_vod: '',
         Call_Objective_vod: '',
         Email_vod: '',
         Insight_vod: '',
         Driver_vod: '', //for Suggestion tag
         Product_vod: '' //for Suggestion tag
     },
     suggestionIds: [],
     accountIds: [],
     suggestions: [],
     childUserLookup:{},
     ownerIdLookup:{},
     ownerIdList:[],
     usersList:[],
     usersListSet:'',
     filtered:{
        userObject:{
            usersList:[],
            averageData:{}
        },
        myCount:{},
        count:{},
        types:{},
        tableData:[],
        suggestions:[]
     },
     accountIdList:[],
     months_to_date: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
 };


//MyInsights Object
(function(global) {
	function MyInsight() {
		
	};
	
    
    MyInsight.prototype.bindEvents = function() {
        var _this = this;
        
        $(document).on('click', '.navigate-to-native', function(event){
            event.preventDefault();
            _this.navigateToAccount($(this));
            
        });
        
         $(document).on('click', '#targetted-users .line, #suggestions .line', function(event){
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
            
        });
        
        $(document).on('hcp-loaded suggestion-loaded', function(event){
       //     _this.attachAccountIds();
            _this.consoleLog('hcp-loaded suggestion-loaded EVENT');
            
        });
        
    };
    
	MyInsight.prototype.init = function() {
		var _this = this;
        _this.consoleLog('mainController - entering');
        _this.bindEvents();
        _this.setDataAdapter();
//        if (_this.application == 'iRep') {
        try {
            _this.dsRunQuery(_this.queryConfig.suggestions).then(function(suggestions){
                _this.consoleLog('suggestions.length - ', suggestions.length);
                _this.parseSuggestions(suggestions);
                _this.attachAccountIds();
           });
        } catch(e) {
            _this.consoleLog('Error in MyInsight.prototype.init - ', e);
        }
            
//        }
                
	};
	
	$.extend(MyInsight.prototype, Queries.prototype);
    global.MyInsight = MyInsight;
	
})(this);

$(function() {
	console.log('document ready');
	var myInsight = new MyInsight();
    $('#response').append('<pre>document-ready</pre>');
    
	myInsight.init();
});
