import '../extjs/resources/css/ext-all-gray.css';
import './css/style.css';
import './css/meringue.css';
import 'd2-analysis/css/ui/GridHeaders.css';

import objectApplyIf from 'd2-utilizr/lib/objectApplyIf';
import arrayTo from 'd2-utilizr/lib/arrayTo';

import { api, table, manager, config, init, util } from 'd2-analysis';

import { Layout } from './api/Layout';

const CELL_WIDTH = 131
const CELL_HEIGHT = 36

// extend
api.Layout = Layout;

// references
let refs = {
    api,
    init,
    table
};

// inits
let inits = [
    init.legendSetsInit,
    init.dimensionsInit
];

// dimension config
let dimensionConfig = new config.DimensionConfig();
refs.dimensionConfig = dimensionConfig;

// option config
let optionConfig = new config.OptionConfig();
refs.optionConfig = optionConfig;

// period config
let periodConfig = new config.PeriodConfig();
refs.periodConfig = periodConfig;

// app manager
let appManager = new manager.AppManager(refs);
appManager.apiVersion = 29;
refs.appManager = appManager;

// calendar manager
let calendarManager = new manager.CalendarManager(refs);
refs.calendarManager = calendarManager;

// request manager
let requestManager = new manager.RequestManager(refs);
refs.requestManager = requestManager;

// i18n manager
let i18nManager = new manager.I18nManager(refs);
refs.i18nManager = i18nManager;

// session storage manager
let sessionStorageManager = new manager.SessionStorageManager(refs);
refs.sessionStorageManager = sessionStorageManager;

// dependencies
dimensionConfig.setI18nManager(i18nManager);
dimensionConfig.init();
optionConfig.setI18nManager(i18nManager);
optionConfig.init();
periodConfig.setI18nManager(i18nManager);
periodConfig.init();

appManager.applyTo([].concat(arrayTo(api), arrayTo(table)));
dimensionConfig.applyTo(arrayTo(table));
optionConfig.applyTo([].concat(arrayTo(api), arrayTo(table)));

