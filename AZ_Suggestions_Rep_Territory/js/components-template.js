var componentsTemplate = {},
    resource = {};

componentsTemplate['suggestion-list'] = '<div class="list list-hover">' +
'   <% _.each(result, function(suggestion, index) { %>       ' +
'        <div class="line">' +
'            <a href="#suggestion-<%= index %>" aria-controls="suggestions" role="tab" data-toggle="tab" aria-expanded="true" class="suggestion-item" data-account-id="">' +
'                <div class="row">' +
'                    <div class="col-xs-2 col-sm-1">' +
'                        <i class="fa fa-2x fg-navy fa-bell" aria-hidden="true"></i>' +
'                    </div>' +
'                    <div class="col-xs-10 col-sm-11">' +
'                        <p><%= suggestion.title %></p>' +
'                    </div>' +
'                </div>' +
'            </a>' +
'        </div>' +
'     <% }) %>' +
' </div>';

componentsTemplate['suggestion-detail'] = '<div class="tab-content">' +
'   <% _.each(result,function(suggestion, index) { %>       ' +
'         <div class="tab-pane fade <%= index == 2 ? \'in active\': \'\'%> " id="suggestion-<%= index %>">' +
'             <div class="row  margin-right-left-0 margin-bottom-10">' +
'                <div class="col-xs-12 col-sm-12 padding-0">' +
'                    <div class="padding-10 padding-bottom-0">' +
'                        <h4><span> Target Account :  </span> <span class=""> <%= suggestion.accountName %></span> </h4>' +
'                        <h4><span> Title :  </span> <span class=""> <%= suggestion.title %></span> </h4>' +
'                    </div>' +
'                </div>' +
'                <div class="col-xs-12 col-sm-12 padding-0">' +
'                    <div class="text-center padding-10 padding-top-0">' +
'                        <a class="action-link fg-navy navigate-to-native" data-account-id="<%= suggestion.accountId %>" data-type="view">' +
'                            View Account' +
'                            <i class="fa padding-10 fa-external-link " aria-hidden="true"></i>' +
'                        </a>' +
'                        <a class="action-link fg-navy navigate-to-native " data-account-id="<%= suggestion.accountId %>" data-type="call">' +
'                            Record a Call' +
'                            <i class="fa padding-10 fa-calendar-plus-o " aria-hidden="true"></i>' +
'                        </a>' +
'                    </div>' +
'                </div>' +
'             </div>' +
'             <p><span class="fg-navy"> Reason : </span> <span> <%= suggestion.reason %></span></p>' +
'             <p><span class="fg-navy"> Posted Date : </span> <span> <%= suggestion.postedDate %></span></p>' +
'             <p><span class="fg-navy"> Expiry Date  :</span> <span> <%= suggestion.expiryDate %></span></p>' +
'             <p><span class="fg-navy"> Status  :</span> <span> <%= suggestion.status %></span></p>' +
'             <p><span class="fg-navy"> Last Status Updated By :</span> <span> <%= suggestion.lastStatusUpdatedBy %></span></p>' +
'         </div>' +
'    <% }) %>' +
' </div>';

componentsTemplate['hcp-list'] = '<div class="list list-hover">' +
'    <% _.each(result,function(hcp, index) { %>       ' +
'        <div class="line <%= index == 1 ? \'active\': \'\'%>">' +
'            <a href="#user-<%= index %>" aria-controls="targetted-users" role="tab" data-toggle="tab" aria-expanded="true">' +
'                <div class="row">' +
'                    <div class="col-xs-2 col-sm-2">' +
'                        <img src="assets/images/placeholder-<%= hcp.gender == \'male\' ? \'male\' : \'female\' %>.png" style="height: 60px;">' +
'                    </div>' +
'                    <div class="col-xs-7 col-sm-8">' +
'                        <p> <b> <%= hcp.firstName %></b> <span><%= hcp.lastName %></span></p>' +
'                        <p class="short-description"> <%= hcp.address %></p>' +
'                    </div>' +
'                    <div class="col-xs-3 col-sm-2">' +
'                        <p> <%= hcp.product %> </p>' +
'                        <p> <%= hcp.therapyArea %></p>' +
'                    </div>' +
'                </div>' +
'            </a>' +
'        </div>' +
'    <% }) %>' +
'</div>';
	
