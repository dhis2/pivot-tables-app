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

// references
var ref = {
    api: api,
    pivot: pivot
};

    // dimension config
var dimensionConfig = new config.DimensionConfig();
ref.dimensionConfig = dimensionConfig;

    // option config
var optionConfig = new config.OptionConfig();
ref.optionConfig = optionConfig;

    // period config
var periodConfig = new config.PeriodConfig();
ref.periodConfig = periodConfig;

    // ui config
var uiConfig = new config.UiConfig();
ref.uiConfig = uiConfig;

    // app manager
var appManager = new manager.AppManager();
ref.appManager = appManager;

    // calendar manager
var calendarManager = new manager.CalendarManager(ref);
ref.calendarManager = calendarManager;

    // request manager
var requestManager = new manager.RequestManager(ref);
ref.requestManager = requestManager;

    // i18n manager
var i18nManager = new manager.I18nManager(ref);
ref.i18nManager = i18nManager;

    // sessionstorage manager
var sessionStorageManager = new manager.SessionStorageManager(ref);
ref.sessionStorageManager = sessionStorageManager;

    // ui manager
var uiManager = new manager.UiManager(ref);
ref.uiManager = uiManager;

    // instance manager
var instanceManager = new manager.InstanceManager(ref);
ref.instanceManager = instanceManager;

    // table manager
var tableManager = new manager.TableManager(ref);
ref.tableManager = tableManager;

// dependencies

    // instance manager
uiManager.setInstanceManager(instanceManager);

    // i18n manager
dimensionConfig.setI18nManager(i18nManager);
optionConfig.setI18nManager(i18nManager);
periodConfig.setI18nManager(i18nManager);
uiManager.setI18nManager(i18nManager);

    // static
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
    calendarManager.init(appManager.systemSettings.keyCalendar);

requestManager.add(new api.Request(init.i18nInit(ref)));
requestManager.add(new api.Request(init.authViewUnapprovedDataInit(ref)));
requestManager.add(new api.Request(init.rootNodesInit(ref)));
requestManager.add(new api.Request(init.organisationUnitLevelsInit(ref)));
requestManager.add(new api.Request(init.legendSetsInit(ref)));
requestManager.add(new api.Request(init.dimensionsInit(ref)));
requestManager.add(new api.Request(init.dataApprovalLevelsInit(ref)));

requestManager.set(initialize);
requestManager.run();

});});});});

function initialize() {

    // app manager
    appManager.appName = 'Pivot Table';
    appManager.sessionName = 'table';

    // instance manager
    instanceManager.apiResource = 'reportTables';

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
        tableManager.setValueMouseHandlers(layout, table);

        // mask
        uiManager.unmask();
    });

    // windows
    uiManager.reg(LayoutWindow(ref), 'layoutWindow').hide();

    uiManager.reg(OptionsWindow(ref), 'optionsWindow').hide();

    uiManager.reg(ui.FavoriteWindow(ref), 'favoriteWindow').hide();

    // viewport
    var northRegion = uiManager.reg(ui.NorthRegion(ref), 'northRegion');

    ui.Viewport(ref, {
        northRegion: northRegion
    });
}

global.ref = ref;
