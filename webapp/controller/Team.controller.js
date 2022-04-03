sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("brawl.adultos.season.controller.Team", {

            _oTeamModel: null,

            _Router: null,

            onInit: function () {
                this._oRouter = this.getOwnerComponent().getRouter();

                this._oTeamModel = new JSONModel();

                let sUrl = "https://gcp-brawl-stars-proxy-rytwssggra-uc.a.run.app/club"
                this._oTeamModel.loadData(sUrl);

                this.getView().setModel(this._oTeamModel, "team");
            },


            onItemPress: function (oEvent) {
                let oParameters = oEvent.getParameters();
                let oItem = oParameters.listItem;
                let oContext = oItem.getBindingContext("team");
                let sPlayerTag = oContext.getProperty("tag");
                this._oRouter.navTo("player", {
                    tag: sPlayerTag
                })


            }
        });
    });
