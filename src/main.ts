import express from 'express';
const morgan = require("morgan");
import imageRouter  from '@/routes/image';
import { envs } from './config/env';
const app = express();

const { PORT, HOSTNAME, DEFAULT_API_PREFIX, BODY_SIZE_LIMIT } = envs;

app.use(morgan("combined"))
app.use(express.json({ limit: BODY_SIZE_LIMIT }));

app.use(DEFAULT_API_PREFIX, imageRouter);

app.listen(PORT || 8000, HOSTNAME || "127.0.0.1", () => console.log(`MS-IMAGES-BS STARTED - ${HOSTNAME}:${PORT}`));