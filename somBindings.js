			
		_bindClientTree: function(sClientId) {
			var oTree = this.byId("clientTree");
			var sPath = "/ClientRelationshipInput(ipi_ba_id=" + sClientId + ",ipv_current_client_only_flag='N')/Results";
			var oTemplate = new sap.m.StandardTreeItem({
				title: "{Description}"
			});
			oTree.bindItems({
				path: sPath,
				template: oTemplate,
				parameters: {
					countMode: "Inline",
					numberOfExpandedLevels: 4
						treeAnnotationProperties: {
							hierarchyLevelFor: "HierarchyLevel",
							hierarchyNodeFor: "NodeID",
							hierarchyParentNodeFor: "ParentNodeID",
							hierarchyDrillStateFor: "DrillState"
						}
				}
			});
		},
		
		_printClientRels: function(sRelPath) {
			var oTable = this.getView().byId("relationshipsTable");
			var oSorter = new sap.ui.model.Sorter("display_order", false);
			oTable.bindAggregation("items", {
				path: sRelPath,
				template: new sap.m.ColumnListItem({
					type: "Navigation",
					press: function(oEvent) {
						var oItem = oEvent.getSource();
						var oBinding = oItem.getBindingContext();
						this.getRouter().navTo("client", {
							ClientId: oBinding.getProperty("client_ba_id")
						});
					}.bind(this),
					cells: [
						new sap.m.Label({
							text: {
								path: "relationship_type",
								formatter: this.formatter.clientLabelBold
							}
						}),
						new sap.m.Label({
							text: {
								path: "client_name",
								formatter: this.formatter.clientNameBold
							}
						})
					]
				}),
				sorter: oSorter
			});
		},

		_openClientQuickView: function(oSource, sClientId) {
			if (!this._zQuickViewClient) {
				this._zQuickViewClient = sap.ui.xmlfragment("X.view.fragments.ClientQuickView", this);
				this.getView().addDependent(this._zQuickViewClient);
			}

			//var sAnchor = this.byId("clientInfos");
			//var sButton = this.byId("application-fioriHtmlBuilder-display-component---client--clientObjPageHeader-titleArrow-cont");
			var oBinding = oSource.getBindingContext();
			var sClientPath = oBinding.getModel().createKey("/Client", {
				client_ba_id: sClientId
			});

			// Bind Client to View
			this._zQuickViewClient.bindElement({
				path: sClientPath
			});

			// Delayed call to allow for re-render before open
			jQuery.sap.delayedCall(0, this, function() {
				//this._zQuickViewClient.openBy(sButton);
				this._zQuickViewClient.openBy(oSource);
			});
		},
		
		_printClientContacts: function(sContactPath) {
			var oTable = this.getView().byId("contactsTable");
			var aSorter = [];
			//			var oStatSorter = new sap.ui.model.Sorter("status_display_order", false);
			//var oRelSorter = new sap.ui.model.Sorter("relationship_display_order", false);
			//			aSorter.push(oStatSorter,oRelSorter);
			oTable.bindAggregation("items", {
				path: sContactPath,
				template: new sap.m.ColumnListItem({
					cells: [
						new sap.m.Label({
							"text": "{client_name}",
							design: "Bold"
						}),
						new sap.m.Text({
							"text": "{contact_name}"
						}),
						new sap.m.Text({
							"text": "{ba_relationship_description}"
						}),
						new sap.m.Link({
							"text": {
								path: "business_phone_number",
								formatter: this.formatter.phone
							},
							"press": this.onClientPhonePress
						}),
						new sap.m.Link({
							"text": {
								path: "cell_phone_number",
								formatter: this.formatter.phone
							},
							"press": this.onClientPhonePress
						}),
						new sap.m.Link({
							"text": {
								path: "business_fax_number",
								formatter: this.formatter.phone
							},
							"press": this.onClientPhonePress
						})
					]
				}),
				sorter: aSorter
			});
		},

		_printClientEmployees: function(sGrelPath) {
			var oTable = this.getView().byId("gRelationshipsTable");
			var aSorter = [];
			//			var oStatSorter = new sap.ui.model.Sorter("status_display_order", false);
			//var oRelSorter = new sap.ui.model.Sorter("relationship_display_order", false);
			//			aSorter.push(oStatSorter,oRelSorter);
			oTable.bindAggregation("items", {
				path: sGrelPath,
				template: new sap.m.ColumnListItem({
					cells: [
						new sap.m.Text({
							"text": "{employee_name}"
						}),
						new sap.m.Text({
							"text": "{client_name}"
						}),
						new sap.m.Text({
							"text": "{ba_relationship_description}"
						}),
						new sap.m.Link({
							"text": {
								path: "business_phone_number",
								formatter: this.formatter.phone
							},
							"press": this.onClientPhonePress
						}),
						new sap.m.Link({
							"text": {
								path: "cell_phone_number",
								formatter: this.formatter.phone
							},
							"press": this.onClientPhonePress
						}),
						new sap.m.Link({
							"text": {
								path: "business_fax_number",
								formatter: this.formatter.phone
							},
							"press": this.onClientPhonePress
						})

					]
				}),
				sorter: aSorter
			});
		},
		
		_createClientTree: function(oResponse) {
			var aTree = [];
			if (typeof oResponse.results !== "undefined") {
				var oResult = oResponse.results;
				oResult.forEach(function(oClient) {
					var h = oClient.ba_id_ordered_list.split("-");
					var hLen = h.length === 1 ? 1 : h.length;
					var me = h.pop();
					var parent = h.slice(-2)[0];
					aTree.push({
						clientId: me,
						parentId: parent,
						hierarchyLevel: hLen,
						clientName: oClient.client_name,
						relType: oClient.relationship_type,
						drillState: "expanded"
					});
				});
			}
			this.getView().getModel("view").setProperty("/treeView", aTree);
		},
		
		_printAllProjSummary: function(sClientId) {
			var oTable = this.byId("projectSummaryTable");
			var aSorter = [];
			var aFilters = [];
			var oOrderSorter = new Sorter("stage_display_order", false);
			aSorter.push(oOrderSorter);
			oTable.bindAggregation("items", {
				path: "/Client(" + sClientId + ")/ClientProjectSummary",
				template: new sap.m.ColumnListItem({
					cells: [
						new sap.m.Label({
							"text": "{stage}",
							design: "Bold"
						}),
						new sap.m.Text({
							"text": "{active_count}"
						}),
						new sap.m.Text({
							"text": "{total_count}"
						}),
						new sap.m.Text({
							"text": {
								path: "active_value",
								formatter: this.formatter.money
							}
						}),
						new sap.m.Text({
							"text": {
								path: "total_value",
								formatter: this.formatter.money
							}
						}),
						new sap.m.Text({
							"text": {
								path: "max_system_entry_date",
								type: 'sap.ui.model.type.Date',
								formatOptions: {
									pattern: 'yyyy/MM/dd',
									UTC: true
								}
							}
						}),
						new sap.m.Text({
							"text": {
								path: "next_closing_datetime",
								formatter: this.formatter.returnDateField,
								type: 'sap.ui.model.type.Date',
								formatOptions: {
									pattern: 'yyyy/MM/dd HH:mm',
									UTC: true
								}
							}
						}),
						new sap.m.Text({
							"text": {
								path: "min_project_start_date",
								formatter: this.formatter.returnDateField,
								type: 'sap.ui.model.type.Date',
								formatOptions: {
									pattern: 'yyyy/MM/dd',
									UTC: true
								}
							}

						}),
						new sap.m.Text({
							"text": {
								path: "max_project_end_date",
								formatter: this.formatter.returnDateField,
								type: 'sap.ui.model.type.Date',
								formatOptions: {
									pattern: 'yyyy/MM/dd',
									UTC: true
								}
							}
						})
					]
				}),
				filters: aFilters,
				sorter: aSorter
			});
		},
		
		_bindClientProjects: function(sClientId) {
			var oView = this.getView();
			var oTable = oView.byId("projectsTable");
			var aSorter = [];
			var aFilters = [];
			var oStageDisplaySorter = new sap.ui.model.Sorter("stage_display_order", false);
			var oStageSorter = new sap.ui.model.Sorter("stage", false, true);
			//var oRelSorter = new sap.ui.model.Sorter("relationship_display_order", false);
			var oProjSorter = new sap.ui.model.Sorter("project_name", false);
			aSorter.push(oStageSorter, oStageDisplaySorter, oProjSorter);
			var oActiveFilter = new sap.ui.model.Filter("estimate_active_flag", "EQ", "Y");
			aFilters.push(oActiveFilter);
			oTable.bindAggregation("items", {
				path: "/Client(" + sClientId + ")/ClientProject",
				template: new sap.m.ColumnListItem({
					cells: [
						new sap.m.Label({
							"text": "{client_name}",
							"design": "Bold"
						}),
						new sap.m.Text({
							"text": "{project_name}"
						}),
						new sap.m.Text({
							"text": {
								path: "value",
								formatter: this.formatter.money
							}
						}),
						new sap.m.Text({
							"text": {
								path: "system_entry_date",
								type: 'sap.ui.model.type.Date',
								formatOptions: {
									pattern: 'yyyy/MM/dd',
									UTC: true
								}
							}
						}),
						new sap.m.Text({
							"text": {
								path: "closing_datetime",
								type: 'sap.ui.model.type.DateTime',
								formatOptions: {
									pattern: 'yyyy/MM/dd HH:mm',
									UTC: true
								}
							}
						}),
						new sap.m.Text({
							"text": {
								parts: [{
									path: 'stage'
								}, {
									path: 'anticipated_start_date',
									type: 'sap.ui.model.type.Date',
									formatOptions: {
										pattern: 'yyyy/MM/dd',
										UTC: true
									}
								}, {
									path: 'project_start_date',
									type: 'sap.ui.model.type.Date',
									formatOptions: {
										pattern: 'yyyy/MM/dd',
										UTC: true
									}
								}],
								formatter: function(sStage, dAnticipatedStart, dProjStart) {
									return (sStage === "Bids" || sStage === "Leads") ? dAnticipatedStart : dProjStart;
								}
							}
						}),
						new sap.m.Text({
							"text": {
								parts: [{
									path: "stage"
								}, {
									path: "anticipated_end_date",
									type: 'sap.ui.model.type.Date',
									formatOptions: {
										pattern: 'yyyy/MM/dd',
										UTC: true
									}
								}, {
									path: "project_end_date",
									type: 'sap.ui.model.type.Date',
									formatOptions: {
										pattern: 'yyyy/MM/dd',
										UTC: true
									}
								}],
								formatter: function(sStage, dAnticipatedEnd, dProjEnd) {
									return (sStage === "Bids" || sStage === "Leads") ? dAnticipatedEnd : dProjEnd;
								}
							}
						})
					]
				}),
				sorter: aSorter,
				filters: aFilters
			});
		},
		
		// Define oData Query Paths for Stored Procs
				//var sRelPath = "/ClientRelationshipInput(ipi_ba_id=" + sObjectId + ",ipv_current_client_only_flag='N')/Results";
				//var sProjPath = "/ClientProjectListInput(ipi_ba_id=" + sObjectId + ",ipv_active_flag='Y')/Results";
				//var sContactPath = "/ClientContactListInput(ipi_ba_id=" + sObjectId + ",ipv_current_client_only_flag='N')/Results";
				//var sEmployeePath = "/ClientEmployeeListInput(ipi_ba_id=" + sObjectId + ",ipv_current_client_only_flag='N')/Results";
				//var sProjSummaryPath = "/ClientProjectSummaryInput(ipi_ba_id=" + sObjectId + ",ipv_active_flag='Y')/Results";
				//var sAllProjSummaryPath = "/ClientProjectSummaryInput(ipi_ba_id=" + sObjectId + ",ipv_active_flag='A')/Results";
				// Execute functions to build table contents
				//this._printClientRels(sRelPath);
				//this._bindTreeRows(sRelPath);
				//that._bindClientProjects(sClientId);
				//this._printClientContacts(sContactPath);
				//this._printClientEmployees(sEmployeePath);
				//this._setProjChartData(sProjSummaryPath);
				//this._printAllProjSummary(sAllProjSummaryPath);
				// Read Notes
				/*that.getModel().read("/Client(" + sClientId + ")/ClientNote", {
					success: that._setNotes();
				});
				
_setList: function(sPath, sList) {
			var oViewModel = this.getModel("view");
			var aItems = [];
			this.getModel().read(sPath, {
				success: function(oData, oResponse) {
					if (sList === "/provinces") {
						aItems = [{
							ProvinceCode: "",
							ProvinceName: "-- Select --",
							CountryCode: ""
						}];
					} else if (sList === "/labourPackages") {
						aItems = [{
							LabourPackageCode: "",
							LabourPackageDescription: "-- Select --",
							Language: ""
						}];
					} else if (sList === "/workContracts") {
						aItems = [{
							WorkContractCode: "",
							WorkContractDescription: "-- Select --",
							CountryGroup: ""
						}];
					} else if (sList === "/compFrequencies") {
						aItems = [{
							Code: "",
							Description: "-- Select --",
							HourlyFlag: ""
						}];
					}
					if (typeof oResponse.data.results !== "undefined") {
						aItems = aItems.concat(oResponse.data.results);
					}
					oViewModel.setProperty(sList, aItems);
				},
				error: function(oError) {
					MessageToast.show("Error reading the data; please try again later");
					//console.log(oError);
				}
			});
		},

_bindCostCentreSelect: function() {
			var that = this;
			var aFilters = [];
			var aSorters = [];
			var sCostCentrePath = "/CostCentres";
			var oCostCentreSelect = this.byId("costCentreSelect");
			var oCostCentreSelectTemplate = new sap.ui.core.Item({
				key: "{CostCentreCode}",
				text: "{CompanyCode} {CostCentreCode} {CostCentreDescription}"
			});
			// aSorters.push(new sap.ui.model.Sorter("ReasonForActionCode", false));
			// aFilters.push(new Filter("ActionTypeCode", "EQ", "K5"));
			oCostCentreSelect.bindAggregation("items", {
				path: sCostCentrePath,
				template: oCostCentreSelectTemplate,
				filters: aFilters,
				sorter: aSorters,
				events: {
					dataReceived: function() {
						if (!that._isEdit()) {
							var aItems = oCostCentreSelect.getItems();
							if (aItems.length === 1) {
								oCostCentreSelect.setSelectedKey(aItems[0].getKey());
								oCostCentreSelect.fireChange({
									selectedItem: aItems[0]
								});
							} else {
								oCostCentreSelect.insertItem(new sap.ui.core.Item({
									text: "-- Select --",
									key: ""
								}), 0);
								oCostCentreSelect.setSelectedKey("");
								// oViewModel.setProperty("/companySelect", true);
							}
						}
					}
				}
			});
		},


_bindManagerSelect: function(sManagerPositionNumber) {
			var that = this;
			var aFilters = [];
			var aSorters = [];
			var sManagerPath = "/Managers";
			var oManagerSelect = this.byId("managerSelect");
			var oManagerSelectTemplate = new sap.ui.core.Item({
				key: "{EmployeeID}",
				text: "{Name} ({EmployeeID}) - {PositionDescription}"
			});
			aSorters.push(new sap.ui.model.Sorter("FormattedName", false));
			// aFilters.push(new Filter("ActionTypeCode", "EQ", "K5"));
			if (sManagerPositionNumber && sManagerPositionNumber !== "") {
				aFilters.push(new Filter("PositionNumber", "EQ", sManagerPositionNumber));
			}
			oManagerSelect.bindAggregation("items", {
				path: sManagerPath,
				template: oManagerSelectTemplate,
				filters: aFilters,
				sorter: aSorters,
				events: {
					dataReceived: function() {
						if (!that._isEdit()) {
							var aItems = oManagerSelect.getItems();
							if (aItems.length === 1) {
								oManagerSelect.setSelectedKey(aItems[0].getKey());
								oManagerSelect.fireChange({
									selectedItem: aItems[0]
								});
							} else {
								oManagerSelect.insertItem(new sap.ui.core.Item({
									text: "-- Select --",
									key: ""
								}), 0);
								oManagerSelect.setSelectedKey("");
								// oViewModel.setProperty("/companySelect", true);
							}
						}
					}
				}
			});
		},
*/

