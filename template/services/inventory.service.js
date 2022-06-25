"use strict";

/** @type {import('moleculer').ServiceSchema} Moleculer's Service Schema */
module.exports = {
    name: "inventory",

    /**
     * Methods. More info: https://moleculer.services/docs/0.14/services.html#Methods
     */
    methods: {
        /**
         * Method that mimics an external API call to order more units of the product
         *
         * @param {import('./products.service').ProductDBEntry} payload
         */
        async orderProduct(payload) {
            // Simulate external API call to order more units...
            await this.Promise.delay(1000);

            const orderedQuantity = Math.round(Math.random() * 100);

            this.logger.info(`Ordered more "${orderedQuantity}" units of ${payload.name}. 
            Expected Arrival date ${new Date(new Date().setDate(Math.round(Math.random() * 10)))}`);
        },
    },

    /**
     * More info: https://github.com/moleculerjs/moleculer-channels
     */
    channels: {
        /**
         * Order more products
         * @param {import('./products.service').ProductDBEntry} payload
         * @this {import('moleculer').Service}
         */
        async "order.more"(payload) {
            await this.orderProduct(payload);
        },
    },
};
