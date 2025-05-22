import categoryController from "../controllers/categoryController.js";
import adminMiddleware from '../middlewares/adminMiddleware.js';

export default (app) => {
    app.get('/categoria', categoryController.get);
    app.get('/categoria/:id', categoryController.get);
    app.post('/criar-categoria', categoryController.persist);
    app.patch('/criar-categoria/:id', categoryController.persist);
    app.delete('/deletar-categoria/:id', categoryController.destroy);
}