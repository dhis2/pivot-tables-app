import {isString, isNumber, isBoolean, isObject} from 'd2-utilizr';

export var OptionsWindow;

OptionsWindow = function(c) {
    var t = this;

    var appManager = c.appManager,
        uiManager = c.uiManager,
        instanceManager = c.instanceManager,
        i18n = c.i18nManager.get(),
        optionConfig = c.optionConfig;

    var comboboxWidth = 262,
        comboBottomMargin = 1,
        checkboxBottomMargin = 2,
        separatorTopMargin = 6,
        cmpWidth = 360,
        labelWidth = 125;

    var showColTotals = Ext.create('Ext.form.field.Checkbox', {
        boxLabel: i18n.show_col_totals,
        style: 'margin-bottom:' + checkboxBottomMargin + 'px',
        checked: true
    });

    var showRowTotals = Ext.create('Ext.form.field.Checkbox', {
        boxLabel: i18n.show_row_totals,
        style: 'margin-bottom:' + checkboxBottomMargin + 'px',
        checked: true
    });

    var showColSubTotals = Ext.create('Ext.form.field.Checkbox', {
        boxLabel: i18n.show_col_subtotals,
        style: 'margin-top:' + separatorTopMargin + 'px; margin-bottom:' + checkboxBottomMargin + 'px',
        checked: true
    });

    var showRowSubTotals = Ext.create('Ext.form.field.Checkbox', {
        boxLabel: i18n.show_row_subtotals,
        style: 'margin-bottom:' + checkboxBottomMargin + 'px',
        checked: true
    });

    var showDimensionLabels = Ext.create('Ext.form.field.Checkbox', {
        boxLabel: i18n.show_dimension_labels,
        style: 'margin-top:' + separatorTopMargin + 'px; margin-bottom:' + comboBottomMargin + 'px',
        checked: true
    });

    var hideEmptyRows = Ext.create('Ext.form.field.Checkbox', {
        boxLabel: i18n.hide_empty_rows,
        style: 'margin-top:' + separatorTopMargin + 'px;' + 'margin-bottom:' + comboBottomMargin + 'px'
    });

    var hideEmptyColumns = Ext.create('Ext.form.field.Checkbox', {
        boxLabel: i18n.hide_empty_columns,
        style: 'margin-bottom:' + checkboxBottomMargin + 'px'
    });

    var skipRounding = Ext.create('Ext.form.field.Checkbox', {
        boxLabel: i18n.skip_rounding,
        style: 'margin-top:' + separatorTopMargin + 'px; margin-bottom:' + comboBottomMargin + 'px'
    });

    var aggregationType = Ext.create('Ext.form.field.ComboBox', {
        cls: 'ns-combo',
        style: 'margin-top:' + (separatorTopMargin + 1) + 'px; margin-bottom:' + comboBottomMargin + 'px',
        width: cmpWidth,
        labelWidth: labelWidth,
        fieldLabel: i18n.aggregation_type,
        labelStyle: 'color:#333',
        labelSeparator: '',
        queryMode: 'local',
        valueField: 'id',
        displayField: 'name',
        editable: false,
        value: optionConfig.getAggregationType('def').id,
        store: Ext.create('Ext.data.Store', {
            fields: ['id', 'name', 'index'],
            data: optionConfig.getAggregationTypeRecords()
        })
    });

    var numberType = Ext.create('Ext.form.field.ComboBox', {
        cls: 'ns-combo',
        style: 'margin-bottom:' + comboBottomMargin + 'px',
        width: cmpWidth,
        labelWidth: labelWidth,
        fieldLabel: i18n.number_type,
        labelStyle: 'color:#333',
        labelSeparator: '',
        queryMode: 'local',
        valueField: 'id',
        displayField: 'name',
        editable: false,
        value: optionConfig.getNumberType('value').name,
        store: Ext.create('Ext.data.Store', {
            fields: ['id', 'name', 'index'],
            data: optionConfig.getNumberTypeRecords()
        })
    });

    var dataApprovalLevel = Ext.create('Ext.form.field.ComboBox', {
        cls: 'ns-combo',
        style: 'margin-bottom:' + comboBottomMargin + 'px',
        width: cmpWidth,
        labelWidth: labelWidth,
        fieldLabel: i18n.data_approved_at_level,
        labelStyle: 'color:#333',
        labelSeparator: '',
        queryMode: 'local',
        valueField: 'id',
        displayField: 'name',
        editable: false,
        hidden: !(appManager.systemInfo.hideUnapprovedDataInAnalytics && appManager.viewUnapprovedData),
        value: optionConfig.getDataApprovalLevel('def').id,
        store: Ext.create('Ext.data.Store', {
            fields: ['id', 'name'],
            data: appManager.dataApprovalLevels.unshift(optionConfig.getDataApprovalLevel('def'))
        })
    });

    var showHierarchy = Ext.create('Ext.form.field.Checkbox', {
        boxLabel: i18n.show_hierarchy,
        style: 'margin-bottom:' + checkboxBottomMargin + 'px',
    });

    var completedOnly = Ext.create('Ext.form.field.Checkbox', {
        boxLabel: i18n.include_only_completed_events_only,
        style: 'margin-bottom:' + checkboxBottomMargin + 'px',
    });

    var displayDensity = Ext.create('Ext.form.field.ComboBox', {
        cls: 'ns-combo',
        style: 'margin-bottom:' + comboBottomMargin + 'px',
        width: cmpWidth,
        labelWidth: labelWidth,
        fieldLabel: i18n.display_density,
        labelStyle: 'color:#333',
        labelSeparator: '',
        queryMode: 'local',
        valueField: 'id',
        displayField: 'name',
        editable: false,
        value: optionConfig.getDisplayDensity('normal').id,
        store: Ext.create('Ext.data.Store', {
            fields: ['id', 'name', 'index'],
            data: optionConfig.getDisplayDensityRecords()
        })
    });

    var fontSize = Ext.create('Ext.form.field.ComboBox', {
        cls: 'ns-combo',
        style: 'margin-bottom:' + comboBottomMargin + 'px',
        width: cmpWidth,
        labelWidth: labelWidth,
        fieldLabel: i18n.font_size,
        labelStyle: 'color:#333',
        labelSeparator: '',
        queryMode: 'local',
        valueField: 'id',
        displayField: 'name',
        editable: false,
        value: optionConfig.getFontSize('normal').id,
        store: Ext.create('Ext.data.Store', {
            fields: ['id', 'name', 'index'],
            data: optionConfig.getFontSizeRecords()
        })
    });

    var digitGroupSeparator = Ext.create('Ext.form.field.ComboBox', {
        labelStyle: 'color:#333',
        labelSeparator: '',
        cls: 'ns-combo',
        style: 'margin-bottom:' + comboBottomMargin + 'px',
        width: cmpWidth,
        labelWidth: labelWidth,
        fieldLabel: i18n.digit_group_separator,
        queryMode: 'local',
        valueField: 'id',
        displayField: 'name',
        editable: false,
        value: appManager.systemSettings.keyAnalysisDigitGroupSeparator || optionConfig.getDigitGroupSeparator('space').id,
        store: Ext.create('Ext.data.Store', {
            fields: ['id', 'name', 'index'],
            data: optionConfig.getDigitGroupSeparatorRecords()
        })
    });

    var legendSet = Ext.create('Ext.form.field.ComboBox', {
        cls: 'ns-combo',
        style: 'margin-bottom:' + comboBottomMargin + 'px',
        width: cmpWidth,
        labelWidth: labelWidth,
        fieldLabel: i18n.apply_legend,
        labelStyle: 'color:#333',
        labelSeparator: '',
        valueField: 'id',
        displayField: 'name',
        queryMode: 'local',
        editable: false,
        value: 'NONE',
        store: {
			fields: ['id', 'name', 'index'],
			data: appManager.legendSets.concat([{
                id: 'NONE',
                name: i18n.none,
                index: -2
            },{
                id: optionConfig.getLegendDisplayStrategy('by_data_item').id,
                name: optionConfig.getLegendDisplayStrategy('by_data_item').name,
                index: -1
            }]),
			sorters: [
				{property: 'index', direction: 'ASC'},
				{property: 'name', direction: 'ASC'}
			]
		},
        listeners: {
            focus: function(combobox) {
                combobox.expand();
                combobox.collapse();
            },
            select: function(cmp) {
                var byDataItemId = optionConfig.getLegendDisplayStrategy('by_data_item').id;
                var fixedId = optionConfig.getLegendDisplayStrategy('fixed').id;
                var noneId = 'NONE';
                var value = cmp.getValue();
                var config = {};

                if (value === byDataItemId) {
                    config.legendDisplayStrategy = value;
                }
                else if (value !== noneId) {
                    config.legendSet = {id: value};
                }

                onLegendSetSelect(getLegendS2C(config));
            }
        }
    });

    var legendDisplayStyle = Ext.create('Ext.form.field.ComboBox', {
        cls: 'ns-combo',
        style: 'margin-bottom:' + comboBottomMargin + 'px',
        width: cmpWidth,
        labelWidth: labelWidth,
        fieldLabel: i18n.style,
        labelStyle: 'color:#333',
        labelSeparator: '',
        valueField: 'id',
        displayField: 'name',
        queryMode: 'local',
        editable: false,
        disabled: true,
        value: optionConfig.getLegendDisplayStyle('fill').id,
        store: Ext.create('Ext.data.Store', {
            fields: ['id', 'name', 'index'],
            data: optionConfig.getLegendDisplayStyleRecords()
        })
    });

    var title = Ext.create('Ext.form.field.Text', {
        width: cmpWidth,
        labelWidth: labelWidth,
        fieldLabel: i18n.table_title,
        emptyText: i18n.table_title,
        labelStyle: 'color:#333',
        labelSeparator: '',
        maxLength: 250,
        enforceMaxLength: true,
        style: 'margin-bottom:0',
        xable: function() {
            this.setDisabled(hideTitle.getValue());
        }
    });

    var reportingPeriod = Ext.create('Ext.form.field.Checkbox', {
        boxLabel: i18n.reporting_period,
        style: 'margin-bottom:' + checkboxBottomMargin + 'px'
    });

    var organisationUnit = Ext.create('Ext.form.field.Checkbox', {
        boxLabel: i18n.organisation_unit,
        style: 'margin-bottom:' + checkboxBottomMargin + 'px'
    });

    var parentOrganisationUnit = Ext.create('Ext.form.field.Checkbox', {
        boxLabel: i18n.parent_organisation_unit,
        style: 'margin-bottom:' + checkboxBottomMargin + 'px'
    });

    var regression = Ext.create('Ext.form.field.Checkbox', {
        boxLabel: i18n.include_regression,
        style: 'margin-bottom:' + checkboxBottomMargin + 'px'
    });

    var cumulative = Ext.create('Ext.form.field.Checkbox', {
        boxLabel: i18n.include_cumulative,
        style: 'margin-bottom:6px'
    });

    var sortOrder = Ext.create('Ext.form.field.ComboBox', {
        cls: 'ns-combo',
        style: 'margin-bottom:1px',
        width: cmpWidth - 8,
        labelWidth: labelWidth,
        fieldLabel: i18n.sort_order,
        labelStyle: 'color:#333',
        labelSeparator: '',
        queryMode: 'local',
        valueField: 'id',
        displayField: 'name',
        editable: false,
        value: 0,
        store: Ext.create('Ext.data.Store', {
            fields: ['id', 'name'],
            data: [
                {id: 0, name: i18n.none},
                {id: 1, name: i18n.low_to_high},
                {id: 2, name: i18n.high_to_low}
            ]
        })
    });

    var topLimit = Ext.create('Ext.form.field.ComboBox', {
        cls: 'ns-combo',
        style: 'margin-bottom:3px',
        width: cmpWidth - 8,
        labelWidth: labelWidth,
        fieldLabel: i18n.top_limit,
        labelStyle: 'color:#333',
        labelSeparator: '',
        queryMode: 'local',
        valueField: 'id',
        displayField: 'name',
        editable: false,
        value: 0,
        store: Ext.create('Ext.data.Store', {
            fields: ['id', 'name'],
            data: [
                {id: 0, name: i18n.none},
                {id: 5, name: 5},
                {id: 10, name: 10},
                {id: 20, name: 20},
                {id: 50, name: 50},
                {id: 100, name: 100}
            ]
        })
    });

    var data = {
        bodyStyle: 'border:0 none',
        style: 'margin-left:14px',
        items: [
            showColTotals,
            showRowTotals,
            showColSubTotals,
            showRowSubTotals,
            showDimensionLabels,
            hideEmptyRows,
            hideEmptyColumns,
            skipRounding,
            aggregationType,
            numberType,
            dataApprovalLevel
        ]
    };

    var events = {
        bodyStyle: 'border:0 none',
        style: 'margin-left:14px',
        items: [
            completedOnly
        ]
    };

    var organisationUnits = {
        bodyStyle: 'border:0 none',
        style: 'margin-left:14px',
        items: [
            showHierarchy
        ]
    };

    var legend = {
        bodyStyle: 'border:0 none',
        style: 'margin-left:14px',
        items: [
            legendSet,
            legendDisplayStyle
        ]
    };

    var style = {
        bodyStyle: 'border:0 none',
        style: 'margin-left:14px',
        items: [
            displayDensity,
            fontSize,
            digitGroupSeparator
        ]
    };

    var general = {
        bodyStyle: 'border:0 none',
        style: 'margin-left:14px',
        items: [
            title
        ]
    };

    var parameters = Ext.create('Ext.panel.Panel', {
        bodyStyle: 'border:0 none; background:transparent',
        style: 'margin-left:14px',
        items: [
            reportingPeriod,
            organisationUnit,
            parentOrganisationUnit,
            regression,
            cumulative,
            sortOrder,
            topLimit
        ],
        hidden: true
    });

    var window = Ext.create('Ext.window.Window', {
        title: i18n.table_options,
        bodyStyle: 'background-color:#fff; padding:2px',
        closeAction: 'hide',
        autoShow: true,
        modal: true,
        resizable: false,
        hideOnBlur: true,
        reset: function() {
            this.setOptions();
        },
        getOptions: function() {
            return Object.assign({
                showRowTotals: showRowTotals.getValue(),
                showColTotals: showColTotals.getValue(),
                showColSubTotals: showColSubTotals.getValue(),
                showRowSubTotals: showRowSubTotals.getValue(),
                showDimensionLabels: showDimensionLabels.getValue(),
                hideEmptyRows: hideEmptyRows.getValue(),
                hideEmptyColumns: hideEmptyColumns.getValue(),
                skipRounding: skipRounding.getValue(),
                aggregationType: aggregationType.getValue(),
                numberType: numberType.getValue(),
                dataApprovalLevel: {id: dataApprovalLevel.getValue()},
                showHierarchy: showHierarchy.getValue(),
                completedOnly: completedOnly.getValue(),
                displayDensity: displayDensity.getValue(),
                fontSize: fontSize.getValue(),
                digitGroupSeparator: digitGroupSeparator.getValue(),
                title: title.getValue(),
                reportingPeriod: reportingPeriod.getValue(),
                organisationUnit: organisationUnit.getValue(),
                parentOrganisationUnit: parentOrganisationUnit.getValue(),
                regression: regression.getValue(),
                cumulative: cumulative.getValue(),
                sortOrder: sortOrder.getValue(),
                topLimit: topLimit.getValue()
            }, getLegendC2S());
        },
        setOptions: function(layout) {
            layout = layout || {};

            showRowTotals.setValue(isBoolean(layout.showRowTotals) ? layout.showRowTotals : true);
            showColTotals.setValue(isBoolean(layout.showColTotals) ? layout.showColTotals : true);
            showColSubTotals.setValue(isBoolean(layout.showColSubTotals) ? layout.showColSubTotals : true);
            showRowSubTotals.setValue(isBoolean(layout.showRowSubTotals) ? layout.showRowSubTotals : true);
            showDimensionLabels.setValue(isBoolean(layout.showDimensionLabels) ? layout.showDimensionLabels : true);
            hideEmptyRows.setValue(isBoolean(layout.hideEmptyRows) ? layout.hideEmptyRows : false);
            hideEmptyColumns.setValue(isBoolean(layout.hideEmptyColumns) ? layout.hideEmptyColumns : false);
            skipRounding.setValue(isBoolean(layout.skipRounding) ? layout.skipRounding : false);
            aggregationType.setValue(isString(layout.aggregationType) ? layout.aggregationType : optionConfig.getAggregationType('def').id);
            numberType.setValue(isString(layout.numberType) ? layout.numberType : optionConfig.getNumberType('value').id);
            dataApprovalLevel.setValue(isObject(layout.dataApprovalLevel) && isString(layout.dataApprovalLevel.id) ? layout.dataApprovalLevel.id : optionConfig.getDataApprovalLevel('def').id);
            showHierarchy.setValue(isBoolean(layout.showHierarchy) ? layout.showHierarchy : false);
            completedOnly.setValue(isBoolean(layout.completedOnly) ? layout.completedOnly : false);
            displayDensity.setValue(isString(layout.displayDensity) ? layout.displayDensity : optionConfig.getDisplayDensity('normal').id);
            fontSize.setValue(isString(layout.fontSize) ? layout.fontSize : optionConfig.getFontSize('normal').id);
            digitGroupSeparator.setValue(isString(layout.digitGroupSeparator) ? layout.digitGroupSeparator : optionConfig.getDigitGroupSeparator('space').id);
            reportingPeriod.setValue(isBoolean(layout.reportingPeriod) ? layout.reportingPeriod : false);
            organisationUnit.setValue(isBoolean(layout.organisationUnit) ? layout.organisationUnit : false);
            parentOrganisationUnit.setValue(isBoolean(layout.parentOrganisationUnit) ? layout.parentOrganisationUnit : false);
            regression.setValue(isBoolean(layout.regression) ? layout.regression : false);
            cumulative.setValue(isBoolean(layout.cumulative) ? layout.cumulative : false);
            sortOrder.setValue(isNumber(layout.sortOrder) ? layout.sortOrder : 0);
            topLimit.setValue(isNumber(layout.topLimit) ? layout.topLimit : 0);

            // legend
            var legendConfig = getLegendS2C(layout);

            legendSet.setValue(legendConfig.legend);
            onLegendSetSelect(legendConfig);

            // title
            if (isString(layout.title)) {
                title.setValue(layout.title);
            }
            else {
                title.reset();
            }
        },
        items: [
            {
                bodyStyle: 'border:0 none; color:#222; font-size:12px; font-weight:bold',
                style: 'margin-top:4px; margin-bottom:6px; margin-left:5px',
                html: i18n.data
            },
            data,
            {
                bodyStyle: 'border:0 none; padding:7px'
            },
            {
                bodyStyle: 'border:0 none; color:#222; font-size:12px; font-weight:bold',
                style: 'margin-bottom:6px; margin-left:5px',
                html: i18n.events
            },
            events,
            {
                bodyStyle: 'border:0 none; padding:7px'
            },
            {
                bodyStyle: 'border:0 none; color:#222; font-size:12px; font-weight:bold',
                style: 'margin-bottom:6px; margin-left:5px',
                html: i18n.organisation_units
            },
            organisationUnits,
            {
                bodyStyle: 'border:0 none; padding:7px'
            },
            {
                bodyStyle: 'border:0 none; color:#222; font-size:12px; font-weight:bold',
                style: 'margin-bottom:6px; margin-left:5px',
                html: i18n.legend
            },
            legend,
            {
                bodyStyle: 'border:0 none; padding:7px'
            },
            {
                bodyStyle: 'border:0 none; color:#222; font-size:12px; font-weight:bold',
                style: 'margin-bottom:6px; margin-left:5px',
                html: i18n.style
            },
            style,
            {
                bodyStyle: 'border:0 none; padding:7px'
            },
            {
                bodyStyle: 'border:0 none; color:#222; font-size:12px; font-weight:bold',
                style: 'margin-bottom:6px; margin-left:5px',
                html: i18n.general
            },
            general,
            {
                bodyStyle: 'border:0 none; padding:3px'
            },
            {
                bodyStyle: 'border:1px solid #d5d5d5; padding:3px 3px 0 3px; background-color:#f0f0f0',
                items: [
                    {
                        xtype: 'container',
                        layout: 'column',
                        items: [
                            {
                                bodyStyle: 'border:0 none; padding:2px 5px 6px 2px; background-color:transparent; color:#222; font-size:12px',
                                html: '<b>' + i18n.parameters + '</b> <span style="font-size:11px"> (' + i18n.for_standard_reports_only + ')</span>',
                                columnWidth: 1
                            },
                            {
                                xtype: 'button',
                                text: i18n.show,
                                height: 19,
                                handler: function() {
                                    parameters.setVisible(!parameters.isVisible());

                                    this.setText(parameters.isVisible() ? i18n.hide : i18n.show);
                                }
                            }
                        ]
                    },
                    parameters
                ]
            }
        ],
        bbar: [
            '->',
            {
                text: i18n.hide,
                handler: function() {
                    window.hide();
                }
            },
            {
                text: '<b>' + i18n.update + '</b>',
                handler: function() {
                    instanceManager.getReport();

                    window.hide();
                }
            }
        ],
        listeners: {
            show: function(w) {
                var optionsButton = uiManager.get('optionsButton') || {};

                if (optionsButton.rendered) {
                    uiManager.setAnchorPosition(w, optionsButton);

                    if (!w.hasHideOnBlurHandler) {
                        uiManager.addHideOnBlurHandler(w);
                    }
                }

                if (!legendSet.store.isLoaded) {
                    legendSet.store.load();
                }

                // cmp
                w.showColTotals = showColTotals;
                w.showRowTotals = showRowTotals;
                w.showColSubTotals = showColSubTotals
                w.showRowSubTotals = showRowSubTotals;
                w.showDimensionLabels = showDimensionLabels;
                w.hideEmptyRows = hideEmptyRows;
                w.hideEmptyColumns = hideEmptyColumns;
                w.skipRounding = skipRounding;
                w.aggregationType = aggregationType;
                w.numberType = numberType;
                w.dataApprovalLevel = dataApprovalLevel;
                w.showHierarchy = showHierarchy;
                w.completedOnly = completedOnly;
                w.displayDensity = displayDensity;
                w.fontSize = fontSize;
                w.digitGroupSeparator = digitGroupSeparator;
                w.legendSet = legendSet;
                w.legendDisplayStyle = legendDisplayStyle;
                w.reportingPeriod = reportingPeriod;
                w.organisationUnit = organisationUnit;
                w.parentOrganisationUnit = parentOrganisationUnit;
                w.regression = regression;
                w.cumulative = cumulative;
                w.sortOrder = sortOrder;
                w.topLimit = topLimit;
            }
        }
    });

    var getLegendS2C = function(layout) {
        layout = layout || {};
console.log(layout);
        var byDataItemId = optionConfig.getLegendDisplayStrategy('by_data_item').id;
        var fillId = optionConfig.getLegendDisplayStyle('fill').id;
        var noneId = 'NONE';

        return {
            legend: isObject(layout.legendSet) ? layout.legendSet.id : (layout.legendDisplayStrategy === byDataItemId ? byDataItemId : noneId),
            legendDisplayStyle: isString(layout.legendDisplayStyle) ? layout.legendDisplayStyle : null
        };
    };

    var getLegendC2S = function() {
        var legendSetValue = legendSet.getValue();
        var legendDisplayStyleValue = legendDisplayStyle.getValue();

        var noneId = 'NONE';
        var fixedId = optionConfig.getLegendDisplayStrategy('fixed').id;
        var byDataItemId = optionConfig.getLegendDisplayStrategy('by_data_item').id;
        var fillId = optionConfig.getLegendDisplayStyle('fill').id;
        var config = {};

        if (legendSetValue === noneId) {
            config.legendDisplayStrategy = fixedId;
            config.legendDisplayStyle = fillId;
        }
        else if (legendSetValue === byDataItemId) {
            config.legendDisplayStrategy = byDataItemId;
            config.legendDisplayStyle = legendDisplayStyleValue;
        }
        else {
            config.legendSet = {id: legendSetValue};
            config.legendDisplayStrategy = fixedId;
            config.legendDisplayStyle = legendDisplayStyleValue;
        }
console.log(config);
        return config;
    };

    var onLegendSetSelect = function(layout) {
        var none = 'NONE';
console.log(layout);
console.log("");
        legendDisplayStyle.setDisabled(layout.legend === none);

        if (isString(layout.legendDisplayStyle)) {
            legendDisplayStyle.setValue(layout.legendDisplayStyle);
        }
    };

    return window;
};
