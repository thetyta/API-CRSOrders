import addressController from "../controllers/addressController.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import userMiddleware from '../middlewares/userMiddleware.js';

export default (app) => {
    app.get('/endereço', adminMiddleware, addressController.get);
    app.get('/endereço/:id', userMiddleware, addressController.get);
    app.post('/criar-endereço', userMiddleware, addressController.persist);
    app.patch('/criar-endereço/:id', userMiddleware, addressController.persist);
    app.delete('/deletar-endereço/:id', userMiddleware, addressController.destroy);
}