"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const app_module_1 = require("../src/app.module");
const ws_adapter_1 = require("../src/ws/ws-adapter");
beforeAll(async () => {
    const module = await testing_1.Test.createTestingModule({
        imports: [app_module_1.AppModule],
    }).compile();
    const app = module.createNestApplication();
    app.useWebSocketAdapter(new ws_adapter_1.WsAdapter(app));
    await app.init();
    global.__APP__ = app;
});
afterAll(async () => {
    await global.__APP__.close();
});
//# sourceMappingURL=setup-e2e.js.map