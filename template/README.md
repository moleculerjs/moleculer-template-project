[![Moleculer](https://badgen.net/badge/Powered%20by/Moleculer/0e83cd)](https://moleculer.services)

# {{projectName}}
This is a [Moleculer](https://moleculer.services/)-based microservices project. Generated with the [Moleculer CLI](https://moleculer.services/docs/0.14/moleculer-cli.html).

## Template architecture
Moleculer supports different [deployment modes](https://moleculer.services/docs/0.14/clustering.html). The figures below represent the deployment and production architectures.
Switching between the architectures is [automatically](https://moleculer.services/docs/0.14/clustering.html) handled by moleculer. To run in dev mode use `npm run dev`, for production mode run `npm run dc:up`.

### Development architecture view
![dev arch](https://raw.githubusercontent.com/moleculerjs/moleculer-template-project/next/media/{{dirName}}/{{imageName}}.svg)

### Production architecture view
![distributed arch](https://raw.githubusercontent.com/moleculerjs/moleculer-template-project/next/media/dist/{{imageName}}.svg)


## Usage
Start the project with `npm run dev` command. 
{{#apiGW}}
After starting, open the http://localhost:3000/ URL in your browser. 
On the welcome page you can test the generated services via API Gateway and check the nodes & services.

{{/apiGW}}
In the terminal, try using [Moleculer REPL](https://moleculer.services/docs/0.14/moleculer-repl.html) by running the following commands:
- `nodes` - List all connected nodes.
- `services` - List all the available services.
- `actions` - List all registered service actions.
- `info` - List node info (e.g., IP, memory usage).
- `call greeter.hello` - Call the `greeter.hello` action.
- `call greeter.welcome --name John` - Call the `greeter.welcome` action with the `name` parameter.
{{#dbService}}- `call products.list` - List the products (call the `products.list` action).{{/dbService}}


## Services
- **api**: API Gateway services
- **greeter**: Sample service with `hello` and `welcome` actions.
{{#dbService}}- **products**: Sample DB service. To use with MongoDB, set `MONGO_URI` environment variables and install MongoDB adapter with `npm install mongodb`.
{{#channels}}- **inventory**: Sample service with a single [`channel` handler](https://github.com/moleculerjs/moleculer-channels) that uses persistent queues to reliably process the messages.{{/channels}}

## Mixins
- **db.mixin**: Database access mixin for services. Based on [moleculer/database](https://github.com/moleculerjs/database)
{{/dbService}}


## Useful links

* Moleculer website: https://moleculer.services/
* Moleculer Documentation: https://moleculer.services/docs/0.14/
{{#apiGW}}* Moleculer API Gateway: https://moleculer.services/docs/0.14/moleculer-web.html{{/apiGW}}
{{#apiGQL}}* Moleculer GraphQL Gateway: https://github.com/moleculerjs/moleculer-apollo-server{{/apiGQL}}
{{#apiIO}}* Moleculer Socket.IO Gateway: https://github.com/moleculerjs/moleculer-io{{/apiIO}}
{{#channels}}* Moleculer Channels: https://github.com/moleculerjs/moleculer-channels{{/channels}}

## NPM scripts

- `npm run dev`: Start development mode (load all services locally with hot-reload & REPL)
- `npm run start`: Start production mode (set `SERVICES` env variable to load certain services)
- `npm run cli`: Start a CLI and connect to production. Don't forget to set production namespace with `--ns` argument in script{{#lint}}
- `npm run lint`: Run ESLint{{/lint}}
- `npm run ci`: Run continuous test mode with watching
- `npm test`: Run tests & generate coverage report{{#docker}}
- `npm run dc:up`: Start the stack with Docker Compose
- `npm run dc:down`: Stop the stack with Docker Compose{{/docker}}
