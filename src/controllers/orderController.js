import Orders from "../models/orderModel.js"
import Payments from "../models/paymentModel.js"
import orderProducts from "../models/orderProductModel.js"
import Products from "../models/productModel.js"
import Users from "../models/userModel.js";
import Address from "../models/addressModel.js";

const get = async (req, res) => {
  try {
    const pedidos = await Orders.findAll({ order: [['id', 'ASC']] });
    const usuarios = await Users.findAll({ attributes: ['id', 'name'] });
    const itens = await orderProducts.findAll();
    const produtos = await Products.findAll({ attributes: ['id', 'name', 'price', 'imageURL', 'description'] });
    const enderecos = await Address.findAll({ attributes: ['id', 'street', 'number', 'neighborhood', 'city', 'state', 'zipCode'] });

    const data = pedidos.map(pedido => {
      const cliente = usuarios.find(u => u.id === pedido.idUserCustomer);
      const entregador = usuarios.find(u => u.id === pedido.idUserDelivery);
      const endereco = enderecos.find(e => e.id === pedido.idAddress);
      const itensPedido = itens.filter(i => i.idOrder === pedido.id)
        .map(item => {
          const produto = produtos.find(p => p.id === item.idProduct);
          return {
            name: produto?.name,
            price: produto?.price,
            imageURL: produto?.imageURL,
            description: produto?.description,
            quantity: item.quantity
          };
        });
      return {
        id: pedido.id,
        status: pedido.status,
        payStatus: pedido.payStatus, 
        totalPrice: pedido.totalPrice,
        totalDiscount: pedido.totalDiscount, 
        created_at: pedido.created_at,
        idUserCustomer: pedido.idUserCustomer, 
        idUserDelivery: pedido.idUserDelivery, 
        idAddress: pedido.idAddress, 
        idPayment: pedido.idPayment, 
        idCupom: pedido.idCupom, 
        cliente_nome: cliente?.name,
        cliente_endereco: endereco ? `${endereco.street}, ${endereco.number}, ${endereco.neighborhood}, ${endereco.city} - ${endereco.state}, ${endereco.zipCode}` : null,
        entregador_nome: entregador?.name,
        itens: itensPedido
      };
      
      
    });

    return res.status(200).send({ data });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const create = async (corpo) => {
    try {
        const {
            status,  
            totalPrice,                   
            totalDiscount,
            idUserCustomer,
            idUserDelivery,
            idAddress,
            idPayment,
            idCupom,          
        } = corpo

        const response = await Orders.create({
            status,  
            totalPrice,                   
            totalDiscount,
            idUserCustomer,
            idUserDelivery,
            idAddress,
            idPayment,
            idCupom,
        })
        return response
    } catch (error) {
        throw new Error(error.message)
    }
}

const update = async (corpo, id) => {
    try {
        const response = await Orders.findOne({
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

        const response = await Orders.findOne({
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

const pagarPedido = async (req, res) => {
    try {
        const pedidoId = req.params.id;
        const userId = req.user.id;

        const pedido = await Orders.findOne({ where: { id: pedidoId, idUserCustomer: userId } });
        if (!pedido) {
            return res.status(404).send({ message: "Pedido não encontrado ou não pertence ao usuário." });
        }
        if (pedido.status === "preparing" || pedido.status === "delivered" || pedido.status === "delivering" ) {
            return res.status(400).send({ message: "Pedido já está pago." });
        }
        if (pedido.status === "canceled") {
            return res.status(400).send({ message: "Pedido cancelado, não pode ser pago." });
        }

        const pagamento = await Payments.create({ name: `Pagamento do pedido ${pedidoId} - ${Date.now()}` });
        if (!pagamento || !pagamento.id) {
            return res.status(500).send({ message: "Erro ao registrar pagamento." });
        }

        pedido.idPayment = pagamento.id;
        pedido.status = "preparing";
        await pedido.save();

        return res.status(200).send({ message: "Pedido pago com sucesso!", data: pedido });
    } catch (error) {
        console.error("Erro ao pagar pedido:", error);
        return res.status(500).send({ message: error.message });
    }
};
const criarPedidoDoCarrinho = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await Users.findByPk(userId);

        const carrinho = Array.isArray(req.body.cart) && req.body.cart.length > 0
            ? req.body.cart
            : user.cart;

        if (!carrinho || carrinho.length === 0) {
            return res.status(400).send({ message: "Carrinho vazio." });
        }

        let totalPrice = 0;
        for (const item of carrinho) {
            const produto = await Products.findByPk(item.idProduct);
            if (!produto) {
                return res.status(404).send({ message: `Produto ${item.idProduct} não encontrado.` });
            }
            totalPrice += Number(produto.price) * Number(item.quantity);
        }

        const pedido = await Orders.create({
            status: 'pending',
            totalPrice,
            totalDiscount: 0,
            idUserCustomer: userId,
            idAddress: req.body.idAddress,
            idPayment: req.body.idPayment,
            idCupom: req.body.idCupom || null
        });

        // Cria os itens do pedido
        for (const item of carrinho) {
            const produto = await Products.findByPk(item.idProduct);
            await orderProducts.create({
                idOrder: pedido.id,
                idProduct: item.idProduct,
                quantity: item.quantity,
                priceProducts: produto.price
            });
        }

        
        user.cart = [];
        await user.save();

        return res.status(201).send({
            message: 'Pedido criado com sucesso a partir do carrinho!',
            data: pedido
        });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

// No final do export default:
export default {
    get,
    persist,
    update,
    pagarPedido,
    criarPedidoDoCarrinho, 
    destroy
}
