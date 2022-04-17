sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/model/Sorter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (
        Controller,
        JSONModel,
        Fragment,
        Sorter,
        Filter,
        FilterOperator
    ) {
        "use strict";

        return Controller.extend("brawl.adultos.season.controller.Player", {

            _FRAGMENT_BRAWLER_SORT: "brawl.adultos.season.fragment.BrawlerSort",
            _FRAGMENT_BRAWLER_FILTER: "brawl.adultos.season.fragment.BrawlerFilter",

            _oPlayerModel: null,
            _sPlayerSanitized: null,

            _Router: null,

            _mDialogs: {},

            onInit: function () {
                this._oRouter = this.getOwnerComponent().getRouter();
                this._oRouter.getRoute("player").attachPatternMatched(this.onPatternMatched, this);

                this._oPlayerModel = new JSONModel();
                this.getView().setModel(this._oPlayerModel, "player");


                this._oViewModel = new JSONModel({
                    busy: false
                });
                this.getView().setModel(this._oViewModel, "view");
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
                this._sPlayerSanitized = sPlayerTag.replace(/\#/g, '');

                this._refresh();

            },

            /**
            * Sort
            */
            onSort: function (oEvent) {
                let oSource = oEvent.getSource();
                let oParameters = oEvent.getParameters();

                this._getViewSettingsDialog(this._FRAGMENT_BRAWLER_SORT)
                    .then(function (oDialog) {
                        oDialog.open();
                    });

            },

            onSortConfirm: function (oEvent) {
                let oSource = oEvent.getSource();
                let oParameters = oEvent.getParameters();

                let oTable = this.byId("table"),
                    oBinding = oTable.getBinding("items"),
                    sPath,
                    bDescending,
                    aSorters = [];

                sPath = oParameters.sortItem.getKey();
                bDescending = oParameters.sortDescending;
                aSorters.push(new Sorter(sPath, bDescending));

                oBinding.sort(aSorters);

            },

            /**
             * Filter
             */
            onFilter: function (oEvent) {
                let oSource = oEvent.getSource();
                let oParameters = oEvent.getParameters();

                this._getViewSettingsDialog(this._FRAGMENT_BRAWLER_FILTER)
                    .then(function (oDialog) {
                        oDialog.open();
                    });
            },

            onFilterConfirm: function (oEvent) {
                let oSource = oEvent.getSource();
                let oParameters = oEvent.getParameters();

                let oTable = this.byId("table"),
                    oBinding = oTable.getBinding("items"),
                    aFilters = [];

                oParameters.filterItems.forEach(function (oItem) {
                    let sPath = oItem.getKey(),
                        sOperator = FilterOperator.EQ,
                        sMin = 0,
                        sMax = 11;

                    let oFilter = new Filter(sPath, sOperator, sMin, sMax);
                    aFilters.push(oFilter);
                });


                oBinding.filter(aFilters);

                // update filter bar
                // this.byId("vsdFilterBar").setVisible(aFilters.length > 0);
                // this.byId("vsdFilterLabel").setText(mParams.filterString);
            },

            /**
             * Group
             */
            onGroup: function (oEvent) {
                let oSource = oEvent.getSource();
                let oParameters = oEvent.getParameters();


            },



            onRefresh: function (oEvent) {
                this._refresh();
            },

            _getViewSettingsDialog: function (sDialogFragmentName) {
                let oDialog = this._mDialogs[sDialogFragmentName];

                if (!oDialog) {
                    oDialog = Fragment.load({
                        id: this.getView().getId(),
                        name: sDialogFragmentName,
                        controller: this
                    }).then(function (oLoadedDialog) {
                        this.getView().addDependent(oLoadedDialog);
                        return oLoadedDialog;

                    }.bind(this));
                    this._mDialogs[sDialogFragmentName] = oDialog;
                }
                return oDialog;
            },

            _refresh: function () {
                this._oViewModel.setProperty("/busy", true);
                let sUrl = `https://gcp-brawl-stars-proxy-rytwssggra-uc.a.run.app/player?tag=${this._sPlayerSanitized}`;

                const fnRequestCompleted = (oEvent) => {
                    this._oViewModel.setProperty("/busy", false);
                }
                this._oPlayerModel.attachEventOnce("requestCompleted", fnRequestCompleted, this);
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

            formatDifferenceState: function (sDifference) {
                let iDifference = Math.abs(+sDifference);

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