/*_bindCompanySelect: function() {
		var that = this;
		var oViewModel = this.getModel("view");
		var aFilters = [];
		var oCompanySelect = this.byId("companySelect");
		var oTemplate = new sap.ui.core.Item({
			key: "{CompanyCode}",
			text: "{CompanyName}"
		});

		var sPath = "/Companies";
		oCompanySelect.bindAggregation("items", {
			path: sPath,
			template: oTemplate,
			filters: aFilters,
			events: {
				dataReceived: function() {
					if (!that._isEdit()) {
						var aItems = oCompanySelect.getItems();
						if (aItems.length === 1) {
							oCompanySelect.setSelectedKey(aItems[0].getKey());
							oCompanySelect.fireChange({
								selectedItem: aItems[0]
							});
						} else {
							oCompanySelect.insertItem(new sap.ui.core.Item({
								text: "-- Select --",
								key: ""
							}), 0);
							oCompanySelect.setSelectedKey("");
							// oViewModel.setProperty("/companySelect", true);
						}
					}
				}
			}
		});
	},*/

/*_bindPayrollFrequencySelect: function() {
	var that = this;
	var aFilters = [];
	var aSorters = [];
	var sPath = "/CompensationFrequencies";
	var oPayrollFrequencySelect = this.byId("wageType");
	var oPayrollFrequencySelectTemplate = new sap.ui.core.Item({
		key: "{Code}",
		text: "{Description}"
	});
	// aSorters.push(new sap.ui.model.Sorter("ReasonForActionCode", false));
	// aFilters.push(new Filter("ActionTypeCode", "EQ", "K5"));
	oPayrollFrequencySelect.bindAggregation("items", {
		path: sPath,
		template: oPayrollFrequencySelectTemplate,
		filters: aFilters,
		sorter: aSorters,
		events: {
			dataReceived: function() {
				if (!that._isEdit()) {
					var aItems = oPayrollFrequencySelect.getItems();
					if (aItems.length === 1) {
						oPayrollFrequencySelect.setSelectedKey(aItems[0].getKey());
						oPayrollFrequencySelect.fireChange({
							selectedItem: aItems[0]
						});
					} else {
						oPayrollFrequencySelect.insertItem(new sap.ui.core.Item({
							text: "-- Select --",
							key: ""
						}), 0);
						oPayrollFrequencySelect.setSelectedKey("");
						// oViewModel.setProperty("/companySelect", true);
					}
				}
			}
		}
	});
},*/

