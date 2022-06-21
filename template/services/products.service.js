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
        fields: {
            id: { type: "string", primaryKey: true, columnName: "_id" },
            name: { type: "string", required: true, min: 5 },
            quantity: { type: "number", required: false },
            price: { type: "number", required: false },
        },

        // GraphQL Schema definition of a Product
        graphql: {
            type: `
                """
                This type describes a Product entity.
                """			
                type Product {
                    id: String!
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
                if (!ctx.params.quantity) ctx.params.quantity = 0;
            },
        },
    },

    /**
     * Actions. More info: https://moleculer.services/docs/0.14/actions.html
     */
    actions: {
        /**
         * The "@moleculer/database" mixin registers the following actions:
         *  - list
         *  - find
         *  - count
         *  - create
         *  - update
         *  - remove
         *
         */

        //  Add GraphQL schema to default actions
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
        update: {
            graphql: {
                mutation: "update(id: String!, name: String, quantity: Int, price: Int): Product!",
            },
        },
        remove: {
            graphql: {
                mutation: "remove(id: String!): String!",
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
                // Get current quantity
                const adapter = await this.getAdapter(ctx);
                const dbEntry = await adapter.findById(ctx.params.id);

                // Compute new quantity
                const newQuantity = dbEntry.quantity + ctx.params.value;

                // Update DB entry
                const doc = await this.updateEntity(ctx, {
                    id: ctx.params.id,
                    quantity: newQuantity,
                });

                // Clear cache
                // await this.entityChanged("updated", doc, ctx);

                return doc;
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
                // Get current quantity
                const adapter = await this.getAdapter(ctx);
                const dbEntry = await adapter.findById(ctx.params.id);

                // Compute new quantity
                const newQuantity = dbEntry.quantity - ctx.params.value;

                if (newQuantity < 0) throw new Error("Quantity cannot be negative");

                // Update DB entry
                const doc = await this.updateEntity(ctx, {
                    id: ctx.params.id,
                    quantity: newQuantity,
                });

                if (doc.quantity === 0) {
                    this.logger.info(`Stock of ${doc.name} depleted... Ordering more`);
                    // Emit a persistent event to order more products
                    // inventory.service will handle this event
                    this.broker.sendToChannel("order.more", doc);
                }

                // Clear cache
                // await this.entityChanged("updated", doc, ctx);

                return doc;
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
         * @this {import('moleculer').Service}
         */
        async seedDB() {
            const adapter = await this.getAdapter();
            await adapter.insertMany([
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
