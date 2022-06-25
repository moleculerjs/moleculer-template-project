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
     */
    settings: {
        // Available fields in the responses
        // More info: https://github.com/moleculerjs/database/tree/master/docs#fields
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
				This type describes response to list action
				"""
				type ProductListResponse {
                    rows: [Product]!
                    total: Int!
                    page: Int!
                    pageSize: Int!
					totalPages: Int!
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
             * @param {import('moleculer').Context<{name: String, value: Number, quantity?: Number}>} ctx
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
         * @moleculer/database mixin registers the following actions:
         * - count
         * - create
         * - find
         * - get
         * - list
         * - remove
         * - update
         *
         * More info: https://github.com/moleculerjs/database
         */

        //  Add GraphQL schema to default actions
        count: {
            graphql: {
                query: "countProducts(search: String, searchFields: [String], scope: [String], query: JSON): Int!",
            },
        },
        create: {
            graphql: {
                mutation: "createProduct(name: String!, quantity: Int, price: Int): Product!",
            },
        },
        find: {
            graphql: {
                query: "findProducts(limit: Int, offset: Int, fields: [String], sort: [String], search: String, searchFields: [String], scope: [String], query: JSON): [Product]!",
            },
        },
        get: {
            graphql: {
                query: "productById(id: String!, fields: [String], scopes: [String]): Product",
            },
        },
        list: {
            graphql: {
                query: "listProducts(page: Int, pageSize: Int, fields: [String], sort: [String], search: String, searchFields: [String], scope: [String], query: JSON): ProductListResponse",
            },
        },
        remove: {
            graphql: {
                mutation: "removeProduct(id: String!): String!",
            },
        },
        update: {
            graphql: {
                mutation:
                    "updateProduct(id: String!, name: String, quantity: Int, price: Int): Product!",
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
                /** @type {ProductDBEntry} */
                const dbEntry = await adapter.findById(ctx.params.id);

                // Compute new quantity
                const newQuantity = dbEntry.quantity + ctx.params.value;

                // Update DB entry. Will emit an event to clear the cache
                /** @type {ProductDBEntry} */
                const doc = await this.updateEntity(ctx, {
                    id: ctx.params.id,
                    quantity: newQuantity,
                });

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
                /** @type {ProductDBEntry} */
                const dbEntry = await adapter.findById(ctx.params.id);

                // Compute new quantity
                const newQuantity = dbEntry.quantity - ctx.params.value;

                if (newQuantity < 0) throw new Error("Quantity cannot be negative");

                // Update DB entry. Will emit an event to clear the cache
                /** @type {ProductDBEntry} */
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
};

/**
 * @typedef ProductDBEntry DB Entry
 * @property {String} id Product ID
 * @property {String} name name of the product
 * @property {Number} quantity product quantity
 * @property {Number} price price per unit
 */