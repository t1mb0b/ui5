onAfterRendering:function() {
			//Add a filter to the table. Filtering will not work without this
			this.getView().byId("treeTable").bindAggregation("rows", {path: "tableModel>/data",filters:[
					new sap.ui.model.Filter("RequisitionNumber", sap.ui.model.FilterOperator.Contains, "")
				]});
		},
		
		onPressExpandAll: function() {
			this.getView().byId("treeTable").expandToLevel(25);
		},
		onPressCollapseAll:function(){
			this.getView().byId("treeTable").collapseAll();
		},
		onSearchTable: function(oEvent) {
			var sValue = oEvent.getParameters().query;
			var oFilterRequisitionNumber = new sap.ui.model.Filter("RequisitionNumber", sap.ui.model.FilterOperator.Contains, sValue);
			var oTableBinding = this.getView().byId("treeTable").getBinding("rows");
			oTableBinding.filter(oFilterRequisitionNumber,"Application");
		}
    
    
    ========================
    
     <t:TreeTable
                    id="treeTable"
                    rows="{ path: 'tableModel>/data', parameters: {arrayNames:['items']}}"
                    selectionMode="Single"
                    enableSelectAll="false"
                    ariaLabelledBy="title"
                    class="sapUiLargeMarginTop"
                    >
                <t:toolbar>
                  <!--  <Toolbar>
                        <Title id="title" text="Clothing"/>
                        <ToolbarSpacer/>
                        <Button text="Collapse all" press="onCollapseAll"/>
                        <Button text="Expand first level" press="onExpandFirstLevel"/>
                    </Toolbar>-->
                </t:toolbar>
                <t:columns>
                    <t:Column width="15%">
                        <Label text="Requisition #"/>
                        <t:template>
                            <Text text="{tableModel>RequisitionNumber}"/>
                        </t:template>
                    </t:Column>
                    <t:Column width="6%">
                        <Label text="Type"/>
                        <t:template>
                           <Text text="{tableModel>Type}"/>
                        </t:template>
                    </t:Column>
                    <t:Column width="10%">
                        <Label text="Requested Vendor"/>
                        <t:template>
                            <Text text="{tableModel>RequestedVendor}"/>
                        </t:template>
                    </t:Column>
                    <t:Column width="15%">
                        <Label text="Item Description"/>
                        <t:template>
                            <Text text="{tableModel>ItemDescription}"/>
                        </t:template>
                    </t:Column>
                    <t:Column width="4%">
                        <Label text="Qty"/>
                        <t:template>
                            <Text text="{tableModel>Qty}"/>
                        </t:template>
                    </t:Column>
                     <t:Column width="10%">
                        <Label text="Price/Value"/>
                        <t:template>
                            <Text text="{tableModel>PriceValue}"/>
                        </t:template>
                    </t:Column>
                     <t:Column width="10%">
                        <Label text="Needed by"/>
                        <t:template>
                            <Text text="{tableModel>NeededBy}"/>
                        </t:template>
                    </t:Column>
                </t:columns>
            </t:TreeTable>