/*_bindFacilitySelect: function() {
	var that = this;
	var aFilters = [];
	var aSorters = [];
	var sFacilityPath = "/Facilities";
	var oFacilitySelect = this.byId("facilitySelect");
	var oFacilitySelectTemplate = new sap.ui.core.Item({
		key: "{FacilityCode}",
		text: "{FacilityCode} {FacilityDescription}"
	});
	// aSorters.push(new sap.ui.model.Sorter("ReasonForActionCode", false));
	// aFilters.push(new Filter("ActionTypeCode", "EQ", "K5"));
	oFacilitySelect.bindAggregation("items", {
		path: sFacilityPath,
		template: oFacilitySelectTemplate,
		filters: aFilters,
		sorter: aSorters,
		events: {
			dataReceived: function() {
				if (!that._isEdit()) {
					var aItems = oFacilitySelect.getItems();
					if (aItems.length === 1) {
						oFacilitySelect.setSelectedKey(aItems[0].getKey());
						oFacilitySelect.fireChange({
							selectedItem: aItems[0]
						});
					} else {
						oFacilitySelect.insertItem(new sap.ui.core.Item({
							text: "-- Select --",
							key: ""
						}), 0);
						oFacilitySelect.setSelectedKey("");
						// oViewModel.setProperty("/companySelect", true);
					}
				}
			}
		}
	});
},*/

