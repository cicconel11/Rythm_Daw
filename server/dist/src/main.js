"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const ws_adapter_1 = require("./ws/ws-adapter");
const helmet_1 = __importDefault(require("helmet"));
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
async function bootstrap() {
    console.log('=== Starting Bootstrap Process ===');
    const logger = new common_1.Logger('Bootstrap');
    try {
        logger.log('Creating NestJS application instance...');
        const app = await core_1.NestFactory.create(app_module_1.AppModule, {
            logger: ['error', 'warn', 'log', 'debug', 'verbose'],
        });
        logger.log('NestJS application instance created successfully');
        app.use((0, helmet_1.default)({
            contentSecurityPolicy: {
                useDefaults: true,
                directives: {
                    "default-src": ["'self'"],
                    "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
                    "object-src": ["'none'"],
                    "img-src": ["'self'", "data:", "blob:"],
                    "style-src": ["'self'", "'unsafe-inline'"],
                    "frame-ancestors": ["'none'"],
                },
            },
            frameguard: { action: 'deny' },
            hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
            hidePoweredBy: true,
        }));
        app.enableCors({
            origin: process.env.CORS_ORIGINS?.split(',') || '*',
            credentials: true,
        });
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            transform: true,
            transformOptions: { enableImplicitConversion: true },
            forbidNonWhitelisted: true,
        }));
        try {
            const wsAdapter = new ws_adapter_1.WsAdapter(app);
            app.useWebSocketAdapter(wsAdapter);
            logger.log('WebSocket adapter initialized');
        }
        catch (error) {
            logger.error('Failed to initialize WebSocket adapter:', error);
            throw error;
        }
        const expressApp = app.getHttpAdapter().getInstance();
        expressApp.get('/', (req, res) => {
            res.status(200).send('OK');
        });
        if (process.env.NODE_ENV !== 'production') {
            const config = new swagger_1.DocumentBuilder()
                .setTitle('RHYTHM API')
                .setDescription('RHYTHM Collaboration Suite API Documentation')
                .setVersion('1.0')
                .addBearerAuth()
                .build();
            const document = swagger_1.SwaggerModule.createDocument(app, config);
            swagger_1.SwaggerModule.setup('api', app, document);
            logger.log('Swagger documentation available at /api');
        }
        const port = parseInt(process.env.PORT || '3001', 10);
        logger.log(`Starting to listen on port ${port}...`);
        try {
            await app.listen(port);
            logger.log(`✅ Application is running on: http://localhost:${port}`);
            logger.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
            const server = app.getHttpServer();
            const router = server._events.request._router;
            const routes = router.stack
                .map(layer => {
                if (layer.route) {
                    return {
                        route: {
                            path: layer.route.path,
                            methods: layer.route.methods
                        }
                    };
                }
            })
                .filter(item => item !== undefined);
            logger.log('Registered routes:', JSON.stringify(routes, null, 2));
            return app;
        }
        catch (error) {
            logger.error(`❌ Failed to start application on port ${port}:`, error);
            throw error;
        }
    }
    catch (error) {
        logger.error('Failed to start application', error);
        process.exit(1);
    }
}
bootstrap()
    .then(() => {
    console.log('Application started successfully');
})
    .catch((error) => {
    console.error('Failed to start application:', error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map