"use strict";

/** @type {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema */
module.exports = {
	name: "greeter",

	/**
	 * Settings
	 */
	settings: {},

	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Actions
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
	 * Events
	 */
	events: {},

	/**
	 * Methods
	 */
	methods: {},

	/**
	 * Service created lifecycle event handler
	 * @this {import('moleculer').Service}
	 */
	created() {},

	/**
	 * Service started lifecycle event handler
	 * @this {import('moleculer').Service}
	 */
	async started() {},

	/**
	 * Service stopped lifecycle event handler
	 * @this {import('moleculer').Service}
	 */
	async stopped() {},
};
