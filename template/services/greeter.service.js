"use strict";

/** @type {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema */
module.exports = {
	name: "greeter",

	/**
	 * Settings. More info: https://moleculer.services/docs/0.14/services.html#Settings
	 */
	settings: {},

	/**
	 * Dependencies. More info: https://moleculer.services/docs/0.14/services.html#Dependencies
	 */
	dependencies: [],

	/**
	 * Actions. More info: https://moleculer.services/docs/0.14/actions.html
	 */
	actions: {
		/**
		 * Say a 'Hello' action.
		 *
		 * @returns
		 */
		hello: {
			rest: {
				method: "GET",
				path: "/hello",
			},
			graphql: {
				query: "hello: String",
			},
			async handler() {
				return "Hello Moleculer";
			},
		},

		/**
		 * Welcome, a username
		 *
		 * @param {String} name - User name
		 */
		welcome: {
			rest: "/welcome",
			params: {
				name: "string",
			},
			graphql: {
				mutation: "welcome(name: String!): String",
			},
			/** @param {import('moleculer').Context<{name: String}>} ctx */
			async handler(ctx) {
				return `Welcome, ${ctx.params.name}`;
			},
		},
	},

	/**
	 * Events. More info: https://moleculer.services/docs/0.14/events.html
	 */
	events: {},

	/**
     * Methods. More info: https://moleculer.services/docs/0.14/services.html#Methods
     */
	methods: {},

	/**
	 * Service created lifecycle event handler
	 * More info: https://moleculer.services/docs/0.14/lifecycle.html#created-event-handler
	 * @this {import('moleculer').Service}
	 */
	created() {},

	/**
	 * Service merged lifecycle event handler
	 * More info: https://moleculer.services/docs/0.14/lifecycle.html#merged-event-handler
	 * @this {import('moleculer').Service}
	 */
	merged() {},

	/**
	 * Service started lifecycle event handler
	 * More info: https://moleculer.services/docs/0.14/lifecycle.html#started-event-handler
	 * @this {import('moleculer').Service}
	 */
	async started() {},

	/**
	 * Service stopped lifecycle event handler
	 * More info: https://moleculer.services/docs/0.14/lifecycle.html#stopped-event-handler
	 * @this {import('moleculer').Service}
	 */
	async stopped() {},
};
