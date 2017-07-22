import {isString, isNumber, isBoolean, isObject} from 'd2-utilizr';

export const ExperimentalWindow = function(c) {
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


    var showRowTotals = Ext.create('Ext.form.field.Checkbox', {
        boxLabel: i18n.show_row_totals,
        style: 'margin-bottom:' + checkboxBottomMargin + 'px',
        checked: true
    });

    var data = {
        bodyStyle: 'border:0 none',
        style: 'margin-left:14px',
        items: [
            showRowTotals,
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
                showRowTotals: showRowTotals.getValue()
            }, getLegendC2S());
        },
        setOptions: function(layout) {
            layout = layout || {};
            showRowTotals.setValue(isBoolean(layout.showRowTotals) ? layout.showRowTotals : true);
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

                // cmp
                w.showRowTotals = showRowTotals;
            }
        }
    });

    return window;
};
