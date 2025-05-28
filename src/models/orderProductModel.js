import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";
import Products from "./productModel.js";
import Orders from "./orderModel.js";

const orderProducts = sequelize.define(
    'orders_products',
    {
        id: {
            field: 'id_order_product',
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        priceProducts: {
            field: 'price_products',
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
    },
    {
        freezeTableName: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);

orderProducts.belongsTo(Orders, {
    as: 'order',
    onUpdate: 'NO ACTION',
    onDelete: 'NO ACTION',
    foreignKey: {
        name: 'idOrder',
        allowNull: false,
        field: 'id_order'
    }
})

orderProducts.belongsTo(Products, {
    as: 'product',
    onUpdate: 'NO ACTION',
    onDelete: 'NO ACTION',
    foreignKey: {
        name: 'idProduct',
        allowNull: false,
        field: 'id_product'
    }
})

export default orderProducts;