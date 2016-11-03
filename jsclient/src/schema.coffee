###
	Name:
	charme_schema

	Info:
	Global Context Definitions

###
@charme_schema_services = [
	"carrepair"
	"pcrepair"
	"electronic"
	"engineer"
	"electrician"
	"clean"
	"assembly"
	"music"
	"musicteach"
	"plumber"
	"trainer"
	"software"
	"trainer"
]

# To be exchanged by translation later on
@charme_schema_services_names = {
	"carrepair": "Car Repair"
	"pcrepair": "Computer Repair"
	"electronic": "Electronic Engineer"
	"engineer": "Engineer"
	"electrician": "Electrician"
	"clean": "Home Cleaning"
	"assembly": "Indoor Assembly"
	"music": "Musician"
	"musicteach": "Music Teacher"
	"plumber": "Plumber"
	"trainer": "Painting"
	"software": "Software Engineer"
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
				id: 'el_tv'
				name: 'Television'
			},
			{
				id: 'el_car'
				name: 'Car Electronics'
			},
			{
				id: 'el_pc'
				name: 'Laptops and Computers'
			},
			{
				id: 'el_screens'
				name: 'Screens'
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
					},
					{
						id: 'el_pc_print'
						name: 'Printers'
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
		id: 'fur'
		name: 'Furniture'
		sub: [
			{
				id: 'fur_deco'
				name: 'Decoration'
			},
			{
				id: 'fur_tables'
				name: 'Tables'
			}
		]

	},
	{
		id: 'bo'
		name: 'Books and Magazines'
		sub: [
			{
				id: 'bo_nonfiction'
				name: 'Nonfiction Books'
				sub: [
					{
						id: 'cl_nonfiction_engineer'
						name: 'Engineering Books'
					},
					{
						id: 'cl_nonfiction_cs'
						name: 'Computer Science Books'
					},
					{
						id: 'cl_nonfiction_medical'
						name: 'Medical Books'
					},
					{
						id: 'cl_nonfiction_law'
						name: 'Law Books'
					}
				]
			},

			{
				id: 'bo_photo'
				name: 'Photography Books'
			},
			{
				id: 'bo_bio'
				name: 'Biographies'
			},
			{
				id: 'bo_child'
				name: 'Books for Children'
			},
			{
				id: 'bo_cook'
				name: 'Cookbooks'
			}
			{
				id: 'bo_scifi'
				name: 'Sci-Fi and Fantasy Books'
			},
			{
				id: 'bo_teen'
				name: 'Books for Teenage and Young Adult'
			},
			{
				id: 'bo_lit'
				name: 'Literature and Fiction Books'
			},
			{
				id: 'bo_rom'
				name: 'Romance Books'
			},

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
					required: true
					filter: "location"

				},
				{
					id: "endLocation"
					type: "location"
					name: "Destination"
					required: true
					filter: "location"
				},
				{
					id: "startTime"
					type: "datetime"
					name: "Start Time"
					optional: true
				},
				{
					id: "endTime"
					type: "datetime"
					name: "End Time"
					optional: true
				}
				{
					id: "seats"
					type: "int"
					name: "Seats"
					filter: "range"
					optional: true
				}
			]
		},


		'lend': {
			name: "Lend"
			attributes: [

				{
					id: "price"
					type: "moneyamount" #
					name: "Price per day"
					required: true
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
					required: true
					name: "Product Identifier"
					filter: "exact"
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
					required: true
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
					required: true
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
					required: true
				},
				{
					id: "currency"
					type: "currency"
					name: "Currency"
				},

				{
					id: "service"
					type: "service"
					required: true
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
