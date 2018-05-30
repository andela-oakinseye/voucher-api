import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import logger from 'util';

dotenv.config();

const DB_URI = process.env.MONGO_URL;
const PORT = process.env.PORT || 3000;
const app = express();

/**
 * handle connection to the DB
 */
mongoose.connect(DB_URI, { autoIndex: true, keepAlive: 120 })
  .then(res => logger.log('DB connection established'))
  .catch(err => logger.log(err.message))


app.use(cors());
app.use(bodyParser.urlencoded( { extended: false }))
app.use(bodyParser.json());


app.listen(PORT, () => {
  logger.log(`Server running on ${PORT}`)
});
