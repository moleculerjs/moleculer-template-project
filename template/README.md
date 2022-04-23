[![Moleculer](https://badgen.net/badge/Powered%20by/Moleculer/0e83cd)](https://moleculer.services)

# {{projectName}}
This is a [Moleculer](https://moleculer.services/)-based microservices project. Generated with the [Moleculer CLI](https://moleculer.services/docs/0.14/moleculer-cli.html).

## Template architecture
Moleculer supports different [deployment modes](https://moleculer.services/docs/0.14/clustering.html). 

### Development architecture view

### Production architecture view
{{#distChannelsDbGreeter}}
![distChannelsDbGreeter](https://raw.githubusercontent.com/moleculerjs/moleculer-template-project/next/media/dist/channels-db.svg)
{{/distChannelsDbGreeter}}

{{#distChannelsGqlHttpDbGreeter}}
![distChannelsGqlHttpDbGreeter](https://raw.githubusercontent.com/moleculerjs/moleculer-template-project/next/media/dist/channels-gql-http.svg)
{{/distChannelsGqlHttpDbGreeter}}

{{#distChannelsHttpDBGreeter}}
![distChannelsHttpDBGreeter](https://raw.githubusercontent.com/moleculerjs/moleculer-template-project/next/media/dist/channels-http.svg)
{{/distChannelsHttpDBGreeter}}

{{#distChannelsIoGqlHttpDBGreeter}}
![distChannelsIoGqlHttpDBGreeter](https://raw.githubusercontent.com/moleculerjs/moleculer-template-project/next/media/dist/channels-io-gql-http.svg)
{{/distChannelsIoGqlHttpDBGreeter}}

{{#distChannelsIoGqlDBGreeter}}
![distChannelsIoGqlDBGreeter](https://raw.githubusercontent.com/moleculerjs/moleculer-template-project/next/media/dist/channels-io-gql.svg)
{{/distChannelsIoGqlDBGreeter}}

{{#distChannelsIoHttpDBGreeter}}
![distChannelsIoHttpDBGreeter](https://raw.githubusercontent.com/moleculerjs/moleculer-template-project/next/media/dist/channels-io-http.svg)
{{/distChannelsIoHttpDBGreeter}}

{{#distDbGreeter}}
![distDbGreeter](https://raw.githubusercontent.com/moleculerjs/moleculer-template-project/next/media/dist/db.svg)
{{/distDbGreeter}}

{{#distGqlHttpDbGreeter}}
![distGqlHttpDbGreeter](https://raw.githubusercontent.com/moleculerjs/moleculer-template-project/next/media/dist/gql-http-db.svg)
{{/distGqlHttpDbGreeter}}

{{#distGqlHttpGreeter}}
![distGqlHttpGreeter](https://raw.githubusercontent.com/moleculerjs/moleculer-template-project/next/media/dist/gql-http.svg)
{{/distGqlHttpGreeter}}

{{#distGreeter}}
![distGreeter](https://raw.githubusercontent.com/moleculerjs/moleculer-template-project/next/media/dist/greeter.svg)
{{/distGreeter}}

{{#distHttpDbGreeter}}
![distHttpDbGreeter](https://raw.githubusercontent.com/moleculerjs/moleculer-template-project/next/media/dist/http-db.svg)
{{/distHttpDbGreeter}}

{{#distHttpGreeter}}
![distHttpGreeter](https://raw.githubusercontent.com/moleculerjs/moleculer-template-project/next/media/dist/http.svg)
{{/distHttpGreeter}}

{{#distIoGqlDB}}
![distIoGqlDB](https://raw.githubusercontent.com/moleculerjs/moleculer-template-project/next/media/dist/io-gql-db.svg)
{{/distIoGqlDB}}

{{#distIoGqlHttpDbGreeter}}
![distIoGqlHttpDbGreeter](https://raw.githubusercontent.com/moleculerjs/moleculer-template-project/next/media/dist/io-gql-http-db.svg)
{{/distIoGqlHttpDbGreeter}}

{{#distIoGqlHttpGreeter}}
![distIoGqlHttpGreeter](https://raw.githubusercontent.com/moleculerjs/moleculer-template-project/next/media/dist/io-gql-http.svg)
{{/distIoGqlHttpGreeter}}

{{#distIoGqlGreeter}}
![distIoGqlGreeter](https://raw.githubusercontent.com/moleculerjs/moleculer-template-project/next/media/dist/io-gql.svg)
{{/distIoGqlGreeter}}

{{#distIoHttpDbGreeter}}
![distIoHttpDbGreeter](https://raw.githubusercontent.com/moleculerjs/moleculer-template-project/next/media/dist/io-http-db.svg)
{{/distIoHttpDbGreeter}}

{{#distIoHttpGreeter}}
![distIoHttpGreeter](https://raw.githubusercontent.com/moleculerjs/moleculer-template-project/next/media/dist/io-http.svg)
{{/distIoHttpGreeter}}

## Usage
Start the project with `npm run dev` command. 
{{#apiGW}}
After starting, open the http://localhost:3000/ URL in your browser. 
On the welcome page you can test the generated services via API Gateway and check the nodes & services.

{{/apiGW}}
In the terminal, try the following commands:
- `nodes` - List all connected nodes.
- `actions` - List all registered service actions.
- `call greeter.hello` - Call the `greeter.hello` action.
- `call greeter.welcome --name John` - Call the `greeter.welcome` action with the `name` parameter.
{{#dbService}}- `call products.list` - List the products (call the `products.list` action).{{/dbService}}


## Services
- **api**: API Gateway services
- **greeter**: Sample service with `hello` and `welcome` actions.
{{#dbService}}- **products**: Sample DB service. To use with MongoDB, set `MONGO_URI` environment variables and install MongoDB adapter with `npm i moleculer-db-adapter-mongo`.

## Mixins
- **db.mixin**: Database access mixin for services. Based on [moleculer-db](https://github.com/moleculerjs/moleculer-db#readme)
{{/dbService}}


## Useful links

* Moleculer website: https://moleculer.services/
* Moleculer Documentation: https://moleculer.services/docs/0.14/

## NPM scripts

- `npm run dev`: Start development mode (load all services locally with hot-reload & REPL)
- `npm run start`: Start production mode (set `SERVICES` env variable to load certain services)
- `npm run cli`: Start a CLI and connect to production. Don't forget to set production namespace with `--ns` argument in script{{#lint}}
- `npm run lint`: Run ESLint{{/lint}}
- `npm run ci`: Run continuous test mode with watching
- `npm test`: Run tests & generate coverage report{{#docker}}
- `npm run dc:up`: Start the stack with Docker Compose
- `npm run dc:down`: Stop the stack with Docker Compose{{/docker}}
