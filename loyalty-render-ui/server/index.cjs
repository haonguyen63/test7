
const express = require('express');
const app = express();
const authRoute = require('./routes/auth.cjs');

app.use(express.json());
app.use('/api/auth', authRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
