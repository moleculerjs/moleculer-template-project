"use strict";

process.env.PORT = 0; // Use random ports during tests

const HTTPrequest = require("supertest");
const io = require("socket.io-client");
const { request, gql } = require("graphql-request");

const { ServiceBroker } = require("moleculer");
// Load service schemas
const APISchema = require("../../services/api.service");
const GreeterSchema = require("../../services/greeter.service");
const ProductsSchema = require("../../services/products.service");

describe("Test HTTP API gateway", () => {
    let broker = new ServiceBroker({ logger: false });
    broker.sendToChannel = jest.fn();

    let greeterService = broker.createService(GreeterSchema);
    let apiService = broker.createService(APISchema);
    let productsService = broker.createService(ProductsSchema);
    productsService.seedDB = null; // Disable seeding

    beforeAll(() => broker.start());
    afterAll(() => broker.stop());

    let SUPER_PHONE_ID;

    describe('Test "greeter" endpoints', () => {
        it("test '/api/greeter/hello'", () => {
            return HTTPrequest(apiService.server)
                .get("/api/greeter/hello")
                .then(res => {
                    expect(res.body).toEqual("Hello Moleculer");
                });
        });

        it("test '/api/unknown-route'", () => {
            return HTTPrequest(apiService.server)
                .get("/api/unknown-route")
                .then(res => {
                    expect(res.statusCode).toBe(404);
                });
        });
    });

    describe('Test "products" endpoints', () => {
        it("test '/api/products/list'", () => {
            return HTTPrequest(apiService.server)
                .get("/api/products/list")
                .then(res => {
                    expect(res.body).toEqual({
                        page: 1,
                        pageSize: 10,
                        rows: [],
                        total: 0,
                        totalPages: 0,
                    });
                });
        });

        it("test '/api/products/find'", () => {
            return HTTPrequest(apiService.server)
                .get("/api/products/find")
                .then(res => {
                    expect(res.body).toEqual([]);
                });
        });

        it("test '/api/products/count'", () => {
            return HTTPrequest(apiService.server)
                .get("/api/products/count")
                .then(res => {
                    expect(res.body).toEqual(0);
                });
        });

        it("test '/api/products/create'", () => {
            return HTTPrequest(apiService.server)
                .post("/api/products/create")
                .send({ name: "Super Phone", price: 123 })
                .then(res => {
                    SUPER_PHONE_ID = res.body.id;
                    expect(res.body).toEqual({
                        id: expect.any(String),
                        name: "Super Phone",
                        price: 123,
                        quantity: 0,
                    });
                });
        });

        it("test '/api/products/update'", () => {
            return HTTPrequest(apiService.server)
                .post("/api/products/update")
                .send({ id: SUPER_PHONE_ID, price: 999 })
                .then(res => {
                    expect(res.body).toEqual({
                        id: expect.any(String),
                        name: "Super Phone",
                        price: 999,
                        quantity: 0,
                    });
                });
        });

        it("test '/api/products/increaseQuantity'", () => {
            return HTTPrequest(apiService.server)
                .post("/api/products/increaseQuantity")
                .send({ id: SUPER_PHONE_ID, value: 10 })
                .then(res => {
                    expect(res.body).toEqual({
                        id: expect.any(String),
                        name: "Super Phone",
                        price: 999,
                        quantity: 10,
                    });
                });
        });

        it("test '/api/products/decreaseQuantity'", () => {
            return HTTPrequest(apiService.server)
                .post("/api/products/decreaseQuantity")
                .send({ id: SUPER_PHONE_ID, value: 5 })
                .then(res => {
                    expect(res.body).toEqual({
                        id: expect.any(String),
                        name: "Super Phone",
                        price: 999,
                        quantity: 5,
                    });
                });
        });

        it("test '/api/products/remove'", () => {
            return HTTPrequest(apiService.server)
                .post("/api/products/remove")
                .send({ id: SUPER_PHONE_ID })
                .then(res => {
                    expect(res.body).toEqual(SUPER_PHONE_ID);
                });
        });
    });
});

