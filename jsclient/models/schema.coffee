###
	Name:
	charme_schema

	Info:
	Global Context Definitions

###


@charme_schema = 
	global: 
		'offer': {
			attributes: [
				{
					id: "Title"
					type: "string"
					name: "Title:"
				},			
				{
					id: "price"
					type: "moneyamount"
					name: "Price:"
				},
				{
					id: "Curreny:"
					type: "currency"
					name: "Currency:"
				}
				{
					id: "Sell:"
					type: "productcategory"
					name: "Category:"
				}
			]
		},
		'review': {
			attributes: [
				{
					id: "title"
					type: "string"
					name: "Title:"
				},
				{
					id: "target"
					type: "entity"
					name: "Entity:"
				},		
				{
					id: "rating"
					type: "5stars"
					name: "Rating:"
				}
			]
		},
		'publicevent': {
			attributes: [
				{
					id: "Title"
					type: "string"
					name: "Title:"
				},			
				{
					id: "location"
					type: "location"
					name: "Location:"
				},
				{
					id: "startTime"
					type: "datetime"
					name: "Start Time:"
				},
				{
					id: "endTime"
					type: "datetime"
					name: "End Time:"
				}
				{
					id: "audience"
					type: "int"
					name: "Guests:"
				}
			]
		},
		'move': {
			attributes: [
				{
					id: "startLocation"
					type: "area"
					name: "Start:"
				},
				{
					id: "endLocation"
					type: "location"
					name: "Destination:"
				},
				{
					id: "startTime"
					type: "datetime"
					name: "Start Time:"
				},
				{
					id: "endTime"
					type: "datetime"
					name: "End Time:"
				}
				{
					id: "seats"
					type: "int"
					name: "Seats"
				}
			]
		}


