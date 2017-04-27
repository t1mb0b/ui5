		_loadFragment: function(sListId) {
			var oLayout = this.getView().byId("clientListFragment");
			var oFragment;
			if (sListId === "ClientNote") {
				oFragment = sap.ui.xmlfragment("ClientNoteFragment", "graham.client.view.fragments.ClientNoteAll", this);
				
			}
			if (sListId === "ClientProject") {
				oFragment = sap.ui.xmlfragment("ClientProjectFragment", "graham.client.view.fragments.ClientProjectAll", this);
			}
			this.getView().addDependent(oFragment);
			oLayout.addContent(oFragment);
			
			if (sListId === "ClientProject") {
				this._bindProjects();
			}
		},
    
    
    ===========================
    
    _formFragments: {},
    
    _getFragment: function(sFragmentName) {
			var oFragment = this._formFragments[sFragmentName];
			if(oFragment) {
				return oFragment;
			}
			oFragment = sap.ui.xmlfragment(this.getView().getId(), "graham.client.view.fragments." + sFragmentName + "All", this);
			return this._formFragments[sFragmentName] = oFragment;
		},
		
		_loadFrag: function(sFragmentName) {
			var oLayout = this.getView().byId("clientListFragment");
			oLayout.removeAllContent();
			oLayout.addContent(this._getFragment(sFragmentName));
			if (sFragmentName === "ClientProject") {
				this._bindProjects();
			}
		}
    
