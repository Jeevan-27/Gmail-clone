// const express = require('express');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const authRoutes = require('./routes/auth');
// const cors = require('cors');
// const groupRoutes = require('./routes/groups');

// // Load environment variables
// dotenv.config();

// const app = express();

// // Allow all origins for development purposes
// app.use(cors());

// // OR, allow specific origins only
// app.use(cors({
//   origin: 'http://localhost:3000' // Frontend URL
// }));

// // Middleware
// app.use(express.json()); // To parse JSON bodies

// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.error('MongoDB connection error:', err));

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/groups', groupRoutes);

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// const express = require('express');
// const dotenv = require('dotenv');
// const cors = require('cors');

// // Load environment variables
// dotenv.config();

// // Import routes
// const authRoutes = require('./routes/auth');
// const groupRoutes = require('./routes/groups');

// // Initialize express app
// const app = express();

// // Middleware
// app.use(express.json()); // Body parser for JSON
// app.use(cors()); // Enable CORS

// // Connect to MongoDB
// const connectDB = require('./config/db');
// connectDB();

// // Use Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/groups', groupRoutes);

// // Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });


const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const groupRoutes = require('./routes/groups');
const inboxRoutes = require('./routes/inbox');
const starredRoute = require('./routes/starred');
const draftRoutes = require('./routes/drafts');
const binEmailsRoute = require('./routes/binEmails');
const sentRoutes = require('./routes/sentMails');
const sendRoute = require('./routes/send');
const allMailsRoute = require('./routes/allMails');
const searchMailsRoute = require('./routes/searchMails');
const fp = require('./routes/fp');
const countryRoutes = require('./routes/countries');
const countryCodeRoutes = require('./routes/CountryCodes');

// Initialize express app
const app = express();

// Middleware
app.use(express.json()); // Body parser for JSON
app.use(cors({ origin: 'http://localhost:3000' })); 

// Connect to MongoDB
const connectDB = require('./config/db');
connectDB();

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/inbox', inboxRoutes);
app.use('/api/starred', starredRoute);
app.use('/api/drafts', draftRoutes);
app.use('/api/binEmails', binEmailsRoute); 
app.use('/api/sent',sentRoutes);
app.use('/api/send',sendRoute);
app.use('/api/allMails', allMailsRoute);
app.use('/api/searchMails',searchMailsRoute);
app.use('/api/fp', fp);
app.use('/api/countries', countryRoutes);
app.use('/api/countrycodes', countryCodeRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is healthy' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});