/*_bindOrgUnitSelect: function() {
	var that = this;
	var aFilters = [];
	var aSorters = [];
	var sOrgUnitPath = "/OrganizationalUnits";
	var oOrgUnitSelect = this.byId("orgUnitSelect");
	var oOrgUnitSelectTemplate = new sap.ui.core.Item({
		key: "{OrganizationalUnitCode}",
		text: "{OrganizationalUnitCode} {OrganizationalUnitDescription}"
	});
	// aSorters.push(new sap.ui.model.Sorter("ReasonForActionCode", false));
	// aFilters.push(new Filter("ActionTypeCode", "EQ", "K5"));
	oOrgUnitSelect.bindAggregation("items", {
		path: sOrgUnitPath,
		template: oOrgUnitSelectTemplate,
		filters: aFilters,
		sorter: aSorters,
		events: {
			dataReceived: function() {
				if (!that._isEdit()) {
					var aItems = oOrgUnitSelect.getItems();
					if (aItems.length === 1) {
						oOrgUnitSelect.setSelectedKey(aItems[0].getKey());
						oOrgUnitSelect.fireChange({
							selectedItem: aItems[0]
						});
					} else {
						oOrgUnitSelect.insertItem(new sap.ui.core.Item({
							text: "-- Select --",
							key: ""
						}), 0);
						oOrgUnitSelect.setSelectedKey("");
						// oViewModel.setProperty("/companySelect", true);
					}
				}
			}
		}
	});
}, */

