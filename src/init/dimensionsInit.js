export var dimensionsInit;

dimensionsInit = function(requestManager, appManager) {
    var path = appManager.getPath(),
        displayProperty = appManager.getDisplayProperty();

    return {
        baseUrl: path + '/api/dimensions.json',
        params: [
            'fields=id,' + displayProperty,
            'paging=false'
        ],
        success: function(r) {
            appManager.addDimensions(r.dimensions);
            requestManager.ok(this);
        }
    };
};
