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
    var appManager = new manager.AppManager();
    var calendarManager = new manager.CalendarManager();
    var requestManager = new manager.RequestManager();
    var i18nManager = new manager.I18nManager();

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

    requestManager.run();

    });
    });
    });
    });
}

init();
