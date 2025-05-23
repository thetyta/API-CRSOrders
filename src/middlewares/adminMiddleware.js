export default async (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return res.status(403).send({ message: 'Acesso negado: apenas administradores.' });
};