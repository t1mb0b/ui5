sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"app/app/model/models",
	"app/app/controller/ErrorHandler",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/format/DateFormat",
	"sap/ushell/services/UserInfo"
], function(UIComponent, Device, models, ErrorHandler, JSONModel, DateFormat, UserInfo) {
	"use strict";

	return UIComponent.extend("app.app.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * In this function, the FLP and device models are set and the router is initialized.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
			// initialize the error handler with the component
			this._oErrorHandler = new ErrorHandler(this);
			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			// set the FLP model
			this.setModel(models.createFLPModel(), "FLP");
			// create the views based on the url/hash
			this.getRouter().initialize();
			// Set the oModel Size Limit
			var oModel = this.getModel();
			oModel.setSizeLimit(999999);
			// Disable HEAD Requests, as it appears they are not supported
			oModel.disableHeadRequestForToken = true;
			// Create Global JSON Model
			var oGlobalModel = new JSONModel({
				appUser: "",
				appUserId: "",
				appUrl: "",
				currentView: "",
				aCurrentViewPath: [],
				todayDate: DateFormat.getDateTimeInstance({
							pattern: "dd/MM/yyyy HH:mm"
				}).format(new Date()),
				addressTypes: [],
				provinces: [],
				countries: [],
				phoneTypes: [],
				noteTypes: [],
				clientStatuses: [],
				divisionList: [],
				regionList: [],
				primaryFunctionTypes: [],
				yesNo: [
					{
					"code": "",
					"description": "(All)",
					"display_order": 0
					},
					{
					"code": "Y",
					"description": "Yes",
					"display_order": 1
					},
					{
					"code": "N",
					"description": "No",
					"display_order": 2
					}
				]
			});
			// Create the Global Model
			this.setModel(oGlobalModel, "global");
			// Set the static lists in the Global Model
			this._setTypes("/NoteTypes", "/noteTypes");
			this._setTypes("/ProvinceList", "/provinces");
			this._setTypes("/CountryList", "/countries");
			this._setTypes("/PhoneTypes","/phoneTypes");
			this._setTypes("/AddressTypes","/addressTypes");
			this._setTypes("/ClientStatus","/clientStatuses");
			this._setTypes("/PrimaryFunctionTypes","/primaryFunctionTypes");
			// Get the current user info
			this.getUserInfo();
		},

		/**
		 * The component is destroyed by UI5 automatically.
		 * In this method, the ErrorHandler is destroyed.
		 * @public
		 * @override
		 */
		destroy: function() {
			this._oErrorHandler.destroy();
			// call the base component's destroy function
			UIComponent.prototype.destroy.apply(this, arguments);
		},

		/**
		 * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
		 * design mode class should be set, which influences the size appearance of some controls.
		 * @public
		 * @return {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
		 */
		getContentDensityClass: function() {
			if (this._sContentDensityClass === undefined) {
				// check whether FLP has already set the content density class; do nothing in this case
				if (jQuery(document.body).hasClass("sapUiSizeCozy") || jQuery(document.body).hasClass("sapUiSizeCompact")) {
					this._sContentDensityClass = "";
				} else if (!Device.support.touch) { // apply "compact" mode if touch is not supported
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					// "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}
			return this._sContentDensityClass;
		},
		
		getUserInfo: function() {
			var oDataModel = this.getModel();
			var oUserInfo = sap.ushell.Container.getUser();
			var sFullName = oUserInfo.getFullName();
			var sUserId = oUserInfo.getId();
			var sUrl = oDataModel.oMetadata.sUrl;
			var oDateFormat = DateFormat.getDateTimeInstance({
				pattern: "dd/MM/yyyy HH:mm"
			});
			var sDate = oDateFormat.format(new Date());
			console.log("++++++++++++ " + sFullName + " on " + sDate + " ++++++++++++");
			this.getModel("global").setProperty("/appUser", sFullName);
			this.getModel("global").setProperty("/appUserId", sUserId);
			this.getModel("global").setProperty("/appUrl", sUrl);
		},

		_setTypes: function(sPath, sType) {
			var that = this;
			var aTypes;
			if (this.getModel("global").getProperty(sType).length === 0) {
				this.getModel().read(sPath, {
					success: function(oData, oResponse) {
						if (sType === "/noteTypes" || sType === "/countries" || sType === "/primaryFunctionTypes") {
							aTypes = [{ id:"",description:"-- Select --",display_order: 0}];
						} else {
							aTypes = [{ code:"",description:"-- Select --",display_order: 0}];
						}
						if (typeof oResponse.data.results !== "undefined") {
							aTypes = aTypes.concat(oResponse.data.results);
						}
						that.getModel("global").setProperty(sType, aTypes);
					},
					error: function(oError) {
						console.log(oError);
					}
				});
			}
		}

	});

});
