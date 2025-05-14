import categoryController from "../controllers/categoryController.js";
import adminMiddleware from '../middlewares/adminMiddleware.js';

export default (app) => {
    app.get('/categoria', adminMiddleware, categoryController.get);
    app.get('/categoria/:id', adminMiddleware, categoryController.get);
    app.post('/criar-categoria', adminMiddleware, categoryController.persist);
    app.patch('/criar-categoria/:id', adminMiddleware, categoryController.persist);
    app.delete('/deletar-categoria/:id', adminMiddleware, categoryController.destroy);
}