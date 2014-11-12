###
	Name:
	charme_schema

	Info:
	Global Context Definitions

###

@charme_schema_categories = [
	{
		id: 'el'
		name: 'Electronics and Hardware'
		sub: [
			{
				id: 'el_smartphone'
				name: 'Smartphones and Mobile Phones'
			},
			{
				id: 'el_smartphone'
				name: 'PC Components'
				sub: [
					{
						id: 'el_pc_cpu'
						name: 'CPU'
					},
					{
						id: 'el_pc_ram'
						name: 'RAM'
					},
					{
						id: 'el_pc_mainbaord'
						name: 'Mainboard'
					},
					{
						id: 'el_pc_hdd'
						name: 'Harddisk'
					}
				]

			}
		]

	},
	{
		id: 'cl'
		name: 'Clothing'
		sub: [
			{
				id: 'cl_shoes'
				name: 'Shoes'
			},
			{
				id: 'cl_hats'
				name: 'Hats'
			}
		]

	},
	{
		id: 'fo'
		name: 'Food and drinks'
		sub: [
			{
				id: 'fo_drink'
				name: 'Drinks'
				sub: [
					{
						id: 'fo_drink_lemonade'
						name: 'Lemonade'
					},
					{
						id: 'fo_drink_milk'
						name: 'Milk'
					}
					,
					{
						id: 'fo_drink_beer'
						name: 'Beer'
					},
					{
						id: 'fo_drink_water'
						name: 'Water'
					}
				]


			},
			{
				id: 'fo_meal'
				name: 'Meal'
			}
		]

	}

]
@charme_schema = 
	global: 
		'offer': {
			attributes: [
	
				{
					id: "price"
					type: "moneyamount"
					name: "Price:"
				},
				{
					id: "currency"
					type: "currency"
					name: "Currency:"
				}
				{
					id: "sell"
					type: "productcategory"
					name: "Product Identifier:"
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
					type: "rating"
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


