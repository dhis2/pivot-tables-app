export var rootNodesInit;

rootNodesInit = function(requestManager, appManager) {
    var path = appManager.getPath(),
        displayProperty = appManager.getDisplayProperty();

    return {
        baseUrl: path + '/api/organisationUnits.json',
        params: [
            'userDataViewFallback=true',
            'fields=id,' + displayProperty + ',children[id,' + displayProperty + ']',
            'paging=false'
        ],
        success: function(r) {
            appManager.addRootNodes(r.organisationUnits);
            requestManager.ok(this);
        }
    };
};
