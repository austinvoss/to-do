const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const routes = require("./routes");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: "voss",
  host: "localhost",
  database: "voss", // <-- Update this line
  port: 5432,
});

app.use("/api", routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
