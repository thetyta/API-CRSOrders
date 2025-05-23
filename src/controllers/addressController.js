import Address from "../models/addressModel.js"

const get = async(req,res) =>{
    try {
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null
        if (!id) {
            const response = await Address.findAll({
                order: 
                [['id', 'ASC']]
            })
            return res.status(200).send({
                message: 'Dados encontrados',
                data: response
            })
        }

        const response = await Address.findOne({
            where: {
                id: id
            }
        })
    if (!response) {
        return res.status(404).send('not found')
    }
        return res.status(200).send({
                message: 'Dados encontrados',
                data: response
        })
    } catch (error) {
        return res.status(500).send({
            message: error.message
        })
    }
}

const create = async (corpo) => {
    try {
        const {
            street,
            number,
            neighborhood,
            city,
            state,
            zipCode,
            idUser
        } = corpo

        const response = await Address.create({
            street,
            number,
            neighborhood,
            city,
            state,
            zipCode,
            idUser
        })

        return response
    } catch (error) {
        throw new Error(error.message)
    }
}

const update = async (corpo, id) => {
    try {
        const response = await Address.findOne({
            where: {
                id
            }
        })
        if (!response) {
            throw new Error()
        }

        Object.keys(corpo).forEach((item) => response[item] = corpo[item])
        await response.save()

        return response;
    } catch (error) {
        throw new Error(error.message)
    }
}

const destroy = async (req,res) => {
    try {
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null
        if (!id) {
            return res.status(400).send('informa ai paizao')
        }

        const response = await Address.findOne({
            where: {
                id
            }
        })
        if(!response){
            return res.status(404).send('not found')
        }

        await response.destroy()

        return res.status(200).send({
            message: 'registro excluido',
            data:response
        })
    } catch (error) {
        return res.status(500).send({
            message: error.message
        })
    }
}

const persist = async (req, res) => {
    try {
        const userId = req.user?.id;
        const userRole = req.user?.role;
        if (!userId) {
            return res.status(401).send({ message: 'Token inválido ou não enviado.' });
        }

        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

        // Se for admin, pode definir o idUser pelo body, senão força o id do próprio usuário
        const targetUserId = userRole === 'admin' && req.body.idUser ? req.body.idUser : userId;

        if (!id) {
            // Criação
            const response = await create({ ...req.body, idUser: targetUserId });
            return res.status(201).send({
                message: 'criado com sucesso!',
                data: response
            });
        }

        // Atualização: admin pode alterar qualquer endereço, usuário comum só o próprio
        const whereClause = userRole === 'admin'
            ? { id }
            : { id, idUser: userId };

        const address = await Address.findOne({ where: whereClause });
        if (!address) {
            return res.status(404).send({ message: 'Endereço não encontrado ou não pertence ao usuário.' });
        }

        const response = await update(req.body, id);
        return res.status(201).send({
            message: 'atualizado com sucesso!',
            data: response
        });
    } catch (error) {
        return res.status(500).send({
            message: error.message
        });
    }
}


export default {
    get,
    persist,
    update,
    destroy
}