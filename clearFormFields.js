aClearFields: ["clientMaintainedBy", "clientTagInput", "regionsList", "divisionsList", "employeePrimary", "employeeExecutive",
					"relationshipParent", "relationshipChild"
				],
        
//

_clearFormFields: function() {
			var oView = this.getView();
			var oViewModel = this.getModel("view");
			var aClearFields = oViewModel.getProperty("/aClearFields");
			aClearFields.forEach(function(sField) {
				var oInput = oView.byId(sField);
				if (oInput instanceof sap.m.MultiComboBox) {
					oInput.setSelectedKeys("");
				}
				if (oInput instanceof sap.m.Input) {
					oInput.setValue("");
					oInput.setSelectedKey("");
					oInput.setSelectionItem("");
				}
				if (oInput instanceof sap.m.MultiInput) {
					oInput.removeAllTokens();
				}
				if (oInput instanceof sap.m.Select) {
					oInput.setSelectedKey("");
				}
			});
		},
    
    //
