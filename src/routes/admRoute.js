import express from 'express';
import userMiddleware from '../middlewares/userMiddleware.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';

const router = express.Router();

router.use(userMiddleware, adminMiddleware); // Protege todas as rotas abaixo

router.get('/', (req, res) => {
    res.status(200).send({ message: 'Acesso autorizado!' });
});

// Exemplo de subrota protegida:
router.get('/usuarios', (req, res) => {
    res.status(200).send({ message: 'Usuários admin' });
});

export default (app) => {
    app.use('/admin', router);
};