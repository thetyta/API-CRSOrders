import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";
import Users from "./userModel.js";

const Address = sequelize.define(
    'addresses',
    {
        id: {
            field: 'id_address',
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        street: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        number: {
            type: DataTypes.STRING(255),
        },
        neighborhood: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        city: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        state: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        zipCode:{
            field:'zip_code',
            type: DataTypes.STRING(255),
            allowNull: false
        }
    },
    {
        freezeTableName: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);

Address.belongsTo(Users, {
    as: 'user',
    onUpdate: 'NO ACTION',
    onDelete: 'NO ACTION',
    foreignKey: {
        name: 'idUser',
        allowNull: false,
        field: 'id_user'
    }
})

export default Address