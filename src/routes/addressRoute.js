import addressController from "../controllers/addressController.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import userMiddleware from '../middlewares/userMiddleware.js';

export default (app) => {
    app.get('/endereco', addressController.get);
    app.get('/endereco/:id', addressController.get);
    app.post('/criar-endereco', userMiddleware, addressController.persist);
    app.patch('/criar-endereco/:id', userMiddleware ,addressController.persist);
    app.delete('/deletar-endereco/:id', addressController.destroy);
}