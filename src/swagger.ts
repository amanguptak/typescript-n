import swaggerAutogen from "swagger-autogen";
import path from "path";
import { Application } from "express";
import swaggerUi from "swagger-ui-express";
import fs from "fs";

const doc = {
  info: {
    title: "Motion-Food API",
    version: "1.0.0",
    description: "Automatically generated API documentation",
  },
  host: "localhost:3333", 
  schemes: ["http"],
};

const outputFile = path.join(__dirname, "swagger-output.json");
// Make sure this references ALL files containing your routes
const endpointsFiles = [
    path.join(__dirname, "routes/index.ts"),
    path.join(__dirname, "routes/menu.ts"),
    path.join(__dirname, "routes/auth.ts")
  ];


export async function generateAndSetupSwagger(app: Application) {
  const swaggerAutogenInstance = swaggerAutogen();

  // 1) Generate the swagger-output.json
  await swaggerAutogenInstance(outputFile, endpointsFiles, doc);

  // 2) Dynamically import the generated file
  if (!fs.existsSync(outputFile)) {
    console.error("Failed to generate swagger-output.json");
    return;
  }
  const swaggerDocument = await import(outputFile);

  // 3) Serve it at /api-docs
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log("Swagger docs available at http://localhost:3333/api-docs");
}