describe("Test Socket.IO API gateway", () => {
    let broker = new ServiceBroker({ logger: false });
    broker.sendToChannel = jest.fn();

    let greeterService = broker.createService(GreeterSchema);
    let apiService = broker.createService(APISchema);
    let productsService = broker.createService(ProductsSchema);
    productsService.seedDB = null; // Disable seeding

    beforeAll(() => broker.start());
    afterAll(() => broker.stop());

    /**
     * Socket.IO client helper function
     * @param {import('socket.io-client').Socket} client
     * @param {String} action
     * @param {Object} params
     * @returns
     */
    function callAwait(client, action, params) {
        return new Promise(function (resolve, reject) {
            client.emit("call", action, params, function (err, res) {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }

    describe('Test "greeter" actions', () => {
        let client;
        let port;

        beforeAll(() => {
            port = apiService.io.httpServer.address().port;
            client = io.connect(`ws://localhost:${port}`, { forceNew: true });
        });
        afterAll(() => client.disconnect());

        it("test 'greeter.hello'", async () => {
            const res = await callAwait(client, "greeter.hello");
            expect(res).toBe("Hello Moleculer");
        });

        it("test 'greeter.welcome'", async () => {
            const res = await callAwait(client, "greeter.welcome", { name: "Socket.IO" });
            expect(res).toBe("Welcome, Socket.IO");
        });
    });

    describe('Test "products" actions', () => {
        let client;
        let port;
        let SUPER_PHONE_ID;

        beforeAll(() => {
            port = apiService.io.httpServer.address().port;
            client = io.connect(`ws://localhost:${port}`, { forceNew: true });
        });
        afterAll(() => client.disconnect());

        it("test 'products.list'", async () => {
            const res = await callAwait(client, "products.list");
            expect(res).toEqual({ page: 1, pageSize: 10, rows: [], total: 0, totalPages: 0 });
        });

        it("test 'products.find'", async () => {
            const res = await callAwait(client, "products.find");
            expect(res).toEqual([]);
        });

        it("test 'products.count'", async () => {
            const res = await callAwait(client, "products.count");
            expect(res).toEqual(0);
        });

        it("test 'products.create'", async () => {
            const res = await callAwait(client, "products.create", {
                name: "Super Phone",
                price: 123,
            });
            SUPER_PHONE_ID = res.id;

            expect(res).toEqual({
                id: expect.any(String),
                name: "Super Phone",
                price: 123,
                quantity: 0,
            });
        });

        it("test 'products.update'", async () => {
            const res = await callAwait(client, "products.update", {
                id: SUPER_PHONE_ID,
                price: 999,
            });

            expect(res).toEqual({
                id: expect.any(String),
                name: "Super Phone",
                price: 999,
                quantity: 0,
            });
        });

        it("test 'products.increaseQuantity'", async () => {
            const res = await callAwait(client, "products.increaseQuantity", {
                id: SUPER_PHONE_ID,
                value: 10,
            });

            expect(res).toEqual({
                id: expect.any(String),
                name: "Super Phone",
                price: 999,
                quantity: 10,
            });
        });

        it("test 'products.decreaseQuantity'", async () => {
            const res = await callAwait(client, "products.decreaseQuantity", {
                id: SUPER_PHONE_ID,
                value: 5,
            });

            expect(res).toEqual({
                id: expect.any(String),
                name: "Super Phone",
                price: 999,
                quantity: 5,
            });
        });

        it("test 'products.remove'", async () => {
            const res = await callAwait(client, "products.remove", {
                id: SUPER_PHONE_ID,
            });

            expect(res).toEqual(SUPER_PHONE_ID);
        });
    });
});

describe("Test GraphQL API gateway", () => {
    let broker = new ServiceBroker({ logger: false });
    broker.sendToChannel = jest.fn();

    let greeterService = broker.createService(GreeterSchema);
    let apiService = broker.createService(APISchema);
    let productsService = broker.createService(ProductsSchema);
    productsService.seedDB = null; // Disable seeding

    beforeAll(() => broker.start());
    afterAll(() => broker.stop());

    describe('Test "greeter" actions', () => {
        let port;

        beforeAll(() => {
            port = apiService.server.address().port;
        });

        it("test 'greeter.hello'", async () => {
            const query = gql`
                query {
                    hello
                }
            `;
            const res = await request(`http://localhost:${port}/graphql`, query);
            expect(res).toEqual({ hello: "Hello Moleculer" });
        });

        it("test 'greeter.welcome'", async () => {
            const query = gql`
                mutation {
                    welcome(name: "GraphQL")
                }
            `;
            const res = await request(`http://localhost:${port}/graphql`, query);
            expect(res).toEqual({
                welcome: "Welcome, GraphQL",
            });
        });
    });

    describe('Test "product" actions', () => {
        let port;
        let SUPER_PHONE_ID;

        beforeAll(() => {
            port = apiService.server.address().port;
        });

        it("test 'product.list'", async () => {
            const query = gql`
                query {
                    list {
                        total
                        page
                        pageSize
                        totalPages
                        rows {
                            id
                            name
                            quantity
                            price
                        }
                    }
                }
            `;
            const res = await request(`http://localhost:${port}/graphql`, query);
            expect(res).toEqual({
                list: {
                    page: 1,
                    pageSize: 10,
                    rows: [],
                    total: 0,
                    totalPages: 0,
                },
            });
        });

        it("test 'product.find'", async () => {
            const query = gql`
                query {
                    find {
                        id
                        name
                        quantity
                        price
                    }
                }
            `;
            const res = await request(`http://localhost:${port}/graphql`, query);
            expect(res).toEqual({
                find: [],
            });
        });

        /*it("test 'product.count'", async () => {
            const query = gql`
                query {
                    count
                }
            `;
            const res = await request(`http://localhost:${port}/graphql`, query);
            expect(res).toEqual({
                count: 0,
            });
        });*/

        it("test 'product.create'", async () => {
            const query = gql`
                mutation {
                    create(name: "Super Phone", price: 123) {
                        id
                        name
                        quantity
                        price
                    }
                }
            `;
            const res = await request(`http://localhost:${port}/graphql`, query);

            SUPER_PHONE_ID = res.create.id;

            expect(res).toEqual({
                create: {
                    id: expect.any(String),
                    name: "Super Phone",
                    quantity: 0,
                    price: 123,
                },
            });
        });

        it("test 'product.update'", async () => {
            const query = gql`
                mutation {
                    update(id: "${SUPER_PHONE_ID}", price: 999) {
                        id
                        name
                        quantity
                        price
                    }
                }
            `;
            const res = await request(`http://localhost:${port}/graphql`, query);

            expect(res).toEqual({
                update: {
                    id: expect.any(String),
                    name: "Super Phone",
                    price: 999,
                    quantity: 0,
                },
            });
        });

        it("test 'product.increaseQuantity'", async () => {
            const query = gql`
                mutation {
                    increaseQuantity(id: "${SUPER_PHONE_ID}", value: 10) {
                        id
                        name
                        quantity
                        price
                    }
                }
            `;
            const res = await request(`http://localhost:${port}/graphql`, query);

            expect(res).toEqual({
                increaseQuantity: {
                    id: expect.any(String),
                    name: "Super Phone",
                    price: 999,
                    quantity: 10,
                },
            });
        });

        it("test 'product.decreaseQuantity'", async () => {
            const query = gql`
                mutation {
                    decreaseQuantity(id: "${SUPER_PHONE_ID}", value: 5) {
                        id
                        name
                        quantity
                        price
                    }
                }
            `;
            const res = await request(`http://localhost:${port}/graphql`, query);

            expect(res).toEqual({
                decreaseQuantity: {
                    id: expect.any(String),
                    name: "Super Phone",
                    price: 999,
                    quantity: 5,
                },
            });
        });

        it("test 'product.remove'", async () => {
            const query = gql`
                mutation {
                    remove(id: "${SUPER_PHONE_ID}")
                }
            `;
            const res = await request(`http://localhost:${port}/graphql`, query);

            expect(res).toEqual({
                remove: SUPER_PHONE_ID,
            });
        });
    });
});
