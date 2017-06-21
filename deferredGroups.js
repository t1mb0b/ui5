/* Compnent.js */

this.getModel().setDeferredGroups(["Incident"]);

/* Controller */

var oModel = this.getModel();
			var oView = this.getView();
			var oContext = oModel.createEntry("DOASet", {
				groupId: "Incident",
				success: this._onIncidentSaveSuccess.bind(this),
				error: this._onIncidentSaveError.bind(this)
			});
			oView.setBindingContext(oContext);
      
   this._oModel.submitChanges({
					groupId: "Incident"
				});
