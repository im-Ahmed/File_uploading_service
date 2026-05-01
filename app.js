import express, { urlencoded } from "express";
import { LIMIT, origin } from "./constants.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// serving directly from folder
app.use(express.static("public"));

// JSON parsing
app.use(
  express.json({
    limit: LIMIT,
  }),
);

// Traditions HTML form parsing
app.use(
  urlencoded({
    limit: LIMIT,
  }),
);

// defining origins
app.use(
  cors({
    origin: origin,
    Credential: true, // cookies, headers, tokens support
  }),
);
app.use(cookieParser());
// importing routes
import userRouter from "./src/routes/user.route.js";

// implementing routes
app.use("/api/v1/users", userRouter);

app.get("/healthcheck", (_, res) => {
  return res.send("Server is running fine");
});

export { app };
