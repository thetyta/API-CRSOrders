import userController from '../controllers/userController.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';
import userMiddleware from '../middlewares/userMiddleware.js';

export default (app) => {
    app.get('/usuario', adminMiddleware, userController.get);
    app.get('/usuario/:id', adminMiddleware, userController.get);
    app.post('/criar-usuario', adminMiddleware, userController.persist);
    app.patch('/criar-usuario/:id', userMiddleware, userController.persist);
    app.delete('/deletar-usuario/:id', adminMiddleware, userController.destroy);
    app.get('/usuario/info', adminMiddleware, userController.getDataByToken);
    app.post('/usuario/carrinho', userMiddleware, userController.adicionarAoCarrinho);
    app.post('/esqueci-senha', userController.getPass);
    app.post('/resetar-senha', userController.resetPassword);
    app.post('/usuario/login', userController.login);
}