_setBlankFilterState: function () {
				var vInitial = this._initialLoad;
				var oFilterStatus = this.getView().byId("filterStatus");
				oFilterStatus.addEventDelegate({
				     onAfterRendering: function () {
				     	var aItems = oFilterStatus.getItems();
				     	if (aItems.length > 0 && aItems[0].getKey() !== "") {
				     		oFilterStatus.insertItem(new Item({ text: "", key: ""}), 0);
				     		if (vInitial !== true) {
				     			oFilterStatus.setSelectedKey("");
				     		}
				     	}
				     }
				}, this);
			}
