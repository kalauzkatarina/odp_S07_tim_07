import express from 'express';
import cors from 'cors';

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.get<{}, {data: string}>('/', (req, res) => {
  res.json({
    data: "response",
  });
});

//app.use('/api/v1', api);

export default app;
