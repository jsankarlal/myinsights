var appData = {
	filtered: {
		suggestions:[{
				title: 'title1',
	            reason: 'sadfsdaf dsafdsf aadfds  fsad fsadf ssafdsaf s fsadfsafsda fdsa afsuggestion.Reason_vod__c dsafsfdsad fsaf dsafasdf',
	            type: 'type1',
				status: 'suggestion.Status',
				lastStatusUpdatedBy: 'suggestion.LastStatusUpdatedBy',
				createdDate: 'suggestion.CreatedDate',
	            postedDate: 'moment(suggestion.Posted_Date_vod__c).format(\'LL\')',
				expirationDate: 'moment(suggestion.Expiration_Date_vod__c).format(\'LL\')',
				accountName: 'suggestion.AccountName',
				tags:[{
					"Driver_vod__c": "",
					"Product_vod__c": "FASENRA"
				},{
					"Driver_vod__c": "Recent OCS Burst",
					"Product_vod__c": ""
				}]
			},{
				title: 'title1',
	            reason: 'sadfsdaf dsafdsf aadfds  fsad fsadf ssafdsaf s fsadfsafsda fdsa afsuggestion.Reason_vod__c dsafsfdsad fsaf dsafasdf',
	            type: 'type1',
				status: 'suggestion.Status',
				lastStatusUpdatedBy: 'suggestion.LastStatusUpdatedBy',
				createdDate: 'suggestion.CreatedDate',
	            postedDate: 'moment(suggestion.Posted_Date_vod__c).format(\'LL\')',
				expirationDate: 'moment(suggestion.Expiration_Date_vod__c).format(\'LL\')',
				accountName: 'suggestion.AccountName',
				tags:[{
					"Driver_vod__c": "",
					"Product_vod__c": "FASENRA"
				},{
					"Driver_vod__c": "Recent OCS Burst",
					"Product_vod__c": ""
				}]
			},{
				title: 'title1',
	            reason: 'sadfsdaf dsafdsf aadfds  fsad fsadf ssafdsaf s fsadfsafsda fdsa afsuggestion.Reason_vod__c dsafsfdsad fsaf dsafasdf',
	            type: 'type1',
				status: 'suggestion.Status',
				lastStatusUpdatedBy: 'suggestion.LastStatusUpdatedBy',
				createdDate: 'suggestion.CreatedDate',
	           postedDate: 'moment(suggestion.Posted_Date_vod__c).format(\'LL\')',
				expirationDate: 'moment(suggestion.Expiration_Date_vod__c).format(\'LL\')',
				accountName: 'suggestion.AccountName',
				tags:[{
					"Driver_vod__c": "",
					"Product_vod__c": "FASENRA"
				},{
					"Driver_vod__c": "Recent OCS Burst",
					"Product_vod__c": ""
				}]
			},{
				title: 'title1',
	            reason: 'sadfsdaf dsafdsf aadfds  fsad fsadf ssafdsaf s fsadfsafsda fdsa afsuggestion.Reason_vod__c dsafsfdsad fsaf dsafasdf',
	            type: 'type1',
				status: 'suggestion.Status',
				lastStatusUpdatedBy: 'suggestion.LastStatusUpdatedBy',
				createdDate: 'suggestion.CreatedDate',
	           postedDate: 'moment(suggestion.Posted_Date_vod__c).format(\'LL\')',
				expirationDate: 'moment(suggestion.Expiration_Date_vod__c).format(\'LL\')',
				accountName: 'suggestion.AccountName',
				tags:[{
					"Driver_vod__c": "",
					"Product_vod__c": "FASENRA"
				},{
					"Driver_vod__c": "Recent OCS Burst",
					"Product_vod__c": ""
				}]
			},{
				title: 'title1',
	            reason: 'sadfsdaf dsafdsf aadfds  fsad fsadf ssafdsaf s fsadfsafsda fdsa afsuggestion.Reason_vod__c dsafsfdsad fsaf dsafasdf',
	            type: 'type1',
				status: 'suggestion.Status',
				lastStatusUpdatedBy: 'suggestion.LastStatusUpdatedBy',
				createdDate: 'suggestion.CreatedDate',
	           postedDate: 'moment(suggestion.Posted_Date_vod__c).format(\'LL\')',
				expirationDate: 'moment(suggestion.Expiration_Date_vod__c).format(\'LL\')',
				accountName: 'suggestion.AccountName',
				tags:[{
					"Driver_vod__c": "",
					"Product_vod__c": "FASENRA"
				},{
					"Driver_vod__c": "Recent OCS Burst",
					"Product_vod__c": ""
				}]
			},{
				title: 'title1',
	            reason: 'sadfsdaf dsafdsf aadfds  fsad fsadf ssafdsaf s fsadfsafsda fdsa afsuggestion.Reason_vod__c dsafsfdsad fsaf dsafasdf',
	            type: 'type1',
				status: 'suggestion.Status',
				lastStatusUpdatedBy: 'suggestion.LastStatusUpdatedBy',
				createdDate: 'suggestion.CreatedDate',
	            postedDate: 'moment(suggestion.Posted_Date_vod__c).format(\'LL\')',
				expirationDate: 'moment(suggestion.Expiration_Date_vod__c).format(\'LL\')',
				accountName: 'suggestion.AccountName',
				tags:[{
					"Driver_vod__c": "",
					"Product_vod__c": "FASENRA"
				},{
					"Driver_vod__c": "Recent OCS Burst",
					"Product_vod__c": ""
				}]
			},
		]
		}
		};

