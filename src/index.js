import './css/style.css';
import {isString, arrayTo} from 'd2-utilizr';
import {api, pivot, manager, config, ui, init} from 'd2-analysis';

// initialize
function initialize() {

    // instances
    var appManager = new manager.AppManager();
    var calendarManager = new manager.CalendarManager();
    var requestManager = new manager.RequestManager();
    var i18nManager = new manager.I18nManager();
    var sessionStorageManager = new manager.SessionStorageManager();
    var uiManager = new manager.UiManager();

    var dimensionConfig = new config.DimensionConfig();
    var optionConfig = new config.OptionConfig();
    var periodConfig = new config.PeriodConfig();

    // i18n
    dimensionConfig.setI18nManager(i18nManager);
    optionConfig.setI18nManager(i18nManager);
    periodConfig.setI18nManager(i18nManager);

    // class fns
    appManager.applyTo([].concat(arrayTo(api), arrayTo(init)));
    requestManager.applyTo(arrayTo(init));
    i18nManager.applyTo([init.i18nInit]);
    uiManager.applyTo(arrayTo(ui));

    dimensionConfig.applyTo(arrayTo(pivot));
    optionConfig.applyTo(arrayTo(pivot));

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


    // i18n
    requestManager.add(new api.Request(init.i18nInit()));

    // authorization
    requestManager.add(new api.Request(init.authViewUnapprovedDataInit()));

    // root nodes
    requestManager.add(new api.Request(init.rootNodesInit()));

    // organisation unit levels
    requestManager.add(new api.Request(init.organisationUnitLevelsInit()));

    // legend sets
    requestManager.add(new api.Request(init.legendSetsInit()));

    // dimensions
    requestManager.add(new api.Request(init.dimensionsInit()));

    // approval levels
    requestManager.add(new api.Request(init.dataApprovalLevelsInit()));

    requestManager.set(getTable);
    requestManager.run();

    });
    });
    });
    });
}

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

initialize();
