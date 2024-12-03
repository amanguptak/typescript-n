"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = setupSwagger;
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_autogen_1 = __importDefault(require("swagger-autogen"));
const path_1 = __importDefault(require("path"));
const doc = {
    info: {
        title: "Motion-Food API",
        version: "1.0.0",
        description: "Automatically generated API documentation",
    },
    host: "localhost:3333",
    schemes: ["http"], // Adjust for production (use "https" if secure)
};
const outputFile = path_1.default.join(__dirname, "swagger-output.json");
const endpointsFiles = [path_1.default.join(__dirname, "routes/index.ts")]; // The main router file
async function setupSwagger(app) {
    const swaggerAutogenInstance = (0, swagger_autogen_1.default)();
    console.log("Generating Swagger documentation...");
    await swaggerAutogenInstance(outputFile, endpointsFiles, doc);
    const swaggerDocument = await Promise.resolve(`${outputFile}`).then(s => __importStar(require(s)));
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
    console.log("Swagger docs available at http://localhost:3333/api-docs");
}
