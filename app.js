require("dotenv").config();
const express = require("express");
var cors = require("cors");
const router = require("./api/router");
const app = express();
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/", router);

app.listen(process.env.APP_PORT || 3000, () =>
  console.log(`Example app listening on port ${process.env.APP_PORT || 3000}!`)
);
