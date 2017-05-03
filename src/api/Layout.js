import isString from 'd2-utilizr/lib/isString';
import isNumber from 'd2-utilizr/lib/isNumber';
import isBoolean from 'd2-utilizr/lib/isBoolean';
import isObject from 'd2-utilizr/lib/isObject';
import isEmpty from 'd2-utilizr/lib/isEmpty';

import { Record, Layout as d2aLayout } from 'd2-analysis';

export var Layout = function(refs, c, applyConfig, forceApplyConfig) {
    var t = this;
    t.klass = Layout;

    c = isObject(c) ? c : {};

    // inherit
    Object.assign(t, new d2aLayout(refs, c, applyConfig));

    // options
    t.showColTotals = isBoolean(c.colTotals) ? c.colTotals : (isBoolean(c.showColTotals) ? c.showColTotals : true);
    t.showRowTotals = isBoolean(c.rowTotals) ? c.rowTotals : (isBoolean(c.showRowTotals) ? c.showRowTotals : true);
    t.showColSubTotals = isBoolean(c.colSubTotals) ? c.colSubTotals : (isBoolean(c.showColSubTotals) ? c.showColSubTotals : true);
    t.showRowSubTotals = isBoolean(c.rowSubTotals) ? c.rowSubTotals : (isBoolean(c.showRowSubTotals) ? c.showRowSubTotals : true);
    t.showDimensionLabels = isBoolean(c.showDimensionLabels) ? c.showDimensionLabels : (isBoolean(c.showDimensionLabels) ? c.showDimensionLabels : true);
    t.hideEmptyRows = isBoolean(c.hideEmptyRows) ? c.hideEmptyRows : false;
    t.skipRounding = isBoolean(c.skipRounding) ? c.skipRounding : false;
    t.aggregationType = isString(c.aggregationType) ? c.aggregationType : refs.optionConfig.getAggregationType('def').id;
    t.dataApprovalLevel = isObject(c.dataApprovalLevel) && isString(c.dataApprovalLevel.id) ? c.dataApprovalLevel : null;
    t.showHierarchy = isBoolean(c.showHierarchy) ? c.showHierarchy : false;
    t.completedOnly = isBoolean(c.completedOnly) ? c.completedOnly : false;
    t.displayDensity = isString(c.displayDensity) && !isEmpty(c.displayDensity) ? c.displayDensity : refs.optionConfig.getDisplayDensity('normal').id;
    t.fontSize = isString(c.fontSize) && !isEmpty(c.fontSize) ? c.fontSize : refs.optionConfig.getFontSize('normal').id;
    t.digitGroupSeparator = isString(c.digitGroupSeparator) && !isEmpty(c.digitGroupSeparator) ? c.digitGroupSeparator : refs.optionConfig.getDigitGroupSeparator('space').id;
    t.legendSet = (new Record(c.legendSet)).val(true);
    t.legendDisplayStyle = isString(c.legendDisplayStyle) ? c.legendDisplayStyle : refs.optionConfig.getLegendDisplayStyle('fill').id;
    t.legendDisplayStrategy = isString(c.legendDisplayStrategy) ? c.legendDisplayStrategy : refs.optionConfig.getLegendDisplayStrategy('fixed').id;

    // graph map
    t.parentGraphMap = isObject(c.parentGraphMap) ? c.parentGraphMap : null;

    // report table
    t.reportingPeriod = isObject(c.reportParams) && isBoolean(c.reportParams.paramReportingPeriod) ? c.reportParams.paramReportingPeriod : (isBoolean(c.reportingPeriod) ? c.reportingPeriod : false);
    t.organisationUnit =  isObject(c.reportParams) && isBoolean(c.reportParams.paramOrganisationUnit) ? c.reportParams.paramOrganisationUnit : (isBoolean(c.organisationUnit) ? c.organisationUnit : false);
    t.parentOrganisationUnit = isObject(c.reportParams) && isBoolean(c.reportParams.paramParentOrganisationUnit) ? c.reportParams.paramParentOrganisationUnit : (isBoolean(c.parentOrganisationUnit) ? c.parentOrganisationUnit : false);

    t.regression = isBoolean(c.regression) ? c.regression : false;
    t.cumulative = isBoolean(c.cumulative) ? c.cumulative : false;
    t.sortOrder = isNumber(c.sortOrder) ? c.sortOrder : 0;
    t.topLimit = isNumber(c.topLimit) ? c.topLimit : 0;

    // force apply
    Object.assign(t, forceApplyConfig);

    t.getRefs = function() {
        return refs;
    };
};

Layout.prototype = d2aLayout.prototype;

Layout.prototype.clone = function() {
    var t = this,
        refs = this.getRefs();

    var layout = new refs.api.Layout(refs, JSON.parse(JSON.stringify(t)));

    layout.setResponse(t.getResponse());
    layout.setAccess(t.getAccess());
    layout.setDataDimensionItems(t.getDataDimensionItems());

    return layout;
};
