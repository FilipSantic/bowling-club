const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv").config();
const { errorHandler } = require("./middleware/errorMiddleware");
const port = process.env.PORT || 5000;

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/users", require("./routes/usersRoutes"));
app.use("/api/games", require("./routes/gamesRoutes"));

// JSON error handler
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`.yellow));