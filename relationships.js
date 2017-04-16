		_onClientMatched: function(oEvent) {
			var sRelPath, sListPath, sColumnText;
			var sClientId = oEvent.getParameter("arguments").ClientId;
			var sEntity = oEvent.getParameter("arguments").Entity;
			this.getModel().metadataLoaded().then(function() {
				var sClientPath = this.getModel().createKey("Client", {
					client_ba_id: sClientId
				});
				this._bindView("/" + sClientPath);
			}.bind(this));
			this.setViewProperty("view", "ClientId", sClientId);
			this.setViewProperty("view", "Entity", sEntity);
			this.setViewProperty("view", "formMode", "Add");
			if (sEntity === "Employee") {
				// Set the Path
				sRelPath = "/ClientEmployeeListInput(ipi_ba_id=" + sClientId + ",ipv_current_client_only_flag='Y')/Results";
				sListPath = "/EmployeeListInput(ipv_active_flag='Y')/Results";
				sColumnText = this.getResourceBundle().getText("relationshipsTableColumnEmployeeName");
				// Build the Employee list
				if (this.getModel("view").getProperty("/employeeList").length === 0) {
					this.getModel().read(sListPath, {
						success: function(oResponse) {
							this._setList(oResponse,sEntity);
						}.bind(this),
						error: function(oError) {
							MessageToast.show("Error Reading list of Employees; please try again");
							console.log(oError);
						}
					});
				}
			} else {
				// Set the Path
				sRelPath = "/ClientContactListInput(ipi_ba_id=" + sClientId + ",ipv_current_client_only_flag='Y')/Results";
				sListPath = "/ContactListInput(ipv_active_flag='Y')/Results";
				sColumnText = this.getResourceBundle().getText("relationshipsTableColumnContactName");
			}
			// Build the table cells
			this._printRelationships(sEntity, sRelPath);
			//this._bindSelect(sEntity, sListPath);
			this._bindComboBox(sEntity, sListPath);
			this.byId("relationshipNameColumnText").setText(sColumnText);
		},

		_printRelationships: function(sEntity, sRelPath) {
			var that = this;
			var aSorter = [],
				oSorter;
			var oTable = this.getView().byId("relationshipsTable");
			var oField = sEntity === "Employee" ? "employee_name" : "contact_name";
			oSorter = new sap.ui.model.Sorter(oField, false);
			aSorter.push(oSorter);
			oTable.bindAggregation("items", {
				path: sRelPath,
				template: new sap.m.ColumnListItem({
					cells: [
						new sap.m.CheckBox({
							"selected": {
								path: 'primary_flag',
								formatter: this.formatter.checkBox
							},
							enabled: false
						}),
						new sap.m.Text({
							"text": "{" + oField + "}"
						}),
						new sap.m.Text({
							"text": "{ba_relationship_description}"
						}),
						new sap.m.Text({
							"text": {
								path: "business_phone_number",
								formatter: this.formatter.phone
							}
						}),
						new sap.m.Text({
							"text": {
								path: "cell_phone_number",
								formatter: this.formatter.phone
							}
						}),
						new sap.m.Text({
							"text": {
								path: "business_fax_number",
								formatter: this.formatter.phone
							}
						}),
						new sap.m.Button({
							"icon": "sap-icon://edit",
							"type": "Transparent",
							"press": function(oEvent) {
								that._editRelationship(oEvent);
							}
						}),
						new sap.m.Button({
							"icon": "sap-icon://delete",
							"type": "Transparent",
							"press": function(oEvent) {
								that._deleteRelationship(oEvent);
							}
						})

					]
				}),
				sorter: aSorter
			});
		},

		_setList: function(oResponse, sEntity) {
			// Declare Vars
			var aList, oViewParam;
			// Check sEntity Value
			if (sEntity === "Employee") {
				aList = [{
					employee_ba_id: "",
					employee_name: "-- Select --"
				}];
				oViewParam = "employeeList";
			} else {
				aList = [{
					contact_ba_id: "",
					contact_name: "-- Select --"
				}];
				oViewParam = "contactList";
			}
			// If a response, set the list
			if (typeof oResponse.results !== "undefined") {
				//aList = aList.concat(oResponse.results);
				aList = oResponse.results;
			}
			this.getModel("view").setProperty("/" + oViewParam, aList);
		},

		_bindSelect: function(sEntity, sListPath) {
			// Declare Vars
			var oItemSelect, oSorter, aSorter = [];
			var selectList = this.byId("relationshipName");
			if (sEntity === "Employee") {
				var sPath = "view>/employeeList";
				oSorter = new sap.ui.model.Sorter("employee_name", false);
				aSorter.push(oSorter);
				oItemSelect = new sap.ui.core.Item({
					key: "{employee_ba_id}",
					text: "{employee_name}"
				});
			} else {
				var sPath = "view>/contactList";
				oSorter = new sap.ui.model.Sorter("contact_name", false);
				aSorter.push(oSorter);
				oItemSelect = new sap.ui.core.Item({
					key: "{contact_ba_id}",
					text: "{contact_name}"
				});
			}
			// Bind items to List
			selectList.bindAggregation("items", {
				path: sPath,
				template: oItemSelect,
				sorter: aSorter
			});
		},
		
		_bindComboBox: function(sEntity, sListPath) {
			// Declare Vars
			var oItemSelect, oSorter, aSorter = [], sPath;
			var oComboBox = this.byId("relationshipName");
			/*var oDefaultItem = new sap.ui.core.Item({
				key: "",
				text: "-- Select --"
			});*/
			if (sEntity === "Employee") {
				sPath = "view>/employeeList";
				oSorter = new sap.ui.model.Sorter("employee_name", false);
				aSorter.push(oSorter);
				oItemSelect = new sap.ui.core.Item({
					key: "{view>employee_ba_id}",
					text: "{view>employee_name}"
				});
			} else {
				sPath = "view>/contactList";
				oSorter = new sap.ui.model.Sorter("contact_name", false);
				aSorter.push(oSorter);
				oItemSelect = new sap.ui.core.Item({
					key: "{view>contact_ba_id}",
					text: "{view>contact_name}"
				});
			}
			// Bind items to List
			oComboBox.bindAggregation("items", {
				path: sPath,
				template: oItemSelect,
				sorter: aSorter
			});
			//oComboBox.addItem(oDefaultItem);
			//oComboBox.setSelectedItem(oDefaultItem);
		},

		_editRelationship: function(oEvent) {
			var oItem = oEvent.getSource();
			var oBinding = oItem.getBindingContext();
			var sEntity = this.getViewProperty("view","Entity");
			var sType = sEntity === "Employee" ? "employee_ba_id" : "contact_ba_id";
			// Declare the variables
			var iBaRelId = oBinding.getProperty("ba_relationship_id");
			var iBaId = oBinding.getProperty(sType);
			var sRoleDescription = oBinding.getProperty("ba_relationship_description");
			var bIsPrimary = oBinding.getProperty("primary_flag") === "Y" ? true : false;
			// Set the form values
			this.byId("relationshipName").setSelectedKey(iBaId);
			this.byId("relationshipRole").setValue(sRoleDescription);
			this.byId("isPrimary").setSelected(bIsPrimary);
			// Set some other values in the local model
			this.setViewProperty("view", "formMode", "Update");
			this.setViewProperty("view", "baRelId", iBaRelId);
		},

		_deleteRelationship: function(oEvent) {
			var oItem = oEvent.getSource();
			var oBinding = oItem.getBindingContext();
			var iRelId = oBinding.getProperty("ba_relationship_id");
			// Declare the Model
			var oModel = this.getView().getModel();
			// Declare the view model
			var oViewModel = this.getModel("view");
			// Declare the table
			var oTable = this.byId("relationshipsTable");
			// Setup the parameters
			var oParams = {
				success: function() {
					MessageToast.show("Relationship " + iRelId + " deleted Successfully", {
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
			oModel.remove("/BARelationship(" + iRelId + ")", oParams);
			oTable.getBinding('items').refresh();
			oViewModel.setProperty("/busy", false);
		},

		_submitRelationship: function() {
			// Declare the Model
			var oModel = this.getView().getModel();
			// Declare the view model
			var oViewModel = this.getModel("view");
			// Declare the table
			var oTable = this.byId("relationshipsTable");
			// Get the Client ID
			var sClientId = this.getViewProperty("view", "ClientId");
			// Get the BA Relationship ID
			var iBaRelId = this.getViewProperty("view", "baRelId");
			// Get the Entity
			var sEntity = this.getViewProperty("view", "Entity");
			// Get the form mode (add/update)
			var sFormMode = this.getViewProperty("view", "formMode");
			// Get State of Primary Checkbox
			var isPrimary = this.byId("isPrimary");
			var primaryState = isPrimary.getSelected() === true ? "Y" : "N";
			// Declare the relationship type code
			var sRelType = sEntity === "Employee" ? "CLI-EMP" : "CLI-CTC";
			// Declare the relationship type code
			var sToastText = sFormMode === "Add" ? "added" : "updated";
			// Declare the second ba_id
			var secondBaId = this.byId("relationshipName").getSelectedKey();
			// Declare the second ba_id
			var sRoleDescription = this.byId("relationshipRole").getValue();
			// Declare the app user
			var appUserId = this.getViewProperty("global", "appUserId");
			// Declare the Object
			var mNewRelEntry = {};
			// Setup the parameters
			var oParams = {
				success: function() {
					MessageToast.show("Relationship " + sToastText + " Successfully", {
						closeOnBrowserNavigation: false,
						my: "center center",
						at: "center center"
					});
				},
				error: function(oError) {
					MessageToast.show("Please Check Record " + oError, {
						closeOnBrowserNavigation: false,
						my: "center center",
						at: "center center"
					});
				}
			};
			oViewModel.setProperty("/busy", true);
			//if (!oModel.hasPendingChanges()) {
			//	MessageBox.information(this.getResourceBundle().getText("noChangesMessage"));
			//	oViewModel.setProperty("/busy", false);
			//	return;
			//}
			// Build the Object
			mNewRelEntry.id = 0;
			mNewRelEntry.ba_id_1 = sClientId;
			mNewRelEntry.ba_id_2 = secondBaId;
			mNewRelEntry.ba_relationship_type_code = sRelType;
			mNewRelEntry.primary_flag = primaryState;
			mNewRelEntry.description = sRoleDescription;
			mNewRelEntry.revision_date = new Date();
			mNewRelEntry.revision_user = appUserId;
			// Declare Busy
			oViewModel.setProperty("/busy", true);
			// Check the form mode
			if (sFormMode === "Update") {
				// PUT
				oModel.update("/BARelationship(" + iBaRelId + ")", mNewRelEntry, oParams);
			} else {
				// POST
				oModel.create("/BARelationship", mNewRelEntry, oParams);
			}
			// Reset the form values
			this.byId("relationshipName").setSelectedKey("");
			this.byId("relationshipRole").setValue("");
			this.byId("isPrimary").setSelected(false);
			// Set some other values in the local model
			this.setViewProperty("view", "formMode", "Add");
			this.setViewProperty("view", "baRelId", 0);
			// Refresh the table and set busy to false
			oTable.getBinding('items').refresh();
			oViewModel.setProperty("/busy", false);
		},
