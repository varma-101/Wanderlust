require("dotenv").config();
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = process.env.MONGO;

if (!MONGO_URL) {
  throw new Error("MONGO environment variable is not defined!");
}

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log("Error connecting to DB:", err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "66bfbb7a48418bdc18f4f605",
  }));
  await Listing.insertMany(initData.data);
  console.log("Data was initialized");
};

initDB();
