// server.ts
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { router } from './routes/userRoutes';

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Importe e use as rotas da API aqui
app.use(router)

const port = 3000;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
