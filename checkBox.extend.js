sap.ui.model.SimpleType.extend("sap.ui.model.type.Boolean", {

			formatValue: function(oValue) {
				if (oValue === 1) {
					return true;
				}
				if (oValue === null || oValue === 0)
				{
					return false;
				}
			},

			parseValue: function(oValue) {
				if (oValue === true) {
					return 1;
				} else if (oValue === false) {
					return 0;
				}
			},
			validateValue: function(oValue) {
				return oValue;
			}
		});
    
    =======
    
    <CheckBox text="{i18n>hdCheckBox}" selected="{path: 'hd', type: 'sap.ui.model.type.Boolean'}" editable="true" enabled="true" visible="true" width="auto" textDirection="Inherit"/>
    
    =====
    
    var oCheckbox = new sap.m.Checkbox({ selected: "{= ${/some_path} == 1 }" });
