import jwt from "jsonwebtoken";
import Users from "../models/userModel.js";


export default async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(404).send({ message: 'Página não existe' });
        }

        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        const user = await Users.findOne({ where: { id: decoded.id } });

        if (!user) {
            return res.status(404).send({ message: 'Página não existe' });
        }

        if (user.role === 'admin') {
            req.user = user;
            return next();
        }

        return res.status(404).send({ message: 'Página não existe' });
    } catch (error) {
        return res.status(500).json({
            error: error.message,
            message: "Erro ao verificar permissão de administrador."
        });
    }
};