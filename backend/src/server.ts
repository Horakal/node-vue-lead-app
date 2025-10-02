import { app } from "./app";
const dotenv = require("dotenv");

dotenv.config();
// import { config } from "./config/config";

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
