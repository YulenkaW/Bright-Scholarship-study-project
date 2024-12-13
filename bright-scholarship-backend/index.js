// index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const applicantsRouter = require('./routes/applicants');
const awardRouter = require('./routes/award');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/applicants', applicantsRouter);
app.use('/api/award', awardRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
