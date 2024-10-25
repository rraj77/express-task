const express = require('express');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
require('./schemas')

const {
  errorHandler,
  notFoundHandler,
} = require('./middleware/errorMiddleware');
require('dotenv').config();

const app = express();
app.use(express.json());

app.use(notFoundHandler);
app.use(errorHandler);

app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
