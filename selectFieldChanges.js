		onStartDateChange: function(oEvent) {
			var aFilters = [];
			var oCompanySelect = this.byId("newHireCompany");
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
						var aItems = oCompanySelect.getItems();
						if (aItems.length === 1) {
							var sCompanyCode = oCompanySelect.getSelectedKey();
							this._processCompSelect(sCompanyCode);
						} else {
							oCompanySelect.insertItem(new sap.ui.core.Item({
								text: "-- Select --",
								key: ""
							}), 0);
							oCompanySelect.setSelectedKey("");
							oCompanySelect.setEnabled(true);
						}
					}.bind(this)
				}
			});
		},

		onCompSelChange: function(oEvent) {
			var oItem = oEvent.getSource();
			var sCompanyCode = oItem.getSelectedKey();
			var oDefaultRate = this.byId("newHireRate");
			if (sCompanyCode !== "") {
				this._processCompSelect(sCompanyCode);
				oDefaultRate.setValue("");
			}
		},

		_processCompSelect: function(sCompanyCode) {
			var aFilters = [];
			var dStartDate = new Date(this.byId("newHireStartDate").getDateValue()).toISOString();
			var oPositionSelect = this.byId("newHirePosition");
			var oItemSelectTemplate = new sap.ui.core.Item({
				key: "{PositionNumber}",
				text: "{PositionNumber} - {PositionDescription}"
			});
			if (sCompanyCode && sCompanyCode.length > 0) {
				aFilters.push(new Filter("CompanyCode", "EQ", sCompanyCode));
			}
			if (dStartDate && dStartDate.length > 0) {
				aFilters.push(new Filter("StartDate", "LE", dStartDate));
				aFilters.push(new Filter("EndDate", "GE", dStartDate));
				aFilters.push(new Filter("HourlyFlag", "EQ", 'Y'));
			}
			var sPath = "/WorkerPositions";
			oPositionSelect.bindAggregation("items", {
				path: sPath,
				template: oItemSelectTemplate,
				filters: aFilters,
				events: {
					dataReceived: function() {
						var aItems = oPositionSelect.getItems();
						if (aItems.length > 0 && aItems[0].getKey() !== "") {
							oPositionSelect.insertItem(new sap.ui.core.Item({
								text: "-- Select --",
								key: ""
							}), 0);
							oPositionSelect.setSelectedKey("");
						}
						oPositionSelect.setEnabled(true);
					}
				}
			});
		},
