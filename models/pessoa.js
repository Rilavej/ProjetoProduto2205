const DataTypes = require("sequelize");
const db = require("../config/dbconnection")

const Pessoa = db.define('pessoa', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  
  
(async () => {
    try {
        await Pessoa.sync(); //{ force: true }
        console.log('Tabela de Pessoa criada com sucesso.');

    } catch (error) { 
        console.error('Não foi possível conectar-se ao banco de dados:', error);
    }
})();

module.exports = Pessoa