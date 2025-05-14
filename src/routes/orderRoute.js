import orderController from "../controllers/orderController.js";
import userMiddleware from '../middlewares/userMiddleware.js';

export default (app) => {
    app.get('/pedido', userMiddleware, orderController.get);
    app.get('/pedido/:id', userMiddleware, orderController.get);
    app.post('/criar-pedido', userMiddleware, orderController.persist);
    app.patch('/criar-pedido/:id', userMiddleware, orderController.persist);
    app.delete('/deletar-pedido/:id', userMiddleware, orderController.destroy);
    app.post('/pagar-pedido/:id', userMiddleware, orderController.pagarPedido);
    app.post('/criar-pedido-do-carrinho', userMiddleware, orderController.criarPedidoDoCarrinho);
}