const Pessoa = require("../models/pessoa")
const Endereco = require("../models/endereco")
const bcrypt = require("bcrypt") 
const SALT_ROUNDS = 10


const controller = {}

controller.getAll = async (req, res) => {
    try{
        const pessoas = await Pessoa.findAll({
            include: Endereco
        })
        // res.status(200).json(pessoas)
        res.status(200).render("pessoas/index", {pessoas})
    }catch(error){
        res.status(500).render("pages/error", {error})
    }
}

controller.getById = async (req, res) => {
    const {pessoaId} = req.params

    try{
        const pessoa = await Pessoa.findByPk(pessoaId,{
            include: Endereco,
        })
        
        if (!pessoa){
            // res.status(422).send("Pessoa não existe!")
            const error = "Pessoa não existe!"
            throw error
            // res.status(422).render("pages/error", {error})
        }

        // res.status(200).json(pessoa)
        const pessoas = [pessoa]
        res.status(200).render("pessoas/index", {pessoas})
    }catch(error){ 
        // res.status(422).json("Ocorreu um erro ao buscar o item. " + error)
        res.status(422).render("pages/error", {error})
    }
}

controller.create = async (req, res) => {
    //const {nome} = req.body
    //const {rua,cidade} = req.body.endereco
    const {nome, rua, cidade, username, password} = req.body
        
    try{
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
        const pessoa = await Pessoa.create({nome:nome, username:username, passwordHash:passwordHash})
        await Endereco.create({rua, cidade, pessoaId:pessoa.id})
        //res.status(200).json(pessoa)
        res.status(200).redirect("/")
    }catch(error){ 
        // res.status(422).send("Ocorreu um erro ao cadastrar a pessoa. " + error)
        res.status(422).render("pages/error", {error})

    }
}

controller.update = async (req, res) => {
    const {pessoaId} = req.params
    // const {nome} = req.body
    // const {rua,cidade} = req.body.endereco
    const {nome,rua,cidade,username,password} = req.body
    try{
        const pessoa = await Pessoa.findByPk(pessoaId)

        if (!pessoa){
            // res.status(422).send("Pessoa não existe!")
            const error = "Pessoa não existe!"
            throw error
        }

        pessoa.nome = nome
        pessoa.username = username
        pessoa.passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
        await pessoa.save()

        const endereco = await Endereco.findOne({
            where:{
                pessoaId : pessoaId
            }
        })

        if (!endereco){
            res.status(422).send("Endereço não existe!")
            const error = "Endereço não existe!"
            throw error
        }

        endereco.rua = rua
        endereco.cidade = cidade
        await endereco.save()

        // res.status(200).json(pessoa)
        res.status(200).redirect(`/pessoas/${pessoa.id}`)
    }catch (error){
        // res.status(422).send("Ocorreu um erro ao atualizar a pessoa. " + error)
        res.status(422).render("pages/error", {error})

    }
}

controller.delete = async (req, res) => {
    const {pessoaId} = req.params
    try{
        const pessoa = await Pessoa.findByPk(pessoaId)
        await pessoa.destroy()
        // res.status(200).json(pessoa)
        res.status(200).redirect("/pessoas")
    }catch (error){
        // res.status(422).send("Ocorreu um erro ao remover a pessoa. " + error)
        res.status(422).render("pages/error", {error})

    }
}

controller.getRegisterPage = async (req, res) => {
    try {
        res.status(200).render("pessoas/form")
    } catch (error){
        res.status(500).render("pages/error",{error: "Erro ao carregar o formulário!"})
    }
}

controller.getUpdatePage = async (req, res) => {
    const {pessoaId} = req.params
    try {
        const pessoa = await Pessoa.findByPk(pessoaId, {
            include: Endereco
        })

        if (!pessoa) {
            return res.status(422).render("pages/error",{error: "Pessoa não existe!"})
        }
        res.status(200).render("pessoas/edit",{
            pessoa
        })
    } catch (error) {
        res.status(500).render("pages/error",{error: "Erro ao carregar o formulário!"})
    }
}

controller.filterById = async (req, res) => {
    try {
        const {id} = req.body
        res.status(200).redirect(`/pessoas/${id}`)
    } catch (error){
        res.status(422).render("pages/error", {error})
    }
}

controller.getLoginPage = async (req, res) => {
    try {
        const url = req.originalUrl
        console.log(url)
        res.status(200).render("pages/login")
    } catch (error){
        res.status(422).render("pages/error", {error})
    }
}
controller.auth = async (req, res) => {
    try {
        const url = req.originalUrl
        console.log(url)
        const {username, password} = req.body
        const pessoa = await Pessoa.findOne({where: {username: username}})
        const validation = await bcrypt.compare(password, pessoa.passwordHash)
        console.log(validation)
        if (validation) {
            res.render("pages/index", {username: username})
            // res.send(`OK password: ${password}, passwordHash: ${pessoa.passwordHash}`)        
        }
        else {
            throw "Usuário ou Senha incorreto!"
        }

    } catch (error){
        res.render("pages/error", {error})
    }
}
module.exports = controller