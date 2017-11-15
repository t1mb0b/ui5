setList: function(sPath, sList) {
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
					console.log(oError);
				}
			});
		}
