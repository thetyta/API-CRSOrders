import bcrypt from 'bcrypt'
import sendMail from "../utils/sendMail.js"
import jwt from "jsonwebtoken"
import Users from "../models/userModel.js"
import { Op } from "sequelize"
import Products from "../models/productModel.js";

const get = async(req,res) =>{
    try {
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null
        if (!id) {
            const response = await Users.findAll({
                order: 
                [['id', 'ASC']]
            })
            return res.status(200).send({
                message: 'Dados encontrados',
                data: response
            })
        }

        const response = await Users.findOne({
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
            username,
            cpf,
            name,
            phone,
            password,
            role,
            cart,
            email,
            recovery
        } = corpo

        const verificaEmail = await Users.findOne({
            where: {
                email
            }
        });

        if (verificaEmail) {
            throw new Error(
                'Já existe um usuário com esse email'
            )
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const response = await Users.create({
            username,
            cpf,
            name,
            phone,
            passwordHash,
            role,
            cart,
            email,
            recovery
        })

        return response
    } catch (error) {
        throw new Error(error.message)
    }
};

const login = async (req,res) =>{
    try {
        const {
            email,
            password
        } = req.body

        const user = await Users.findOne({
            where: {
                email
            }
        });

        if(!user){
            return res.status(400).send({
                message: 'Usuário ou senha incorretos'
            })
        }

        const compararSenha = await bcrypt.compare(password, user.passwordHash)
        if (compararSenha) {
            const token = jwt.sign({ 
                id: user.id,
                username: user.username,
                email: user.email
            }, process.env.TOKEN_KEY, { expiresIn: '8h' });
            return res.status(200).send({
                message: 'sucesso!',
                response: token
            })
        } else {
            return res.status(400).send({
                message: 'Usuário ou senha incorretos'
            })
        }
        }
     catch (error) {
        throw new Error(error.message)
    }
}

const getPass = async (req, res) => {
    try {
        const { email } = req.body
        
        if(!email){
            return res.status(400).send({
                message: 'Email é obrigatorio'
            })
        }

        const user = await Users.findOne({
            where: {
                email
            }
        })
        
        if(!user){
            return res.status(400).send({
                message: 'Usuário com esse email não existe'
            })
        }

        const codigo = Math.floor(100000 + Math.random() * 900000).toString();
        const expiracao = new Date(Date.now());
        expiracao.setMinutes(expiracao.getMinutes() + 30);

        user.recovery = codigo
        user.recoveryExpires = expiracao

        await user.save()


        const body = `
        <h1>Recuperação de Senha</h1>
        <p>Olá, ${user.name}.</p>
        <p>Seu código de recuperação é: <strong>${codigo}</strong></p>
        <p>Este código expira em 30 minutos.</p>
        `;
        console.log(`\n body: ${body}`);
        
        
        await sendMail('joao.vc2006@unochapeco.edu.br', user.name, body, "Recuperação de Senha");

        return res.status(200).send({
            message: "Código de recuperação enviado para o e-mail."
        });
    } catch (error) {
        throw new Error(error.message)
    }
}

const resetPassword = async (req, res) => {
    try {
        const { email, recovery: codigo } = req.body;
        const novaSenha = req.body.novaSenha;
        const user = await Users.findOne({ 
            where: {
                email,
                recovery: codigo.toString(),
                recoveryExpires: { [Op.gt]: new Date() }
                }
            });
    
        if (!user) {
            return res.status(400).send({
                message: "Código inválido ou expirado."
            });
        }
    
        const passwordHash = await bcrypt.hash(novaSenha, 10);
    
        user.passwordHash = passwordHash;
        user.recovery = null; 
        user.recoveryExpires = null;
        await user.save();
    
        return res.status(200).send({
            message: "Senha atualizada com sucesso."
        });
    
    } catch (error) {
        return res.status(500).send({
            message: "Erro ao redefinir a senha.",
            error: error.message
        });
    }
 };

 const getDataByToken = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(400).send({
                message: 'Token não fornecido.'
            });
        }
        const user = jwt.verify(token, process.env.TOKEN_KEY);

        if (!user) {
            return res.status(400).send({
                message: 'Token inválido.'
            });
        }
        
        const userr = await Users.findOne({
            where: { id: user.id },
        })

        if (!userr) {
            return res.status(404).send({
                message: 'Usuário não encontrado.'
            });
        }
        
        const resposta = {
            id: userr.id,
            name: userr.name,
            role: userr.role,
            email: userr.email,
            cart: userr.cart,
        }


        return res.status(200).send({
            resposta
        });

    } catch (error) {
        return res.status(400).send({
            message: error.message
        });
    }
};

const update = async (corpo, id) => {
    try {
        const response = await Users.findOne({
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

        const response = await Users.findOne({
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
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

        if (!id) {
            const response = await create(req.body);
            return res.status(201).send({
                message: 'criado com sucesso!',
                data: response
            });
        }

        const user = await Users.findOne({ where: { id } });
        if (!user) {
            return res.status(404).send({ message: 'Usuário não encontrado.' });
        }

        if (
            req.user.role !== 'admin' &&
            user.id !== req.user.id
        ) {
            return res.status(403).send({ message: 'Você não tem permissão para atualizar este usuário.' });
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

const adicionarAoCarrinho = async (req, res) => {
    try {
        const userId = req.user.id;
        const { idProduct, quantity } = req.body;

        // Corrija a validação aqui:
        if (!idProduct || quantity === undefined || quantity === null) {
            return res.status(400).send({ message: "Produto e quantidade obrigatórios." });
        }

        const produto = await Products.findByPk(idProduct);
        if (!produto) {
            return res.status(404).send({ message: "Produto não encontrado." });
        }
        
        const user = await Users.findByPk(userId);
        let cart = Array.isArray(user.toJSON().cart) ? [...user.toJSON().cart] : [];
        console.log(cart);

        const index = cart.findIndex(item => Number(item.idProduct) === Number(idProduct));
        if (index > -1) {
            cart[index].quantity += quantity;
            if (cart[index].quantity <= 0) {
                cart.splice(index, 1);
            }
        } else if (quantity > 0) {
            cart.push({ idProduct: Number(idProduct), quantity });
        }

        cart = cart.filter(item => item.quantity > 0);
        
        console.log(user.cart);
        user.cart = cart;
        await user.save();

        return res.status(200).send({ message: "Produto adicionado ao carrinho.", cart });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

export default {
    get,
    persist,
    adicionarAoCarrinho,
    login,
    getPass,
    update,
    getDataByToken,
    resetPassword,
    destroy
}