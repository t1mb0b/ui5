		_setComboBox: function(sClientId, sItemList) {
			var that = this;
			var oModel = this.getModel();
			var oList = sItemList === "Region" ? "regionsList" : "divisionsList";
			var sPath = "/Client" + sItemList + "ListInput(" + sClientId + ")/Results";
			oModel.read(sPath, {
				success: function(oResponse) {
					var aSelected = [];
					oResponse.results.forEach(function(oValue) {
						if (sItemList === "Region") {
							aSelected.push({
								"xref": oValue.client_region_xref_id,
								"id": oValue.region_id.toString()
							});
						} else {
							aSelected.push({
								"xref": oValue.client_division_xref_id,
								"code": oValue.division_code
							});
						}
					});
					var aKeys = [];
					var oMultiComboBox = that.byId(oList);
					aSelected.forEach(function(key) {
						if (sItemList === "Region") {
							aKeys.push(key.id);
						} else {
							aKeys.push(key.code);
						}
					});
					oMultiComboBox.setSelectedKeys(aKeys);
					that.setViewProperty("view", "aSelected" + sItemList + "s", aSelected);
					oMultiComboBox.getBinding("items").refresh();
				},
				error: function(oError) {
					MessageToast.show("Error Reading Data");
					console.log(oError);
				}
			});
		},
		
		_updateSelected: function(sClientId, sItemList) {
			var that = this;
			var oModel = this.getModel();
			var oViewModel = this.getModel("view");
			var sPath = "/Client" + sItemList + "ListInput(" + sClientId + ")/Results";
			oModel.read(sPath, {
				success: function(oResponse) {
					var aSelected = [];
					oResponse.results.forEach(function(oValue) {
						if (sItemList === "Region") {
							aSelected.push({
								"xref": oValue.client_region_xref_id,
								"id": oValue.region_id.toString()
							});
						} else {
							aSelected.push({
								"xref": oValue.client_division_xref_id,
								"code": oValue.division_code
							});
						}
					});
					that.setViewProperty("view", "aSelected" + sItemList + "s", aSelected);
				},
				error: function(oError) {
					MessageToast.show("Error Reading Data");
					console.log(oError);
				}
			});
			// We need to disable busy we set in the
			// add/deleteType function
			oViewModel.setProperty("/busy", false);
			
		},

		_submitRegions: function() {
			// Get/Set Array Values
			var aCurrentRegions = this.getViewProperty("view", "aSelectedRegions");
			var aNewRegions = this.byId("regionsList").getSelectedKeys();
			// Get keys from current regions
			var aCurrentRegionKeys = aCurrentRegions.map(function(regionKey) {
				return regionKey.id;
			});
			// Check contents of Arrays to see if there are any changes
			var aDelRegions = aCurrentRegions.filter(function(each) {
				return aNewRegions.indexOf(each.id) === -1;
			});
			var aAddRegions = aNewRegions.filter(function(each) {
				return aCurrentRegionKeys.indexOf(each) === -1;
			});
			// Make sure we have something
			if (aAddRegions && aAddRegions.length > 0) {
				// If we do, POST the new entry
				//console.log("Adding " + aAddRegions);
				this._addType(aAddRegions, "Region");
			}
			// Make sure we have something
			if (aDelRegions && aDelRegions.length > 0) {
				// if we have something, REMOVE the entry
				//console.log("Removing " + aDelRegions);
				this._deleteType(aDelRegions, "Region");
			}
		},

		_submitDivisions: function() {
			// Get/Set Array Values
			var aCurrentDivisions = this.getViewProperty("view", "aSelectedDivisions");
			var aNewDivisions = this.byId("divisionsList").getSelectedKeys();
			// Get keys from current divisions so we can use them 
			// to compare with the new ones
			var aCurrentDivisionKeys = aCurrentDivisions.map(function(divisionKey) {
				return divisionKey.code;
			});
			// Check contents of Arrays to see if there are any changes
			var aDelDivisions = aCurrentDivisions.filter(function(each) {
				return aNewDivisions.indexOf(each.code) === -1;
			});
			var aAddDivisions = aNewDivisions.filter(function(each) {
				return aCurrentDivisionKeys.indexOf(each) === -1;
			});
			// Make sure we have something
			if (aAddDivisions && aAddDivisions.length > 0) {
				// If we do, POST the new entry
				//console.log("Adding " + aAddDivisions);
				this._addType(aAddDivisions, "Division");
			}
			// Make sure we have something
			if (aDelDivisions && aDelDivisions.length > 0) {
				// if we have something, REMOVE the entry
				//console.log("Removing " + aDelDivisions);
				this._deleteType(aDelDivisions, "Division");
			}
		},

		_addType: function(aAddType, sType) {
			// Declare the Model
			var oModel = this.getView().getModel();
			// Declare the view model
			var oViewModel = this.getModel("view");
			// Get the view mode property
			var sView = this.getViewProperty("view", "edit");
			// Get the view mode property
			var sUser = this.getViewProperty("global", "appUserId");
			// Set Text for success message
			var sText = sView === false ? "Added" : "Updated";
			//Set field type
			var oField = sType === "Region" ? "region_id" : "division_code";
			// Get the Client ID
			var sClientId = this.getViewProperty("view", "ClientId");
			// Get comboBox name
			var sMultiComboBox = sType === "Region" ? "regionsList" : "divisionsList";
			var oMultiComboBox = this.byId(sMultiComboBox);
			// Declare the Object
			var mNewEntry = {};
			// Setup the parameters
			var oParams = {
				success: function() {
					MessageToast.show("Client " + sType + "s " + sText + " Successfully", {
						closeOnBrowserNavigation: false,
						my: "center center",
						at: "center center"
					});
				},
				error: function(oError) {
					MessageToast.show("Error submitting data, please try again", {
						closeOnBrowserNavigation: false,
						my: "center center",
						at: "center center"
					});
					oViewModel.setProperty("/busy", false);
					console.log(oError);
				}
			};
			oViewModel.setProperty("/busy", true);
			// Submit the Object
			aAddType.forEach(function(oType) {
				if (sType === "Region") {
					oModel.createEntry("Client" + sType, {
						properties: {
							id: 0,
							client_ba_id: sClientId,
							region_id: oType,
							revision_date: new Date(),
							revision_user: sUser
						}
					});
				}
				if (sType === "Division") {
					oModel.createEntry("Client" + sType, {
						properties: {
							id: 0,
							client_ba_id: sClientId,
							division_code: oType,
							revision_date: new Date(),
							revision_user: sUser
						}
					});
				}
			});
			oModel.submitChanges(oParams);
			// We need to set a delay before running the function which 
			// updates the stored values in the local model
			jQuery.sap.delayedCall(2500, this, function() {
				this._updateSelected(sClientId, sType);
			});
		},

		_deleteType: function(aDeleteType, sType) {
			// Declare the Model
			var oModel = this.getView().getModel();
			// Declare the view model
			var oViewModel = this.getModel("view");
			// Get the view mode property
			var sView = this.getViewProperty("view", "edit");
			// Set Text for success message
			var sText = sView === false ? "Added" : "Updated";
			// Get the Client ID
			var sClientId = this.getViewProperty("view", "ClientId");
			// Setup the oDataModel parameters
			var oParams = {
				success: function() {
					MessageToast.show("Client " + sType + "s " + sText + " Successfully", {
						closeOnBrowserNavigation: false,
						my: "center center",
						at: "center center"
					});
				},
				error: function(oError) {
					MessageToast.show("Error submitting data, please try again", {
						closeOnBrowserNavigation: false,
						my: "center center",
						at: "center center"
					});
					oViewModel.setProperty("/busy", false);
					console.log(oError);
				}
			};
			oViewModel.setProperty("/busy", true);
			aDeleteType.forEach(function(entity) {
				var sXrefId = entity.xref;
				if (sType === "Region") {
					oModel.remove("/Client" + sType + "(" + sXrefId + ")", oParams);
				}
				if (sType === "Division") {
					oModel.remove("/Client" + sType + "(" + sXrefId + ")", oParams);
				}
			});
			jQuery.sap.delayedCall(2500, this, function() {
				this._updateSelected(sClientId, sType);
			});
		},
