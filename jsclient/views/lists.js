
/*

	The List Page views

*/

var view_lists = view_page.extend({

	options: {
		template: 'profile',
		optionbar: '<a style="background-position: -60px 0px;" data-bgpos="-60" id="addListButton" class="actionButton"></a>'
	},
	viewId: 'listView',

	getData: function() {
		var templateData = {
			globaldata: []
		};
		templateData["listitems"] = apl_postloader_getLists();
		return templateData;
	},
	postRender: function() {

		// Problem: if opening another list form sidebar event gets unregistred.
		$('#addListButton').click(function() {
			var n = prompt("Enter a Name", "New List");

			// TODO: apl request to get id...

			apl_request({
				"requests": [{
						"id": "lists_add",
						"name": n
					}

				]
			}, function(d1) {

				apl_postloader_lists.items.push({
					'_id': {
						'$id': d1.lists_add.id.$id
					},
					name: n
				});

				// Add item to Sidebar
				$(".sbBeta .subCont").append('<li id="nav_' + d1.lists_add.id.$id + '"><a href="#lists/' + d1.lists_add.id.$id + '">' + n + '</a></li>');

				//

			});


		});
	}

});


var view_lists_subpage = view_subpage.extend({
	options: {
		template: 'lists_'
	},
	events: {

		"click  #but_renameList": "renameList",
		"click  #but_deleteList": "deleteList",

	},
	postRender: function() {
		// Hide Edit/delete button when showing all lists
		if (this.options.listId == "") {
			$('#listOptions').hide();

		}
	},
	renameList: function() {
		var that = this;
		$.get("templates/box_editlist.html", function(d) {
			var template = _.template(d, {});

			ui_showBox(template, function() {
				var oldName = $("#nav_" + that.options.listId).text();
				$("#inp_listNameEdit").val(oldName).focus().select();

				$('#but_editListOk').click(function() {
					// Notify user server about the changed name
					apl_request({
						"requests": [{
								"id": "lists_rename",
								"listId": that.options.listId,
								"newName": $("#inp_listNameEdit").val()
							}

						]
					}, function() {

						// Update sidebar item with new Text
						$("#nav_" + that.options.listId + " a").text($("#inp_listNameEdit").val());

						// Update Name
						apl_postloader_editList(that.options.listId, $("#inp_listNameEdit").val());

						// Close box dialog
						ui_closeBox();
					});



				});
			});
		});
	},
	deleteList: function() {
		var that = this;
		$.get("templates/box_deletelist.html", function(d) {
			var template = _.template(d, {});

			ui_showBox(template, function() {
				$("#but_deleteList").select().focus();
				$('#but_deleteList').click(function() {
					apl_request({
						"requests": [{
								"id": "lists_delete",
								"listId": that.options.listId
							}

						]
					}, function(d) {
						ui_closeBox();
						$("#nav_" + that.options.listId).remove();
						$("#page").text("");

						// Delete from script cache:
						apl_postloader_deleteList(that.options.listId);


					});

				});
			});
		});

	},
	getData: function() {
		return this.options.data;
	},


});
