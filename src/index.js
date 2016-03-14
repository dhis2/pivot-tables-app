import '../extjs/resources/css/ext-all-gray.css';
import './css/style.css';
import './css/meringue.css';

import 'd2-analysis/css/ui/GridHeaders.css';

import isString from 'd2-utilizr/lib/isString';
import arrayFrom from 'd2-utilizr/lib/arrayFrom';
import arrayTo from 'd2-utilizr/lib/arrayTo';

import {api, pivot, manager, config, ui, init} from 'd2-analysis';

import {LayoutWindow} from './ui/LayoutWindow.js';
import {OptionsWindow} from './ui/OptionsWindow.js';

// manager instances
var appManager = new manager.AppManager();
var calendarManager = new manager.CalendarManager();
var requestManager = new manager.RequestManager();
var responseManager = new manager.ResponseManager();
var i18nManager = new manager.I18nManager();
var sessionStorageManager = new manager.SessionStorageManager();
var uiManager;
var instanceManager;
var tableManager;

// config instances
var dimensionConfig = new config.DimensionConfig();
var optionConfig = new config.OptionConfig();
var periodConfig = new config.PeriodConfig();
var uiConfig = new config.UiConfig();

// references
var ref = {
    appManager: appManager,
    calendarManager: calendarManager,
    requestManager: requestManager,
    responseManager: responseManager,
    i18nManager: i18nManager,
    sessionStorageManager: sessionStorageManager,
    dimensionConfig: dimensionConfig,
    optionConfig: optionConfig,
    periodConfig: periodConfig,
    uiConfig: uiConfig,
    api: api,
    pivot: pivot
};

// managers
uiManager = new manager.UiManager(ref);
ref.uiManager = uiManager;

instanceManager = new manager.InstanceManager(ref);
instanceManager.setApiResource('reportTables');
ref.instanceManager = instanceManager;

tableManager = new manager.TableManager(ref);
ref.tableManager = tableManager;

uiManager.setInstanceManager(instanceManager);

// set i18n
dimensionConfig.setI18nManager(i18nManager);
optionConfig.setI18nManager(i18nManager);
periodConfig.setI18nManager(i18nManager);
uiManager.setI18nManager(i18nManager);

// apply to
appManager.applyTo(arrayTo(api));
instanceManager.applyTo(arrayTo(api));
uiManager.applyTo(arrayTo(api));
dimensionConfig.applyTo(arrayTo(pivot));
optionConfig.applyTo([].concat(arrayTo(api), arrayTo(pivot)));

// requests
var manifestReq = $.getJSON('manifest.webapp');
var systemInfoUrl = '/api/system/info.json';
var systemSettingsUrl = '/api/systemSettings.json?key=keyCalendar&key=keyDateFormat&key=keyAnalysisRelativePeriod&key=keyHideUnapprovedDataInAnalytics';
var userAccountUrl = '/api/me/user-account.json';

var systemInfoReq;
var systemSettingsReq;
var userAccountReq;

manifestReq.done(function(manifest) {
    appManager.manifest = manifest;
    appManager.env = process.env.NODE_ENV;
    appManager.setAuth();
    systemInfoReq = $.getJSON(appManager.getPath() + systemInfoUrl);

systemInfoReq.done(function(systemInfo) {
    appManager.systemInfo = systemInfo;
    appManager.path = systemInfo.contextPath;
    systemSettingsReq = $.getJSON(appManager.getPath() + systemSettingsUrl);

systemSettingsReq.done(function(systemSettings) {
    appManager.systemSettings = systemSettings;
    userAccountReq = $.getJSON(appManager.getPath() + userAccountUrl);

userAccountReq.done(function(userAccount) {
    appManager.userAccount = userAccount;
    calendarManager.setBaseUrl(appManager.getPath());
    calendarManager.setDateFormat(appManager.getDateFormat());
    calendarManager.generate(appManager.systemSettings.keyCalendar);

requestManager.add(new api.Request(init.i18nInit(ref)));
requestManager.add(new api.Request(init.authViewUnapprovedDataInit(ref)));
requestManager.add(new api.Request(init.rootNodesInit(ref)));
requestManager.add(new api.Request(init.organisationUnitLevelsInit(ref)));
requestManager.add(new api.Request(init.legendSetsInit(ref)));
requestManager.add(new api.Request(init.dimensionsInit(ref)));
requestManager.add(new api.Request(init.dataApprovalLevelsInit(ref)));

requestManager.set(createUi);
requestManager.run();

});});});});

function createUi() {

    // app manager
    appManager.appName = 'Pivot Tables';

    // ui manager
    uiManager.disableRightClick();

    uiManager.enableConfirmUnload();

    uiManager.setIntroHtml(function() {
        return '<div class="ns-viewport-text" style="padding:20px">' +
            '<h3>' + i18nManager.get('example1') + '</h3>' +
            '<div>- ' + i18nManager.get('example2') + '</div>' +
            '<div>- ' + i18nManager.get('example3') + '</div>' +
            '<div>- ' + i18nManager.get('example4') + '</div>' +
            '<h3 style="padding-top:20px">' + i18nManager.get('example5') + '</h3>' +
            '<div>- ' + i18nManager.get('example6') + '</div>' +
            '<div>- ' + i18nManager.get('example7') + '</div>' +
            '<div>- ' + i18nManager.get('example8') + '</div>' +
            '</div>';
    }());

    // instance manager
    instanceManager.setFn(function(layout) {
        var sortingId = layout.sorting ? layout.sorting.id : null,
            table;

        // get table
        var getTable = function() {
            var response = layout.getResponse();
            var colAxis = new pivot.TableAxis(layout, response, 'col');
            var rowAxis = new pivot.TableAxis(layout, response, 'row');
            return new pivot.Table(layout, response, colAxis, rowAxis);
        };

        // pre-sort if id
        if (sortingId && sortingId !== 'total') {
            layout.sort();
        }

        // table
        table = getTable();

        // sort if total
        if (sortingId && sortingId === 'total') {
            layout.sort(table);
            table = getTable();
        }

        uiManager.update(table.html);

        // events
        tableManager.setColumnHeaderMouseHandlers(layout, table);

        // mask
        uiManager.unmask();
    });

    // windows
    var layoutWindow = uiManager.reg(LayoutWindow(ref), 'layoutWindow');
    layoutWindow.hide();

    var optionsWindow = uiManager.reg(OptionsWindow(ref), 'optionsWindow');
    optionsWindow.hide();

    var favoriteWindow = uiManager.reg(ui.FavoriteWindow(ref), 'favoriteWindow');
    favoriteWindow.hide();

    // viewport
    var northRegion = uiManager.reg(ui.NorthRegion(ref), 'northRegion');

    ui.Viewport(ref, {
        northRegion: northRegion
    });
}

global.appManager = appManager;
global.instanceManager = instanceManager;
global.uiManager = uiManager;
