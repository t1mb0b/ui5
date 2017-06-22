		_MessageBoxPromise: function() {

			return new Promise(function resolver(resolve, reject) {
				MessageBox.warning("Message", {
					actions: [MessageBox.Action.YES, MessageBox.Action.NO],
					onClose: function(sAction) {
						if (sAction === MessageBox.Action.YES) {
							resolve();
						} else {
							reject();
						}
					}
				});
			});
		},
