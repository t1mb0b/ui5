			
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
		
		
