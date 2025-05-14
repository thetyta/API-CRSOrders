import bcrypt from "bcrypt";
import Users from "./models/userModel.js";
import Category from "./models/categoryModel.js";
import Products from "./models/productModel.js";
import Address from "./models/addressModel.js";
import Cupom from "./models/cupomModel.js";
import Payments from "./models/paymentModel.js";
import Orders from "./models/orderModel.js";
import OrderProducts from "./models/orderProductModel.js";
import { sequelize } from "./config/postgres.js";

async function seed() {
  try {
    await sequelize.sync({ force: true }); // CUIDADO: apaga tudo e recria as tabelas

    // Gera hash das senhas
    const senha1 = await bcrypt.hash("senha123", 10);
    const senha2 = await bcrypt.hash("senha123", 10);
    const senha3 = await bcrypt.hash("senha123", 10);

    // Usuários
    const users = await Users.bulkCreate([
      {
        username: "joao",
        cpf: "123.456.789-00",
        name: "João da Silva",
        phone: "48999990001",
        passwordHash: senha1,
        role: "user",
        cart: null,
        email: "joao@email.com"
      },
      {
        username: "maria",
        cpf: "987.654.321-00",
        name: "Maria Souza",
        phone: "48999990002",
        passwordHash: senha2,
        role: "admin",
        cart: null,
        email: "maria@email.com"
      },
      {
        username: "entregador",
        cpf: "111.222.333-44",
        name: "Carlos Entregador",
        phone: "48999990003",
        passwordHash: senha3,
        role: "delivery",
        cart: null,
        email: "carlos@email.com"
      }
    ]);
    // Categorias
    const categories = await Category.bulkCreate([
      { name: "Bebidas" },
      { name: "Lanches" },
      { name: "Sobremesas" }
    ]);

    // Produtos
    const products = await Products.bulkCreate([
      {
        name: "Coca-Cola",
        description: "Refrigerante lata 350ml",
        price: 6.50,
        idCategory: categories[0].id
      },
      {
        name: "X-Salada",
        description: "Hambúrguer com salada",
        price: 18.00,
        idCategory: categories[1].id
      },
      {
        name: "Sorvete",
        description: "Sorvete de creme 120ml",
        price: 8.00,
        idCategory: categories[2].id
      }
    ]);

    // Endereços
    const addresses = await Address.bulkCreate([
      {
        street: "Rua das Flores",
        number: "100",
        neighborhood: "Centro",
        city: "Chapecó",
        state: "SC",
        zipCode: "89801-000",
        idUser: users[0].id
      },
      {
        street: "Av. Brasil",
        number: "200",
        neighborhood: "Bairro Norte",
        city: "Chapecó",
        state: "SC",
        zipCode: "89802-000",
        idUser: users[1].id
      },
      {
        street: "Rua do Entregador",
        number: "300",
        neighborhood: "Bairro Sul",
        city: "Chapecó",
        state: "SC",
        zipCode: "89803-000",
        idUser: users[2].id
      }
    ]);

    // Cupons
    const cupons = await Cupom.bulkCreate([
      {
        code: "DESC10",
        type: "percent",
        value: 10.00,
        uses: 5
      },
      {
        code: "FRETEGRATIS",
        type: "shipping",
        value: 100.00,
        uses: 10
      },
      {
        code: "DESC5",
        type: "percent",
        value: 5.00,
        uses: 3
      }
    ]);

    // Pagamentos
    const payments = await Payments.bulkCreate([
      { name: "Cartão de Crédito" },
      { name: "Pix" },
      { name: "Dinheiro" }
    ]);

    // Pedidos
    const orders = await Orders.bulkCreate([
      {
        status: "pending",
        totalPrice: 31.00,
        totalDiscount: 0,
        idUserCustomer: users[0].id,
        idAddress: addresses[0].id,
        idCupom: cupons[0].id,
        idPayment: payments[0].id
      },
      {
        status: "pending",
        totalPrice: 54.00,
        totalDiscount: 0,
        idUserCustomer: users[1].id,
        idAddress: addresses[1].id,
        idCupom: cupons[1].id,
        idPayment: payments[1].id
      },
      {
        status: "pending",
        totalPrice: 14.50,
        totalDiscount: 0,
        idUserCustomer: users[2].id,
        idAddress: addresses[2].id,
        idCupom: cupons[2].id,
        idPayment: payments[2].id
      }
    ]);

    // Itens do Pedido
    await OrderProducts.bulkCreate([
      {
        idOrder: orders[0].id,
        idProduct: products[0].id,
        quantity: 2,
        priceProducts: 6.50
      },
      {
        idOrder: orders[0].id,
        idProduct: products[1].id,
        quantity: 1,
        priceProducts: 18.00
      },
      {
        idOrder: orders[2].id,
        idProduct: products[2].id,
        quantity: 1,
        priceProducts: 8.00
      }
    ]);

    console.log("Dados populados com sucesso!");
    process.exit(0);
  } catch (error) {
    console.error("Erro ao popular dados:", error);
    process.exit(1);
  }
}

seed();