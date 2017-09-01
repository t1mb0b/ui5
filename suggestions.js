handleSuggest: function(oEvent) {
			var sTerm = oEvent.getParameter("suggestValue");
			var aFilters = [];
			var sPath = "/Path";
			var oTemplate = new sap.ui.core.Item({
				text: "{FormattedName} - {EmployeeID} - {CompanyName}",
				key: "{EmployeeID}"
			});
			if (sTerm.length >= 3) {
				aFilters.push(new Filter("EmploymentStatusCode", "NE", "0"));
				aFilters.push(new Filter("LookupString", "Contains", sTerm));
				/*if(isNaN(sTerm)) {
					aFilters.push(new Filter("FormattedName", "Contains", sTerm));
				} else {
					aFilters.push(new Filter("EmployeeID", "Contains", sTerm));
				}*/
				oEvent.getSource().bindAggregation('suggestionItems', {
					path: sPath,
					template: oTemplate,
					filters: aFilters
				});
				//console.log(sTerm);
			}
		},

		onSuggestSelect: function(oEvent) {
			var oViewModel = this.getModel("view");
			var oBinding = oEvent.getParameter("selectedItem").getBindingContext();
			this.byId("changeEmployeeName").setText(oBinding.getProperty("FormattedName"));
			this.byId("changeEmployeeID").setText(oBinding.getProperty("EmployeeID"));
			this.byId("changeEmployeePosition").setText(oBinding.getProperty("PositionDescription"));
			this.byId("changeEmployeeCompany").setText(oBinding.getProperty("CompanyName"));
			oViewModel.setProperty('/employeeSelected', true);
		}