// plugin
function render(plugin, layout) {
    if (!util.dom.validateTargetDiv(layout.el)) {
        return;
    }

    let instanceRefs = Object.assign({}, refs);

    // ui manager
    let uiManager = new manager.UiManager(instanceRefs);
    instanceRefs.uiManager = uiManager;
    uiManager.applyTo([].concat(arrayTo(api), arrayTo(table)));

    // instance manager
    let instanceManager = new manager.InstanceManager(instanceRefs);
    instanceRefs.instanceManager = instanceManager;
    instanceManager.apiResource = 'reportTable';
    instanceManager.apiEndpoint = 'reportTables';
    instanceManager.apiModule = 'dhis-web-pivot';
    instanceManager.plugin = true;
    instanceManager.dashboard = reportTablePlugin.dashboard;
    instanceManager.applyTo(arrayTo(api));

    // table manager
    let tableManager = new manager.TableManager(instanceRefs);
    instanceRefs.tableManager = tableManager;

    // initialize
    uiManager.setInstanceManager(instanceManager);

    instanceManager.setFn(function(_layout) {
        if (!util.dom.validateTargetDiv(_layout.el)) {
            return;
        }

        let sortingId = _layout.sorting ? _layout.sorting.id : null;
        let html = '';
        let pivotTable;

        // get table
        let buildPivotTable = function() {
            let response = _layout.getResponse();

            let colAxis = new table.PivotTableAxis(instanceRefs, _layout, response, 'col');
            let rowAxis = new table.PivotTableAxis(instanceRefs, _layout, response, 'row');
            let tableOptions = { cellHeight: CELL_HEIGHT, cellWidth: CELL_WIDTH }

            let _pivotTable = new table.PivotTable(instanceRefs, _layout, response, colAxis, rowAxis, tableOptions);

            let el = document.getElementById(_layout.el)

            _pivotTable.setViewportSize(
                el.offsetWidth,
                el.offsetHeight
            );
        
            return _pivotTable;
        };

        // pre-sort if id
        if (sortingId && sortingId !== 'total') {
            _layout.sort();
        }

        // table
        pivotTable = buildPivotTable();
        pivotTable.initialize();
        pivotTable.build();

        // sort if total
        if (sortingId && sortingId === 'total') {
            _layout.sort(pivotTable);
            pivotTable = buildPivotTable();
            pivotTable.initialize();
            pivotTable.build();
        }

        html += reportTablePlugin.showTitles ?
            uiManager.getTitleHtml(_layout.title || _layout.name) : '';

        html += pivotTable.render();

        uiManager.update(html, _layout.el);

        // events
        tableManager.setColumnHeaderMouseHandlers(_layout, pivotTable);
        
        // mask
        uiManager.unmask();


        if (pivotTable.doDynamicRendering()) {

            document.getElementById(_layout.el).style.paddingTop = "0px";
            document.getElementById(_layout.el).style.paddingBottom = "0px";
            document.getElementById(_layout.el).style.paddingLeft = "0px";
            document.getElementById(_layout.el).style.paddingRight = "0px";

            document.getElementById(_layout.el).addEventListener('scroll', event => {
    
                // calculate number of rows and columns to render

                let rowLength = Math.floor(event.target.scrollTop / CELL_HEIGHT);
                let columnLength = Math.floor(Math.max(0, event.target.scrollLeft - 11) / CELL_WIDTH);

                let offset = rowLength === 0 ? 0 : 1;

                // only update if row/column has gone off screen
                if (pivotTable.rowStart + offset !== rowLength || pivotTable.columnStart !== columnLength) {
                    uiManager.update(pivotTable.update(columnLength, rowLength), _layout.el);
                    tableManager.setColumnHeaderMouseHandlers(layout, pivotTable);
                    // tableManager.setValueMouseHandlers(layout, pivotTable);
                }
            });

            document.getElementById(_layout.el).addEventListener('scroll', event => {

                let regionHeight = document.getElementById(_layout.el).offsetHeight;
                let regionWidth = document.getElementById(_layout.el).offsetWidth ;

                let rowLength = Math.floor(regionHeight / CELL_HEIGHT);
                let columnLength = Math.floor(regionWidth / CELL_WIDTH);

                let offset = rowLength === 0 ? 0 : 1;
                
                if (pivotTable.rowEnd - pivotTable.rowStart !== rowLength + offset || pivotTable.columnEnd - pivotTable.columnStart !== columnLength + offset) {
                    pivotTable.setViewportWidth(regionWidth);
                    pivotTable.setViewportHeight(regionHeight);

                    uiManager.update(pivotTable.update(pivotTable.columnStart, pivotTable.rowStart), _layout.el);
                    
                    tableManager.setColumnHeaderMouseHandlers(layout, pivotTable);
                    // tableManager.setValueMouseHandlers(layout, pivotTable);
                }
            });
            
        } else {
            // document.getElementById(_layout.el).removeEventListener('scroll');
            // document.getElementById(_layout.el).removeEventListener('scroll');
        }

    });

    if (plugin.loadingIndicator) {
        uiManager.renderLoadingIndicator(layout.el);
    }

    if (layout.id) {
        instanceManager.getById(layout.id, function(_layout) {
            _layout = new api.Layout(instanceRefs, objectApplyIf(layout, _layout));

            if (!util.dom.validateTargetDiv(_layout.el)) {
                return;
            }

            instanceManager.getReport(_layout);
        });
    }
    else {
        instanceManager.getReport(new api.Layout(instanceRefs, layout), false, false, false, null, { noError: true, errorMessage: 'No data to display' });
    }
};

global.reportTablePlugin = new util.Plugin({ refs, inits, renderFn: render, type: 'REPORT_TABLE' });
