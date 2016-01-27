import '../extjs/resources/css/ext-all-gray.css';
import './css/style.css';
import './css/meringue.css';
import {isString, arrayFrom, arrayTo} from 'd2-utilizr';
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
var uiManager = new manager.UiManager();

// config instances
var dimensionConfig = new config.DimensionConfig();
var optionConfig = new config.OptionConfig();
var periodConfig = new config.PeriodConfig();
var uiConfig = new config.UiConfig();

dimensionConfig.setI18nManager(i18nManager);
optionConfig.setI18nManager(i18nManager);
periodConfig.setI18nManager(i18nManager);

appManager.applyTo(arrayTo(api));
dimensionConfig.applyTo(arrayTo(pivot));
optionConfig.applyTo([].concat(arrayTo(api), arrayTo(pivot)));

// references
var ref = {
    appManager: appManager,
    calendarManager: calendarManager,
    requestManager: requestManager,
    responseManager: responseManager,
    i18nManager: i18nManager,
    sessionStorageManager: sessionStorageManager,
    uiManager: uiManager,
    dimensionConfig: dimensionConfig,
    optionConfig: optionConfig,
    periodConfig: periodConfig,
    uiConfig: uiConfig,
    api: api,
    pivot: pivot
};

// instance manager
var instanceManager = new manager.InstanceManager(ref);
instanceManager.setApiResource('reportTables');
ref.instanceManager = instanceManager;

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

function getTable() {
    var response,colAxis,rowAxis,table;

    var layout = new api.Layout({"id":"C0rhAq1oklh","name":"ANC: Coverages Quarterly","hideEmptyRows":false,"parentGraphMap":{"ImspTQPwCqd":""},"rowSubTotals":false,"displayDensity":"NORMAL","completedOnly":false,"colTotals":true,"showDimensionLabels":false,"sortOrder":0,"fontSize":"NORMAL","topLimit":0,"aggregationType":"DEFAULT","displayName":"ANC: Coverages Quarterly","colSubTotals":false,"showHierarchy":false,"rowTotals":true,"cumulative":false,"digitGroupSeparator":"SPACE","regression":false,"skipRounding":false,"reportParams":{"paramGrandParentOrganisationUnit":false,"paramReportingPeriod":false,"paramParentOrganisationUnit":false,"paramOrganisationUnit":true},"attributeDimensions":[],"programIndicatorDimensions":[],"attributeValues":[],"dataDimensionItems":[{"dataDimensionItemType":"INDICATOR","indicator":{"id":"Uvn6LCg7dVU","name":"ANC 1 Coverage","code":"IN_52486","created":"2012-11-13T12:51:32.215+0000","lastUpdated":"2015-04-10T14:01:56.760+0000"}},{"dataDimensionItemType":"INDICATOR","indicator":{"id":"OdiHJayrsKo","name":"ANC 2 Coverage","code":"IN_52491","created":"2012-11-13T12:51:38.949+0000","lastUpdated":"2015-04-10T14:02:17.622+0000"}},{"dataDimensionItemType":"INDICATOR","indicator":{"id":"sB79w2hiLp8","name":"ANC 3 Coverage","created":"2012-11-13T12:51:45.321+0000","lastUpdated":"2015-04-10T14:32:25.625+0000"}}],"columns":[{"dimension":"ou","items":[{"id":"ImspTQPwCqd","name":"Sierra Leone"}]},{"dimension":"dx","items":[{"id":"Uvn6LCg7dVU","name":"ANC 1 Coverage"},{"id":"OdiHJayrsKo","name":"ANC 2 Coverage"},{"id":"sB79w2hiLp8","name":"ANC 3 Coverage"}]}],"dataElementDimensions":[],"categoryDimensions":[],"filters":[],"rows":[{"dimension":"pe","items":[{"id":"LAST_4_QUARTERS","name":"LAST_4_QUARTERS"}]}],"categoryOptionGroups":[]});
console.log("layout", layout);
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
console.log(response);
console.log(colAxis);
console.log(rowAxis);
console.log(table);
        });
    });
}

function createUi() {

    uiManager.disableRightClick();

    var layoutWindow = uiManager.register(LayoutWindow(ref), 'layoutWindow');
    layoutWindow.hide();

    var optionsWindow = uiManager.register(OptionsWindow(ref), 'optionsWindow');
    optionsWindow.hide();

    var favoriteWindow = uiManager.register(ui.FavoriteWindow(ref), 'favoriteWindow');
    favoriteWindow.hide();

    var northRegion = uiManager.register(ui.NorthRegion(ref, {
        appName: 'Pivot Tables',
    }), 'northRegion');

    var viewport = ui.Viewport(ref, {
        northRegion: northRegion
    });

    instanceManager.setFn(function(layout) {

        // table
        var response = layout.getResponse();
        var colAxis = new pivot.TableAxis(layout, response, 'col');
        var rowAxis = new pivot.TableAxis(layout, response, 'row');
        var table = new pivot.Table(layout, response, colAxis, rowAxis);
        uiManager.update(table.html);

        // mask
        uiManager.unmask();
    });
}
