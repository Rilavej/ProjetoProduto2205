const Pessoa = require("../models/pessoa")
const Pedido = require("../models/pedido")
const Produto = require("../models/product")
const Cor = require("../models/cor")

const controller = {}

controller.getAll = async (req, res) => {
    try{
        const pedidos = await Pedido.findAll({
            include: [{ model: Produto, through: "pedidoProduto" },
            {
                model: Pessoa
            }],
          })
          const pessoa = pedidos[0].pessoa
        //res.status(200).json(pedidos)
        res.status(200).render("pedidos/index",{
            pedidos : pedidos,
            pessoa : pessoa
        })
    }catch(error){
        //res.status(500).json(error)
        res.status(500).render("pages/error",{error : "Erro ao exibir os pedidos"})

    }
}

controller.getById = async (req, res) => {
    const {pessoaId,pedidoId} = req.params

    try{
        const pessoa = await Pessoa.findByPk(pessoaId,{
            include: [
                {
                    model: Pedido,
                    include: [
                    /*{ 
                        model: Produto, through: "pedidoProduto" 
                    }*/
                    {
                        model: Produto,
                        include: [{ model: Cor, through: "produtoCor" }],
                    },
                    ],
                }
            ],
        })
        
        if (!pessoa){
            return res.status(500).render("pages/error",{error : "Pessoa não existe!"})
        }

        const pedido = pessoa.pedidos.find((pedido) => pedido.id === Number(pedidoId));
        
        if (!pedido) {
            return res.status(500).render("pages/error",{error : "Pedido não existe!"})
        }
        console.log(pedido.produtos)
        //res.status(200).json(pedido);
        res.status(200).render("pedidos/show",{
            pedido : pedido,
            pessoa : pessoa
        })
    }catch(error){
        //res.status(500).json(error)
        res.status(500).render("pages/error",{error : "Erro ao exibir o pedido"})
    }
    
}

controller.create = async (req, res) => {
    const {pessoaId} = req.params
    const {produtosIds} = req.body

    console.log(pessoaId,produtosIds)

    try{
        const pessoa = await Pessoa.findByPk(pessoaId)
        
        if (!pessoa){
            res.status().send("Pessoa não existe!")
        }
        
        const produtos = await Produto.findAll({ where: { id: produtosIds } });
        
        let valorPedido = 0
        for (produto of produtos){
            valorPedido += parseFloat(produto.preco)
        }

        const pedido = await Pedido.create({valor:valorPedido,status:"Aguardando Pagamento",pessoaId})
        
        await pedido.addProdutos(produtos);
     
        res.status(200).json(pedido.id)
    }catch(error){ 
        res.status(500).render("pages/error",{error : "Erro ao cadastrar o pedido"})
    }
}

//falta implementar front-end
controller.update = async (req, res) => {
    const {pessoaId,pedidoId} = req.params
    const {status} = req.body

    try{
        const pessoa = await Pessoa.findByPk(pessoaId,{
            include: [
                {
                    model: Pedido,
                    include: [{ model: Produto, through: "pedidoProduto" }],
                },
            ],
        })
        
        if (!pessoa){
            res.status(404).send("Pessoa não existe!")
        }

        const pedido = pessoa.pedidos.find((pedido) => pedido.id === Number(pedidoId));
        
        if (!pedido) {
            return res.status(404).send("Pedido não encontrado!");
        }

        pedido.status = status

        await pedido.save()
        
        res.status(200).json(pedido)
    }catch (error){
        res.status(422).send("Ocorreu um erro ao atualizar o pedido. " + error)
    }

}

controller.delete = async (req, res) => {
    const {pessoaId,pedidoId} = req.params
    try{
        const pessoa = await Pessoa.findByPk(pessoaId)

        if (!pessoa){
            res.status(422).send("Pessoa não existe!")
        }

        const pedido = await Pedido.findByPk(pedidoId)

        if (!pedido){
            res.status(422).send("Pedido não existe!")
        }

        await pedido.destroy()
        res.status(200).redirect(`/pedidos/${pessoaId}`)
    }catch (error){
        res.status(422).render("pages/error",{error: "Não foi possível remover o pedido"})

    }
    
}

module.exports = controller