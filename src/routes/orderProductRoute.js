import orderProductController from "../controllers/orderProductController.js";

export default (app) => {
    app.get('/orderproduct', orderProductController.get);
    app.get('/orderproduct/:id', orderProductController.get);
    app.post('/orderproduct', orderProductController.persist);
    app.patch('/orderproduct/:id', orderProductController.persist);
    app.delete('/orderproduct/:id', orderProductController.destroy);
}