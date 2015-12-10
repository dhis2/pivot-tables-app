export var legendSetsInit;

legendSetsInit = function(requestManager, appManager) {
    var path = appManager.getPath(),
        displayProperty = appManager.getDisplayProperty();

    return {
        baseUrl: path + '/api/legendSets.json',
        params: [
            'fields=id,' + displayProperty + ',legends[id,' + displayProperty + ',startValue,endValue,color]',
            'paging=false'
        ],
        success: function(r) {
            appManager.addLegendSets(r.legendSets);
            requestManager.ok(this);
        }
    };
};
