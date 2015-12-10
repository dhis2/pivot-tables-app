export var authViewUnapprovedDataInit;

authViewUnapprovedDataInit = function(requestManager, appManager) {
    return {
        baseUrl: appManager.path + '/api/me/authorization/F_VIEW_UNAPPROVED_DATA',
        success: function(r) {
            appManager.viewUnapprovedData = r;
            requestManager.ok(this);
        }
    };
};
