import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";

const Cupoms = sequelize.define(
    'cupoms',
    {
        id: {
            field: 'id_cupom',
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        code: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        value: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        uses: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
    },
    {
        freezeTableName: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);

export default Cupoms;