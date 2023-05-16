require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

const credentials = require("./middleware/credentials");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConn");
const PORT = process.env.LOCAL_PORT || 4600;

// Connect to MongoDB
connectDB();

//set the template engine
app.set("view engine", "ejs");

// handle options credentials check - before CORS!
// and fetch cookies credentials  requirements
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));
// app.use(
//   cors({
//     origin: "http://localhost:3600",
//   })
// );

// built-in middleware for json
app.use(express.json());
// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: true }));
// middleware for cookies
app.use(cookieParser());

//serve static files
app.use(express.static(path.resolve(__dirname, "public")));

app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

// Require JWT Token to access data
// app.use(verifyJWT);
// Private routes
app.use("/api/users", require("./routes/api/usersRoute"));
app.use("/api/inventory", require("./routes/api/inventoryRoute"));
app.use("/api/restock", require("./routes/api/restocksRoute"));
app.use("/api/sales", require("./routes/api/salesRoute"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "page", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
