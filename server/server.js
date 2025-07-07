import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware } from '@clerk/express';
import { serve } from 'inngest/express';
import { inngest, functions } from './inngest/index.js';
import connectDB from './configs/db.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

app.use('/api/inngest', serve({ client: inngest, functions }));

app.get('/', (req, res) => {
  res.send('Server is Live!');
});

await connectDB();

// 🔥 IMPORTANT: yahan app.listen() mat likhna
// Instead, export default app
export default app;
