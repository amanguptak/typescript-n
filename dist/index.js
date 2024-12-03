"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_1 = require("./swagger");
const secrets_1 = require("./secrets");
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api", routes_1.default);
// app.listen(PORT, () => {
//   console.log(`app is listening port ${PORT}`);
// });
const startServer = async () => {
    try {
        await (0, swagger_1.setupSwagger)(app);
        console.log("Swagger setup completed");
        app.listen(secrets_1.PORT, () => {
            console.log(`App is listening on port ${secrets_1.PORT}`);
        });
    }
    catch (err) {
        console.error("Failed to setup Swagger:", err);
        process.exit(1); // Exit the process if setup fails
    }
};
startServer();