/*_bindReasonSelect: function() {
	var that = this;
	var aFilters = [];
	var aSorters = [];
	var sReasonPath = "/ChangeReasons";
	var oReasonSelect;
	var oReasonSelectTemplate = new sap.ui.core.Item({
		key: "{ReasonForActionCode}",
		text: "{ReasonForActionCode} {ReasonForActionDescription}"
	});
	aSorters.push(new sap.ui.model.Sorter("ReasonForActionCode", false));
	if (this._isChange()) {
		oReasonSelect = this.byId("reasonSelect");
		aFilters.push(new Filter("ActionTypeCode", "EQ", "K5"));
	} else if (this._isNewHire()) {
		oReasonSelect = this.byId("hireReasonSelect");
		if (this.getModel("view").getProperty("/newEmployee")) {
			aFilters.push(new Filter("ActionTypeCode", "EQ", "K1"));
		} else {
			aFilters.push(new Filter("ActionTypeCode", "EQ", "K4"));
		}
	}

	oReasonSelect.bindAggregation("items", {
		path: sReasonPath,
		template: oReasonSelectTemplate,
		filters: aFilters,
		sorter: aSorters,
		events: {
			dataReceived: function() {
				if (!that._isEdit()) {
					var aItems = oReasonSelect.getItems();
					if (aItems.length === 1) {
						oReasonSelect.setSelectedKey(aItems[0].getKey());
						oReasonSelect.fireChange({
							selectedItem: aItems[0]
						});
					} else {
						oReasonSelect.insertItem(new sap.ui.core.Item({
							text: "-- Select --",
							key: ""
						}), 0);
						oReasonSelect.setSelectedKey("");
						// oViewModel.setProperty("/companySelect", true);
					}
				}
			}
		}
	});
},*/

