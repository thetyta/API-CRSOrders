import cupomController from "../controllers/cupomController.js";
import adminMiddleware from '../middlewares/adminMiddleware.js';

export default (app) => {
    app.get('/cupom', adminMiddleware, cupomController.get);
    app.get('/cupom/:id', adminMiddleware, cupomController.get);
    app.post('/criar-cupom', adminMiddleware, cupomController.persist);
    app.patch('/criar-cupom/:id', adminMiddleware, cupomController.persist);
    app.delete('/deletar-cupom/:id', adminMiddleware, cupomController.destroy);
}