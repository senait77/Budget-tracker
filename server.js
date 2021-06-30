const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
require('dotenv').config();
const compression = require("compression");

const PORT = process.env.PORT || 3001;
// Varible for making text color red in node 
const redText = '\x1b[31m%s\x1b[0m';

// Vaible for the endpoint, it will log if we can't define the .env var
const MONGODB_ENDPOINT =
    process.env.MONGODB_ENDPOINT ||
    console.log(redText, 'You must have a Mongo Database endpoint.');

const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

// Connect mongoose
mongoose.connect(MONGODB_ENDPOINT, {
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// listen for connection or error events
mongoose.connection.on('connected', () =>
  console.log('Connected to MongoDB Endpoint')
);

mongoose.connection.on('error', (err) =>
  console.log(redText, `Mongoose default connection error: ${err}`)
);

// Log mongoose queries
mongoose.set('debug', true)

// routes
app.use(require("./routes/api.js"));

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});