"use strict";

const DbMixin = require("../mixins/db.mixin");

/** @type {import('moleculer').ServiceSchema} Moleculer's Service Schema */
module.exports = {
    name: "products",
    // version: 1

    /**
     * Mixins. More info: https://moleculer.services/docs/0.14/services.html#Mixins
     */
    mixins: [DbMixin("products")],

    /**
     * Settings. More info: https://moleculer.services/docs/0.14/services.html#Settings
     * @type {import('moleculer-db').DbServiceSettings}
     */
    settings: {
        // Available fields in the responses
        fields: ["_id", "name", "quantity", "price"],

        // Validator for the `create` & `insert` actions.
        entityValidator: {
            name: "string|min:3",
            price: "number|positive",
        },

        // GraphQL Schema definition
        graphql: {
            type: `
                """
                This type describes a Product entity.
                """			
                type Product {
                    _id: String!
                    name: String!
                    quantity: Int!
                    price: Int!
                }

				"""
				This type describes Produce service Response
				"""
				type Response {
                    rows: [Product]!
                    total: Int!
                    page: Int!
                    pageSize: Int!
					totalPages: Int!
                }

				"""
                This type describes input for insert action.
                """	
				input ProductInput {
                    name: String!
                    quantity: Int
                    price: Int!
				}
            `,
        },
    },

    /**
     * Action Hooks. More info: https://moleculer.services/docs/0.14/actions.html#Action-hooks
     */
    hooks: {
        before: {
            /**
             * Register a before hook for the `create` action.
             * It sets a default value for the quantity field.
             *
             * @param {import('moleculer').Context<{quantity: Number}>} ctx
             */
            create(ctx) {
                ctx.params.quantity = 0;
            },
        },
    },

    /**
	 * Actions. More info: https://moleculer.services/docs/0.14/actions.html
	 */
    actions: {
        /**
         * The "moleculer-db" mixin registers the following actions:
         *  - list
         *  - find
         *  - count
         *  - create
         *  - insert
         *  - update
         *  - remove
         */

        list: {
            graphql: {
                query: "list: Response",
            },
        },
        find: {
            graphql: {
                query: "find: [Product]!",
            },
        },
        count: {
            graphql: {
                query: "count: Int!",
            },
        },
        create: {
            graphql: {
                mutation: "create(name: String!, quantity: Int, price: Int): Product!",
            },
        },
        insert: {
            graphql: {
                mutation: "insert(entity: ProductInput!): Product!",
            },
        },
        update: {
            graphql: {
                mutation: "update(id: String!, name: String, quantity: Int, price: Int): Product!",
            },
        },
        remove: {
            graphql: {
                mutation: "remove(id: String!): Int!",
            },
        },

        // --- ADDITIONAL ACTIONS ---

        /**
         * Increase the quantity of the product item.
         */
        increaseQuantity: {
            rest: "PUT /:id/quantity/increase",
            params: {
                id: "string",
                value: "number|integer|positive",
            },
            graphql: {
                mutation: "increaseQuantity(id: String!, value: Int!): Product",
            },
            /** @param {import('moleculer').Context<{id: String, value: Number}>} ctx */
            async handler(ctx) {
                const doc = await this.adapter.updateById(ctx.params.id, {
                    $inc: { quantity: ctx.params.value },
                });
                const json = await this.transformDocuments(ctx, ctx.params, doc);
                await this.entityChanged("updated", json, ctx);

                return json;
            },
        },

        /**
         * Decrease the quantity of the product item.
         */
        decreaseQuantity: {
            rest: "PUT /:id/quantity/decrease",
            params: {
                id: "string",
                value: "number|integer|positive",
            },
            graphql: {
                mutation: "decreaseQuantity(id: String!, value: Int!): Product",
            },
            /** @param {import('moleculer').Context<{id: String, value: Number}>} ctx */
            async handler(ctx) {
                const doc = await this.adapter.updateById(ctx.params.id, {
                    $inc: { quantity: -ctx.params.value },
                });
                const json = await this.transformDocuments(ctx, ctx.params, doc);
                await this.entityChanged("updated", json, ctx);

                if (json.quantity === 0) {
                    this.logger.info(`Stock of ${json.name} depleted... Ordering more`);
                    // Emit a persistent event to order more products
                    // inventory.service will handle this event
                    this.broker.sendToChannel("order.more", json);
                }

                return json;
            },
        },
    },

    /**
     * Methods. More info: https://moleculer.services/docs/0.14/services.html#Methods
     */
    methods: {
        /**
         * Loading sample data to the collection.
         * It is called in the DB.mixin after the database
         * connection establishing & the collection is empty.
         */
        async seedDB() {
            await this.adapter.insertMany([
                { name: "Samsung Galaxy S10 Plus", quantity: 10, price: 704 },
                { name: "iPhone 11 Pro", quantity: 25, price: 999 },
                { name: "Huawei P30 Pro", quantity: 15, price: 679 },
            ]);
        },
    },

    /**
     * Fired after database connection establishing.
     */
    async afterConnected() {
        // await this.adapter.collection.createIndex({ name: 1 });
    },
};
