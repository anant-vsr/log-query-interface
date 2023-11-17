// index.js


require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());



mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log("Connected to database.");
  })
  .catch((error) => {
    console.log("Mongoose connection ERROR:", error.message);
  });


// Log schema and model definition
const logSchema = new mongoose.Schema({
  level: String,
  message: String,
  resourceId: String,
  timestamp: {
    type: Date,
    default: Date.now
  },
  traceId: String,
  spanId: String,
  commit: String,
  metadata: {
    parentResourceId: String
  }
});

// Specify the database collection where logs will be stored
const Log = mongoose.model('Log', logSchema, 'logs');

// Log ingestion endpoint
app.post('/ingest', async (req, res) => {
  const logData = req.body;

  try {
    await Log.create(logData);
    res.status(200).send('Log ingested successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Log retrieval endpoint
// app.get('/logs', async (req, res) => {
//   try {
//     const logs = await Log.find(req.query);
//     res.status(200).json(logs);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }
// });


//new Log retrieval endpoint
app.get('/logs', async (req, res) => {
  try {
    const levelFilter = req.query.level;

    // Full-text search
    const fullTextSearch = req.query.q;
    const fullTextSearchQuery = fullTextSearch ? { $text: { $search: fullTextSearch } } : {};

    // Combining filters and full-text search
    const combinedQuery = { level: levelFilter, ...fullTextSearchQuery };

    const logs = await Log.find(combinedQuery);
    res.status(200).json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});



// Add a new endpoint for searching logs by message
app.get('/logsByMessage', async (req, res) => {
  try {
    const { message } = req.query;
    const logs = await Log.find({ message: { $regex: new RegExp(message, 'i') } });
    res.status(200).json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


// Add a new endpoint for searching logs by resourceId
app.get('/logsByResourceId', async (req, res) => {
  try {
    const { resourceId } = req.query;
    const logs = await Log.find({ resourceId });
    res.status(200).json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


// Log retrieval endpoint with timestamp range
app.get('/logsByTimestampRange', async (req, res) => {
  try {
    // Extracting filters
    const filters = {
      level: req.query.level,
      message: req.query.message,
      resourceId: req.query.resourceId,
      'metadata.parentResourceId': req.query['metadata.parentResourceId'],
    };

    // Removing undefined or empty filters
    Object.keys(filters).forEach(key => (filters[key] === undefined || filters[key] === '') && delete filters[key]);

    // Timestamp range filters
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    if (startDate && endDate) {
      filters.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const logs = await Log.find(filters);
    res.status(200).json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


//with traceId
app.get('/logsByTraceId', async (req, res) => {
  try {
    const { traceId } = req.query;

    // Assuming traceId is a field in your logs schema
    const logs = await Log.find({ traceId });

    res.status(200).json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


//with spanId
app.get('/logsBySpanId', async (req, res) => {
  try {
    const { spanId } = req.query;

    // Assuming spanId is a field in your logs schema
    const logs = await Log.find({ spanId });

    res.status(200).json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


//with commit
app.get('/logsByCommit', async (req, res) => {
  try {
    const { commit } = req.query;

    // Assuming commit is a field in your logs schema
    const logs = await Log.find({ commit });

    res.status(200).json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


//with ParentResourceId
app.get('/logsByParentResourceId', async (req, res) => {
  try {
    const { parentResourceId } = req.query;

    // Assuming metadata.parentResourceId is a field in your logs schema
    const logs = await Log.find({ 'metadata.parentResourceId': parentResourceId });

    res.status(200).json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Log Ingestor and Query Interface listening at http://localhost:${port}`);
});
