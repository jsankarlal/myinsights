/*
 Veeva MyInsights Library version 172.0.9
 
 http://developer.veevacrm.com/

 Copyright © 2017 Veeva Systems, Inc. All rights reserved.

 My Insights Library is dependent on the Q library, which enables you to work with promises as returns from the My Insights Library methods.
 Include the Q library as a script in the custom report package.
 Q Library License Acknolegements
 Copyright 2009 - 2017 Kristopher Michael Kowal. All rights reserved.
 Q library can be downloaded here https://github.com/kriskowal/q/blob/v1/LICENSE
*/

(function () {
    'use strict';
    window.VeevaUtilities = function () {
        var veevaUtil = this;

        veevaUtil.isWin8 = function () {
            return navigator.platform.toLowerCase().indexOf('win') >= 0;
        };

        veevaUtil.isOnline = function () {
            var host = window.location.hostname;
            var onlineRETest = /cdnhtml/gi;
            return onlineRETest.test(host);
        };

        veevaUtil.addMessageListener = function (callback) {
            if (window.addEventListener) {
                window.addEventListener('message', callback, false);
            }
            else {
                window.attachEvent('onmessage', callback);
            }
            return callback;
        };

        veevaUtil.removeMessageListener = function (callback) {
            if (window.addEventListener) {
                window.addEventListener('message', callback, false);
            }
            else {
                window.detachEvent('onmessage', callback);
            }
        };

        veevaUtil.mergeObjects = function (dst, src, clobber) {
            for (var k in src) {
                if (src.hasOwnProperty(k) && ((!clobber && !dst[k]) || clobber)) {
                    dst[k] = src[k];
                }
            }
            return dst;
        };

        veevaUtil.copyObject = function (obj) {
            return JSON.parse(JSON.stringify(obj));
        };
    };
})();

