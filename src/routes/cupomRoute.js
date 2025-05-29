import cupomController from "../controllers/cupomController.js";
import adminMiddleware from '../middlewares/adminMiddleware.js';

export default (app) => {
    app.get('/cupom', cupomController.get);
    app.get('/cupom/:id', cupomController.get);
    app.post('/criar-cupom', cupomController.persist);
    app.patch('/criar-cupom/:id', cupomController.persist);
    app.delete('/deletar-cupom/:id', cupomController.destroy);
}