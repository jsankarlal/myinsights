/*
 Veeva MyInsights Library version 173.0.10
 
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

        veevaUtil.deepCopy = function (originalObject) {
            if(originalObject === null || typeof(originalObject) !== 'object') {
                return originalObject;
            }

            var clonedObject;
            if(originalObject instanceof Date) {
                clonedObject = new Date(originalObject);
            } else {
                clonedObject = originalObject.constructor();
            }

            for(var key in originalObject) {
                // Ignore inherited properties
                if(Object.prototype.hasOwnProperty.call(originalObject, key)) {
                    //TODO: worse case O(2^n), any better?
                    clonedObject[key] = veevaUtil.deepCopy(originalObject[key]);
                }
            }

            return clonedObject;
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

        function postMessage(message) {
            window.parent.postMessage(JSON.stringify(message), '*');
        }

        function generateQueryMessage(command, queryConfig) {
            var deferred = Q.defer();
            var deferredId = 'callback_' + (+new Date());
            queryConfig.command = command;
            listenerQueue[deferredId] = deferred;
            queryConfig.deferredId = deferredId;
            postMessage(queryConfig);
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
            postMessage(queryConfig);
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
                postMessage(queryConfig);
            }

            return deferred.promise;
        };

        olAPI.query = function (queryConfig) {
            var deferred = Q.defer();
            var deferredId = 'callback_' + Math.random().toString(36).substring(2); // (+new Date());
            queryConfig.deferredId = deferredId;
            listenerQueue[deferredId] = deferred;
            queryConfig.deferredId = deferredId;
            postMessage(queryConfig);
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
            postMessage(queryConfig);
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
            },function (error) {
                deferred.reject(error);
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

        olAPI.newRecord = function(configObject) {
            var deferred = Q.defer();
            if(typeof configObject === 'object') {
                var messageBody = {};
                messageBody.command = 'newRecord';
                messageBody.configObject = configObject;
                postMessage(messageBody);
            }
            return deferred.promise;
        };

        olAPI.viewRecord = function(configObject) {
            var deferred = Q.defer();
            if(typeof configObject === 'object') {
                var messageBody = {};
                messageBody.command = 'viewRecord';
                messageBody.configObject = configObject;
                postMessage(messageBody);
            }
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
        var ISO_DATE_REGEX = /[0-9]{4}-[0-9]{2}-[0-9]{2}(T|\s)[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{1,3}Z/;
        var VALID_DATE_FORMAT_REGEX = /[0-9]{4}.[0-9]{2}.[0-9]{2}(.[0-9]{2})?(.[0-9]{2})?(.[0-9]{2})?(.[0-9]{1,3})?[zZ]?/;

        function isISODateFormat(inputString) {
            return ISO_DATE_REGEX.test(inputString);
        }

        function isValidDateFormat(inputString) {
            return VALID_DATE_FORMAT_REGEX.test(inputString);
        }

        function normalizeTimeDigits(digitInString) {
            return digitInString ? parseInt(digitInString, 10) : 0;
        }

        function extractDateStringToNumbers(inputString) {
            var parts = inputString.match(/(\d+)/g);

            return {
                year: normalizeTimeDigits(parts[0]),
                month: normalizeTimeDigits(parts[1]) - 1,
                date: normalizeTimeDigits(parts[2]),
                hours: normalizeTimeDigits(parts[3]),
                minutes: normalizeTimeDigits(parts[4]),
                seconds: normalizeTimeDigits(parts[5]),
                ms: normalizeTimeDigits(parts[6])
            };
        }

        function parseDate(input) {
            var extractedDigits;

            if (isISODateFormat(input)) {
                return new Date(input);
            }else {
                extractedDigits = extractDateStringToNumbers(input);

                return new Date(
                    extractedDigits.year, extractedDigits.month, extractedDigits.date,
                    extractedDigits.hours, extractedDigits.minutes, extractedDigits.seconds,
                    extractedDigits.ms
                );
            }
        }

        function getCRMDate(dateString) {
            var newDate;

            if (isISODateFormat(dateString) || isValidDateFormat(dateString)) {
                newDate = parseDate(dateString);
            }

            if (!newDate) {
                console.warn('bad date: ', dateString, newDate);
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

        function sendLinkingRequest(command, configObject) {
            var deferred = Q.defer();
            var req = constructLinkingRequest(command, configObject);

            query(req).then(function(resp) {
                deferred.resolve(resp);
            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function constructLinkingRequest(command, configObject) {
            var request = [];
            if(typeof command === 'string' && command.length && typeof configObject === 'object') {
                request.push('veeva:' + command + '(' + configObject.object + ')');
                request.push('fields(' + JSON.stringify(configObject.fields) + ')');
                request.push('');
            }
            return request.join(',');
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
                        var win8PareseError = veevaUtil.isWin8();
                        console.warn('query result returned as non-parseable string', e, result);
                    }
                }
                if(typeof win8PareseError !== 'undefined' && win8PareseError){
                    result = formatResult(result);
                }
                if ((typeof result === 'object' && result && result.success) || result === null) {
                    deferred.resolve(wrapResult('query', formatResult(result)));
                }
                else {
                    for (var a = arguments.length; a--;) {
                        console.log('query failure arguments', arguments[a]);
                    }
                    deferred.reject('Query failed: ' + arguments /*[0].message*/ + ' ' + JSON.stringify(request));
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

        function delegateQueryRequest(request, deferred) {
            ds.queryRunning = true;
            query(request).then(function(resp) {
                deferred.resolve(resp);
                ds.queryRunning = false;
                ds.checkQueryQueue();
            }, function(error) {
                deferred.reject(error);
                ds.queryRunning = false;
                ds.checkQueryQueue();
            });
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
                delegateQueryRequest(req, deferred);
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

        ds.querySalesData = function(queryObject) {
            var deferred = Q.defer();

            if(ds.queryRunning) {
                ds.queriesQueue.push({
                    config: queryObject,
                    deferred: deferred,
                    type: 'querySalesData'
                });
            } else {
                // we will use queryObject method from the platform to handle sales data for now
                var req = constructRequest('queryObject', queryObject.object, queryObject.fields, queryObject.where, queryObject.sort, queryObject.limit);
                delegateQueryRequest(req, deferred);
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
         object -	Limited to the following keywords: Account, TSF, User, Address, Call, Presentation, KeyMessage, and CallObjective.
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
                }, function (error) {
                    console.error('query field labels failed', arguments);
                    deferred.reject(error);
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
                } else if(next.type === 'querySalesData') {
                    ds.querySalesData(next.config).then(function(resp) {
                        next.deferred.resolve(resp);
                    });
                } else {
                    queryObject(next);
                }
            }
        };

        ds.newRecord = function(configObject) {
            return sendLinkingRequest('newRecord', configObject);
        };

        ds.viewRecord = function(configObject) {
            return sendLinkingRequest('viewRecord', configObject);
        };

        // switch in here for the different overrides?
        if (veevaUtil.isOnline()) {
            window.OnlineAPI.call(ds);
        }
    };

    window.ds = new DataService();
})(window.Q);

