class CharmeModels.Context

	@getForm: (fieldId) ->


		html = ""
		console.log(charme_schema.global["move"])

		for k,v of charme_schema.global[fieldId].attributes
			html += "<div style='padding:8px 0px; font-weight:bold;'>"+v["name"]+"</div>"

			if v["type"] == "area"
				html += "<select><option></option></select> Radius: <select><option></option></select>"
			else if v["type"] == "location"
				html += "<select><option></option></select>"
			else if v["type"] == "string"
				html += "<input type='text' class='box'>"
			else if v["type"] == "datetime"
				html += '<input class="box" type="date">'

			else if v["type"] == "int"
				html += "<input type='text' class='box'>"
			else if v["type"] == "moneyamount"
				html += "<input type='text' class='box'>"

			html += "<br>"
		return html