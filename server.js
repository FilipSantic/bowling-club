const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv").config();
const cors = require('cors');
const { errorHandler } = require("./middleware/errorMiddleware");
const port = process.env.PORT || 5000;

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/games", require("./routes/gameRoutes"));

// JSON error handler
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`.yellow));