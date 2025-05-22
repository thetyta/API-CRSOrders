import productController from "../controllers/productController.js";
import adminMiddleware from '../middlewares/adminMiddleware.js';

export default (app) => {
    app.get('/produto', productController.get);
    app.get('/produto/:id', productController.get);
    app.post('/criar-produto', productController.persist);
    app.post('/criar-produto/img', productController.createImg);
    app.patch('/criar-produto/:id', productController.persist);
    app.delete('/deletar-produto/:id',  productController.destroy);
}