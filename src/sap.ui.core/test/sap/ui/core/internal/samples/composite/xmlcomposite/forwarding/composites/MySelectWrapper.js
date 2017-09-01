sap.ui.define(['sap/ui/core/XMLComposite'],
	function (XMLComposite) {
		"use strict";
		var MySelectWrapper = sap.ui.core.XMLComposite.extend("composites.MySelectWrapper", {
			metadata: {
				aggregations: {
					fcItems: {
						type: "sap.ui.core.Item",
						multiple: true,
						bindable: "bindable"
					}
				},
				defaultAggregation: "fcItems"
			}
		});

		return MySelectWrapper;
	}, /* bExport= */true);
