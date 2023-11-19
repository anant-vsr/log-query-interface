// index.js


require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
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

// User schema and model definition
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String,
});

const User = mongoose.model('User', userSchema);

// Log schema and model definition
const logSchema = new mongoose.Schema({
  level: String,
  message: String,
  resourceId: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
  traceId: String,
  spanId: String,
  commit: String,
  metadata: {
    parentResourceId: String,
  },
  // user: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User',
  //   required: true,
  // },
});

// Specify the database collection where logs will be stored
const Log = mongoose.model('Log', logSchema, 'logs');

// Function to generate JWT token
function generateToken(user) {
  return jwt.sign({ username: user.username, role: user.role }, process.env.SECRET, { expiresIn: '1h' });
}

// Registration endpoint
app.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const newUser = new User({ username, password, role });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password });

    if (user) {
      const token = generateToken(user);
      res.status(200).json({ token });
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Middleware to authenticate user
// Middleware to authenticate user
app.use((req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7); // Remove 'Bearer ' from the token string
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }
      req.user = decoded;
      next();
    });
  } else {
    res.status(401).json({ error: 'No token provided' });
  }
});


// Log ingestion endpoint
app.post('/ingest', async (req, res) => {
  const { user } = req; // Assuming user information is attached to the request after authentication
  const logData = req.body;

  try {
    // Check if the user has the "admin" role to allow log ingestion
    if (user && user.role === 'admin') {
      logData.user = user._id; // Associate the log entry with the user who created it
      await Log.create(logData);
      res.status(200).send('Log ingested successfully');
    } else {
      res.status(403).json({ error: 'Permission denied. Only admin users can ingest logs.' });
    }
  } catch (error) {
    console.error('Error during log ingestion:', error);
    res.status(500).json({ error: 'Internal Server Error during log ingestion' });
  }
});






app.get('/logs', async (req, res) => {
  try {
    // Extracting filters from query parameters
    const { level, message, resourceId, traceId, spanId, commit, parentResourceId } = req.query;

    // Construct a filter object based on the provided parameters
    const filters = {
      level,
      message: { $regex: new RegExp(message, 'i') },
      resourceId,
      traceId,
      spanId,
      commit,
      'metadata.parentResourceId': parentResourceId,
      // Add more filters as needed
    };

    // Remove undefined or empty filters
    Object.keys(filters).forEach(key => (filters[key] === undefined || filters[key] === '') && delete filters[key]);

    const logs = await Log.find(filters);
    res.status(200).json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


// Add a new endpoint for searching logs by message
app.get('/logsByMessage', async (req, res) => {
 try {
    // Extracting filters from query parameters
    const { level, message, resourceId, traceId, spanId, commit, parentResourceId } = req.query;

    // Construct a filter object based on the provided parameters
    const filters = {
      level,
      message: { $regex: new RegExp(message, 'i') },
      resourceId,
      traceId,
      spanId,
      commit,
      'metadata.parentResourceId': parentResourceId,
      // Add more filters as needed
    };

    // Remove undefined or empty filters
    Object.keys(filters).forEach(key => (filters[key] === undefined || filters[key] === '') && delete filters[key]);

    const logs = await Log.find(filters);
    res.status(200).json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Add a new endpoint for searching logs by resourceId
app.get('/logsByResourceId', async (req, res) => {
  try {
    // Extracting filters from query parameters
    const { level, message, resourceId, traceId, spanId, commit, parentResourceId } = req.query;

    // Construct a filter object based on the provided parameters
    const filters = {
      level,
      message: { $regex: new RegExp(message, 'i') },
      resourceId,
      traceId,
      spanId,
      commit,
      'metadata.parentResourceId': parentResourceId,
      // Add more filters as needed
    };

    // Remove undefined or empty filters
    Object.keys(filters).forEach(key => (filters[key] === undefined || filters[key] === '') && delete filters[key]);

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
  const { level, message, resourceId, traceId, spanId, commit, parentResourceId } = req.query;

    // Construct a filter object based on the provided parameters
    const filters = {
      level,
      message: { $regex: new RegExp(message, 'i') },
      resourceId,
      traceId,
      spanId,
      commit,
      'metadata.parentResourceId': parentResourceId,
      // Add more filters as needed
    };

    // Remove undefined or empty filters
    Object.keys(filters).forEach(key => (filters[key] === undefined || filters[key] === '') && delete filters[key]);

    const logs = await Log.find(filters);
    res.status(200).json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

//with spanId
app.get('/logsBySpanId', async (req, res) => {
 try {
    // Extracting filters from query parameters
    const { level, message, resourceId, traceId, spanId, commit, parentResourceId } = req.query;

    // Construct a filter object based on the provided parameters
    const filters = {
      level,
      message: { $regex: new RegExp(message, 'i') },
      resourceId,
      traceId,
      spanId,
      commit,
      'metadata.parentResourceId': parentResourceId,
      // Add more filters as needed
    };

    // Remove undefined or empty filters
    Object.keys(filters).forEach(key => (filters[key] === undefined || filters[key] === '') && delete filters[key]);

    const logs = await Log.find(filters);
    res.status(200).json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

//with commit
app.get('/logsByCommit', async (req, res) => {
 try {
    // Extracting filters from query parameters
    const { level, message, resourceId, traceId, spanId, commit, parentResourceId } = req.query;

    // Construct a filter object based on the provided parameters
    const filters = {
      level,
      message: { $regex: new RegExp(message, 'i') },
      resourceId,
      traceId,
      spanId,
      commit,
      'metadata.parentResourceId': parentResourceId,
      // Add more filters as needed
    };

    // Remove undefined or empty filters
    Object.keys(filters).forEach(key => (filters[key] === undefined || filters[key] === '') && delete filters[key]);

    const logs = await Log.find(filters);
    res.status(200).json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

//with ParentResourceId
app.get('/logsByParentResourceId', async (req, res) => {
  try {
    // Extracting filters from query parameters
    const { level, message, resourceId, traceId, spanId, commit, parentResourceId } = req.query;

    // Construct a filter object based on the provided parameters
    const filters = {
      level,
      message: { $regex: new RegExp(message, 'i') },
      resourceId,
      traceId,
      spanId,
      commit,
      'metadata.parentResourceId': parentResourceId,
      // Add more filters as needed
    };

    // Remove undefined or empty filters
    Object.keys(filters).forEach(key => (filters[key] === undefined || filters[key] === '') && delete filters[key]);

    const logs = await Log.find(filters);
    res.status(200).json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
app.get('/logsByTimestampRange', async (req, res) => {
  try {
    // Extracting filters
    const { level, message, resourceId, traceId, spanId, commit, parentResourceId } = req.query;

    // Construct a filter object based on the provided parameters
    const filters = {
      level,
      message: { $regex: new RegExp(message, 'i') },
      resourceId,
      traceId,
      spanId,
      commit,
      'metadata.parentResourceId': parentResourceId,
      // Add more filters as needed
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


// Start the server
app.listen(port, () => {
  console.log(`Log Ingestor and Query Interface listening at http://localhost:${port}`);
});
