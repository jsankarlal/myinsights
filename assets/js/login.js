

$(document).ready(function(){
    $("button").click(function(){
		var username = $('#inputEmail').val(),
		    password = $('#inputPassword').val();
			loginData = {
					username: username,
					password: password
				}
        loginSalesforce(loginData, function(data) { 
           $.ajax({
              type: "GET",
              contentType: 'application/json',
              url:'https://cs17.salesforce.com/services/data/v35.0/query?q=SELECT Name,Id,Due_Date_AZ_EU__c,Status_AZ_EU__c FROM Action_AZ_EU__c',  
              cache :false,
                headers: {'Authorization': 'Bearer '+data},
              dataType: 'json',
              success: function (data) {
                  
              },
              error : function(jqXHR, textStatus, errorThrown) {
                  console.log('Error: '+jqXHR.status);
                  console.log('textStatus: '+textStatus)
                 } 
           });
        });    
    });
});
/*
https://test.salesforce.com/services/oauth2/token?username= ankur.agnihotri@az.core.cored06&password=2017veevayFojwoSroZcAVN8dxuzsshJqz&grant_type=password&client_id=3MVG9ahGHqp.k2_wmbjHwYMdmX3cmOKx3zYG687U5UIUYkkPZ6yb.RQXPcmG8Z0u_6zYYawUcQQ==
&client_secret=7005354545272679489
*/
var username = 'ankur.agnihotri@az.core.cored06',
	password = '2017veeva',
	grant_type = 'password',
	securitytoken = 'FojwoSroZcAVN8dxuzsshJqz'
	client_id = '3MVG9ahGHqp.k2_wmbjHwYMdmX3cmOKx3zYG687U5UIUYkkPZ6yb.RQXPcmG8Z0u_6zYYawUcQQ==',
	client_secret = '7005354545272679489';
	
	
	
function loginSalesforce(loginData, callback){
	var username = loginData.username || 'ankur.agnihotri@az.core.cored06',
		password = loginData.password || '2017veeva',
		grant_type = 'password',
		securitytoken = 'FojwoSroZcAVN8dxuzsshJqz'
		client_id = '3MVG9ahGHqp.k2_wmbjHwYMdmX3cmOKx3zYG687U5UIUYkkPZ6yb.RQXPcmG8Z0u_6zYYawUcQQ==',
		client_secret = '7005354545272679489';
	
	loginPostData = {"grant_type":"password","client_id": client_id, "client_secret":client_secret,"username": username,"password": password + securitytoken};
     $.ajax({
            type: 'POST',
            crossOrigin: true,
            url: 'https://test.salesforce.com/services/oauth2/token',
            dataType: 'json',
            cache :false,
          //  data : {"grant_type":"password","client_id": client_id, "client_secret":client_secret,"username": username,"password": password + securitytoken},
			data: loginPostData,
            success : function (data) {
             //callback(data.access_token);
			 console.log(data);
			 
            },
            error : function (data, errorThrown,status) {
				console.log(data);
            }
    });
  }