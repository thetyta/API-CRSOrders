import userController from '../controllers/userController.js';

export default (app) => {
    app.get('/user', userController.get);
    app.get('/user/:id', userController.get);
    app.post('/user', userController.persist);
    app.patch('/user/:id', userController.persist);
    app.delete('/user/:id', userController.destroy);
    app.get('/user/info', userController.getDataByToken);
    app.post('/forgot-pass-request', userController.getPass)
    app.post('/forgot-pass-reset', userController.resetPassword)
    app.post('/user/login', userController.login)
}