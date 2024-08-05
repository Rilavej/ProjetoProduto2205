const express = require("express")
const ProductController = require("../controllers/ProductController")
const PessoaController = require("../controllers/PessoaController")
const EnderecoController = require("../controllers/EnderecoController")
const PedidoController = require("../controllers/PedidoController")

const routes = express.Router()

routes.get("/",(req,res)=>{
    res.status(200).render("pages/index",{
        pessoaId:1
    })
})

routes.get("/produtos/novo",ProductController.getRegisterPage)
routes.get("/produtos/:produtoId/update",ProductController.getUpdatePage)

routes.get("/produtos",ProductController.getAll)
routes.get("/produtos/:produtoId",ProductController.getById)
routes.post("/produtos",ProductController.create)
routes.put("/produtos/:produtoId",ProductController.update)
routes.delete("/produtos/:produtoId",ProductController.delete)


routes.get("/pedidos/:pessoaId",PedidoController.getAll)
routes.get("/pedidos/:pessoaId/:pedidoId",PedidoController.getById)
routes.post("/pedidos/:pessoaId",PedidoController.create)
routes.put("/pedidos/:pessoaId/:pedidoId",PedidoController.update)
routes.delete("/pedidos/:pessoaId/:pedidoId",PedidoController.delete)

routes.get("/pessoas",PessoaController.getAll)
routes.get("/pessoas/:pessoaId",PessoaController.getById)
routes.post("/pessoas",PessoaController.create)
routes.put("/pessoas/:pessoaId",PessoaController.update)
routes.delete("/pessoas/:pessoaId",PessoaController.delete)

module.exports = routes