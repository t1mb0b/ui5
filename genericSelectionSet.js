/* xmlns:app="http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1" */

onSearch: function (oEvent) {
    var aFilters = [];
    var oView = this.getView();
    var oTable = oView.byId("table");
    var oBinding = oTable.getBinding("items");
    var aSelections = oEvent.getParameter("selectionSet");
    var vFilter;

    aSelections.forEach(function (oSelection) {
        var sFilter = oSelection.data("filter");
        var sProperty = oSelection.data("property");
        var sFunction;
        var vValue;

        if (sProperty !== null) {
            if (sFilter === null) {
                sFilter = "EQ";
            }
            sFunction = oSelection.data("function");
            vValue = (sFunction === null) ? oSelection.getValue() : oSelection[sFunction]();
            if (vValue) {
                if (jQuery.type(vValue) === "date") {
                    vValue = new Date(vValue.getTime() - vValue.getTimezoneOffset() * 60000).toISOString(); // Convert to UTC
                }
                aFilters.push(new Filter(sProperty, FilterOperator[sFilter], vValue));
            }
        }
    });
    
    vFilter = (aFilters.length > 0) ? new Filter(aFilters, true) : [];
    
    if (typeof oBinding === "undefined") {
        oTable.bindItems({
            path: "/PRs",
            template: this.getView().byId("listItems"),
            filters: vFilter,
            parameters: {
                expand: "Vendors,PurchasingGroups"
            }	
        });
    } else {
        oBinding.filter(vFilter, "Application");
    }
},



<fb:FilterBar id="listFilterBar" showFilterConfiguration="false" useToolbar="false" searchEnabled="true" showRestoreButton="false" showClearButton="true" showClearOnFB="true" search="onSearch" clear="onClearFilter">
    <fb:filterItems>
        <fb:FilterItem name="filterStatus" label="{i18n>list.filter.label.status}">
            <fb:control>
                <Select id="filterStatus" app:function="getSelectedKey" app:property="Status" items="{/Statuses}">
                    <items>
                        <core:Item text="{Name}" key="{Id}" />
                    </items>
                </Select>
            </fb:control>				
        </fb:FilterItem>
        
        <fb:FilterItem name="filterId"  label="{i18n>list.filter.label.prNumber}">
            <fb:control>
                <Input app:filter="Contains" app:property="PRNumber" placeholder="" />
            </fb:control>				
        </fb:FilterItem>
        
        <fb:FilterItem name="filterMaterial" label="{i18n>list.filter.label.material}">
            <fb:control>
                <Input app:property="Material" showValueHelp="true" valueHelpRequest="onValueHelpMaterial" />
            </fb:control>				
        </fb:FilterItem>
        
        <fb:FilterItem name="filterMaterialGroup" label="{i18n>list.filter.label.materialGroup}">
            <fb:control>
                <Input app:property="MaterialGroup" showValueHelp="true" valueHelpRequest="onValueHelpMaterialGroup" />
            </fb:control>				
        </fb:FilterItem>
        
        <fb:FilterItem name="filterCreated" label="{i18n>list.filter.label.createdBy}">
            <fb:control>
                <Input app:property="CreatedBy" showValueHelp="true" valueHelpRequest="onValueHelpCreatedBy" />
            </fb:control>				
        </fb:FilterItem>

        <fb:FilterItem name="filterVendor" label="{i18n>list.filter.label.vendor}">
            <fb:control>
                <Input app:property="Vendor" showValueHelp="true" valueHelpRequest="onValueHelpVendor" />
            </fb:control>				
        </fb:FilterItem>

        <fb:FilterItem name="filterPlant" label="{i18n>list.filter.label.plant}">
            <fb:control>
                <Input id="inputPlant" app:property="Plant" showValueHelp="true" valueHelpRequest="onValueHelpPlant" />
            </fb:control>				
        </fb:FilterItem>	

        <fb:FilterItem name="filterStart" label="{i18n>list.filter.label.startDate}">
            <fb:control>
                <DatePicker app:filter="GE" app:property="CreatedOn" app:function="getDateValue" placeholder="{i18n>placeholder.date}" />
            </fb:control>				
        </fb:FilterItem>
        
        <fb:FilterItem name="filterEnd" label="{i18n>list.filter.label.endDate}">
            <fb:control>
                <DatePicker app:filter="LE" app:property="CreatedOn" app:function="getDateValue" placeholder="{i18n>placeholder.date}" />
            </fb:control>				
        </fb:FilterItem>
    </fb:filterItems>
</fb:FilterBar>