function filterSuggestionByProductsDrivers(productFilter, driverFilter, suggestion) {
	try {
		var hasTags = false,
			flag = false;
			console.log(suggestion.tags);
	//	if (productFilter || driverFilter) {
			if(suggestion.tags != 'undefined') {
				
				console.log('suggestion.tags - not undefined');
				if($.isArray(suggestion.tags)) {
					console.log('suggestion.tags - isArray true');
					hasTags = suggestion.tags.length > 0 ? true : false;
					console.log('suggestion.tags.length > 0 :  true/False '+ hasTags);
				} 
			}
			
			
			if(hasTags) {
				console.log('inside hasTags');
				$('#response').append('<pre>inside: filterSuggestionByProductsDrivers : hasTags : inside - '+ JSON.stringify(hasTags, null, "\t") +'</pre>');
				for(var i=0; i < suggestion.tags.length; i++) {
					if(flag) {
						return flag;
					}
					if (productFilter.has(suggestion.tags[i].Product_Name__c) || driverFilter.has(suggestion.tags[i].Driver_vod__c)) {
						flag = true;
					}
				}	    			
			}
	//	} 
		return flag;
	} catch(e) {
		$('#response').append('<pre>After: filterSuggestionByProductsDrivers : ' + JSON.stringify(e, null, "\t") +'</pre>');
	}
}

var productFilter = new Set(['FASENRA']);
var driverFilter = new Set(['Recent OCS Burst']);
//filterSuggestionByProductsDrivers(productFilter, driverFilter, suggestion);

function buildTable(statusFilter, typeFilter) {

        var $table = $('#bootstrap-table'),
        	rows = [],
        	row = {},
        	markup = '';
        $('#response').append('<pre> inside buildTable: statusFilter :' + JSON.stringify(statusFilter, null, "\t") + '</div>');
        $('#response').append('<pre> inside buildTable: typeFilter :' + JSON.stringify(typeFilter, null, "\t") + '</div>');
        for (var i = 0; i < appData.filtered.suggestions.length; i++) {
        	row = appData.filtered.suggestions[i];
        	if (statusFilter && statusFilter === row.status) {
            	$('#response').append('<pre> inside buildTable: lastStatusUpdatedByFilter && statusFilter Matched :' + JSON.stringify('', null, "\t") + '</div>');
                rows.push(row);
            } else if (typeFilter && typeFilter === row.type) {
            	$('#response').append('<pre> inside buildTable: typeFilter Matched :' + JSON.stringify(typeFilter, null, "\t") + '</div>');
                rows.push(row);
            } else if(!statusFilter && !typeFilter) {
                rows.push(row);
            }

        }
        //$("#tablebody").append(markup);

        function operateFormatter(value, row, index) {
            return [
                '<div class="table-icons">',
                '<a rel="tooltip" title="View" class="btn btn-simple btn-info btn-icon table-action view" href="javascript:void(0)">',
                '<i class="ti-image"></i>',
                '</a>',
                '<a rel="tooltip" title="Edit" class="btn btn-simple btn-warning btn-icon table-action edit" href="javascript:void(0)">',
                '<i class="ti-pencil-alt"></i>',
                '</a>',
                '<a rel="tooltip" title="Remove" class="btn btn-simple btn-danger btn-icon table-action remove" href="javascript:void(0)">',
                '<i class="ti-close"></i>',
                '</a>',
                '</div>',
            ].join('');
        }
        
        function detailFormatter(index, row) {
            var html = [];
            $.each(row, function (key, value) {
                html.push('<p><b>' + key + ':</b> ' + value + '</p>');
            });
            return html.join('');
        }
        
        $table.bootstrapTable({
            toolbar: ".toolbar",
            clickToSelect: true,
            showRefresh: false,
            search: true,
            showToggle: false,
            showColumns: false,
            pagination: true,
            searchAlign: 'left',
            pageSize: 5,
            clickToSelect: false,
            pageList: [5, 10, 15, 20],
            multipleSearch: true,
            delimeter: '&',
            showFilter: true,
            filterControl: true,
            detailView: true,
            detailFormatter: detailFormatter,


            formatShowingRows: function(pageFrom, pageTo, totalRows) {
                //do nothing here, we don't want to show the text "showing x of y from..."
            },
            formatRecordsPerPage: function(pageNumber) {
                return pageNumber + " rows visible";
            },
            icons: {
                refresh: 'fa fa-refresh',
                toggle: 'fa fa-th-list',
                columns: 'fa fa-columns',
                detailOpen: 'glyphicon glyphicon-plus icon-plus',
                detailClose: 'glyphicon glyphicon-minus icon-minus'
            }
        });
        

        $table.bootstrapTable('load', rows);

        //activate the tooltips after the data table is initialized
        $('[rel="tooltip"]').tooltip();

        $(window).resize(function() {
            $table.bootstrapTable('resetView');
        });

    }
	
	buildTable(null, null);