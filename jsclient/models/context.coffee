class CharmeModels.Context

	@getTimeHours: () ->
		str = ""
		for k in [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]
			str += "<option>"+k+"</option>"
		return str 
	@getTimeMinutes: () ->
		str = ""
		for k in [0,15,30,45]
			str += "<option>"+k+"</option>"
		return str
	@getRad: () ->
		str = ""
		for k in [0,1,2,3,4,5,6,7,8,9]
			str += "<option>"+k+"km</option>"
		return str
	@getCurrencies: () ->
		str = ""
		for k in ["EUR", "USD", "BTC", "YEN"]
			str += "<option vale='"+k+"'>"+k+"</option>"
		return str
	@getRating: () ->
		str = ""
		for k in ["5", "4", "3", "2", "1"]
			str += "<option>"+k+"</option>"
		return str

	@searchRecursiveId: (node, parentId, level=0) ->
		console.log("LOOKUP LEVEL"+level);
		for subnode in node
			console.log "iterate el"+subnode.name
			if subnode.id == parentId
				console.log "RETURN"
				console.log subnode
				return subnode.sub
			else if subnode.sub? # ? checks if variable exists
				console.log "	RECURSIVE CALL"
				retval =  this.searchRecursiveId(subnode.sub, parentId, (level+1))
				
				return retval if retval?


	@searchRecursiveText: (node, query) ->
		retArray = []
		for subnode in node

	
			if subnode.name.toLowerCase().indexOf(query.toLowerCase()) >= 0
				console.log("PSUH"+subnode.name)
				retArray.push(subnode)

			if subnode.sub?
				subres = this.searchRecursiveText(subnode.sub, query)
				retArray = retArray.concat(subres)
			#if subnode.id == parentId
			#	return subnode.sub
			#else if subnode.sub? # ? checks if variable exists

			#	if retval?
			#		return retval

		return retArray

	@renderCateogries: (parentId, searchQuery) ->

		str = ""
		if searchQuery!="" and searchQuery?
			parent = CharmeModels.Context.searchRecursiveText(charme_schema_categories,  searchQuery)
		else
			
			if not parentId? #parent does not exist?
				parent = charme_schema_categories
			else
				parent = CharmeModels.Context.searchRecursiveId(charme_schema_categories, parentId)
		
		console.log(parent);

		for item in parent
			if str != ""
				str+=", "
			if item.sub?
				str += "<a class='selectCategory' data-cat='"+item.id+"'>"+item.name+"</a>"
			else
				str += "<a class='selectCategory' data-final='"+item.id+"'>"+item.name+"</a>"

		return str


	#@getTopCategories: () ->
	#	str = ""
	#	for k in ["EUR", "USD", "BTC", "YEN"]
	#		str += "<option>"+k+"</option>"
	#	return str		
	@getForm: (fieldId) ->
	# the event handlers are set in page_modules.js, function addContext
		html = ""
		console.log(charme_schema.global["move"])

		for k,v of charme_schema.global[fieldId].attributes
			html += "<div style='padding:8px 0px; font-weight:bold;'>"+v["name"]+"</div>"

			if v["type"] == "area"
				html += "<select  name='"+v["id"]+"' class='locationContainer'></select> <a class='but_addLocation'>Add Location</a> Radius: <select name='"+v["id"]+"_radius'>"+CharmeModels.Context.getRad()+"</select>"
			else if v["type"] == "location"
				html += "<select name='"+v["id"]+"' class='locationContainer'></select> <a class='but_addLocation'>Add Location</a>"
			else if v["type"] == "string"
				html += "<input  name='"+v["id"]+"' type='text' class='box'>"
			else if v["type"] == "entity"
				html += "<input  name='"+v["id"]+"' type='text' class='box'>"
			else if v["type"] == "rating"
				html += '<select name="'+v["id"]+'">'+CharmeModels.Context.getRating()+'</select> (5 is best)'
			else if v["type"] == "datetime"
				html += '<input  name="'+v["id"]+'" class="box" type="date"> <select name="'+v["id"]+'_hour">'+CharmeModels.Context.getTimeHours()+'</select>:<select  name="'+v["id"]+'_minute">'+CharmeModels.Context.getTimeMinutes()+'</select>'

			else if v["type"] == "int"
				html += "<input name='"+v["id"]+"' type='text' class='box'>"
			else if v["type"] == "moneyamount"
				html += "<input name='"+v["id"]+"' type='text' class='box'>"
			else if v["type"] == "currency"
				html += '<select name="'+v["id"]+'">'+CharmeModels.Context.getCurrencies()+'</select>'
			else if v["type"] == "productcategory"
				html += '<input placeholder="Search..." id="productidentifierSearch" class="box" type="text" style="margin-bottom:8px;"><input style="clear:both" type="hidden" name="'+v["id"]+'" id="productSelector"><div  id="productidentifierHelp">'+CharmeModels.Context.renderCateogries()+'</div>'

			html += "<br>"
		return html