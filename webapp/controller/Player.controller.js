sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("brawl.adultos.season.controller.Player", {

            _oPlayerModel: null,

            _Router: null,

            onInit: function () {
                this._oRouter = this.getOwnerComponent().getRouter();
                this._oRouter.getRoute("player").attachPatternMatched(this.onPatternMatched, this);

                this._oPlayerModel = new JSONModel();
                this.getView().setModel(this._oPlayerModel, "player");
            },

            onBack: function () {
                let sClubTag = this._oPlayerModel.getProperty("/club/tag");

                this._oRouter.navTo("club", {
                    tag: sClubTag
                },
                    true)
            },

            onPatternMatched: function (oEvent) {
                let oParameters = oEvent.getParameters();
                let mArguments = oParameters.arguments;
                let sPlayerTag = mArguments.tag;
                let sPlayerSanitized = sPlayerTag.replace(/\#/g, '');

                let sUrl = `https://gcp-brawl-stars-proxy-rytwssggra-uc.a.run.app/player?tag=${sPlayerSanitized}`;
                this._oPlayerModel.loadData(sUrl);


            },

            formatBrawlerImage: function (sBrawlerName) {
                if (!sBrawlerName) {
                    return ""
                }

                var camelSentence = function camelSentence(str) {
                    return (" " + str).toLowerCase().replace(/[^a-zA-Z0-9\.]+(.)/g, function (match, chr) {
                        return match.toUpperCase();
                    }).substring(1);
                }

                let sProperCase = camelSentence(sBrawlerName);

                sProperCase = sProperCase.replace(/ /g, '-');
                sProperCase = sProperCase.replace(/\.-/g, '.');

                return `https://cdn.brawlify.com/brawler/${sProperCase}.png`;
            },

            formatSeasonEnd: function (sTrophies) {
                let iTrophies = +sTrophies;
                if (iTrophies <= 500) {
                    return iTrophies;
                }

                let iMod = iTrophies % 25;
                return iTrophies - iMod - 1;
            },

            formatDifference: function (sTrophies) {
                let iTrophies = +sTrophies;
                if (iTrophies <= 500) {
                    return 0;
                }

                let iDifference = ((iTrophies % 25) + 1) * -1;
                return iDifference;
            },

            formatDifferenceState: function (sTrophies) {
                let iTrophies = +sTrophies;
                if (iTrophies <= 500) {
                    return "Success";
                }

                let iDifference = ((iTrophies % 25) + 1);

                if (iDifference <= 8) {
                    return "Success"
                }
                if (iDifference <= 16) {
                    return "Warning"
                }
                return "Error"

            }


        });
    });
