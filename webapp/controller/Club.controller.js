sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("brawl.adultos.season.controller.Club", {

            _oClubModel: null,

            _Router: null,

            onInit: function () {
                this._oRouter = this.getOwnerComponent().getRouter();
                this._oRouter.getRoute("club").attachPatternMatched(this.onPatternMatched, this);

                this._oClubModel = new JSONModel();
                this.getView().setModel(this._oClubModel, "club");
            },


            onPatternMatched: function (oEvent) {
                let oParameters = oEvent.getParameters();
                let mArguments = oParameters.arguments;
                let sClubTag = mArguments.tag;
                let sClubSanitized = sClubTag.replace(/\#/g, '');

                let sUrl = `https://gcp-brawl-stars-proxy-rytwssggra-uc.a.run.app/club?tag=${sClubSanitized}`;
                this._oClubModel.loadData(sUrl);
            },


            onBack: function () {
                this._oRouter.navTo("clubs", true);
            },



            onItemPress: function (oEvent) {
                let oParameters = oEvent.getParameters();
                let oItem = oParameters.listItem;
                let oContext = oItem.getBindingContext("club");
                let sPlayerTag = oContext.getProperty("tag");
                this._oRouter.navTo("player", {
                    tag: sPlayerTag
                })


            }
        });
    });
