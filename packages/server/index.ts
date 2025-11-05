import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import router from './routes.ts';
dotenv.config();

const app = express();
// ✅ Allow requests only from frontend
app.use(
   cors({
      origin: ['https://www.falgenie.com', 'http://localhost:5173'],
      methods: ['GET', 'POST'],
   })
);

app.use(express.json());
app.use('/', router);

const port = process.env.PORT || 3000;

app.listen(Number(port), '0.0.0.0', () => {
   console.log(`Server is running at http://localhost:${port}`);
});
