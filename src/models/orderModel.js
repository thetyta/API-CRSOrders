import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";
import Users from "./userModel.js";
import Address from "./addressModel.js";
import Payments from "./paymentModel.js";
import Cupoms from "./cupomModel.js";

const Orders = sequelize.define(
    'orders',
    {
        id: {
            field: 'id_order',
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        status: {
            type: DataTypes.ENUM('pending', 'preparing', 'delivering', 'delivered'),
            defaultValue: 'pending'
        },
        totalPrice: {
            field: 'total_price',
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        totalDiscount:{
            field:'total_discount',
            type: DataTypes.DECIMAL(10, 2),
        },
    },
    {
        freezeTableName: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);

Orders.belongsTo(Users, {
    as: 'user_customer',
    onUpdate: 'NO ACTION',
    onDelete: 'NO ACTION',
    foreignKey: {
        name: 'idUserCustomer',
        allowNull: false,
        field: 'id_user_customer'
    }
});

Orders.belongsTo(Users, {
    as: 'user_delivery',
    onUpdate: 'NO ACTION',
    onDelete: 'NO ACTION',
    foreignKey: {
        name: 'idUserDelivery',
        field: 'id_user_delivery'
    }
});

Orders.belongsTo(Address, {
    as: 'address',
    onUpdate: 'NO ACTION',
    onDelete: 'NO ACTION',
    foreignKey: {
        name: 'idAddress',
        field: 'id_address'
    }
});

Orders.belongsTo(Payments, {
    as: 'payment',
    onUpdate: 'NO ACTION',
    onDelete: 'NO ACTION',
    foreignKey: {
        name: 'idPayment',
        allowNull: false,
        field: 'id_payment'
    }
});

Orders.belongsTo(Cupoms, {
    as: 'cupom',
    onUpdate: 'NO ACTION',
    onDelete: 'NO ACTION',
    foreignKey: {
        name: 'idCupom',
        field: 'id_cupom'
    }
})

export default Orders;