import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";
import Categories from "./categoryModel.js";

const Products = sequelize.define(
    'products',
    {
        id: {
            field: 'id_product',
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(255),
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        imageURL: {
            field: 'image_url',
            type: DataTypes.STRING(255),
        },
    },
    {
        freezeTableName: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);

Products.belongsTo(Categories, {
    as: 'category',
    onUpdate: 'NO ACTION',
    onDelete: 'NO ACTION',
    foreignKey: {
        name: 'idCategory',
        allowNull: false,
        field: 'id_category'
    }
})

export default Products;