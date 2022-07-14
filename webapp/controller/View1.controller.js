sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"./Client"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller,JSONModel,Client) {
		"use strict";

		return Controller.extend("books.books.controller.View1", {
			onInit: function () {
				this.getBooks();
			},

			jsonFill: function(aResults) {
				//copy the data
				var jsonData = {
					booksList: aResults
				}
				var jsonModel = new JSONModel(jsonData);
				this.getView().setModel(jsonModel,"local");

				this.byId("baseTable").getBinding("items");
			},

			onRefresh: function() {
				this.getBooks();
			},

			getBooks: function() {
				this.getView().setBusy(true);
				//this.jsonFill(this.mockBooks);

				Client.get().then(
					(result)=>{
						this.getView().setBusy(false);
						this.jsonFill(result);
					}
				);
			},

			onInsert: function() {
				let oView = this.getView();

				let oBook = {
					isbn: oView.byId("isbn").getValue(),
					title: oView.byId("title").getValue(),
					author: oView.byId("author").getValue()
				}

				let _resolve = (result)=>{
					console.log("Inserido");

					this.onRefresh();

					let oView = this.getView();

					["isbn","title","author"].map((field)=>{
						oView.byId(field).setValue("");
					});
				}

				this.getView().setBusy(true);
				Client.post(oBook).then(_resolve.bind(this));	
			},

			onRemove: function() {
				let oView = this.getView();
				let oModel = oView.getModel("local");
				let oTable = oView.byId("baseTable");
				let selItems = oTable.getSelectedItems();

				let _resolve = (result)=>{
					console.log("Removido");

					this.onRefresh();
				}

				for(var i=0;i<selItems.length;i++) {		
					let row = selItems[i];
					let sBasePath = row.getBindingContextPath();
					let base = oModel.getProperty(sBasePath);
					this.getView().setBusy(true);
					Client.delete(base.isbn).then(_resolve.bind(this));
				}		

			},

			mockBooks: [
				{
					"isbn":"1",
					"title":"mock title hum",
					"author":"mock author hum"
				},
				{
					"isbn":"2",
					"title":"mock title dois",
					"author":"mock author dois"
				}
			]
		});
	});