componentsTemplate['hcp-detail'] = '<div class="tab-content">' +
'    <% _.each(result,function(hcp, index) { %>    ' +
'        <div class="tab-pane fade <%= index == 1 ? \'in active\': \'\'%>" id="user-<%= index %>">' +
'' +
'            <div class="row  margin-right-left-0 margin-bottom-10">' +
'                <div class="col-xs-12 col-sm-12 padding-0">' +
'                    <div class="row padding-10">' +
'                        <div class="col-xs-3 col-sm-3 text-center padding-top-30">' +
'                            <img src="assets/images/placeholder-<%= hcp.gender == \'male\' ? \'male\' : \'female\' %>.png" style="height: 70px;">' +
'                        </div>' +
'                        <div class="col-xs-9 col-sm-9">' +
'                            <p> <b> <%= hcp.firstName %></b> <span><%= hcp.lastName %></span></p>' +
'                            <p> <%= hcp.address %></p>' +
'                            <div class="action-link-list">' +
'                                <a class="navigate-to-native fg-navy action-link" data-account-id="<%= hcp.id %>" data-type="view">' +
'                                    <i class="fa padding-10 box-shadow-all-white fa-external-link" aria-hidden="true"></i>' +
'                                     View Account' +
'                                </a>' +
'                                <a class="navigate-to-native fg-navy action-link" data-account-id="<%= hcp.id %>" data-type="call">' +
'                                    <i class="fa padding-10 box-shadow-all-white fa-calendar-plus-o " aria-hidden="true"></i>' +
'                                    Record a Call' +
'                                </a>' +
'                            </div>' +
'                        </div>' +
'                    </div>' +
'                </div>' +
'' +
'            </div> ' +
'' +
'            <div class="ratings-component">' +
'                <div class="row margin-right-left-0">' +
'                    <div class="col-xs-4 padding-bottom-10">' +
'                        <span class="label navy-theme label-lg full-width">Academic</span>' +
'                    </div>' +
'                    <div class="col-xs-5 padding-top-5 fg-gold">' +
'                        <% if (hcp.metric.academic.rating >= 1) { %> ' +
'                            <i class="fa fa-2x padding-left-5 fa-star" aria-hidden="true"></i>' +
'                        <% } else { %>' +
'                            <i class="fa fa-2x padding-left-5 fa-star-o" aria-hidden="true"></i>' +
'                        <% } if (hcp.metric.academic.rating >= 2) { %>' +
'                            <i class="fa fa-2x padding-left-5 fa-star" aria-hidden="true"></i>' +
'                        <% } else { %>' +
'                            <i class="fa fa-2x padding-left-5 fa-star-o" aria-hidden="true"></i>' +
'                        <% } if (hcp.metric.academic.rating >= 3) { %>' +
'                            <i class="fa fa-2x padding-left-5 fa-star" aria-hidden="true"></i>' +
'                        <% } else { %>' +
'                            <i class="fa fa-2x padding-left-5 fa-star-o" aria-hidden="true"></i>' +
'                        <% } if (hcp.metric.academic.rating >= 4) { %>' +
'                            <i class="fa fa-2x padding-left-5 fa-star" aria-hidden="true"></i>' +
'                        <% } else { %>' +
'                            <i class="fa fa-2x padding-left-5 fa-star-o" aria-hidden="true"></i>' +
'                        <% } if (hcp.metric.academic.rating >= 5) { %>' +
'                            <i class="fa fa-2x padding-left-5 fa-star" aria-hidden="true"></i>' +
'                        <% } else { %>' +
'                            <i class="fa fa-2x padding-left-5 fa-star-o" aria-hidden="true"></i>' +
'                        <% } %>' +
'                    </div>' +
'                    <div class="col-xs-3">' +
'                        <div class="percentage-section">' +
'                            <span> <%= hcp.metric.academic.percentage %> </span> ' +
'                            <i class="fa fa-percent" aria-hidden="true"></i>' +
'                        </div>' +
'                    </div>' +
'                </div>' +
'' +
'                <div class="row margin-right-left-0">' +
'                    <div class="col-xs-4 padding-bottom-10">' +
'                        <span class="label navy-theme label-lg full-width">Internet</span>' +
'                    </div>' +
'                    <div class="col-xs-5 padding-top-5 fg-gold">' +
'                        <% if (hcp.metric.internet.rating >= 1) { %> ' +
'                            <i class="fa fa-2x padding-left-5 fa-star" aria-hidden="true"></i>' +
'                        <% } else { %>' +
'                            <i class="fa fa-2x padding-left-5 fa-star-o" aria-hidden="true"></i>' +
'                        <% } if (hcp.metric.internet.rating >= 2) { %>' +
'                            <i class="fa fa-2x padding-left-5 fa-star" aria-hidden="true"></i>' +
'                        <% } else { %>' +
'                            <i class="fa fa-2x padding-left-5 fa-star-o" aria-hidden="true"></i>' +
'                        <% } if (hcp.metric.internet.rating >= 3) { %>' +
'                            <i class="fa fa-2x padding-left-5 fa-star" aria-hidden="true"></i>' +
'                        <% } else { %>' +
'                            <i class="fa fa-2x padding-left-5 fa-star-o" aria-hidden="true"></i>' +
'                        <% } if (hcp.metric.internet.rating >= 4) { %>' +
'                            <i class="fa fa-2x padding-left-5 fa-star" aria-hidden="true"></i>' +
'                        <% } else { %>' +
'                            <i class="fa fa-2x padding-left-5 fa-star-o" aria-hidden="true"></i>' +
'                        <% } if (hcp.metric.internet.rating >= 5) { %>' +
'                            <i class="fa fa-2x padding-left-5 fa-star" aria-hidden="true"></i>' +
'                        <% } else { %>' +
'                            <i class="fa fa-2x padding-left-5 fa-star-o" aria-hidden="true"></i>' +
'                        <% } %>' +
'                    </div>' +
'                    <div class="col-xs-3">' +
'                        <div class="percentage-section">' +
'                            <span> <%= hcp.metric.internet.percentage %></span> ' +
'                            <i class="fa fa-percent" aria-hidden="true"></i>' +
'                        </div>' +
'                    </div>' +
'                </div>' +
'' +
'                <div class="row margin-right-left-0">' +
'                    <div class="col-xs-4 padding-bottom-10">' +
'                        <span class="label navy-theme label-lg full-width">Society</span>' +
'                    </div>' +
'                    <div class="col-xs-5 padding-top-5 fg-gold">' +
'                        <% if (hcp.metric.society.rating >= 1) { %> ' +
'                            <i class="fa fa-2x padding-left-5 fa-star" aria-hidden="true"></i>' +
'                        <% } else { %>' +
'                            <i class="fa fa-2x padding-left-5 fa-star-o" aria-hidden="true"></i>' +
'                        <% } if (hcp.metric.society.rating >= 2) { %>' +
'                            <i class="fa fa-2x padding-left-5 fa-star" aria-hidden="true"></i>' +
'                        <% } else { %>' +
'                            <i class="fa fa-2x padding-left-5 fa-star-o" aria-hidden="true"></i>' +
'                        <% } if (hcp.metric.society.rating >= 3) { %>' +
'                            <i class="fa fa-2x padding-left-5 fa-star" aria-hidden="true"></i>' +
'                        <% } else { %>' +
'                            <i class="fa fa-2x padding-left-5 fa-star-o" aria-hidden="true"></i>' +
'                        <% } if (hcp.metric.society.rating >= 4) { %>' +
'                            <i class="fa fa-2x padding-left-5 fa-star" aria-hidden="true"></i>' +
'                        <% } else { %>' +
'                            <i class="fa fa-2x padding-left-5 fa-star-o" aria-hidden="true"></i>' +
'                        <% } if (hcp.metric.society.rating >= 5) { %>' +
'                            <i class="fa fa-2x padding-left-5 fa-star" aria-hidden="true"></i>' +
'                        <% } else { %>' +
'                            <i class="fa fa-2x padding-left-5 fa-star-o" aria-hidden="true"></i>' +
'                        <% } %>' +
'                    </div>' +
'                    <div class="col-xs-3">' +
'                        <div class="percentage-section">' +
'                            <span> <%= hcp.metric.society.percentage %> </span> ' +
'                            <i class="fa fa-percent" aria-hidden="true"></i>' +
'                        </div>' +
'                    </div>' +
'                </div>' +
'' +
'            </div>' +
'' +
'            <div class="panel-group" id="accordion-<%= hcp.id %>">' +
'' +
'                <div class="panel panel-default">' +
'                    <div class="panel-heading">' +
'                        <h4 class="panel-title">' +
'                            <a class="collapse-panel-heading collapsed fa-right" data-toggle="modal" data-target="#popup-modal" href="#">' +
'                                <span>Relationship Charts </span><span class="fa fa-chevron-right pull-right"></span></a>' +
'                        </h4>' +
'                    </div>' +
'                </div>' +
'' +
'                <div class="panel panel-default">' +
'                    <div class="panel-heading">' +
'                        <h4 class="panel-title">' +
'                            <a class="collapse-panel-heading collapsed" data-toggle="collapse" data-parent="#accordion-<%= hcp.id %>" href="#collapse1-<%= hcp.id %>"><span>Suggested Topics </span><span class="fa fa-chevron-up pull-right"></span></a>' +
'                        </h4>' +
'                    </div>' +
'                    <div id="collapse1-<%= hcp.id %>" class="panel-collapse collapse">' +
'                        <div class="panel-body">' +
'                            <p>Content for suggested topics</p>' +
'                        </div>' +
'                    </div>' +
'                </div>' +
'' +
'                <div class="panel panel-default">' +
'                    <div class="panel-heading">' +
'                        <h4 class="panel-title">' +
'                            <a class="collapse-panel-heading collapsed"  data-toggle="collapse" data-parent="#accordion-<%= hcp.id %>" href="#collapse2-<%= hcp.id %>"><span>Basic information </span><span class="fa fa-chevron-up pull-right"></span></a>' +
'                        </h4>' +
'                    </div>' +
'                    <div id="collapse2-<%= hcp.id %>" class="panel-collapse collapse">' +
'                        <div class="panel-body">' +
'                            <p>Content for basic Information</p>' +
'                            <div class="list list-hover"> ' +
'                                <div class="line">' +
'                                    <p><span class="fg-navy"> First Name  </span> <span class="pull-right"> <%= hcp.firstName %></span></p>' +
'                                </div>' +
'                                <div class="line">' +
'                                    <p><span class="fg-navy"> Last Name  </span> <span class="pull-right"> <%= hcp.lastName %></span></p>' +
'                                </div>' +
'                                <div class="line">' +
'                                    <p><span class="fg-navy"> Address  </span> <span class="pull-right"> <%= hcp.address %></span></p>' +
'                                </div>' +
'                                <div class="line">' +
'                                    <p><span class="fg-navy"> Account Name  </span> <span class="pull-right"> <%= hcp.accountName %></span></p>' +
'                                </div>' +
'                                <div class="line">' +
'                                    <p><span class="fg-navy"> Therapy Area  </span> <span class="pull-right"> <%= hcp.therapyArea %></span></p>' +
'                                </div>' +
'                                <div class="line">' +
'                                    <p><span class="fg-navy"> Product </span> <span class="pull-right"> <%= hcp.product %></span></p>' +
'                                </div>' +
'                                ' +
'                                <div class="line">' +
'                                    <p><span class="fg-navy"> Language </span> <span class="pull-right"> <%= hcp.language %></span></p>' +
'                                </div>' +
'                                ' +
'                            </div>' +
'                        </div>' +
'                    </div>' +
'                </div>' +
'' +
'            </div>' +
'        </div>' +
'    <% }) %>' +
'    ' +
'</div>';

