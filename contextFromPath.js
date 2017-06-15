var oDataModel = this.getModel();
			var oFormVBox = this.byId("newHirePositionData");
			var oPositionPanel = this.byId("positionInfoPanel");
			var oContext = oPositionPanel.getBindingContext();
			var oDefaultRate = this.byId("newHireRate");
			var oItem = oEvent.getSource();
			var sPosition = oItem.getSelectedKey();
			var dEndDate = "9999-12-31T00:00:00";
			var sPositionPath = this.getModel().createKey("WorkerPositions", {
				PositionNumber: sPosition,
				EndDate: dEndDate
			});
			if (sPosition !== "") {
				oFormVBox.setBusy(true);
				this._bindElement(oFormVBox, "/" + sPositionPath, function(oBinding) {
					var sUnion = oBinding.getProperty("UnionFlag");
					oDefaultRate.setValue(oBinding.getProperty("DefaultRate"));
					oDefaultRate.setEnabled(true);
					if (sUnion === "Y") {
						oDefaultRate.setEnabled(false);
					} 
				});
				/*oDataModel.read("/" + sPositionPath, {
					success: function(oData) {
						var oContextModel = oContext.getModel();
						oContextModel.setProperty(oContext.getPath() + "/PersonnelAreaDescription", oData.PersonnelAreaDescription);
						oContextModel.setProperty(oContext.getPath() + "/PersonnelSubAreaDescription", oData.PersonnelSubAreaDescription);
						oContextModel.setProperty(oContext.getPath() + "/EmployeeGroupDescription", oData.EmployeeGroupDescription);
						oContextModel.setProperty(oContext.getPath() + "/EmployeeSubGroupDescription", oData.EmployeeSubGroupDescription);
						oContextModel.setProperty(oContext.getPath() + "/CostCenterDescription", oData.CostCenterDescription);
						oContextModel.setProperty(oContext.getPath() + "/CostCenter", oData.CostCenter);
						oContextModel.setProperty(oContext.getPath() + "/OrganizationalUnitDescription", oData.OrganizationalUnitDescription);
						oContextModel.setProperty(oContext.getPath() + "/ActivityType", oData.ActivityType);
						oContextModel.setProperty(oContext.getPath() + "/ActivityTypeDescription", oData.ActivityTypeDescription);
						//
						var sUnion = oData.UnionFlag;
						oDefaultRate.setValue(oData.DefaultRate);
						oDefaultRate.setEnabled(true);
						if (sUnion === "Y") {
							oDefaultRate.setEnabled(false);
						}
					}
				});*/
				oFormVBox.setBusy(false);
			}
		},
