###
	Name:
	charme_schema

	Info:
	Global Context Definitions

###
@charme_schema_services = [
	"software"
	"music"
	"electronic"
	"clean"
	"artist"
	"trainer"
]

# To be exchanged by translation later on
@charme_schema_services_names = {
	"software": "Software Engineer"
	"music": "Musician"
	"electronic": "Electronic Engineer"
	"clean": "Room Cleaning"
	"artist": "Artist"
	"trainer": "Trainer"
}

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
			},
			{
				id: 'fo_snack'
				name: 'Sweets'

				sub: [
					{
						id: 'fo_snack_chocolate'
						name: 'Chocolate'
					}


				]


			}
		]

	}

]

@charme_schema =
	global:
		'move': {
			name: "Move from A to B"
			attributes: [
				{
					id: "startLocation"
					type: "location"
					name: "Start"
					filter: "location"
				},
				{
					id: "endLocation"
					type: "location"
					name: "Destination"
					filter: "location"
				},
				{
					id: "startTime"
					type: "datetime"
					name: "Start Time"
				},
				{
					id: "endTime"
					type: "datetime"
					name: "End Time"
				}
				{
					id: "seats"
					type: "int"
					name: "Seats"
					filter: "range"
				}
			]
		},

		'offer': {
			name: "Offer"
			attributes: [

				{
					id: "price"
					type: "moneyamount" #
					name: "Price"
					filter: "range"
				},
				{
					id: "currency"
					type: "currency"
					name: "Currency"
				}
				{
					id: "sell"
					type: "productcategory"
					name: "Product Identifier"
					filter: "exact"
				}
			]
		},



		'service': {
			name: "Service"
			attributes: [
				{
					id: "price"
					type: "moneyamount"
					name: "Price per hour "
				},
				{
					id: "currency"
					type: "currency"
					name: "Currency"
				},

				{
					id: "service"
					type: "service"
					name: "Typ"
				},
			]
		},

		'meal': {
			name: "Meal"
			attributes: [

				{
					id: "people"
					type: "int"
					name: "Number of People"
					filter: "range"
				}
				{
					id: "location"
					type: "optionallocation"
					name: "Location (optional)"
					filter: "location"
				},

			]
		},

		'activity': {
				name: "Activity"
				attributes: [

					{
						id: "location"
						type: "optionallocation"
						name: "Location (optional)"
						filter: "location"
					},
					{
						id: "activity"
						type: "activity"
						name: "Type:"
					},

				]
			},

		'review': {
			name: "Review"
			attributes: [

				{
					id: "target"
					type: "entity"
					name: "Entity"
				},
				{
					id: "rating"
					type: "rating"
					name: "Rating"
				}
			]
		},
		'publicevent': {
			name: "Event"
			attributes: [
				{
					id: "Title"
					type: "string"
					name: "Title:"
				},
				{
					id: "location"
					type: "location"
					name: "Location"
				},
				{
					id: "startTime"
					type: "datetime"
					name: "Start Time"
				},
				{
					id: "endTime"
					type: "datetime"
					name: "End Time"
				}
				{
					id: "audience"
					type: "int"
					name: "Guests"
				}
			]
		}
