// Read Data
			this.getModel().read(sRelPath, {
				success: function(oResponse) {
						var aChildren = oResponse.results.filter(function(obj) {
						return +sClientId !== obj.client_ba_id;
					});
					this.setViewProperty("view", "aChildren", aChildren);
				}.bind(this),
				error: function(oError) {
					MessageToast.show("Error Reading list of Relationships; please try again");
					console.log(oError);
				}
			});
      
===================

			/*
			this.getModel().read(oBinding.sPath + "/EmployeeToQualificationNav", {
				success: function(oData, response) {
					for (var i = 0; i < response.data.results.length; i++) {
					 qualArray = [];
					 qual = response.data.results[i].Ttext + "	" + response.data.results[i].Endda;
					 qualArray.push(qual);
					 }
					MessageBox.information("Qualification Info:", {
						 icon: MessageBox.Icon.INFORMATION,
						 title: "Info",
						 details: sEmpName + " - Field Compliance Tracking" + "\n" + sQualHdr + qualArray[0]
					});

				}.bind(this),
				error: function() {}
			});
			//MessageBox.information("we have " + qualArray.length);
			*/


var oModel = this.getModel("weightProtocolSource");
      oModel.read("/UserCalendarSet(ShortName='BMA')", {
        success: function (oData, oResponse) {
          console.log(oResponse);
        },
        error: function (oError) {
          console.log(oError);
        }
      });



==========================================

this.getModel().read("/ClientRelationshipInput(" + sObjectId + ")/Results", {
success: function(oData, oResponse) {
this._aClientRels = oResponse.data.results;
this._printClientRels(sPath);
}.bind(this),
error: function() {
MessageBox.Error("Could not load client relationships");
	}
});

if (this._sClientRels && this._aClientRels.length > 0) {
	for (var i = 0; i < this._aClientRels.length; i++) {
	var clientName = this._aClientRels[i].client_name;
	var relType = this._aClientRels[i].relationship_type;
		console.log(clientName + "=>" + relType);
		}
}

		_getClientRelationships: function(oEvent) {
			var sClientId = oEvent.getParameter("arguments").ClientId;
			this.getModel().metadataLoaded().then(function() {
				var sObjectPath = this.getModel().read("/ClientRelationshipInput(" + sClientId + ")/Results");
				this._bindView("/" + sObjectPath);
			}.bind(this));
		},



==============================

      const oSapWpService = this.getModel("sapWpService");
      oSapWpService.setHeaders({"Authorization": "Basic BlaBla"});
      oSapWpService.read("/InsCharInfoSet", {
        success: function (oData, oResponse) {
          console.log(oResponse);
        },
        error: function (oError) {
          console.log(oError);
        }
      });



======================================================

this.getModel().read("/QualificationLists", {
success: this._setQualifications.bind(this)
});

_setQualifications: function (oResponse) {
var aQualifications = [{
Objid: "",
McStext: ""
}];
if (typeof oResponse.results !== "undefined") {
aQualifications = aQualifications.concat(oResponse.results);
}
this.getModel("view").setProperty("/qualifications", aQualifications);
},
