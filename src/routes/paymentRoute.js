import paymentController from "../controllers/paymentController.js";
import adminMiddleware from '../middlewares/adminMiddleware.js';
import userMiddleware from "../middlewares/userMiddleware.js";

export default (app) => {
    app.get('/pagamento', userMiddleware, paymentController.get);
    app.get('/pagamento/:id', userMiddleware, paymentController.get);
    app.post('/criar-pagamento', adminMiddleware, paymentController.persist);
    app.patch('/criar-pagamento/:id', adminMiddleware, paymentController.persist);
    app.delete('/deletar-pagamento/:id', adminMiddleware, paymentController.destroy);
}