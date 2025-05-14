import productController from "../controllers/productController.js";
import adminMiddleware from '../middlewares/adminMiddleware.js';

export default (app) => {
    app.get('/produto', adminMiddleware, productController.get);
    app.get('/produto/:id', adminMiddleware, productController.get);
    app.post('/criar-produto', adminMiddleware, productController.persist);
    app.post('/criar-produto/img', adminMiddleware, productController.createImg);
    app.patch('/criar-produto/:id', adminMiddleware, productController.persist);
    app.delete('/deletar-produto/:id', adminMiddleware, productController.destroy);
}