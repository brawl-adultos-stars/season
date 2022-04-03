sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("brawl.adultos.season.controller.Clubs", {

            _oClubModel: null,

            _Router: null,

            onInit: function () {
                this._oRouter = this.getOwnerComponent().getRouter();

                this._oClubsModel = new JSONModel();

                let sUrl = "https://gcp-brawl-stars-proxy-rytwssggra-uc.a.run.app/clubs"
                this._oClubsModel.loadData(sUrl);

                this.getView().setModel(this._oClubsModel, "clubs");
            },


            onItemPress: function (oEvent) {
                let oParameters = oEvent.getParameters();
                let oItem = oParameters.listItem;
                let oContext = oItem.getBindingContext("clubs");
                let sClubTag = oContext.getProperty("tag");
                this._oRouter.navTo("club", {
                    tag: sClubTag
                })


            }
        });
    });