(function (Q) {
    'use strict';
    window.OnlineAPI = function () {
        var olAPI = this;
        var listenerQueue = {};
        var veevaUtil = new window.VeevaUtilities();
        var translationsCache = {};
        var queries = {
            translations: {
                object: 'Message_vod__c',
                fields: ['Name', 'Category_vod__c', 'Language_vod__c', 'Text_vod__c'],
                where: ''
            }
        };

        function queryListener(message) {
            var data;
            if (typeof message.data === 'string') {
                try {
                    data = JSON.parse(message.data);
                }
                catch (e) {
                    data = {data: {}};
                }
            }
            if (data.command === 'queryReturn') {
                if (listenerQueue[data.deferredId]) {
                    listenerQueue[data.deferredId].resolve(data);

                    if(~data.deferredId.indexOf('callback_queued_')) {
                        olAPI.queryRunning = false;
                        olAPI.checkQueryQueue();
                    }
                }
                else {
                    console.warn('deferred cb not found', data);
                }
            }
            else if (data.command === 'error') {
                if(listenerQueue[data.deferredId]) {
                    listenerQueue[data.deferredId].reject(data);

                    if(~data.deferredId.indexOf('callback_queued_')) {
                        olAPI.queryRunning = false;
                        olAPI.checkQueryQueue();
                    }
                }
            }
            else {
                console.warn('unknown command', message);
            }
        }

        function addMessageListener(callback) {
            if (window.addEventListener) {
                window.addEventListener('message', callback, false);
            }
            else {
                window.attachEvent('onmessage', callback);
            }
        }

        function postBridgeMessage(message) {
            window.parent.postMessage(JSON.stringify(message), '*');
        }

        function generateQueryMessage(command, queryConfig) {
            var deferred = Q.defer();
            var deferredId = 'callback_' + (+new Date());
            queryConfig.command = command;
            listenerQueue[deferredId] = deferred;
            queryConfig.deferredId = deferredId;
            postBridgeMessage(queryConfig);
            // just pass the query config to the api
            return deferred.promise;
        }

        /**
         * Wrapper function for the legacy online queryRecord function
         */
        function queryRecord(object, fields, where, sort, limit) {
            var deferred = Q.defer();
            var deferredId = 'callback_' + (+new Date());
            var queryConfig = {
                command: 'queryObject',
                object: object,
                fields: fields,
                where: where,
                sort: sort,
                limit: limit,
                deferredId: deferredId
            };
            listenerQueue[deferredId] = deferred;
            postBridgeMessage(queryConfig);
            return deferred.promise;
        }

        olAPI.genericQueryErrorHandler = function (e) {
            var errors = e.error;
            var i = errors.length;
            while (i--) {
                errors[i] = {
                    message: errors[i].message,
                    error: errors[i].errorCode
                };
            }
            console.log(e);
            $('#response').append('<pre>appData.recordtype_map: ' +  JSON.stringify(e, null, "\t") + '</pre>');
        };

        olAPI.queryRecord = function (queryObject) {
            if(arguments.length > 1) {
                // Fallback method for legacy queryRecord
                return queryRecord.apply(olAPI, arguments);
            }

            var deferred = Q.defer();

            if (olAPI.queryRunning) {
                olAPI.queriesQueue.push({
                    config: queryObject,
                    deferred: deferred,
                    type: 'queryRecord_ol'
                });
            } else {
                var deferredId = 'callback_queued_' + (+new Date());
                var queryConfig = {
                    command: 'queryObject',
                    object: queryObject.object,
                    fields: queryObject.fields,
                    where: queryObject.where,
                    sort: queryObject.sort,
                    limit: queryObject.limit,
                    deferredId: deferredId
                };

                olAPI.queryRunning = true;
                listenerQueue[deferredId] = deferred;
                postBridgeMessage(queryConfig);
            }

            return deferred.promise;
        };

        olAPI.query = function (queryConfig) {
            var deferred = Q.defer();
            var deferredId = 'callback_' + Math.random().toString(36).substring(2); // (+new Date());
            queryConfig.deferredId = deferredId;
            listenerQueue[deferredId] = deferred;
            queryConfig.deferredId = deferredId;
            postBridgeMessage(queryConfig);
            // just pass the query config to the api
            return deferred.promise;
        };

        olAPI.getDataForCurrentObject = function (object, field) {
            var deferred = Q.defer();
            var deferredId = 'callback_' + Math.random().toString(36).substring(2); // (+new Date());
            var queryConfig = {
                command: 'getDataForObjectV2',
                object: object,
                fields: [field],
                deferredId: deferredId
            };
            listenerQueue[deferredId] = deferred;
            queryConfig.deferredId = deferredId;
            postBridgeMessage(queryConfig);
            // just pass the query config to the api
            return deferred.promise;
        };

        olAPI.getObjectLabels = function (objects) {
            return generateQueryMessage('getObjectLabels', {object: objects});
        };

        olAPI.getFieldLabels = function (queryConfig) {
            var deferred = Q.defer();
            generateQueryMessage('getFieldLabel', queryConfig).then(function (resp) {
                var fields = queryConfig.fields;
                var labels = resp[queryConfig.object];
                var f = fields.length;
                var newLabels = [];
                while (f--) {
                    newLabels.unshift({name: fields[f], display: labels[fields[f]]});
                }
                deferred.resolve(newLabels);
            });
            return deferred.promise;
        };

        olAPI.getTranslation = function (tokens, localeKey) {
            var deferred = Q.defer();
            var config = veevaUtil.copyObject(queries.translations);
            var whereSubClauses = [];
            var index = tokens.length;
            var cachedResponses = [];
            var cache = translationsCache;
            while (index--) {
                if (!cache[tokens[index].msgName + ':' + tokens[index].msgCategory]) {
                    whereSubClauses.push("(Name='" + tokens[index].msgName + "' AND Category_vod__c='" + tokens[index].msgCategory + "')");
                }
                else {
                    cachedResponses.push(cache[tokens[index].msgName + ':' + tokens[index].msgCategory]);
                }
            }
            config.where += "(" + whereSubClauses.join(" OR ") + ")" + " AND Language_vod__c='" + localeKey + "'";
            // if all the responses were in the cache, then this will be empty and we just return the cached responses.
            if (whereSubClauses.length) {
                olAPI
                    .queryRecord(config.object, config.fields, config.where)
                    .then(function (resp) {
                        var data = resp[config.object],
                            d = data.length;
                        deferred.resolve(data.concat(cachedResponses));
                        while (d--) {
                            if (!cache[data[d].Name.value + ':' + data[d].Category_vod__c.value]) {
                                cache[data[d].Name.value + ':' + data[d].Category_vod__c.value] = data[d];
                            }
                        }
                    });
            }
            else {
                deferred.resolve(cachedResponses);
            }
            return deferred.promise;
        };

        olAPI.getPicklistValueLabels = function (object, field) {
            var deferred = Q.defer();
            var queryConfig = {object: object, field: field};
            generateQueryMessage('getPicklistValueLabels', queryConfig)
                .then(function (resp) {
                    deferred.resolve(resp);
                });
            return deferred.promise;
        };

        addMessageListener(queryListener);
    };
})(window.Q);

