const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');
const ejs = require('ejs');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
if (process.env.SKIP_MONGODB !== 'true') {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.log('Skipping MongoDB connection for demonstration purposes');
}

// Routes (to be implemented)
// app.use('/', require('./routes/index'));
// app.use('/api/affiliates', require('./routes/affiliates'));
// app.use('/api/leads', require('./routes/leads'));
// app.use('/api/emails', require('./routes/emails'));

// Default route
app.get('/', (req, res) => {
  res.render('index', { title: 'Menschgreifzu - Affiliate Marketing Platform' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { 
    title: 'Error', 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
