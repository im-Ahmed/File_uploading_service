import { app } from "./app.js";
import dotenvx from "@dotenvx/dotenvx";
import { connectDB } from "./src/config/conn.js";

dotenvx.config();
const PORT = process.env.PORT || 8080;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App is listening on port:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Server failed to run"|| err);
  });
