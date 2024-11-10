const sequelize = require('sequelize')
const connection = require('./database')

const user = connection.define('users',{
    email:{
        type: sequelize.STRING,
        allowNull:false,
        // primaryKey: true,
        // autoIncrement: true
    },
    password:{
        type:sequelize.STRING,
        allowNull:false
    }
})
user.sync({force:false}).then(()=>{
    console.log("tabela criada");
})
module.exports = user