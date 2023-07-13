const Sequelize = require('sequelize');

const connection = new Sequelize('estudo_perguntas','root','',{
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

module.exports = connection;
