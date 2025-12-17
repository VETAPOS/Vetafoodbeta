// backend/src/index.js
// Express entrypoint (minimal). Backend holds all business logic; frontend only calls these APIs.
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// v1 API router (health, bootstrap, settings)
app.use('/api/v1', require('./routes/v1'));

app.get('/', (req, res) => res.send('Veta POS - Backend (Node.js)'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Backend listening on http://localhost:' + PORT));