componentsTemplate['kpi-list'] = '<div class="card-view kpi-section"> ' +
'    <div class="card-title">' +
'        <span class="main-title"> <%= result.title %></span>' +
'        <span class="sub-title pull-right" data-kpi-id="<%= result.id %> "> <%= result.subTitle %> <i class="fa fa-chevron-right"></i></span>' +
'    </div>' +
'     <div class="card-container">' +
'         <div class="row">' +
'             <% _.each(result.metric, function(metric, index) { %>  ' +
'                <div class="col-xs-6 col-sm-6 col-md-6 card-widget padding-0 <%= index == 0 ? \'border-right-50\': \'\' %> ">' +
'                     <div class="card-tile">' +
'                        <h6><%= metric.title %></h6>' +
'                        <div class="percentage-section <%= result.title == \'Calls Number\' ? \'fg-yellowgreen\' : \'fg-aqua\' %>">' +
'                            <span> <%= metric.value %></span> ' +
'                            <i class="fa <%= result.title == \'Calls Number\' ? \'fa-arrow-up\' : \'fa-percent\' %>" aria-hidden="true"></i>' +
'                        </div>' +
'                        <div class="caption">' +
'                            <% _.each(metric.fields, function(field, pointer) { %>' +
'                                <p class="label-description"><span><%= field.name %>: </span><span class=""> <%= field.value %></span></p>' +
'                            <% }) %>' +
'                        </div>' +
'                    </div>' +
'                </div>' +
'            <% }) %>' +
'         </div>' +
'    </div>' +
'</div>';