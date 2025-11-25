const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const config = require('./config');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: config.api.title,
      version: config.api.version,
      description: config.api.description,
      contact: {
        name: 'API Support',
        email: 'support@quranapi.com'
      }
    },
    servers: [
      {
        url: config.env === 'production' ? 'https://api-quran.kancralabs.com' : `http://localhost:${config.port}`,
        description: config.env === 'production' ? 'Production server' : 'Development server'
      },
      {
        url: 'https://api-quran.kancralabs.com',
        description: 'Staging/Production server'
      },
      {
        url: `http://localhost:${config.port}`,
        description: 'Local development'
      }
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication endpoints (register, login, refresh token)'
      },
      {
        name: 'Surahs',
        description: 'Surah management endpoints'
      },
      {
        name: 'Health',
        description: 'Health check endpoints'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT access token'
        }
      }
    }
  },
  apis: [
    path.join(__dirname, '../internal/controller/**/*.js'),
    path.join(__dirname, '../internal/routes/**/*.js'),
    path.join(__dirname, '../internal/swagger/**/*.js')
  ]
};

const specs = swaggerJsdoc(options);

// Log untuk debugging
console.log('📚 Swagger Configuration:');
console.log(`  Environment: ${config.env}`);
console.log(`  Port: ${config.port}`);
console.log('  Scanning paths:');
options.apis.forEach(apiPath => console.log(`    - ${apiPath}`));
console.log(`  Found ${Object.keys(specs.paths || {}).length} endpoints`);
if (Object.keys(specs.paths || {}).length > 0) {
  console.log('  Sample endpoints:');
  Object.keys(specs.paths).slice(0, 5).forEach(path => console.log(`    - ${path}`));
}

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Quran API Documentation',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true
    }
  }));

  // Serve swagger.json
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
  
  console.log('✅ Swagger UI setup complete');
  console.log(`  Swagger UI: ${config.env === 'production' ? 'https://api-quran.kancralabs.com' : `http://localhost:${config.port}`}/api-docs`);
  console.log(`  Swagger JSON: ${config.env === 'production' ? 'https://api-quran.kancralabs.com' : `http://localhost:${config.port}`}/api-docs.json`);
};
module.exports = setupSwagger;
