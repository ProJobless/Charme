class CharmeModels.Context
	@setupLocationSelector: () ->

		updateDataTag = ->
		  # This function updates the data-xyz attributes which are stored in database later
		  $('.locationContainer option:selected').each ->
		    $(this).parent().data 'storage', $(this).data('json')
		    return
		  return

		updateDataTag()
		$('.locationContainer').change ->
		  updateDataTag()
		  return


	@getTimeHours: () ->
		str = ""
		str += "<option value=''>-</option>"

		for k in [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]
			str += "<option>"+k+"</option>"
		return str

	@getTimeMinutes: () ->
		str = ""
		str += "<option value=''>-</option>"
		for k in [0,15,30,45]
			str += "<option>"+k+"</option>"
		return str

	@getRad: () ->
		str = ""
		for k in [1,3,5,10,25,50]
			str += "<option value='"+k+"'>"+k+"km</option>"
		return str

	@getActivities: () ->
		str = ""
		for k in ["House Party",  "Watching Soccer on TV", "Making Music", "Baseball", "Volleyball", "Table Tennis", "Soccer"]
			str += "<option vale='"+k+"'>"+k+"</option>"
		return str

	@getContextChoices:() ->
		all = []
		for k,schema of charme_schema.global
			all.push  {id: k, name: schema.name}

		return all

	@getFilters: (filterId) ->

		all = []
		for k,schema of charme_schema.global
		 	for attribute in schema.attributes
				 if attribute.filter?
					 all.push {contextId: k, attribute: attribute}

		return all

	@getContextFloats: (type) ->

    all = []
    for attribute in charme_schema.global[type].attributes
       if attribute.type=="moneyamount"
         all.push attribute.id

    return all

	@getContextIntegers: (type) ->

    all = []
    for attribute in charme_schema.global[type].attributes
       if attribute.type=="int"
         all.push attribute.id

    return all

	@getServices: () ->
		str = ""
		for v in charme_schema_services
			str += "<option value='"+v+"'>"+charme_schema_services_names[v]+"</option>"
		return str

	@getDateSelector: (name) ->
		str = ""
		str += "<select  name='"+name+"_day'>"
		str += "<option value=''>-</option>"
		for k in [1...31] by 1
			# TODO: Make today selected
			str += "<option vale='"+k+"'>"+k+"</option>"
		str += "</select>"

		str += "<select  name='"+name+"_month'>"
		str += "<option value=''>-</option>"
		for k in [1...12] by 1
			str += "<option vale='"+k+"'>"+k+"</option>"
		str += "</select>"

		str += "<select name='"+name+"_year'>"
		str += "<option value=''>-</option>"
		for k in ["2015", "2016", "2017", "2018", "2019", "2020"]
			str += "<option vale='"+k+"'>"+k+"</option>"
		str += "</select>"

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
		for subnode in node
			if subnode.id == parentId
				return subnode.sub
			else if subnode.sub? # ? checks if variable exists
				retval =  this.searchRecursiveId(subnode.sub, parentId, (level+1))

				return retval if retval?

	@catById: (node, id) ->
		retArray = []
		for subnode in node

			if subnode.id == id
				return subnode.name;
			else if subnode.sub?
				subres = this.catById(subnode.sub, id)
				retArray = retArray.concat(subres)

		return retArray

	@searchRecursiveText: (node, query) ->
		retArray = []
		for subnode in node


			if subnode.name.toLowerCase().indexOf(query.toLowerCase()) >= 0
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



		for item in parent
			if str != ""
				str+=", "
			if item.sub?
				str += "<a class='selectCategory' data-cat='"+item.id+"'>"+item.name+"</a>"
			else
				str += "<a class='selectCategory' data-final='"+item.id+"'>"+item.name+"</a>"

		return str

 	#
	# Called  after selecting a product category
	#

	@registerEventProductClick: (elementHelp) ->
		$(elementHelp).parent().find('.productidentifierHelp a').unbind('click').click ->
			if $(this).data('cat')?
				elementSearch = $(elementHelp).prev().prev()
				$(elementHelp).html CharmeModels.Context.renderCateogries($(this).data('cat'))
				CharmeModels.Context.registerEventProductClick(elementHelp)
			else
				elementSearch = $(elementHelp).prev().prev()
				# No subcateogies exist anymore, so save selection!
				$(elementHelp).html '<b>' + $(this).text() + '</b> - <a class=\'resetProduct\'>Select another Category</a>'
				$(elementSearch).next().val $(this).data('final')

				$(elementHelp).find('.resetProduct').click ->
					$(".productSelector").val("");
					$(elementSearch).show().focus().select()
					$(elementHelp).html CharmeModels.Context.renderCateogries(null)
					CharmeModels.Context.registerEventProductClick(elementHelp)
					return

		  $(elementSearch).hide()
		  return
		return

 	#
	# Called for setting up the product category selector
	#

	@initProductSelector: () ->

		$(".productidentifierHelp").each ->
			CharmeModels.Context.registerEventProductClick(this)
			return

		$('.productidentifierSearch').bind 'propertychange onkeydown click keyup input paste', ->
			elementHelp = $(this).next().next()
			$(elementHelp).html CharmeModels.Context.renderCateogries(null, $(this).val())
			CharmeModels.Context.registerEventProductClick(elementHelp)
			return
		return

	@getProductSelector: (name, requiredStr) ->
		return '<input placeholder="Search..." class="productidentifierSearch box" type="text" style="margin-bottom:8px;"><input '+requiredStr+' data-requiredref=".productidentifierSearch" style="clear:both" data-type="exact" type="hidden" name="'+name+'" class="productSelector"><div  class="productidentifierHelp">'+CharmeModels.Context.renderCateogries()+'</div>'
	#@getTopCategories: () ->
	#	str = ""
	#	for k in ["EUR", "USD", "BTC", "YEN"]
	#		str += "<option>"+k+"</option>"
	#	return str
	@getForm: (fieldId) ->
	# the event handlers are set in page_modules.js, function addContext
		html = "<div id='errorRequiredContextField' class='error hidden'>Please fill out all required fields.</div>"
		hasOptional = false
		for k,v of charme_schema.global[fieldId].attributes

			if (v["optional"])
				hasOptional=true
				html += "<div class='optionalproperty' style='display:none'>"
			else
				html += "<div>"

			html += "<div style='padding:8px 0px; font-weight:bold;'>"+v["name"]+"</div>"

			requiredStr = ""
			if (v["required"]? && v["required"] == true)
				requiredStr = " required='true' "

			if v["type"] == "area"
				html += "<select  " + requiredStr + " name='"+v["id"]+"' class='locationContainer'></select> <a class='but_addLocation'>Add Location</a> Radius: <select name='"+v["id"]+"_radius'>"+CharmeModels.Context.getRad()+"</select>"
			else if v["type"] == "location"
				html += "<select  " + requiredStr + "  name='"+v["id"]+"' class='locationContainer'><option value=''>-</option></select> <a class='but_addLocation'>Add Location</a>"
			else if v["type"] == "optionallocation"
				html += "<select  " + requiredStr + "  name='"+v["id"]+"' class='locationContainer'><option value='0' class='nolocation'>No location</option></select> <a class='but_addLocation'>Add Location</a>"
			else if v["type"] == "string"
				html += "<input  name='"+v["id"]+"' type='text' class='box'>"
			else if v["type"] == "entity"
				html += "<input  name='"+v["id"]+"' type='text' class='box'>"
			else if v["type"] == "rating"
				html += '<select name="'+v["id"]+'">'+CharmeModels.Context.getRating()+'</select> (5 is best)'
			else if v["type"] == "datetime"
				html += CharmeModels.Context.getDateSelector(v["id"])+' <select name="'+v["id"]+'_hour">'+CharmeModels.Context.getTimeHours()+'</select>:<select  name="'+v["id"]+'_minute">'+CharmeModels.Context.getTimeMinutes()+'</select>'
			else if v["type"] == "int"
				html += "<input name='"+v["id"]+"' type='text' class='box'>"
			else if v["type"] == "moneyamount"
				html += "<input " + requiredStr + "  type='number' min='1' step='any' name='"+v["id"]+"'  class='box'>"
			else if v["type"] == "currency"
				html += '<select name="'+v["id"]+'">'+CharmeModels.Context.getCurrencies()+'</select>'
			else if v["type"] == "activity"
				html += '<select name="'+v["id"]+'">'+CharmeModels.Context.getActivities()+'</select>'

			else if v["type"] == "service"
				html += '<select  ' + requiredStr + ' name="'+v["id"]+'"><option value="">-</option>'+CharmeModels.Context.getServices()+'</select>'

			else if v["type"] == "productcategory"
				html += CharmeModels.Context.getProductSelector(v["id"], requiredStr)

			html += "</div>"

		if hasOptional
			html += "<div style='padding-top:32px; padding-bottom:16px;'><a id='advancedproperties'>Show Advanced Properties</a></div>";


		return html
