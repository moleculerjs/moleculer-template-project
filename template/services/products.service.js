"use strict";

const DbMixin = require("../mixins/db.mixin");

module.exports = {
	name: "products",
	// version: 1

	mixins: [DbMixin("products")],

	settings: {
		// Available fields in the responses
		fields: [
			"_id",
			"name",
			"quantity",
			"price"
		]
	},
	
	actions: {
		/**
		 * The "moleculer-db" mixin registers the following actions:
		 *  - list
		 *  - find
		 *  - create
		 *  - insert
		 *  - update
		 *  - remove
		 */

		// --- ADDITIONAL ACTIONS ---

		/**
		 * Increase the quantity of the product item.
		 */
		increaseQuantity: {
			rest: "POST /:id/increase-quantity",
			params: {
				id: "string",
				value: "number|integer|positive"
			},
			async handler(ctx) {
				const doc = await this.adapter.updateById(ctx.params.id, { $inc: { quantity: ctx.params.value } });
				const json = await this.transformDocuments(ctx, params, doc);
				await this.entityChanged("updated", json, ctx);

				return json;
			}
		},

		/**
		 * Decrease the quantity of the product item.
		 */
		decreaseQuantity: {
			rest: "POST /:id/decrease-quantity",
			params: {
				id: "string",
				value: "number|integer|positive"
			},
			async handler(ctx) {
				const doc = await this.adapter.updateById(ctx.params.id, { $dec: { quantity: ctx.params.value } });
				const json = await this.transformDocuments(ctx, params, doc);
				await this.entityChanged("updated", json, ctx);

				return json;
			}
		}
	},

	methods: {
		/**
		 * Loading sample data to the collection.
		 */
		async seedDB() {
			await this.adapter.insertMany([
				{ name: "Samsung Galaxy S10 Plus", quantity: 10, price: 704 },
				{ name: "iPhone 11 Pro", quantity: 25, price: 999 },
				{ name: "Huawei P30 Pro", quantity: 15, price: 679 },
			]);
		}
	},

	async afterConnected() {
		// await this.adapter.collection.createIndex({ name: 1 });
	}    
};