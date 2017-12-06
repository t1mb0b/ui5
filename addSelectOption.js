_setBlankOption: function(oItem) {
			var oSelectItem = this.byId(oItem);
			oSelectItem.addEventDelegate({
				onAfterRendering: function() {
					var aItems = oSelectItem.getItems();
					if (aItems.length > 0 && aItems[0].getKey() !== "") {
						oSelectItem.insertItem(new sap.ui.core.Item({
							text: "-- Select --",
							key: ""
						}), 0);
						oSelectItem.setSelectedKey("");
					}
				}
			}, this);
		}
