onCreate: this._updatePhoneTypes(sClientId);
onEdit: this._processPhoneTypes({
				results: []
			});
      
============================================================

_updatePhoneTypes: function(sClientId) {
			this.getModel().read("/Client(" + sClientId + ")/ClientPhone", {
				success: this._processPhoneTypes.bind(this),
				error: this.onNavBack.bind(this)
			});
		},

		_processPhoneTypes: function(oResponse) {
			var fnStorePhoneTypes = function(oResQual) {
				if (typeof oResQual.results !== "undefined") {
					this._aPhoneTypes = oResQual.results;
				}
				this._setPhoneTypes(oResponse);
			};
			if (this._aPhoneTypes.length === 0) {
				this.getModel().read("/PhoneTypes", {
					success: fnStorePhoneTypes.bind(this),
					error: this.onNavBack.bind(this)
				});
			} else {
				this._setPhoneTypes(oResponse);
			}
		},

		_setPhoneTypes: function(oResponse) {
			var aExistingPhoneTypes = [];
			var aPhoneTypes = [{
				code: "",
				description: "--Select--"
			}];

			if (typeof oResponse.results !== "undefined") {
				// Generate list of current client phone types
				aExistingPhoneTypes = oResponse.results.map(function(oValue) {
					return oValue.phone_type_code;
				});
				// Generate list of output phonetypes
				this._aPhoneTypes.forEach(function(oValue) {
					if (aExistingPhoneTypes.indexOf(oValue.code) === -1) {
						aPhoneTypes.push({
							code: oValue.code,
							description: oValue.description
						});
					}
				});
			}
			this.getModel("view").setProperty("/phoneTypes", aPhoneTypes);
		},
