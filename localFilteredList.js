_updateQualifications: function(sEmployeeId) {
			this.getModel().read("/Employees('" + sEmployeeId + "')/EmployeeToQualificationNav", {
				success: this._processQualifications.bind(this),
				error: this.onNavBack.bind(this)
			});
		},

		_processQualifications: function(oResponse) {

			var fnStoreQualifications = function(oResQual) {
				if (typeof oResQual.results !== "undefined") {
					this._aQualifications = oResQual.results;
				}
				this._setQualifications(oResponse);
			};

			if (this._aQualifications.length === 0) {
				this.getModel().read("/QualificationCodes", {
					success: fnStoreQualifications.bind(this),
					error: this.onNavBack.bind(this)
				});
			} else {
				this._setQualifications(oResponse);
			}

		},

		_setQualifications: function(oResponse) {
			var aPreviousQualifications = [];
			var aQualifications = [{
				Code: "",
				Description: ""
			}];

			if (typeof oResponse.results !== "undefined") {

				// Generate list of current employee qualifications
				aPreviousQualifications = oResponse.results.map(function(oValue) {
					return oValue.QualificationId;
				});

				// Generate list of output qualifications
				this._aQualifications.forEach(function(oValue) {
					if (aPreviousQualifications.indexOf(oValue.Code) === -1) {
						aQualifications.push({
							Code: oValue.QualificationId,
							Description: oValue.Description
						});
					}
				});
			}

			this.getModel("view").setProperty("/qualifications", aQualifications);

		}
