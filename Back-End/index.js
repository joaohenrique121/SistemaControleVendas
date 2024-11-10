const express = require("express");
const app = express(); 
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser')

const connection = require('./database/database')

app.use(cors())

const users = require('./database/Users')
const produtos = require('./database/Produtos')

connection.authenticate().then(()=>{
    console.log("Conectado ao banco")
}).catch((msgErro)=>{
    console.log(msgErro)
})

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.set('view engine', 'ejs')

app.use(express.static('public'))


app.post("/login", async (req, res) => {
    const { email, senha } = req.body;
    try {
        const user = await users.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: "Usuário não encontrado." });
        }

        const isPasswordValid = await bcrypt.compare(senha, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Senha inválida." }); // Alterado para 401
        }

        const token = jwt.sign({ userId: user.id }, 'privateKey', { expiresIn: '1h' });
        return res.status(200).json({ message: "Logado", user: user, token: token });
    } catch (error) {
        console.error("Erro ao realizar login:", error);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
});

app.post('/produto', async (req, res)=>{
    const product = await produtos.create({
        comprador: req.body.comprador,
        produto: req.body.produto,
        quantidade: req.body.quantidade,
        valor: req.body.valor
    })
    if(product){
        return res.status(200).json(product)
    }
    return res.status(404).json({'message': 'ERROR'})
})

app.get('/produto', async (req,res)=>{
    const products = await produtos.findAll()
    if(products){
        return res.status(200).json(products)
    }
    return res.status(404).json({'message': 'ERROR'})
})

app.delete("/produto/:id", async(req,res)=>{
    const deleted = await produtos.destroy({
        where: {id: req.params.id}
    })
    if(deleted){
        return res.status(200).json(deleted)
    }
    return res.status(404).json({'message': "ERRO"})
})

app.put("/produto/:id", async (req, res) => {
    const [updated] = await produtos.update(
        { comprador: req.body.comprador, produto: req.body.produto, quantidade: req.body.quantidade, valor: req.body.valor },
        { where: { id: req.params.id } }
    );

    if (updated) {
        const updatedProduct = await produtos.findOne({ where: { id: req.params.id } });
        return res.status(200).json(updatedProduct);
    }
    return res.status(404).json({ "message": "ERROR" });
});



// app.post("/login", async (req,res)=>{
//     const hashedPass = await bcrypt.hash(req.body.senha, 10)
//     await users.create({
//         email:req.body.email,
//         password: hashedPass
//     })
// })

app.listen(8181, function(erro){
    if(erro){
        console.log("erro")
    }else{
        console.log("Servidor iniciando...");
    }
});