/*_bindVehicleAllowanceSelect: function() {
	var that = this;
	var aFilters = [];
	var aSorters = [];
	var sReasonPath = "/VehicleAllowances";
	var oVehicleAllowanceSelect = this.byId("vehicleAllowanceSelect");
	var oVehicleAllowanceSelectTemplate = new sap.ui.core.Item({
		key: "{VehicleAllowanceCode}",
		text: "{VehicleAllowanceDescription}"
	});

	oVehicleAllowanceSelect.bindAggregation("items", {
		path: sReasonPath,
		template: oVehicleAllowanceSelectTemplate,
		filters: aFilters,
		sorter: aSorters,
		events: {
			dataReceived: function() {
				if (!that._isEdit()) {
					var aItems = oVehicleAllowanceSelect.getItems();
					if (aItems.length === 1) {
						oVehicleAllowanceSelect.setSelectedKey(aItems[0].getKey());
						oVehicleAllowanceSelect.fireChange({
							selectedItem: aItems[0]
						});
					} else {
						oVehicleAllowanceSelect.insertItem(new sap.ui.core.Item({
							text: "-- Select --",
							key: ""
						}), 0);
						oVehicleAllowanceSelect.setSelectedKey("");
						//oViewModel.setProperty("/companySelect", true);
					}
				}
			}
		}
	});
},
		
		
