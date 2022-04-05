sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
],

    function (JSONModel, Device) {
        "use strict";

        return {
            createDeviceModel: function () {
                var oModel = new JSONModel(Device);
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
            },

            createSeasonModel: function () {

                var oData = {
                    now: new Date(),
                    end: new Date(2022, 4, 1, 5, 0, 0),
                };

                function timeDiffCalc(dateFuture, dateNow) {
                    let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;

                    // calculate days
                    const days = Math.floor(diffInMilliSeconds / 86400);
                    diffInMilliSeconds -= days * 86400;

                    // calculate hours
                    const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
                    diffInMilliSeconds -= hours * 3600;

                    // calculate minutes
                    const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
                    diffInMilliSeconds -= minutes * 60;

                    let difference = '';
                    if (days > 0) {
                        difference += (days === 1) ? `${days} day, ` : `${days} days, `;
                    }

                    difference += (hours === 0 || hours === 1) ? `${hours} hour, ` : `${hours} hours, `;

                    difference += (minutes === 0 || hours === 1) ? `${minutes} minutes` : `${minutes} minutes`;

                    return difference;
                }

                oData.delta = timeDiffCalc(oData.end, oData.now);

                var oModel = new JSONModel(oData);
                return oModel;
            }

        };
    });