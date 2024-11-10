const sequelize = require('sequelize')
const connection = require('./database')


const Produto = connection.define('produtos', {
    comprador:{
        type: sequelize.STRING,
        allowNull: false
    },
    produto:{
        type: sequelize.STRING,
        allowNull: false
    },
    quantidade:{
        type: sequelize.INTEGER,
        allowNull: false
    },
    valor:{
        type: sequelize.DOUBLE,
        allowNull: false
    }
})

Produto.sync({force:false}).then(()=>{
    console.log("tabela criada");
})

module.exports = Produto