(function (Q) {
    'use strict';

    var DataService = function () {
        var ds = this;
        ds.queriesQueue = [];
        ds.queryRunning = false;

        var veevaUtil = new window.VeevaUtilities();
        var queries = {
            translations: {
                object: 'Message_vod__c',
                fields: ['Name', 'Category_vod__c', 'Language_vod__c', 'Text_vod__c'],
                where: ''
            }
        };
        var dateRE = /date/i;
        var urlRE = /_url_/i;
        var translationsCache = {};

        function parseDate(input) {
            var hours, minutes, seconds, ms;
            var parts = input.match(/(\d+)/g);

            hours = parts[3] ? parseInt(parts[3], 10) : 0;
            minutes = parts[4] ? parseInt(parts[4], 10) : 0;
            seconds = parts[5] ? parseInt(parts[5], 10) : 0;
            ms = parts[6] ? parseInt(parts[6], 10) : 0;

            if (!veevaUtil.isOnline() && veevaUtil.isWin8()) {   // to parse date in winModern only
                return new Date(parts[2], parts[0]-1, parts[1], hours, minutes, seconds, ms); // 'MM-DD-YYYY' months are 0-based
            }else {
                return new Date(parts[0], parts[1]-1, parts[2], hours, minutes, seconds, ms); // 'YYYY-MM-DD' months are 0-based
            }
        }

        function getCRMDate(dateString) {
            var newDate = null, dtArr;
            var dateAndTimeArray;
            var timePortion, digits;
            var hours, minutes, seconds, ms;
            if (dateString) {
                if (!isNaN((new Date(dateString)).getDate())) {
                    newDate = parseDate(dateString);
                }
                else if (dateString.length && dateString.split) { // if the date is a dash delimited date string
                    dtArr = dateString.split('-');
                    // Special handler because the windows WebView cant figure out that this is a date.
                    dateAndTimeArray = dtArr[2].split(' ');

                    if (dateAndTimeArray.length > 1) {
                        timePortion = dateAndTimeArray[1];

                        digits = timePortion.match(/(\d+)/g);

                        hours = digits[0] ? parseInt(digits[0], 10) : 0;
                        minutes = digits[1] ? parseInt(digits[1], 10) : 0;
                        seconds = digits[2] ? parseInt(digits[2], 10) : 0;
                        ms = digits[3] ? parseInt(digits[3], 10) : 0;

                        newDate = new Date(dtArr[0], dtArr[1]-1, dateAndTimeArray[0], hours, minutes, seconds, ms);
                    }else {
                        newDate = new Date(dtArr[0], dtArr[1]-1, dtArr[2]);
                    }

                    if (isNaN(newDate.getDate())) {
                        newDate = null;
                    }
                }
            }
            if (!newDate) {
                console.warn('bad date', dateString, newDate);
            }

            return newDate;
        }

        function getResultSet(query) {
            for (var k in query) {
                if (query.hasOwnProperty(k) && k !== 'success' && k !== 'record_count' && k !== 'fieldLabels' && k !== 'object') {
                    var object = query.object;
                    var result = {
                        data: query[k],
                        object: object,
                        name: k,
                        fieldLabels: query.fieldLabels
                    };
                    var data = result.data;
                    var urlTrimProtocolRE = /^(http|https):\/\//i;
                    var urlTrimDubRE = /www\./i;
                    var fieldLabels = query.fieldLabels;

                    result.object.name = k;

                    for (var i = data.length; i--;) {
                        for (var d in data[i]) {
                            if (data[i].hasOwnProperty(d)) { // d is the key of the data point
                                if (dateRE.test(d)) { // this is a date field
                                    var tempDate = data[i][d];
                                    var realDate = getCRMDate(tempDate);
                                    if (realDate) {
                                        data[i].date = data[i][d] = {
                                            value: realDate,
                                            display: [realDate.getFullYear(), (realDate.getMonth() + 1), realDate.getDate()].join('-'),
                                            dataType: 'date'
                                        };
                                    }
                                    else {
                                        data[i].date = data[i][d] = {
                                            value: tempDate,
                                            display: tempDate,
                                            dataType: 'date'
                                        };
                                    }
                                }
                                else if (urlRE.test(d)) {
                                    var tempUrl = data[i][d];
                                    data[i][d] = {
                                        value: tempUrl,
                                        display: tempUrl && tempUrl.length ? ('<a href="' + tempUrl + '" target="_blank">' + tempUrl.replace(urlTrimProtocolRE, '').replace(urlTrimDubRE, '').slice(0, 12) + '\u2026</a>') : null,
                                        dataType: 'url'
                                    };
                                }
                                else {
                                    if (data[i][d] && data[i][d].value) {
                                        var formattedData = {
                                            value: data[i][d].value,
                                            display: data[i][d].display,
                                            dataType: 'string'
                                        };

                                        data[i][d] = formattedData;
                                    }else {
                                        data[i][d] = {
                                            value: data[i][d],
                                            display: data[i][d],
                                            dataType: 'string'
                                        };
                                    }
                                }
                                data[i][d].label = getLabelFromLabels(d, fieldLabels);
                            }
                        }
                    }
                    return result;
                }
            }

            function getLabelFromLabels(name, labels) {
                var l = labels.length;
                while (l--) {
                    if (labels[l].name === name) {
                        return labels[l].display;
                    }
                }
            }
        }

        function queryObject(query) {
            var config = query.config;
            var picklistsAvailable = config.picklists && config.picklists.length;

            function finishQuery(results) {
                query.deferred.resolve(getResultSet(results));
                ds.queryRunning = false;
                ds.checkQueryQueue();
            }

            function reportQueryError(e) {
                query.deferred.reject(e);
                ds.queryRunning = false;
                ds.checkQueryQueue();
            }

            function getPicklists(resp) {
                var deferred = Q.defer();
                if (picklistsAvailable) {
                    var thisPicklist = config.picklists.pop();
                    var nextPicklist = function() {
                        var deferredInner = Q.defer();
                        ds
                            .getPicklistValueLabels(config.object, thisPicklist)
                            .then(function (picklistResp) {
                                var thisPicklistsResp = picklistResp[config.object];
                                // got the object containing picklist values for each picklist field
                                for (var pk in thisPicklistsResp) { // loop over each of the piclist value lists
                                    if (thisPicklistsResp.hasOwnProperty(pk)) {
                                        var picklistName = pk; // the picklist name is also the name of the field in the record
                                        var picklistValues = thisPicklistsResp[pk]; // this object has all the possible values for the picklist
                                        for (var records = resp[config.object], r = records.length; r--;) {
                                            var record = records[r];
                                            if (record[picklistName] && (picklistValues[record[picklistName].value] || picklistValues[record[picklistName]])) {
                                                if (record[picklistName].value) {
                                                    record[picklistName].display = picklistValues[record[picklistName].value];
                                                }
                                                else if (picklistValues[record[picklistName]]) {
                                                    var formattedRecord = {
                                                        value: record[picklistName],
                                                        display: picklistValues[record[picklistName]]
                                                    };

                                                    record[picklistName] = formattedRecord;
                                                }
                                            }
                                        }
                                    }
                                }
                                deferredInner.resolve();
                            }, function (e) {
                                console.warn('picklist error', e);
                            });
                        return deferredInner.promise;
                    };

                    // TODO: Make this serial or recursive in some way or modify the queue to be lower level.
                    nextPicklist().then(function () {
                        thisPicklist = config.picklists.pop();
                        if (thisPicklist) {
                            nextPicklist().then(function () {
                                thisPicklist = config.picklists.pop();
                                if (thisPicklist) {
                                    nextPicklist();
                                }
                                else {
                                    deferred.resolve();
                                }
                            });
                        }
                        else {
                            deferred.resolve();
                        }
                    });
                }
                else {
                    deferred.resolve();
                }
                return deferred.promise;
            }

            ds.queryRunning = true;
            ds.getObjectLabels([config.object])
                .then(function (objectLabels) {
                    ds.queryRecord(config.object, config.fields, config.where, config.sort, config.limit)
                        .then(function (resp) {
                            ds.getFieldLabels(config)
                                .then(function (labels) {
                                    resp.fieldLabels = labels;
                                    resp.object = objectLabels[config.object][0];
                                    getPicklists(resp)
                                        .then(function() {
                                            finishQuery(resp);
                                        });
                                },
                                reportQueryError);
                        },
                        reportQueryError);
                },
                reportQueryError);
        }

        function constructRequest(command, object, fields, where, sort, limit) {
            var request = [];
            if (command && object) {
                request.push('veeva:' + command + '(' + object);
                if (fields) {
                    request.push((command === 'getPicklistValueLabels' ? 'field' : 'fields') + '(' + fields);
                }
                if (where) {
                    request.push('where(where ' + where);
                }
                if (sort) {
                    request.push('sort(' + JSON.stringify(sort));
                }
                if (limit) {
                    request.push('limit(' + limit);
                }
                request.push('');
            }
            else {
                console.error('constructRequest: invalid arguments', command, object, fields);
            }
            return request.join('),');
        }

        function query(request) {
            var deferred = Q.defer();
            var uniqueCallbackName = 'com_veeva_queryRecordReturn' + (+new Date());
            window[uniqueCallbackName] = function (resp) {
                var result = resp;
                if (typeof result === 'string') {
                    try {
                        result = JSON.parse(result);
                    }
                    catch (e) {
                        console.warn('query result returned as non-parseable string', e, result);
                    }
                }
                if (result.success) {
                    deferred.resolve(wrapResult('query', formatResult(result)));
                }
                else {
                    for (var a = arguments.length; a--;) {
                        console.log('query failure arguments', arguments[a]);
                    }
                    deferred.reject('Query failed: ' + arguments /*[0].message*/ + ' ' + JSON.stringify(request));
                    $('#response').append('<pre>Error handler: ' +  JSON.stringify(arguments, null, "\t") + '</pre>');
                }
            };
            request = request + uniqueCallbackName + '(result)';
            runAPIRequest(request);
            return deferred.promise;
        }

        function formatResult(result) {
            if (veevaUtil.isWin8()) {
                if (typeof result === 'string') {
                    result = eval('(' + result + ')');
                }
            }
            return result;
        }

        function wrapResult(apiName, result) {
            result = formatResult(result);
            if (!result.success) {
                result.message = apiName + ': ' + result.message;
            }
            return result;
        }

        function runAPIRequest(request) {
            if (veevaUtil.isWin8()) {
                window.external.notify(request);
            } else {
                //Remove the veeva: prefix, encode the remaining request, and add veeva: back.
                //This works with a basic replace because we only run ONE request here.
                request = request.replace(/^veeva:/, '');
                request = encodeURIComponent(request);
                request = 'veeva:' + request;

                document.location = request;
            }
        }

        /**
         * This function standardize the response differences(if there is any) across iPad/WM
         * @param resp Response from queryRecord
         * @param queryObject The query config object
         * @returns resp The standardize response
         */
        function standardizeQueryRecordResponse(resp, queryObject) {
            if(veevaUtil.isWin8() || veevaUtil.isOnline()) {
                var responseData = resp[queryObject.object];
                if(responseData) {
                    for(var row in responseData) {
                        for(var field in responseData[row]) {
                            if(responseData[row].hasOwnProperty(field)) {

                                // Standardize date format
                                if(dateRE.test(field)) {
                                    var tempDate = responseData[row][field];
                                    var realDate = getCRMDate(tempDate);
                                    if(realDate) {
                                        var year = realDate.getFullYear();
                                        var month = realDate.getMonth() + 1 + '';
                                        if(month.length === 1) {
                                            month = '0' + month;
                                        }
                                        var date = realDate.getDate() + '';
                                        if(date.length === 1) {
                                            date = '0' + date;
                                        }
                                        responseData[row][field] = [year, month, date].join('-');
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return resp;
        }

        /**
         * Legacy queryRecord function.
         * Although this function still works, it should only be called within the library.
         */
        function queryRecord(object, fields, where, sort, limit) {
            var req = constructRequest('queryObject', object, fields, where, sort, limit);
            return query(req);
        }

        /**
         * Public facing functions
         */

        ds.queryRecord = function (queryObject) {
            // Fallback method for legacy queryRecord
            if(arguments.length > 1) {
                return queryRecord.apply(ds, arguments);
            }

            var deferred = Q.defer();

            if (ds.queryRunning) {
                ds.queriesQueue.push({
                    config: queryObject,
                    deferred: deferred,
                    type: 'queryRecord'
                });
            } else {
                var req = constructRequest('queryObject', queryObject.object, queryObject.fields, queryObject.where, queryObject.sort, queryObject.limit);
                ds.queryRunning = true;
                query(req).then(function(resp) {
                    deferred.resolve(standardizeQueryRecordResponse(resp, queryObject));
                    ds.queryRunning = false;
                    ds.checkQueryQueue();
                }, function(error) {
                    deferred.reject(error);
                    ds.queryRunning = false;
                    ds.checkQueryQueue();
                });
            }

            return deferred.promise;
        };

        ds.runQuery = function (queryConfig) {
            var deferred = Q.defer();
            var newQuery = {
                config: queryConfig,
                deferred: deferred,
                type: typeof queryConfig === 'string' ? 'apiRequest' : 'object'
            };
            if (ds.queryRunning) {
                ds.queriesQueue.push(newQuery);
            }
            else {
                queryObject(newQuery);
            }
            return deferred.promise;
        };

        ds.joinQueries = function (q1, q2, keyForID, fieldsLabelsToExclude, primaryObjectName) {
            var primaryQuery, secondaryQuery, joinTo, joinFrom;
            var joins = {};
            // get the primary query and secondary query
            if (q1.object.name === primaryObjectName) {
                primaryQuery = q1;
                secondaryQuery = q2;
            }
            else {
                primaryQuery = q2;
                secondaryQuery = q1;
            }
            // figure out which has the key on which to join the queries
            for (var k in q1.data[0]) {
                if (k === keyForID) {
                    joinTo = q1;
                    joinFrom = q2;
                    break;
                }
            }
            if (!joinTo) {
                joinTo = q2;
                joinFrom = q1;
            }
            // Set up a dictonary with references to each result on which to join
            for (var d = joinFrom.data.length; d--;) {
                joins[joinFrom.data[d].ID.value] = joinFrom.data[d];
            }
            // rename the fields on the secondary result set to reflect their unique relationship to the original results
            for (d = secondaryQuery.data.length; d--;) {
                for (k in secondaryQuery.data[d]) {
                    if (secondaryQuery.data[d].hasOwnProperty(k) && k !== 'date') {
                        var propertyToMove = secondaryQuery.data[d][k];
                        secondaryQuery.data[d][secondaryQuery.object.name + '.' + k] = propertyToMove;
                        delete(secondaryQuery.data[d][k]);
                    }
                }
            }
            // merge each record with its respective matching record
            // figure out if we need to append the object name to the keyForID in the case where the joinTo === secondaryQuery
            if (joinTo.object.name === secondaryQuery.object.name) {
                keyForID = joinTo.object.name + '.' + keyForID;
            }
            for (d = joinTo.data.length; d--;) {
                // merge joinTo[d] with joins[joinTo[d][keyForID]]
                veevaUtil.mergeObjects(joinTo.data[d], joins[joinTo.data[d][keyForID].value]); // does the key for ID include the object name or not. it will if joinTo === secondaryQuery;
            }

            // begin label renaming and combining
            var deleteExcludedLabels = function (labels) {
                    for (var k in fieldsLabelsToExclude) {
                        for (var n = labels.length; n--;) {
                            if (labels[n].name === k) {
                                labels.splice(n, 1);
                            }
                        }
                    }
                    return labels;
                },
                primaryLabels = deleteExcludedLabels(primaryQuery.fieldLabels),
                secondaryLabels = deleteExcludedLabels(secondaryQuery.fieldLabels);
            // rename labels in q2
            for (var l = secondaryLabels.length, label; l--;) {
                label = secondaryLabels[l];
                label.name = secondaryQuery.object.name + '.' + label.name;
            }
            joinTo.fieldLabels = primaryLabels.concat(secondaryLabels);
            joinTo.object = primaryQuery.object;
            joinTo.name = primaryQuery.name;
            return joinTo;
        };

        ds.getInStatement = function (ids) {
            var online = veevaUtil.isOnline();
            var statmentEnd = online ? ')' : '}';
            var statementBegin = online ? '(' : '{';
            return statementBegin + '\'' + ids.join('\',\'') + '\'' + statmentEnd;
        };

        /*
         Returns the value of a field for a specific record related to the current call
         object -   Limited to the following keywords: Account, TSF, User, Address, Call, Presentation, KeyMessage, and CallObjective.
         field - field api name to return a value for
         callback - call back function which will be used to return the information
         @public
         */
        ds.getDataForCurrentObject = function (object, field) {
            var deferred = Q.defer();
            var uniqueCallbackName = 'com_veeva_clm_getCurrentObjectField' + (+new Date());

            window[uniqueCallbackName] = function (result) {
                var wrappedResult = wrapResult('getDataForCurrentObject', result);
                deferred.resolve(wrappedResult);
            };

            var request = 'veeva:getDataForObjectV2(' + object + '),fieldName(' + field + '),' + uniqueCallbackName + '(result)';
            runAPIRequest(request);
            return deferred.promise;
        };

        ds.getObjectLabels = function (objects) {
            return query(constructRequest('getObjectLabels', JSON.stringify(objects)));
        };

        ds.getFieldLabels = function (queryConfig) {
            var deferred = Q.defer();
            var object = queryConfig.object;
            var fields = queryConfig.fields;
            var request = constructRequest('getFieldLabel', object, JSON.stringify(fields));
            query(request)
                .then(function (labelsResp) {
                    var f = fields.length;
                    var labels = labelsResp[object];
                    var newLabels = [];
                    while (f--) {
                        newLabels.unshift({name: fields[f], display: labels[fields[f]]});
                    }
                    deferred.resolve(newLabels);
                },
                function () {
                    console.error('query field labels failed', arguments);
                });
            return deferred.promise;
        };

        /*
         Returns the translated label for each of the picklist values of the specified field

         object - API Name of the object
         field - API Name of the picklist field
         */
        ds.getPicklistValueLabels = function (object, field) {
            var deferred = Q.defer();
            var request = constructRequest('getPicklistValueLabels', object, field);
            query(request)
                .then(function (labelsResp) {
                    deferred.resolve(labelsResp);
                },
                function () {
                    console.error('query picklist value labels failed', arguments);
                });
            return deferred.promise;
        };

        ds.getVeevaMessagesWithDefault = function (tokens, languageLocaleKey) {
            var deferred = Q.defer();
            var config = veevaUtil.copyObject(queries.translations);
            var whereSubClauses = [];
            var index = tokens.length;
            var cachedResponses = [];
            var cache = translationsCache;
            while (index--) {
                if (!cache[tokens[index].msgName + ':' + tokens[index].msgCategory]) {
                    whereSubClauses.push("(Name='" + tokens[index].msgName + "' AND Category_vod__c='" + tokens[index].msgCategory + "')");
                }
                else {
                    cachedResponses.push(cache[tokens[index].msgName + ':' + tokens[index].msgCategory]);
                }
            }
            config.where += "(" + whereSubClauses.join(" OR ") + ")" + " AND Language_vod__c='" + languageLocaleKey + "'";
            // if all the responses were in the cache, then this will be empty and we just return the cached responses.
            if (whereSubClauses.length) {
                ds.runQuery(config)
                    .then(function (resp) {
                        var data = resp.data;
                        var d = data.length;
                        deferred.resolve(data.concat(cachedResponses));
                        while (d--) {
                            if (!cache[data[d].Name.value + ':' + data[d].Category_vod__c.value]) {
                                cache[data[d].Name.value + ':' + data[d].Category_vod__c.value] = data[d];
                            }
                        }
                    });
            }
            else {
                deferred.resolve(cachedResponses);
            }
            return deferred.promise;
        };

        ds.checkQueryQueue = function() {
            if (ds.queriesQueue.length && !ds.queryRunning) {
                var next = ds.queriesQueue.shift();
                if (next.type === 'apiRequest') {
                    ds.queryRunning = true;
                    query(next.config).then(function (resp) {
                        next.deferred.resolve(resp);
                        ds.queryRunning = false;
                        ds.checkQueryQueue();
                    });
                } else if(next.type === 'queryRecord' || next.type === 'queryRecord_ol') {
                    ds.queryRecord(next.config).then(function(resp) {
                        next.deferred.resolve(resp);
                    });
                } else {
                    queryObject(next);
                }
            }
        };

        // switch in here for the different overrides?
        if (veevaUtil.isOnline()) {
            window.OnlineAPI.call(ds);
        }
    };

    window.ds = new DataService();
})(window.Q);

