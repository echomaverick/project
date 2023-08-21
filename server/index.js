const express = require('express');
const connectDB = require('./config/dbConfig');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const roleRoutes = require('./routes/roleRoutes');
const projectRoutes = require('./routes/projectRoutes');
const searchRoutes = require('./routes/searchRoutes');
const dotenv = require('dotenv');
const emailRoutes = require('./routes/emailRoutes');
const serveless = require('serverless-http');

dotenv.config();
const secretKey = process.env.SECRET_KEY;
const refreshSecretKey = process.env.REFRESH_SECRET_KEY;
const app = express();
const cors = require('cors');

connectDB();
app.use(express.json());
app.use(cors());

app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/projects', projectRoutes);

app.use('/api/emails', emailRoutes);

app.use('/api/search/projects', searchRoutes);

// app.listen(5000, () => {
//   console.log(`Server started on port 5000`);
// });


module.exports.handler = serveless(app);