import {isString} from 'd2-utilizr';
import {api, pivot, manager, config} from 'd2-analysis';

import {i18nInit} from './init/i18nInit.js';
import {authViewUnapprovedDataInit} from './init/authViewUnapprovedDataInit.js';
import {rootNodesInit} from './init/rootNodesInit.js';
import {organisationUnitLevelsInit} from './init/organisationUnitLevelsInit.js';
import {legendSetsInit} from './init/legendSetsInit.js';
import {dimensionsInit} from './init/dimensionsInit.js';
import {dataApprovalLevelsInit} from './init/dataApprovalLevelsInit.js';

// initialize
function init() {

    //TMP
    manager.SessionStorageManager = function() {
        var t = this;

        // constants
        t.db = 'dhis2';
        t.supported = ('sessionStorage' in window && window['sessionStorage'] !== null);

        // fn
        t.supportHandler = function() {
            if (!this.supported) {
                alert("Your browser is outdated and does not support local storage. Please upgrade your browser.");
                return;
            }

            return true;
        };
    };

    manager.SessionStorageManager.prototype.has = function(session) {
        if (!this.supportHandler()) {
            return;
        }

        return (JSON.parse(sessionStorage.getItem(this.db)) && JSON.parse(sessionStorage.getItem(this.db))[session]);
    };

    manager.SessionStorageManager.prototype.set = function(layout, session, url) {
        if (!this.supportHandler()) {
            return;
        }

        var dhis2 = JSON.parse(sessionStorage.getItem(this.db)) || {};
        dhis2[session] = layout;
        sessionStorage.setItem(this.db, JSON.stringify(dhis2));

        if (url) {
            window.location.href = url;
        }
    };
    //TMP

    var appManager = new manager.AppManager();
    var calendarManager = new manager.CalendarManager();
    var requestManager = new manager.RequestManager();
    var i18nManager = new manager.I18nManager();
    var sessionStorageManager = new manager.SessionStorageManager();

    var manifestReq = $.getJSON('manifest.webapp');
    var systemInfoUrl = '/api/system/info.json';
    var systemSettingsUrl = '/api/systemSettings.json?key=keyCalendar&key=keyDateFormat&key=keyAnalysisRelativePeriod&key=keyHideUnapprovedDataInAnalytics';
    var userAccountUrl = '/api/me/user-account.json';

    var systemInfoReq;
    var systemSettingsReq;
    var userAccountReq;

    //TMP
    appManager.setAuth = function(env) {
        if (!(env === 'production' && !(this.manifest && isString(this.manifest.activities.dhis.auth)))) {
            $.ajaxSetup({
                headers: {
                    Authorization: 'Basic ' + btoa(this.manifest.activities.dhis.auth)
                }
            });
        }
    };
    //TMP

    manifestReq.done(function(manifest) {
        appManager.manifest = manifest;
        appManager.setAuth(process.env.NODE_ENV);
        systemInfoReq = $.getJSON(manifest.activities.dhis.href + systemInfoUrl);

    systemInfoReq.done(function(systemInfo) {
        appManager.systemInfo = systemInfo;
        appManager.path = systemInfo.contextPath;
        systemSettingsReq = $.getJSON(appManager.path + systemSettingsUrl);

    systemSettingsReq.done(function(systemSettings) {
        appManager.systemSettings = systemSettings;
        userAccountReq = $.getJSON(appManager.path + userAccountUrl);

    userAccountReq.done(function(userAccount) {
        appManager.userAccount = userAccount;
        calendarManager.setBaseUrl(appManager.getPath());
        calendarManager.setDateFormat(appManager.getDateFormat());
        calendarManager.generate(appManager.systemSettings.keyCalendar);

    // i18n
    requestManager.add(new api.Request(i18nInit(requestManager, appManager, i18nManager)));

    // authorization
    requestManager.add(new api.Request(authViewUnapprovedDataInit(requestManager, appManager)));

    // root nodes
    requestManager.add(new api.Request(rootNodesInit(requestManager, appManager)));

    // organisation unit levels
    requestManager.add(new api.Request(organisationUnitLevelsInit(requestManager, appManager)));

    // legend sets
    requestManager.add(new api.Request(legendSetsInit(requestManager, appManager)));

    // dimensions
    requestManager.add(new api.Request(dimensionsInit(requestManager, appManager)));

    // approval levels
    requestManager.add(new api.Request(dataApprovalLevelsInit(requestManager, appManager)));

    requestManager.set(getTable);
    requestManager.run();

    });
    });
    });
    });
}

function getTable() {
    var response,colAxis,rowAxis,table;

    var layout = new api.Layout({"id":"C0rhAq1oklh","name":"ANC: Coverages Quarterly","hideEmptyRows":false,"parentGraphMap":{"ImspTQPwCqd":""},"rowSubTotals":false,"displayDensity":"NORMAL","completedOnly":false,"colTotals":true,"showDimensionLabels":false,"sortOrder":0,"fontSize":"NORMAL","topLimit":0,"aggregationType":"DEFAULT","displayName":"ANC: Coverages Quarterly","colSubTotals":false,"showHierarchy":false,"rowTotals":true,"cumulative":false,"digitGroupSeparator":"SPACE","regression":false,"skipRounding":false,"reportParams":{"paramGrandParentOrganisationUnit":false,"paramReportingPeriod":false,"paramParentOrganisationUnit":false,"paramOrganisationUnit":true},"attributeDimensions":[],"programIndicatorDimensions":[],"attributeValues":[],"dataDimensionItems":[{"dataDimensionItemType":"INDICATOR","indicator":{"id":"Uvn6LCg7dVU","name":"ANC 1 Coverage","code":"IN_52486","created":"2012-11-13T12:51:32.215+0000","lastUpdated":"2015-04-10T14:01:56.760+0000"}},{"dataDimensionItemType":"INDICATOR","indicator":{"id":"OdiHJayrsKo","name":"ANC 2 Coverage","code":"IN_52491","created":"2012-11-13T12:51:38.949+0000","lastUpdated":"2015-04-10T14:02:17.622+0000"}},{"dataDimensionItemType":"INDICATOR","indicator":{"id":"sB79w2hiLp8","name":"ANC 3 Coverage","created":"2012-11-13T12:51:45.321+0000","lastUpdated":"2015-04-10T14:32:25.625+0000"}}],"columns":[{"dimension":"dx","items":[{"id":"Uvn6LCg7dVU","name":"ANC 1 Coverage"},{"id":"OdiHJayrsKo","name":"ANC 2 Coverage"},{"id":"sB79w2hiLp8","name":"ANC 3 Coverage"}]}],"dataElementDimensions":[],"categoryDimensions":[],"filters":[],"rows":[{"dimension":"ou","items":[{"id":"ImspTQPwCqd","name":"Sierra Leone"}]},{"dimension":"pe","items":[{"id":"LAST_4_QUARTERS","name":"LAST_4_QUARTERS"}]}],"categoryOptionGroups":[]});
    var reqMap = layout.data();

    reqMap.metaData.done(function(md) {
        console.log("md", md);

        reqMap.data.done(function(json) {
            json.metaData = md.metaData;
            console.log("json", json);

            response = new api.Response(json);
            colAxis = new pivot.TableAxis(layout, response, 'col');
            rowAxis = new pivot.TableAxis(layout, response, 'row');
            table = new pivot.Table(layout, response, colAxis, rowAxis);
            document.body.innerHTML = table.html;
        });
    });
}

init();
