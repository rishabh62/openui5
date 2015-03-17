sap.ui.define(
	[
		"sap/ui/model/odata/v2/ODataModel",
		"sap/ui/model/json/JSONModel",
		"sap/ui/thirdparty/URI"
	], function (ODataModel, JSONModel, URI) {
		"use strict";

		function extendMetadataUrlParameters (aUrlParametersToAdd, oMetadataUrlParams, sServiceUrl) {
			var oExtensionObject = {},
				oServiceUri = new URI(sServiceUrl);

			aUrlParametersToAdd.forEach(function (sUrlParam) {
				var sLanguage,
					oUrlParameters,
					sParameterValue;

				// for sap-language we check if the launchpad can provide it.
				if (sUrlParam === "sap-language") {
					sLanguage = tryGetLaunchpadUserLanguage();

					if (sLanguage) {
						oMetadataUrlParams["sap-language"] = sLanguage;
						return;
					}
					// Continue searching in the url
				}

				oUrlParameters = jQuery.sap.getUriParameters();
				sParameterValue = oUrlParameters.get(sUrlParam);
				if (sParameterValue) {
					oMetadataUrlParams[sUrlParam] = sParameterValue;
					oServiceUri.addSearch(sUrlParam, sParameterValue);
				}
			});

			jQuery.extend(oMetadataUrlParams, oExtensionObject);
			return oServiceUri.toString();
		}

		function tryGetLaunchpadUserLanguage () {
			var sLanguage = null,
				oContainer = sap.ushell && sap.ushell.Container,
				oUser = oContainer && oContainer.getUser && oContainer.getUser();

			if (oUser) {
				sLanguage = oUser.getLanguage();
			}
			return sLanguage;
		}

		return {
			/**
			 *
			 * @param oOptions {object}a map which contains the following parameter properties
			 * @param oOptions.url {string} see {@link sap.ui.model.odata.v2.ODataModel#constructor.sServiceUrl}.
			 * @param [oOptions.urlParametersForEveryRequest] {object} If the parameter is present in the URL or in case of language the UShell can provide it,
			 * it is added to the odata models metadataUrlParams {@link sap.ui.model.odata.v2.ODataModel#constructor.mParameters.metadataUrlParams}, and to the service url.
			 * If you provided a value in the config.metadataUrlParams this value will be overwritten by the value in the url.
			 *
			 * Example: the app is started with the url query, and the user has an us language set in the launchpad:
			 *
			 * ?sap-server=serverValue&sap-host=hostValue
			 *
			 * The createODataModel looks like this.
			 *
			 * models.createODataModel({
			 *     urlParametersToPassOn: [
			 *         "sap-server",
			 *         "sap-host",
			 *         "sap-language",
			 *         "anotherValue"
			 *     ],
			 *     url : "my/Url"
			 * });
			 *
			 * then the config will have the following metadataUrlParams:
			 *
			 * metadataUrlParams: {
			 *     // retrieved from the url
			 *     "sap-server" : "serverValue"
			 *     "sap-host" : "hostValue",
			 *     // language is added from the launchpad
			 *     "sap-language" : "us"
			 *     // anotherValue is not present in the url and will not be added
			 * }
			 *
			 * @param [oOptions.config] {object} see {@link sap.ui.model.odata.v2.ODataModel#constructor.mParameters} it is the exact same object, the metadataUrlParams are enrichted by the oOptions.urlParametersToPassOn
			 * @returns {sap.ui.model.odata.v2.ODataModel}
			 */
			createODataModel: function (oOptions) {
				var aUrlParametersForEveryRequest,
					oConfig,
					sUrl;

				oOptions = oOptions || {};

				if (!oOptions.url) {
					jQuery.sap.log.error("Please provide a url when you want to create an ODataModel", "sap.ui.demo.worklist.model.models.createODataModel");
					return null;
				}

				// create a copied instance since we modify the config
				oConfig = jQuery.extend(true, {}, oOptions.config);

				aUrlParametersForEveryRequest = oOptions.urlParametersForEveryRequest || [];
				oConfig.metadataUrlParams = oConfig.metadataUrlParams || {};

				sUrl = extendMetadataUrlParameters(aUrlParametersForEveryRequest, oConfig.metadataUrlParams, oOptions.url);

				return this._createODataModel(sUrl, oConfig);
			},

			_createODataModel: function (sUrl, oConfig) {
				return new ODataModel(sUrl, oConfig);
			},

			createDeviceModel: function () {
				var oModel = new JSONModel({
						isTouch: sap.ui.Device.support.touch,
						isNoTouch: !sap.ui.Device.support.touch,
						isPhone: sap.ui.Device.system.phone,
						isNoPhone: !sap.ui.Device.system.phone
					});
				oModel.setDefaultBindingMode("OneWay");
				return oModel;
			}
		};

	}, /* bExport= */ true);
