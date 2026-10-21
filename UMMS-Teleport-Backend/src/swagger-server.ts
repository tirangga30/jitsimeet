import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./config/swagger";
import { config } from "dotenv";
config();

const app = express();
const port = Number(process.env.PORT || 4001);

app.get("/api-docs.json", (_req, res) => res.json(swaggerDocument));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`Swagger UI running on http://localhost:${port}/api-docs`);
});
