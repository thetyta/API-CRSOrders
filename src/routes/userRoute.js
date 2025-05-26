import userController from '../controllers/userController.js';
import userMiddleware from '../middlewares/userMiddleware.js';

export default (app) => {
    app.get('/usuario/info', userController.getDataByToken);
    app.get('/usuario', userController.get);
    app.get('/usuario/:id', userController.get);
    app.post('/criar-usuario', userController.persist);
    app.patch('/criar-usuario/:id', userController.persist);
    app.delete('/deletar-usuario/:id', userController.destroy);
    app.post('/usuario/carrinho', userMiddleware, userController.adicionarAoCarrinho);
    app.post('/esqueci-senha', userController.getPass);
    app.post('/resetar-senha', userController.resetPassword);
    app.post('/usuario/login', userController.login);
}