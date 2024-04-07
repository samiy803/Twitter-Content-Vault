import { Sequelize, DataTypes } from 'sequelize';


export const sequelize = new Sequelize(process.env.PG_CONN || "");

export const Joke = sequelize.define('Joke', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    joke: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    discarded: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    used: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    approved: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    createdAt: false,
    updatedAt: false,
    tableName: process.env.NODE_ENV == "production" ? "jokes" : "dev_jokes",
});

export const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    username: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    createdAt: false,
    updatedAt: false,
    tableName: 'users',
});