import express, { Express, Request, Response } from "express";
import { setupSwagger } from "./swagger";
import { PORT } from "./secrets";
import rootRouter from "./routes";

const app: Express = express();

app.use(express.json());


app.use("/api", rootRouter);

// app.listen(PORT, () => {
//   console.log(`app is listening port ${PORT}`);
// });

const startServer = async () => {
    try {
      await setupSwagger(app);
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
  