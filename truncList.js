_setNotes: function(oResponse) {
			if (typeof oResponse.results !== "undefined") {
				var aAllNotes = oResponse.results;
				var aTruncNotes = [];

				var sortedNotes = aAllNotes.sort(function(a, b) {
					a = new Date(a.note_date);
					b = new Date(b.note_date);
					return a > b ? -1 : a < b ? 1 : 0;
				});

				sortedNotes.forEach(function(v) {
					if (aTruncNotes.filter(function(vv) {
							return v.note_type_description === vv.note_type_description;
						}).length < 2) {
						aTruncNotes.push(v);
					}
				});
			}
			//this.getView().getModel("view").setProperty("/allNotes", aAllNotes);
			this.getView().getModel("view").setProperty("/truncNotes", aTruncNotes);
		},
