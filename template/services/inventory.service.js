"use strict";

/** @type {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema */
module.exports = {
    name: "inventory",

    /**
     * Methods. More info: https://moleculer.services/docs/0.14/services.html#Methods
     */
    methods: {
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
         * @param {Object} payload
         * @this {import('moleculer').Service}
         */
        async "order.more"(payload) {
            await this.orderProduct(payload);
        },
    },
};
