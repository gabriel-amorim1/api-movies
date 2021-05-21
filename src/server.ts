import express from 'express';
import dotenv from 'dotenv';

import './database/connection';
import routes from './routes';

const app = express();

dotenv.config();

app.use(routes);

app.listen(3333, () => console.log("Server is running"));
