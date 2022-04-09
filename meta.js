"use strict";

module.exports = function (values) {
    return {
        /** @type {Array<import('inquirer').Question>} */
        questions: [
            {
                type: "confirm",
                name: "apiGW",
                message: "Add HTTP API Gateway (moleculer-web) service?",
                default: true,
            },
            {
                type: "confirm",
                name: "apiGQL",
                message: "Add GraphQL Gateway?",
                default: true,
            },
            {
                type: "confirm",
                name: "apiIO",
                message: "Add Socket.Io Gateway?",
                default: true,
            },
            {
                type: "confirm",
                name: "needTransporter",
                message: "Would you like to communicate with other nodes?",
                default: true,
            },
            {
                type: "list",
                name: "transporter",
                message: "Select a transporter",
                choices: [
                    { name: "NATS (recommended)", value: "NATS" },
                    { name: "Redis", value: "Redis" },
                    { name: "MQTT", value: "MQTT" },
                    { name: "AMQP", value: "AMQP" },
                    { name: "TCP", value: "TCP" },
                    { name: "NATS Streaming", value: "STAN" },
                    { name: "Kafka", value: "Kafka" },
                    { name: "AMQP 1.0 (experimental)", value: "AMQP10" },
                ],
                when(answers) {
                    return answers.needTransporter;
                },
                default: "NATS",
            },
            {
                type: "confirm",
                name: "needCacher",
                message: "Would you like to use cache?",
                default: false,
            },
            {
                type: "list",
                name: "cacher",
                message: "Select a cacher solution",
                choices: [
                    { name: "Memory", value: "Memory" },
                    { name: "Redis", value: "Redis" },
                ],
                when(answers) {
                    return answers.needCacher;
                },
                default: "Memory",
            },
            {
                type: "confirm",
                name: "dbService",
                message: "Add DB sample service?",
                default: true,
            },
            {
                type: "confirm",
                name: "needChannels",
                message: "Add Moleculer-Channels middleware?",
                when(answers) {
                    return answers.dbService;
                },
                default: false,
            },
            {
                type: "list",
                name: "channels",
                message: "Select a Channels",
                choices: [
                    { name: "NATS", value: "NATS" },
                    { name: "Redis", value: "Redis" },
                    { name: "AMQP", value: "AMQP" },
                    { name: "Kafka", value: "Kafka" },
                ],
                when(answers) {
                    return answers.needChannels;
                },
                default: "NATS",
            },
            {
                type: "confirm",
                name: "metrics",
                message: "Would you like to enable metrics?",
                default: true,
            },
            {
                type: "confirm",
                name: "tracing",
                message: "Would you like to enable tracing?",
                default: true,
            },
            {
                type: "confirm",
                name: "docker",
                message: "Add Docker & Kubernetes sample files?",
                default: true,
            },
            {
                type: "confirm",
                name: "lint",
                message: "Use ESLint to lint your code?",
                default: true,
            },
        ],

        metalsmith: {
            before(metalsmith) {
                /**
                 * @typedef Metadata
                 * @property {Boolean} apiGW
                 * @property {Boolean} apiGQL
                 * @property {Boolean} apiIO
                 * @property {Boolean} needTransporter
                 * @property {String} transporter
                 * @property {Boolean} needCacher
                 * @property {Boolean} dbService
                 * @property {Boolean} needChannels
                 * @property {String} channels
                 * @property {Boolean} metrics
                 * @property {Boolean} tracing
                 * @property {Boolean} docker
                 * @property {Boolean} lint
                 */

                /** @type {Metadata} */
                const data = metalsmith.metadata();

                //// Flags for distributed mode ////
                // File: channels-db
                data.distChannelsDbGreeter =
                    data.channels && data.dbService && !data.apiGW && !data.apiIO && !data.apiGQL;
                // File: channels-gql-http
                data.distChannelsGqlHttpDbGreeter =
                    data.channels && data.dbService && data.apiGW && !data.apiIO && data.apiGQL;
                // File: channels-http
                data.distChannelsHttpDBGreeter =
                    data.channels && data.dbService && data.apiGW && !data.apiIO && !data.apiGQL;
                // File: channels-io-gql-http
                data.distChannelsIoGqlHttpDBGreeter =
                    data.channels && data.dbService && data.apiGW && data.apiIO && data.apiGQL;
                // File: channels-io-http
                data.distChannelsIoHttpDBGreeter =
                    data.channels && data.dbService && data.apiGW && data.apiIO && !data.apiGQL;
                // File: db
                data.distDbGreeter =
                    !data.channels && data.dbService && !data.apiGW && !data.apiIO && !data.apiGQL;
                // File: gql-http-db
                data.distGqlHttpDbGreeter =
                    !data.channels && data.dbService && data.apiGW && !data.apiIO && data.apiGQL;
                // File: gql-http
                data.distGqlHttpGreeter =
                    !data.channels && !data.dbService && data.apiGW && !data.apiIO && data.apiGQL;
                // File: greeter
                data.distGreeter =
                    !data.channels && !data.dbService && !data.apiGW && !data.apiIO && !data.apiGQL;
                // File: http-db
                data.distHttpDbGreeter =
                    !data.channels && data.dbService && data.apiGW && !data.apiIO && !data.apiGQL;
                // File: http
                data.distHttpGreeter =
                    !data.channels && !data.dbService && data.apiGW && !data.apiIO && !data.apiGQL;
                // File: io-gql-http-db
                data.distIoGqlHttpDbGreeter =
                    !data.channels && data.dbService && data.apiGW && data.apiIO && data.apiGQL;
                // File: io-gql-http
                data.distIoGqlHttpGreeter =
                    !data.channels && !data.dbService && data.apiGW && data.apiIO && data.apiGQL;
                // File: io-http-db
                data.distIoHttpDbGreeter =
                    !data.channels && data.dbService && data.apiGW && data.apiIO && !data.apiGQL;
                // File: io-http
                data.distIoHttpGreeter =
                    !data.channels && !data.dbService && data.apiGW && data.apiIO && !data.apiGQL;

                data.redis = data.cacher == "Redis" || data.transporter == "Redis";
                data.hasDepends =
                    (data.needCacher && data.cacher !== "Memory") ||
                    (data.needTransporter && data.transporter != "TCP");
            },
        },

        skipInterpolation: [
            //"public/index.html"
        ],

        filters: {
            "services/api.service.js": "apiGW",
            "public/**/*": "apiGW",

            "services/products.service.js": "dbService",
            "mixins/db.mixin.js": "dbService",
            "test/unit/mixins/db.mixin.spec.js": "dbService",
            "test/integration/products.service.spec.js": "dbService",
            "test/unit/services/products.spec.js": "dbService",

            ".eslintrc.js": "lint",

            ".dockerignore": "docker",
            "docker-compose.*": "docker",
            Dockerfile: "docker",
            "k8s.yaml": "docker",
        },

        completeMessage: `
To get started:

	cd {{projectName}}
	npm run dev

		`,
    };
};
