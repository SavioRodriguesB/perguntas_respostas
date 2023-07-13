const Sequelize = require("sequelize");
const connection = require("./database");

const Resposta = connection.define('resposta', {
    
    perguntaId:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    corpo:{
        type: Sequelize.TEXT,
        allowNull: false
    }
});

Resposta.sync({force: false}).then(() => {"Tabela Resposta criadada!"});

module.exports = Resposta;