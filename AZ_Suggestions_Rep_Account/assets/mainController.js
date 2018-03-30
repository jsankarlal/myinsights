
$(document).ready(function() {
//invoke immediately
	
	//proper color scheme for data visualizations
	//5DA5DA (blue), rgb(93,165,218)
	//FAA43A (orange), rgb(250,164,58)
	//60BD68 (green), rgb(96,189,104)
	//F17CB0 (pink), rgb(241,124,176)
	//DECF3F (yellow), rgb(222,207,63)
	//B276B2 (purple), rgb(178,118,178)
	//4D4D4D (gray), rgb(77,77,77)
	//F15854 (red), rgb(241,88,84)
	//B2912F (brown), rgb(178,145,47)

	var first_run = true;

	let pendingColor = ['rgba(250,164,58, 1)'];
	let dismissedColor = ['rgba(242,227,83, 1)'];
	let completedColor = ['rgba(169,208,94, 1)'];
	let actionedColor = ['rgba(96,189,104, 1)'];

	var pendingColorDisplay = ['rgba(250,164,58, 1)'];
	var dismissedColorDisplay = ['rgba(242,227,83, 1)'];
	var completedColorDisplay = ['rgba(169,208,94, 1)'];
	var actionedColorDisplay = ['rgba(96,189,104, 1)'];
	 var actionedText = 'Actioned',
	    completedText = 'Marked as Complete',
	    pendingText = 'Pending',
	    dismissedText = 'Dismissed';
	    
	var callText = 'Call',
	    callObjectiveText = 'Call Objective',
	    emailText = 'Email',
	    insightText = 'Insight';
	var appData = {
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
         monthly_suggestions: {
             complete: [],
             total: []
         },
         months_to_date: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
         average_data: {
             pending: 0,
             dismissed: 0,
             actioned: 0,
             completed: 0
         },
         suggestions_by_type_data: []
     };

	 var products_master_set = new Set();
	 var drivers_master_set = new Set();
	
	 var selected_drivers = null;
	 var selected_products = null;
	 var selected_users = null;
	
	 //Create Team Chart
	 function createTeamChart() {

	        $('#team_chart_container').empty();
	        $('#team_chart_container').append('<canvas id="suggestions"></canvas>');
	        if (myChart) {
	            myChart.destroy();
	        }
	     /*   var names = [];
	        var pending = [];
	        var dismissed = [];
	        var completed = [];
	        var actioned = [];

	        for (var i = 0; i < appData.filtered.userObject.usersList.length; i++) {
	            pendingColorDisplay[i] = 'rgba(250,164,58, 1)';
	            dismissedColorDisplay[i] = 'rgba(242,227,83, 1)';
	            completedColorDisplay[i] = 'rgba(169,208,94, 1)';
	            actionedColorDisplay[i] = 'rgba(96,189,104, 1)';
	            names.push(appData.filtered.userObject.usersList[i].Name);
	            pending.push(appData.filtered.userObject.usersList[i].pending);
	            dismissed.push(appData.filtered.userObject.usersList[i].dismissed);
	            completed.push(appData.filtered.userObject.usersList[i].completed);
	            actioned.push(appData.filtered.userObject.usersList[i].actioned);
	        }*/

	        //suggestions chart
	        var ctx = document.getElementById("suggestions");
	        var myChart = new Chart(ctx, {
	            type: 'horizontalBar',
	            data: {
	            	labels: [''],
	            	datasets: [{
	                    label: 'Pending',
	                    data: [appData.filtered.myCount.pending],
	                    backgroundColor: pendingColorDisplay,
	                    borderColor: pendingColorDisplay
	                },{
	                    label: 'Dismissed',
	                    data: [appData.filtered.myCount.dismissed],
	                    backgroundColor: dismissedColorDisplay,
	                    borderColor: dismissedColorDisplay
	                }, {
	                    label: 'Actioned',
	                    data: [appData.filtered.myCount.actioned],
	                    backgroundColor: actionedColorDisplay,
	                    borderColor: actionedColorDisplay
	                },{
	                    label: 'Marked Complete',
	                    data: [appData.filtered.myCount.completed],
	                    backgroundColor: completedColorDisplay,
	                    borderColor: completedColorDisplay
	                }]
	            },
	            options: {
	                maintainAspectRatio: false,
	                responsive: true,
	                title: {
	                    display: false
	                },
	                scales: {
	                    yAxes: [{
	                        display: true,
	                        stacked: true,
	                        ticks: {
	                            beginAtZero: true
	                        },
	                    }],
	                    xAxes: [{
	                        display: true,
	                        stacked: true,
	                    }]
	                },
	                legend: {
	                    display: true,
	                    labels: {
	                        filter: function (legendItem, chartData) {
	                            console.log(legendItem);
	                            console.log(chartData);
	                            
	                            for (var i = 0; i < chartData.datasets.length; i++) {
	                                if (legendItem.text === chartData.datasets[i].label) {
	                                    var hasValue = false;
	                                    for (var j = 0; j < chartData.datasets[i].data.length; j++) {
	                                        if (chartData.datasets[i].data[j] > 0) {
	                                            hasValue = true;
	                                        }
	                                    }
	                                    return hasValue;
	                                }
	                            }
	                            
	                        }
	                    }
	                },
	                tooltips: {
	                    enabled: false
	                },
	                onClick: handleClick,
	                animation: {
	                    onComplete: function() {
	                        var chartInstance = this.chart,
	                        ctx = chartInstance.ctx,
							preset = 0;

	                        ctx.font = Chart.helpers.fontString(10, "bold", Chart.defaults.global.defaultFontFamily);
	                        ctx.textAlign = 'center';
	                        ctx.textBaseline = 'center';

	                        this.data.datasets.forEach(function(dataset, i) {
	                            var meta = chartInstance.controller.getDatasetMeta(i);
	                            meta.data.forEach(function(bar, index) {
	                                var data = dataset.data[index];
	                                //console.log(bar._model.x);
	                                if (data > 0) {
	                                	ctx.fillText(data, bar._model.base+(bar._model.x - bar._model.base)/2, bar._model.y-6);
	    								preset = bar._model.x;
	                                }   
	                            });
	                        });
	                    }
	                }
	            }
	        });

	        function handleClick(e) {
	        /**
	        var currentChart = myChart.getElementAtEvent(e)[0];
	        console.log(currentChart);
	        var currentTeamMember = currentChart._view.label;
	        console.log(currentTeamMember);
	        var currentDataset = currentChart._datasetIndex;
	        var currentData = currentChart._index;

	        //var dataset = myChart1.getElementAtEvent(e)[0]._datasetIndex;
	        swal({
	            html: "<h4>" + currentTeamMember + "</h4><br/>Pending: <strong>" + pending[currentData] +
	                "</strong><br/>Dismissed: <strong>" + dismissed[currentData] + "</strong><br/>Marked Complete: <strong>" +
	                completed[currentData] + "</strong><br/>Actioned: <strong>" + actioned[currentData] + "</strong>"
	        });**/


	            console.log(myChart.getElementAtEvent(e));
	            var chartData = myChart.getElementAtEvent(e)[0]._view;
	            console.log(chartData);
	        /**console.log(currentChart);
	        $(".search").find(".form-control").val(currentChart._view.label + '&' + currentChart._view.datasetLabel);
	        $(".search").find(".form-control").trigger("keyup");**/

	            var status = chartData.datasetLabel;

	      		if (status == 'Marked Complete') {
	      			status = 'Marked as Complete';
	      		}
	      		$('#response').append('<div> clicked createTeamChart:  chartData.datasetLabel :' + JSON.stringify(chartData.datasetLabel, null, "\t") + '</div>');
	      		//function buildTable(statusFilter, typeFilter);
	      		try{
	      			buildTable(status, null);
		            //document.location.href = 'index.html#bootstrap-table';
	      			//location.hash = '#bootstrap-table';
	      			$('html, body').animate({
	      		        scrollTop: $("#bootstrap-table").offset().top
	      		    }, 1200);
	      		} catch(e){
	      			$('#response').append('<pre>error :' + JSON.stringify(e, null, "\t") + '</pre>');
	      		}
      			
	        }
	    }
	 
	  
	//0 = calls
	//1 = email
	//2 = insight
	//3 = call objective
	function createSuggestionsByTypeChart(type_data) {

	    $('#suggestions_by_type_container').empty();
	    $('#suggestions_by_type_container').append('<canvas id="suggestions_by_type"></canvas>');
	    if (myChart1) {
	        myChart1.destroy();
	    }

	    var type_data = [appData.filtered.types.call, appData.filtered.types.email, appData.filtered.types.insight, appData.filtered.types.objective],
	        labels = ["Call", "Email", "Insight", "Call Objective"],
	        labels_to_display = [],
	        data_to_display = [];
	
	    for (var i = 0; i < labels.length; i++) {
	        if (type_data[i] !== 0) {
	            labels_to_display.push(labels[i]);
	            data_to_display.push(type_data[i]);
	        }
	    }
	
	//    if (data_to_display.length > 0) {//only render the chart if there are meaningful types to break down.
	        first_run = false;
	        var ctx1 = document.getElementById("suggestions_by_type");

	        var myChart1 = new Chart(ctx1, {
				type: 'horizontalBar',
				data: {
					labels: labels_to_display,
					datasets: [{
						label: 'Sugestions by Type',
						data: data_to_display,
						backgroundColor: [
							'rgba(93,165,218, 1)', 'rgba(93,165,218, 1)', 'rgba(93,165,218, 1)', 'rgba(93,165,218, 1)', 'rgba(93,165,218, 1)'
						],
						borderColor: [
							'rgba(93,165,218, 1)'
						]
					}]
				},
				options: {
					maintainAspectRatio: false,
					responsive: true,
					title: {
						display: false
					},
					scales: {
						yAxes: [{
							display: true,
							stacked: false,
							ticks: {
								beginAtZero: true
							},
						}],
						xAxes: [{
							display: true,
							stacked: false,
							barPercentage: 0.7,
							ticks: {
								beginAtZero: true
							}
						}]
					},
					legend: {
						display: false,
						labels: {
							display: true
						}
					},
					tooltips: {
						enabled: false
					},
					onClick: handleClick,
					animation: {
						onComplete: function() {
							var chartInstance = this.chart,
								ctx = chartInstance.ctx;

							ctx.font = Chart.helpers.fontString(10, "bold", Chart.defaults.global.defaultFontFamily);
							ctx.textAlign = 'center';
							ctx.textBaseline = 'center';

							this.data.datasets.forEach(function(dataset, i) {
								var meta = chartInstance.controller.getDatasetMeta(i);
								meta.data.forEach(function(bar, index) {
									var data = dataset.data[index];
									//console.log(bar._model.x);
									if (data > 0) {
										ctx.fillText(data, bar._model.base+(bar._model.x - bar._model.base)/2, bar._model.y);
									}   
								});
							});
						}
					}
	            }
	        });

	   /* } else if (first_run){
	        $("#suggestions_by_type_section").remove();
	        $("#team_continer").removeClass("col-md-6");
	        $("#team_continer").addClass("col-md-12");
	    }*/

	    

	    function handleClick(e) {
	        /**var currentChart = myChart1.getElementAtEvent(e)[0];
	        console.log(labels_to_display[currentChart._datasetIndex]);
	        console.log(data_to_display[currentChart._index]);
	        //var dataset = myChart1.getElementAtEvent(e)[0]._datasetIndex;
	        var myhtml = "";
	        for (var i = 0; i < labels_to_display.length; i++) {
	            myhtml += "<strong>" + labels_to_display[i] + ": </strong> " +
	                data_to_display + "<br/>";
	        }
	        swal({
	            html: myhtml
	        });
	        **/
	        //document.location.href = 'index.html#bootstrap-table';
	        //console.log(chart_config.data.datasets[activeElement[0]._datasetIndex].data[activeElement[0]._index]);

	        var chartData = myChart1.getElementAtEvent(e)[0]._view;
	        console.log(chartData);
	        /**console.log(currentChart);
	        $(".search").find(".form-control").val(currentChart._view.label + '&' + currentChart._view.datasetLabel);
	        $(".search").find(".form-control").trigger("keyup");**/

	        //function buildTable(statusFilter, typeFilter)
	        $('#response').append('<div> clicked createSuggestionsByTypeChart:  chartData.label :' + JSON.stringify(chartData.label, null, "\t") + '</div>');
	        buildTable(null, chartData.label);
	        //location.hash = '#bootstrap-table';
	        $('html, body').animate({
  		        scrollTop: $("#bootstrap-table").offset().top
  		    }, 1200);

	    }
	}
	
	function createTrendsChart() {

	    $('#trends_container').empty();
	    $('#trends_container').append('<canvas id="chart1"></canvas>');
	    if (myChart3) {
	        myChart3.destroy();
	    }
	    var totals = appData.filtered.count.total,
	    	completes = appData.filtered.count.complete,
	    	months = appData.months_to_date;
	    var ctx3 = document.getElementById("chart1");
	    var myChart3 = new Chart(ctx3, {
	        type: 'line',
	        data: {
	            labels: months,
	            datasets: [{
	                type: 'line',
	                label: 'Total',
	                data: totals,
	                backgroundColor: 'rgba(93,165,218, 0.5)',
	                borderColor: 'rgba(93,165,218, 1)',
	                borderWidth: 1
	            }, {
	                type: 'line',
	                label: 'Completed/Actioned',
	                data: completes,
	                backgroundColor: 'rgba(96,189,104, 0.9)',
	                borderColor: 'rgba(96,189,104,1)',
	                borderWidth: 1
	            }]
	        },
	        options: {
	            maintainAspectRatio: false,
	            responsive: true,
	            scales: {
	                yAxes: [{
	                    display: true,
	                    ticks: {
	                        beginAtZero: true,
	                        fontStyle: 'bold'
	                    }
	                }],
	                xAxes: [{
	                    display: true,
	                    scaleLabel: {
	                        display: false
	                    }
	                }],
	            },
	            legend: {
	                labels: {
	                    fontColor: '#777',
	                    fontFamily: 'Arial'
	                }
	            },
	            animation: {
					onComplete: function() {
						var chartInstance = this.chart,
							ctx = chartInstance.ctx;

						ctx.font = Chart.helpers.fontString(9, "bold", Chart.defaults.global.defaultFontFamily);
						ctx.textAlign = 'center';
						ctx.textBaseline = 'center';
						ctx.fillStyle = 'rgba(0, 0, 0,.7)';

						this.data.datasets.forEach(function(dataset, i) {
							var meta = chartInstance.controller.getDatasetMeta(i);
							meta.data.forEach(function(bar, index) {
								var data = dataset.data[index];
								//console.log(bar._model.x);
								if (data > 0) {
									ctx.fillText(data, bar._model.x, bar._model.y-15);
								}   
							});
						});
					}
				}
	        }
	    });
	}
	
	function buildTable(statusFilter, typeFilter) {

        var $table = $('#bootstrap-table'),
        	rows = [],
        	row = {},
        	markup = '';
        $('#response').append('<pre> inside buildTable: statusFilter :' + JSON.stringify(statusFilter, null, "\t") + '</div>');
        $('#response').append('<pre> inside buildTable: typeFilter :' + JSON.stringify(typeFilter, null, "\t") + '</div>');
        if (appData.filtered.suggestions.length > 0) {
	        for (var i = 0; i < appData.filtered.suggestions.length; i++) {
	        	row = appData.filtered.suggestions[i];
	        	if (statusFilter && statusFilter === row.status) {
	            	$('#response').append('<pre> inside buildTable: statusFilter Matched :' + JSON.stringify('', null, "\t") + '</div>');
	                rows.push(row);
	            } else if (typeFilter && typeFilter === row.type) {
	            	$('#response').append('<pre> inside buildTable: typeFilter Matched :' + JSON.stringify(typeFilter, null, "\t") + '</div>');
	                rows.push(row);
	            } else if(!statusFilter && !typeFilter) {
	                rows.push(row);
	            }
	
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
            var html = ['<div style="padding-left:50px;padding-right:50px;"> <h4 style="text-align:center;"> Suggestion Details </h4>'],
            	map = {};
            map['title'] = 'Title';
            map['reason'] = 'Reason';
            map['type'] = 'Type';
            map['status'] = 'Status';
            map['lastStatusUpdatedBy'] = 'Last Status Updated By';
            map['accountName'] = 'Account Name';
			map['accountNameFormula'] = 'Account Name Formula';
            map['postedDate'] = 'Posted Date';
            map['expirationDate'] = 'Expiration Date';
            map['productTags'] = 'Tagged Products';
            map['driverTags'] = 'Tagged Drivers';
            map['createdDate'] = 'Created Date';
            		
            $.each(row, function (key, value) {
            	if(key != 'tags' && key != 'undefined') {
            		if (key == 'createdDate') {
            			value = moment(value).format('LL');
            		} 
            		html.push('<p><b>' + map[key] + ':</b> ' + value + '</p>');
            	}
            });
            html.push('</div>')
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
            pageSize: 10,
            clickToSelect: false,
            pageList: [10, 20, 30, 40],
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
                detailOpen: 'fa fa-plus-square',
                detailClose: 'fa fa-minus-square'
            }
        });

        $table.bootstrapTable('load', rows);

        //activate the tooltips after the data table is initialized
        $('[rel="tooltip"]').tooltip();

        $(window).resize(function() {
            $table.bootstrapTable('resetView');
        });

    }
	
	//refreshCharts(selected_drivers, selected_products);     
    function refreshCharts(drivers, products) {
        
        var selected_drivers_set = null;
        if (drivers) {
            selected_drivers_set = new Set(selected_drivers);
        }
        var selected_products_set = null;
        if (products) {
            selected_products_set = new Set(selected_products);
        }
               
        filterSuggestions(selected_products_set, selected_drivers_set);
        
        //make sure we're only displaying the YTD labels and values:
        var this_month_remove = ((new Date().getMonth()) + 1);
        appData.months_to_date = appData.months_to_date.slice(0, this_month_remove);
        appData.filtered.count.total = appData.filtered.count.total.slice(0, this_month_remove);
        appData.filtered.count.complete = appData.filtered.count.complete.slice(0, this_month_remove);
        
        //CREATE TYPE CHART
        createSuggestionsByTypeChart();
        
        //CREATE TRENDS CHART
        createTrendsChart();
        
        
        createTeamChart();

        //BuildTable based on the filtered results
        buildTable(null, null);
    }

    //initialize the promise library
    $q = window.Q;
    //console.log("q.js initialized");

    function getUserId() {
        //console.log("getting userId");
    	$('#response').append('<pre>getUserId - Entering </pre>');
        var deferred = $q.defer();

        ds.getDataForCurrentObject('User', 'Id')
            .then(function(result) {
                //console.log(result);
                deferred.resolve(result.User.Id);
            })

        return deferred.promise;
    }
    
    function getAccountId() {
    	//console.log("getting userId");
    	var deferred = $q.defer();

    	ds.getDataForCurrentObject('Account', 'Id')
    		.then(function(result) {
    			//console.log(result);
    			deferred.resolve(result.Account.Id);
    		})

    	return deferred.promise;
    }

    function getCurrentUserTerritoryId(userId) {
        //console.log("getting UserTerr data based on userid = " + userId);
        //var inUserTerr = ds.getInStatement([userId]);
    	$('#response').append('<pre>getCurrentUserTerritoryId - Entering </pre>');
        var queryConfig = {
            userTerr: {
                object: 'UserTerritory',
                fields: ['TerritoryId'],
                where: "UserId = '" + userId + "'"
            }
        };

        var deferred = $q.defer();

        ds.runQuery(queryConfig.userTerr)
            .then(function(result) {
                //console.log(result)
                deferred.resolve(result.data); //we're assuming only 1 territory is assigned per user
            });

        return deferred.promise;
    }

    //accepts a single value territory SFDC Id
    function getChildTerritoryIds(terrId) {
        //console.log("getting more territories");
        //var inTerr = ds.getInStatement([terrId]);
        var queryConfig = {
            childTerr: {
                object: 'Territory',
                fields: ['Id'],
                where: 'ParentTerritoryId = \'' + terrId + '\''
            }
        };

        var deferred = $q.defer();

        ds.runQuery(queryConfig.childTerr)
            .then(function(result) {
                //console.log(result);
                deferred.resolve(result.data); //we're assuming only 1 level of child territories deep
            });

        return deferred.promise;

    }

    //accepts an array of territory SFDC Id's
    function getChildUserIds(terrIds) {
        //console.log("getting user id's of the manager's minions");
        var inTerr = ds.getInStatement(terrIds);

        var queryConfig = {
            childTerr: {
                object: 'UserTerritory',
                fields: ['UserId'],
                where: 'TerritoryId IN ' + inTerr
            }
        };

        var deferred = $q.defer();

        ds.runQuery(queryConfig.childTerr)
            .then(function(result) {
                //console.log(result);
                deferred.resolve(result.data);
            });

        return deferred.promise; //returning a list of User SFDC Ids
    }

    //accepts an array of User SFDC id's
    function getChildUsers(userIds) {
        //console.log("getting the usernames and id's together");
        var inTerr = ds.getInStatement(userIds);

        var queryConfig = {
            childTerr: {
                object: 'User',
                fields: ['Name', 'Id'],
                where: 'Id IN ' + inTerr
            }
        };

        var deferred = $q.defer();

        ds.runQuery(queryConfig.childTerr)
            .then(function(result) {
                deferred.resolve(result.data);
            });

        return deferred.promise; //returning a list of User Names for display
    }

    function getProducts() {
        //console.log("querying product catalog");
        var queryConfig = {
            all_products: {
                object: 'Product_vod__c',
                fields: ['Name', 'Id'],
                where: ''
            }
        };

        var deferred = $q.defer();

        ds.runQuery(queryConfig.all_products)
            .then(function(result) {
                //console.log(result);
                deferred.resolve(result.data);
            });

        return deferred.promise; //returning a list of products
    }
    
    function getCurrentUserName() {
        //console.log("getting userId");
        var deferred = $q.defer();

        ds.getDataForCurrentObject('User', 'Name')
            .then(function(result) {
                //console.log(result);
                deferred.resolve(result.User.Name);
            })

        return deferred.promise;
    }

    function getRecordTypes() {
        //console.log('getting recordtypes');

        var inObject = ds.getInStatement(['Suggestion_vod__c', 'Suggestion_Tag_vod__c']);

        var queryConfig = {
            recordTypes: {
                object: 'RecordType',
                fields: ['Id', 'DeveloperName'],
                where: 'SobjectType IN ' + inObject
            }
        };

        var deferred = $q.defer();

        ds.runQuery(queryConfig.recordTypes)
            .then(function(result) {
                deferred.resolve(result.data);
            });

        return deferred.promise;
    }

    function getSuggestions(accountId) {
        //console.log("getting Suggestion header records");
  //      var inOwner = ds.getInStatement(userIds);
   //     $('#response').append('<div> Owner :' + JSON.stringify(inOwner, null, "\t") + '</div>');

       var queryConfig = {
            suggestions: {
                object: 'Suggestion_vod__c',
                fields: ['OwnerId', 'Account_Name_Stamp_AZ_US__c','Account_Name_Formula_AZ_US__c', 'Owner_District_AZ_US__c', 'Actioned_By_AZ_US__c', 'Completed_By_AZ_US__c', 'Dismissed_By_AZ_US__c', 'Account_vod__c','CreatedDate', 'RecordTypeId', 'Id', 'Marked_As_Complete_vod__c', 'Actioned_vod__c', 'Dismissed_vod__c', 'Title_vod__c', 'Reason_vod__c', 'Posted_Date_vod__c', 'Expiration_Date_vod__c'],
                where: 'Account_vod__c =\''+ accountId +'\''
            }
        };

        var deferred = $q.defer();

        ds.runQuery(queryConfig.suggestions)
            .then(function(result) {
                deferred.resolve(result.data);
            });

        return deferred.promise;
    }
	
    function getUserNames(ownerIds) {
        var inObject = ds.getInStatement(ownerIds);

        var queryConfig = {
            userNames: {
                object: 'User',
                fields: ['Id', 'Name'],
                where: 'Id IN ' + inObject
            }
        };
        
        var deferred = $q.defer();

        ds.runQuery(queryConfig.userNames)
            .then(function(result) {
                deferred.resolve(result.data);
            });

        return deferred.promise;
    }
    
	function getAccountNames(accountIds) {
        var accIds = ds.getInStatement(accountIds);
        var queryConfig = {
            accounts: {
                object: 'Account',
                fields: ['Name', 'Id'],
                where: 'Id IN ' + accIds
            }
        };

        var deferred = $q.defer();

        ds.runQuery(queryConfig.accounts)
            .then(function(result) {
                deferred.resolve(result.data);
            });

        return deferred.promise;
    }
	
    function getSuggestionTags(suggestions) {

        var suggestionIds = [];
        for (var i = 0; i < suggestions.length; i++) {
            suggestionIds.push(suggestions[i].Id);
        }
        //console.log("getting tags");
        var inSuggest = ds.getInStatement(suggestionIds);


        var queryConfig = {
            suggestionTags: {
                object: 'Suggestion_Tag_vod__c',
                fields: ['Product_Name__c', 'Suggestion_vod__c', 'Driver_vod__c'],
                where: 'Suggestion_vod__c IN ' + inSuggest
            }
        };

        var deferred = $q.defer();

        ds.runQuery(queryConfig.suggestionTags)
            .then(function(result) {
                //console.log(result);
                deferred.resolve(result.data);
            });

        return deferred.promise;
    }

    function disableProductFilter() {
        //console.log('sup');

        $('.product-filter').remove();
        $('#product_filter_label').remove();
        //$('.product-filter').children().css({color: "#9A9A9A"; border-color: "#9A9A9A"});
        //$('.product-filter').selectPicker('setStyle','btn-default','add');
        //$('.product-filter').prop('disabled', true);
        //$('.product-filter').selectpicker('refresh');
    }

    function disableDriverFilter() {
        $('.driver-filter').remove();
        $('#driver_filter_label').remove();
    }

    function getAllSuggestionFeedback() {
        //console.log("getting feedback");

        var queryConfig = {
            suggestionFeedback: {
                object: 'Suggestion_Feedback_vod__c',
                fields: ['Suggestion_vod__c'],
                where: ''
            }
        };

        var deferred = $q.defer();

        ds.runQuery(queryConfig.suggestionFeedback)
            .then(function(result) {
                //console.log(result);
                deferred.resolve(result.data);
            });

        return deferred.promise;
    }

    //returns true if a match is found
    function countAgainstTagFilters(applyProductFilter, applyDriverFilter, productFilter, driverFilter, suggestionTags) {
    	$('#response').append('<pre>countAgainstTagFilters - entering: productFilter ' + JSON.stringify(productFilter, null, "\t") +'</pre>');
    	$('#response').append('<pre>countAgainstTagFilters - entering: driverFilter ' + JSON.stringify(driverFilter, null, "\t") +'</pre>');
    	$('#response').append('<pre>countAgainstTagFilters - entering: suggestionTags ' + JSON.stringify(suggestionTags, null, "\t") +'</pre>');
        //console.log(suggestionTags);
        var product_match = false;
        var driver_match = false;

        if (applyProductFilter) {
            if (suggestionTags) {
                for (var i = 0; i < suggestionTags.length; i++) {
                    if (productFilter.has(suggestionTags[i].Product_Name__c)) {
                        product_match = true;
                    }
                }
            }
        }
        if (applyDriverFilter) {
            if (suggestionTags) {
                //console.log("checking driver filter");
                for (var i = 0; i < suggestionTags.length; i++) {
                    if (driverFilter.has(suggestionTags[i].Driver_vod__c)) {
                        driver_match = true;
                        //console.log("passed!");
                    }
                }
            }

        }
        return (product_match || driver_match);
    }


    function createTeamPicker(users) {
        var team_options = '';
        for (var i = 0; i < users.length; i++) {
            team_options += '<option value="' + users[i].Name + '">' + users[i].Name + '</option>';
        }

        $("#team_picker").append(team_options);
        $('#team_picker').selectpicker('refresh');
        $('#team_picker').selectpicker('render');

    }
    
    function checkTags(tags, filters) {
    	var flag = false;
    	for (var j=0; j < filters.length; j++) {
    		for (var i=0; i < tags.length; i++) {
        		if(tags[i] == filters[j]) {
        			flag = true;
        			return flag;
        		}
        	}
    	}
    	
    	return flag;
    }
    
    function filterSuggestionByProductsDrivers(productFilter, driverFilter, suggestion) {
    	try {
	    	var productFlag = productFilter ? false : true,
	    		driverFlag = driverFilter ? false : true;
	    	  				
	    	if (productFilter && !productFlag && suggestion.productTags.length > 0 && checkTags(suggestion.productTags, selected_products)) {
				productFlag = true;
            }
			
			if (driverFilter && !driverFlag && suggestion.driverTags.length > 0 && checkTags(suggestion.driverTags, selected_drivers)) {
				driverFlag = true;
            }
    				
	    	return productFlag && driverFlag;
    	} catch(e) {
			$('#response').append('<pre>After: filterSuggestionByProductsDrivers : ' + JSON.stringify(e, null, "\t") +'</pre>');
		}
    }
    
    function filterSuggestions(productFilter, driverFilter) {
		$('#response').append('<pre>inside: filterSuggestions : </pre>');
		$('#response').append('<pre>productFilter :'+ JSON.stringify(productFilter, null, "\t") +' </pre>');
		$('#response').append('<pre>driverFilter :'+ JSON.stringify(driverFilter, null, "\t") +' </pre>');
		try {
			var filtered = {},
				tableDataCount = 0,
				thisSuggestion = {};
			
			
			//initialize userObject for status calculation
			appData.filtered.myCount["pending"] = 0;
			appData.filtered.myCount["dismissed"] = 0;
			appData.filtered.myCount["actioned"] = 0;
			appData.filtered.myCount["completed"] = 0;
			
	        
			//initialize types object for types calculation
			appData.filtered.types = {
				call: 0,
	        	email: 0,
	        	insight: 0,
	        	objective: 0
	        };
			//initialize count object for types calculation
	        appData.filtered.count = {
	            total: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	            complete: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	        };
	        //initialize appData.filtered.suggestions object
	        appData.filtered.suggestions = [];
	        if (appData.suggestions.length > 0) {
		        for (var i = 0; i < appData.suggestions.length; i++) {
		        	thisSuggestion = aggregateTableData(appData.suggestions[i]);
		            //apply product and driver filters
		        	if(productFilter || driverFilter) {
			            if (filterSuggestionByProductsDrivers(productFilter, driverFilter, thisSuggestion)) {
			           		countSuggestionStatus(thisSuggestion);
			           		calculateMonthsCount(thisSuggestion);
			           		calculateSuggestionsType(thisSuggestion);
			           	 	appData.filtered.suggestions.push(thisSuggestion);
			           	 	tableDataCount++;
			             }
		        	} else {
		        		countSuggestionStatus(thisSuggestion);
		           		calculateMonthsCount(thisSuggestion);
		           		calculateSuggestionsType(thisSuggestion);
		           	 	appData.filtered.suggestions.push(thisSuggestion);
		           	 	tableDataCount++;
		        	}
		        }
	        }
	        $('#response').append('<pre>tableDataCount: ' + JSON.stringify(tableDataCount, null, "\t") +'</pre>');
	        
	        $('#response').append('<pre>appData.filtered.suggestions : first suggestion ' + JSON.stringify(appData.filtered.suggestions[0], null, "\t") +'</pre>');
			$('#response').append('<pre>appData.filtered.suggestions.length : ' + JSON.stringify(appData.filtered.suggestions.length, null, "\t") +'</pre>'); 
	        $('#response').append('<pre>appData.filtered.myCount : ' + JSON.stringify(appData.filtered.myCount, null, "\t") +'</pre>');
	        $('#response').append('<pre>appData.filtered.types : ' + JSON.stringify(appData.filtered.types, null, "\t") +'</pre>');
	        $('#response').append('<pre>appData.filtered.count : ' + JSON.stringify(appData.filtered.count, null, "\t") +'</pre>');
	        
		} catch(e) {
			$('#response').append('<pre>error: filterSuggestions : ' + JSON.stringify(e, null, "\t") +'</pre>');
		}
	}
	
	function aggregateTableData(suggestion) {
		var thisSuggestion = {
				title: suggestion.Title_vod__c,
	            reason: suggestion.Reason_vod__c,
	            type: suggestion.type,
				status: suggestion.Status,
				lastStatusUpdatedBy: suggestion.LastStatusUpdatedBy,
				createdDate: suggestion.CreatedDate,
	            postedDate: moment(suggestion.Posted_Date_vod__c).format('LL'),
				expirationDate: moment(suggestion.Expiration_Date_vod__c).format('LL'),
				accountName: suggestion.AccountName,
				accountNameFormula: suggestion.AccountNameFormula,
				tags: suggestion.tags,
				productTags: suggestion.productTags,
				driverTags: suggestion.driverTags
            };
		
		return thisSuggestion;
	}
	
	function calculateSuggestionsType(suggstion) {
		if (suggstion.type == callText) {
			appData.filtered.types.call++;
        } else if (suggstion.type == emailText) {
        	appData.filtered.types.email++;
        } else if (suggstion.type == callObjectiveText) {
        	appData.filtered.types.objective++;
        } else if (suggstion.type == insightText) {
        	appData.filtered.types.insight++;
        }
	}
	
	//Count by User Status for Team Chart
	function countSuggestionStatus(suggestion) {
	 	if (suggestion.status == actionedText) { 
	 		appData.filtered.myCount['actioned']++;
	 	} else if (suggestion.status == completedText) {
	 		appData.filtered.myCount['completed']++;
	 	} else if (suggestion.status == dismissedText) {
	 		appData.filtered.myCount['dismissed']++;
	 	} else if (suggestion.status == pendingText) {
	 		appData.filtered.myCount['pending']++;
	    }
	}
	
	//Count by created month for Trends chart
	function calculateMonthsCount(suggestion, count) {
		var month = new Date(suggestion.createdDate).getMonth();
		appData.filtered.count.total[month]++;
        if (suggestion.status == completedText || suggestion.status == actionedText) {
        	appData.filtered.count.complete[month]++;
        }
	}
	
    
   
    
    function parseSuggestions(suggestions) {
    	$('#response').append('<pre>inside: parseSuggestions : </pre>');
    	var accountIds = [];
        appData.ownerIdList = [];
        if (suggestions.length > 0) {
	        for (var i = 0; i < suggestions.length; i++) {
	        	var this_suggestion = {
	                Marked_As_Complete_vod__c: suggestions[i].Marked_As_Complete_vod__c.value,
	                Dismissed_vod__c: suggestions[i].Dismissed_vod__c.value,
	                Actioned_vod__c: suggestions[i].Actioned_vod__c.value,
	                RecordTypeId: suggestions[i].RecordTypeId.value,
	                Id: suggestions[i].Id.value,
	                CreatedDate: suggestions[i].CreatedDate.value,
	                OwnerId: suggestions[i].OwnerId.value,
	                Title_vod__c: suggestions[i].Title_vod__c.value,
	                Reason_vod__c: suggestions[i].Reason_vod__c.value,
	                Posted_Date_vod__c: suggestions[i].Posted_Date_vod__c.value,
					Expiration_Date_vod__c: suggestions[i].Expiration_Date_vod__c.value,
					Account_vod__c: suggestions[i].Account_vod__c.value,
					AccountName: suggestions[i].Account_Name_Stamp_AZ_US__c.value,
					AccountNameFormula : suggestions[i].Account_Name_Formula_AZ_US__c.value,
					Actioned_By_AZ_US__c: suggestions[i].Actioned_By_AZ_US__c.value,
					Completed_By_AZ_US__c: suggestions[i].Completed_By_AZ_US__c.value,
					Dismissed_By_AZ_US__c: suggestions[i].Dismissed_By_AZ_US__c.value,
					LastStatusUpdatedBy: '',
					Status: '',
					productTags: [],
					driverTags: []
						
	            };
	        	appData.ownerIdList.push(suggestions[i].OwnerId.value);
	        	
	            appData.suggestionIds[i] = suggestions[i].Id.value;
	            switch (suggestions[i].RecordTypeId.value) {
	                case appData.recordtype_map.Call_vod:
	                	this_suggestion.type = callText;
	                    break;
	                case appData.recordtype_map.Call_Objective_vod:
	                	this_suggestion.type = callObjectiveText;
	                    break;
	                case appData.recordtype_map.Email_vod:
	                	this_suggestion.type = emailText;
	                    break;
	                case appData.recordtype_map.Insight_vod:
	                	this_suggestion.type = insightText;
	                    break;
	        	}
	            this_suggestion.LastStatusUpdatedBy = this_suggestion.Actioned_By_AZ_US__c || this_suggestion.Completed_By_AZ_US__c || this_suggestion.Dismissed_By_AZ_US__c || '';
	            this_suggestion.Status = this_suggestion.Actioned_vod__c ? 'Actioned' : this_suggestion.Marked_As_Complete_vod__c ? 'Marked as Complete' : this_suggestion.Dismissed_vod__c ? 'Dismissed' : 'Pending';
	 //         accountIds[i] = suggestions[i].Account_vod__c.value;
	            //console.log(this_suggestion);
	            appData.suggestions[i] = this_suggestion;
	        }
	        appData.ownerIdList = appData.ownerIdList.filter(function(item, i, ar){ return ar.indexOf(item) === i; });
	       // $('#response').append('<pre> appData.suggestions[appData.suggestions.length-1] : ' + JSON.stringify(appData.suggestions[appData.suggestions.length-1], null, "\t") +'</pre>');
        }
    }
    
    function parseSuggestionTags(tags) {

        console.log(tags);
        try {
        	$('#response').append('<pre>inside: parseSuggestionTags : </pre>');
	        if (tags.length > 0) {
	        	$('#response').append('<pre>tags.length :'+tags.length+' </pre>');
	            var product_tags_missing = true;
	            var driver_tags_missing = true;
	            //console.log(appData.suggestions);
	            for (var i = 0; i < appData.suggestions.length; i++) {
	                var tag_count = 0,
	                	driverTags = [],
	                	productTags = [];
	                for (var j = 0; j < tags.length; j++) {
	                    //check if this tag parentid matches this suggestion id
	                    if (tags[j].Suggestion_vod__c.value === appData.suggestions[i].Id) {
	                        //console.log("it's a match!");
	                    	driverTags.push(tags[j].Driver_vod__c.value);
	                    	productTags.push(tags[j].Product_Name__c.value);
	                        var newTag = {
	                            Driver_vod__c: tags[j].Driver_vod__c.value,
	                            Product_Name__c: tags[j].Product_Name__c.value
	                        };
	                        //console.log(newTag);
	                        //console.log(appData.suggestions[i]);
	                        if (tag_count === 0) {
	                            appData.suggestions[i]["tags"] = [];
	                        }
	                        appData.suggestions[i].tags[tag_count] = newTag;
	                        tag_count++;
	                        //console.log(appData.suggestions[i].tags);
	                        if (newTag.Driver_vod__c) {
	                            drivers_master_set.add(newTag.Driver_vod__c);
	                            driver_tags_missing = false;
	                        }
	                        if (newTag.Product_Name__c) {
	                            products_master_set.add(newTag.Product_Name__c);
	                            product_tags_missing = false;
	                        }
	                    }
	                    appData.suggestions[i]['driverTags'] = driverTags.filter(function(n){ return n != '' });
	                    appData.suggestions[i]['productTags'] = productTags.filter(function(n){ return n != '' });
	                    
	                }
	            }
	            console.log("Driver tags missing? " + driver_tags_missing);
	            console.log(drivers_master_set);
	            console.log("Product tags missing? " + product_tags_missing);
	            console.log(products_master_set);
	            if (product_tags_missing) {
	                disableProductFilter();
	            } else { //now that all the tags are built out, time to compose the select pickers
	                var product_options = '';
	                for (let product of products_master_set) {
	                    product_options += '<option value="' + product + '">' + product + '</option>';
	                }
	                $("#product_filter").append(product_options);
	                $('.product-filter').selectpicker('refresh');
	
	            }
	            if (driver_tags_missing) {
	                disableDriverFilter();
	            } else { //now that all the tags are built out, time to compose the driver  pickers
	                var driver_options = '';
	                for (let driver of drivers_master_set) {
	                    driver_options += '<option value="' + driver + '">' + driver + '</option>';
	                }
	                $("#driver_filter").append(driver_options);
	                $('.driver-filter').selectpicker('refresh');
	            }
	        } else { //no tags!!
	            //disable the filters that don't apply
	            //console.log("There are zero Suggestion Tags")
	            disableDriverFilter();
	            disableProductFilter();
	        }
        
	    } catch(e) {
			$('#response').append('<pre>Error in: parseSuggestionTags : ' + JSON.stringify(e, null, "\t") +'</pre>');
		}
    	
    }
    
    function parseUserNames(userNames) {
    	$('#response').append('<pre>inside parseUserNames : ' + JSON.stringify('', null, "\t") +'</pre>');
    	$('#response').append('<pre>before parseUserNames : appData.suggestions.length ' + JSON.stringify(appData.suggestions.length, null, "\t") +'</pre>');
    	try {
    		if (userNames.length > 0) {
	        	var ownerIdLookup = {};
	        	for (var i = 0;i < userNames.length; i++) {
	        		ownerIdLookup[userNames[i].Id.value] = userNames[i].Name.value;
	        	}
	        	$.extend(appData.ownerIdLookup, ownerIdLookup);
	        	for (var i = 0; i < appData.suggestions.length; i++) {
	        		var temp = appData.ownerIdLookup[appData.suggestions[i].OwnerId] ? appData.ownerIdLookup[appData.suggestions[i].OwnerId] : '';
	        	    appData.suggestions[i].LastStatusUpdatedBy = appData.suggestions[i].LastStatusUpdatedBy || temp ;
	        	}
	        	$('#response').append('<pre> appData.suggestions length : ' + JSON.stringify(appData.suggestions.length, null, "\t") +'</pre>');
    		}
    	} catch(e){
    		$('#response').append('<pre>error : ' + JSON.stringify(e, null, "\t") +'</pre>');
    	}
    }

    function mainController() {
    	$('#response').append('<div>mainController - entering </div>');
    	getAccountId().then(function(accountId) {
            //console.log(userId);
            appData.accountId = accountId;
            //console.log(appData.currentUser.Id);
            return getUserId();
    	}).then(function(userId) {
        	$('#response').append('<pre>getUserId - '+ JSON.stringify(userId, null, "\t") +' </pre>');
        	appData.currentUser.Id = userId;
        	 return getCurrentUserName();
        }).then (function(username) {
        	$('#response').append('<pre>username: ' +  username + '</pre>');
            appData.currentUser.Name = username;
            //console.log(products_master_set);
            return getRecordTypes();
        }).then(function(rt) {
            $('#response').append('<pre>getRecordTypes - passed </pre>');
            for (var i = 0; i < rt.length; i++) {
                $.extend(appData.recordtype_map, {
                    [rt[i].DeveloperName.value]: rt[i].Id.value
                });
            } //for the horrified: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#Computed_property_names
       //     $('#response').append('<pre>appData.recordtype_map '+ JSON.stringify(appData.recordtype_map, null, "\t") +' </pre>');
            console.log(appData.recordtype_map);
            return getSuggestions(appData.accountId);
        }).then(function(suggestions) {
            $('#response').append('<pre>getSuggestions - passed : suggestions.length:'+suggestions.length +' </pre>');
            if (suggestions.length == 1) {
            	$('#response').append('<pre>getSuggestions - passed : suggestions.length:'+ JSON.stringify(suggestions, null, "\t") +' </pre>');
            
            
            }
        	return parseSuggestions(suggestions);
        }).then(function() {
        	$('#response').append('<pre>parseSuggestions - passed </pre>');
            return getSuggestionTags(appData.suggestions);
        }).then(function(tags) {
            $('#response').append('<pre>getSuggestionTags - passed </pre>');
        	return parseSuggestionTags(tags);
        }).then(function() {
        	$('#response').append('<pre>before: getUserNames</pre>');
           	return getUserNames(appData.ownerIdList);
        }).then(function(userNames) {
        	$('#response').append('<pre>After: getUserNames : userNames.length ' + JSON.stringify(userNames.length, null, "\t") +'</pre>');
        	return parseUserNames(userNames);
        }).then(function() {
        	$('#response').append('<pre>before: filterSuggestions</pre>');
           	filterSuggestions(null, null);
            //make sure we're only displaying the YTD labels and values:
            var this_month_remove = ((new Date().getMonth()) + 1);
            appData.months_to_date = appData.months_to_date.slice(0, this_month_remove);
            appData.filtered.count.total = appData.filtered.count.total.slice(0, this_month_remove);
            appData.filtered.count.complete = appData.filtered.count.complete.slice(0, this_month_remove);
            
            //Create charts
            createSuggestionsByTypeChart();
            createTrendsChart();
            createTeamChart();
            buildTable(null, null);

            //event listener for driver filter
            $("#driver_filter").on("hidden.bs.select", function(e) {
                selected_drivers = $("#driver_filter").val();
                refreshCharts(selected_drivers, selected_products);
            });

            //event listener for product filter
            $("#product_filter").on("hidden.bs.select", function(e) {
                selected_products = $("#product_filter").val();
                refreshCharts(selected_drivers, selected_products);
            });

        });
    }
    

	$('#response').append('<pre>document-ready</pre>');
    mainController();
});