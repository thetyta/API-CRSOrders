import Products from "../models/productModel.js"
import uploadFile from "../utils/uploadFile.js"
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const get = async(req,res) =>{
    try {
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null
        if (!id) {
            const response = await Products.findAll({
                order: 
                [['id', 'ASC']]
            })
            return res.status(200).send({
                message: 'Dados encontrados',
                data: response
            })
        }

        const response = await Products.findOne({
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
            name,
            description,
            price,
            idCategory,
        } = corpo

        const response = await Products.create({
            name,
            description,
            price,
            idCategory,
        })

        return response
    } catch (error) {
        throw new Error(error.message)
    }
}

const createImg = async (req, res) => {
    try {
        const { id } = req.body;
        if(!id) {
            return res.status(400).send({
                message: 'Nenhum ID fornecido'
            })
        }

        if (!req.files.arquivo) {
            return res.status(400).send({
                message: 'Nenhum arquivo enviado.'
            });
        }

        if(req.files.arquivo.mimetype != 'image/png'){
            return res.status(400).send({
                message: 'arquivo/tipo não suportado.'
            });
        }

        const arquivo = req.files.arquivo

        const product = await Products.findOne({ where: { id } });

        if (!product) {
            return res.status(404).send({
                message: 'Filme não encontrado.'
            });
        }

        const uploadResult = await uploadFile(arquivo, {tipo: 'imagem', tabela: 'produto', name: product.name, id: product.id});

        if (uploadResult.type === 'erro') {
            return res.status(500).send({
                message: 'Erro ao fazer upload da imagem',
                error: uploadResult.message
            });
        }

        product.imagemURL = uploadResult.message; 
        await product.save();

        return res.status(200).send({
            message: 'Imagem enviada com sucesso!',
            data: uploadResult
        });

    } catch (error) {
        return res.status(500).send({
            message: 'Erro ao enviar imagem',
            error: error.message
        });
    }
};

const update = async (corpo, id) => {
    try {
        const response = await Products.findOne({
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

        const response = await Products.findOne({
            where: {
                id
            }
        })
        if(!response){
            return res.status(404).send('not found')
        }

        if (response.imagemURL) {
            const imagePath = path.join(response.imagemURL);
            console.log(imagePath);
            
            try {
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            } catch (error) {
                throw new Error(error.message)
            }
        }
        console.log(response);
        await response.destroy()
        console.log(response);
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

const persist = async (req,res) => {
    try {
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null

        if(!id){
            const response = await create(req.body)
            return res.status(201).send({
                message: 'criado com sucesso!',
                data: response
            })
        }
        const response = await update(req.body, id)
            return res.status(201).send({
                message: 'atualizado com sucesso!',
                data: response
            })
    } catch (error) {
        return res.status(500).send({
            message: error.message
        })
    }
        
}


export default {
    get,
    persist,
    createImg,
    update,
    destroy
}