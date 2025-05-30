"use strict";

const { Service: DbService } = require("@moleculer/database");

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = function (collection) {
	const cacheCleanEventName = `cache.clean.${collection}`;

	/** @type {ServiceSchema} */
	const schema = {
		/**
		 * Mixins. More info: https://moleculer.services/docs/0.15/services.html#Mixins
		 */
		mixins: [
			// @moleculer/database config: More info: https://github.com/moleculerjs/database
			DbService({
				adapter:
					// In production use MongoDB
					process.env.NODE_ENV === "production"
						? {
							type: "MongoDB",
							options: {
								uri: process.env.MONGO_URI,
							},
						}
						: {
							type: "NeDB",
							options:
								// In unit/integration tests use in-memory DB. Jest sets the NODE_ENV automatically
								// During dev use file storage
								process.env.NODE_ENV === "test"
									? {
										neDB: {
											inMemoryOnly: true,
										},
									}
									: `./data/${collection}.db`,
						},
				strict: false,
			}),
		],

		/**
		 * Events. More info: https://moleculer.services/docs/0.15/events.html
		 */
		events: {
			/**
			 * Subscribe to the cache clean event. If it's triggered
			 * clean the cache entries for this service.
			 *
			 * @param {Context} ctx
			 */
			async [cacheCleanEventName]() {
				if (this.broker.cacher) {
					await this.broker.cacher.clean(`${this.fullName}.*`);
				}
			},
		},

		/**
		 * Methods. More info: https://moleculer.services/docs/0.15/services.html#Methods
		 */
		methods: {
			/**
			 * Send a cache clearing event when an entity changed.
			 *
			 * @param {String} type
			 * @param {object} data
			 * @param {object} oldData
			 * @param {Context} ctx
			 * @param {object} opts
			 */
			async entityChanged(type, data, oldData, ctx, opts) {
				ctx.broadcast(cacheCleanEventName);
			},
		},

		/**
		 * Service started lifecycle event handler
		 * More info: https://moleculer.services/docs/0.15/lifecycle.html#started-event-handler
		 * @this {import('moleculer').Service}
		 */
		async started() {
			// Check the count of items in the DB. If it's empty,
			// call the `seedDB` method of the service.
			if (this.seedDB) {
				const adapter = await this.getAdapter();
				const count = await adapter.count();
				if (count == 0) {
					this.logger.info(
						`The '${collection}' collection is empty. Seeding the collection...`
					);
					await this.seedDB();
					this.logger.info("Seeding is done. Number of records:", await adapter.count());
				}
			}
		},
	};

	return schema;
};
