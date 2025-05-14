import orderProductController from "../controllers/orderProductController.js";
import userMiddleware from '../middlewares/userMiddleware.js';

export default (app) => {
    app.get('/produto-pedido', userMiddleware, orderProductController.get);
    app.get('/produto-pedido/:id', userMiddleware, orderProductController.get);
    app.post('/criar-produto-pedido', userMiddleware, orderProductController.persist);
    app.patch('/criar-produto-pedido/:id', userMiddleware, orderProductController.persist);
    app.delete('/deletar-produto-pedido/:id', userMiddleware, orderProductController.destroy);
}