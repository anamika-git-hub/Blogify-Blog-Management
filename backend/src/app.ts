import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { config } from './config';
import userRoutes from './routes/userRoutes';
import blogRoutes from './routes/blogRoutes';

const app = express();

mongoose
  .connect(config.mongoURI as string)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes);

app.get('/', (req, res) => {
  res.send('Blog Platform API is running');
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server Error',
  });
});

export default app;