import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";

const Payments = sequelize.define(
    'payments',
    {
        id: {
            field: 'id_payment',
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(255),
            unique: true,
            allowNull: false,
        },
    },
    {
        freezeTableName: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);

export default Payments;