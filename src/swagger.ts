import swaggerUi from "swagger-ui-express";
import swaggerAutogen from "swagger-autogen";
import { Express } from "express";
import path from "path";

const doc = {
  info: {
    title: "Motion-Food API",
    version: "1.0.0",
    description: "Automatically generated API documentation",
  },
  host: "localhost:3333",
  schemes: ["http"], // Adjust for production (use "https" if secure)
};

const outputFile = path.join(__dirname, "swagger-output.json");
const endpointsFiles = [path.join(__dirname, "routes/index.ts")]; // The main router file

export async function setupSwagger(app: Express): Promise<void> {
  const swaggerAutogenInstance = swaggerAutogen();

  console.log("Generating Swagger documentation...");
  await swaggerAutogenInstance(outputFile, endpointsFiles, doc);

  const swaggerDocument = await import(outputFile);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log("Swagger docs available at http://localhost:3333/api-docs");
}
