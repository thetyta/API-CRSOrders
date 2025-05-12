import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";


const Users = sequelize.define(
    'users',
    {
        id: {
            field: 'id_user',
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        cpf: {
            type: DataTypes.STRING(14),
            allowNull: false,
            unique: true
        },
        name: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        phone:{
            type: DataTypes.STRING(16),
            allowNull: false
        },
        passwordHash: {
            field: 'password_hash',
            type: DataTypes.STRING(255),
            allowNull: false
        },
        token: {
            type: DataTypes.STRING(255),
        },
        role: {
            type: DataTypes.ENUM('admin', 'user', 'delivery'),
            allowNull: false,
            defaultValue: 'user'
        },
        cart: {
            type: DataTypes.JSONB,
            defaultValue: null
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        recovery:{
            type: DataTypes.STRING(255),
        },
        recoveryExpires:{
            field: 'recovery_expires',
            type: DataTypes.DATE,
        }
    },
    {
        freezeTableName: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
)

export default Users