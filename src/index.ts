import express, { Express, Request, Response } from "express";
import { generateAndSetupSwagger } from "./swagger";
import { PORT } from "./secrets";
import rootRouter from "./routes";
import { errorMiddleware } from "./utils/middleware/error";
import cookieParser from 'cookie-parser';

const app: Express = express();

app.use(express.json());

app.use(cookieParser())
app.use("/api", rootRouter);
app.use(errorMiddleware)


const startServer = async () => {
    try {
      await generateAndSetupSwagger(app);
      console.log("Swagger setup completed");
  
      app.listen(PORT, () => {
        console.log(`App is listening on port ${PORT}`);
      });
    } catch (err) {
      console.error("Failed to setup Swagger:", err);
      process.exit(1); // Exit the process if setup fails
    }
  };
  
  startServer();
  