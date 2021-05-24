import swaggerJSDoc, { SwaggerDefinition, Options } from 'swagger-jsdoc';

import definitionsOfRoutes from './routes/doc';

const swaggerDefinition = {
    info: {
        title: 'API Movies',
        version: '1.0.0',
    },
    host: process.env.HOST || 'localhost:3333',
    basePath: '/',
} as SwaggerDefinition;

const options = {
    swaggerDefinition,
    apis: [
        './dist/routes/index.js',
        './dist/routes/user.routes.js',
        './dist/routes/session.routes.js',
        './dist/routes/movie.routes.js',
        './dist/routes/vote.routes.js',
    ],
} as Options;

const swaggerSpec = swaggerJSDoc(options) as SwaggerDefinition;
swaggerSpec.definitions = { ...swaggerSpec.definitions, ...definitionsOfRoutes };

export { swaggerSpec };
