const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Parse JSON bodies
app.use(bodyParser.json());

// Import database connection
const db = require('./models');
const settingsRoutes = require('./routes/settings');


// Sync the database (creates tables if they don't exist)
db.sequelize.sync()
  .then(() => console.log('Database connected successfully!'))
  .catch(err => console.log('Error:', err));

// Add your routes here
app.use('/api', require('./routes/productRoutes'));
app.use('/api', require('./routes/sellRoutes'));
app.use('/api', settingsRoutes);


// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
