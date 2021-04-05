//Aqui que vai estruturar os dados
const mongoose = require('mongoose');
//Permite criar novos schemas
const Schema = mongoose.Schema;

//coleção
const PessoaSchema = new Schema({
  nome_cad: {
      type: String,
      required: true
  },
  email_cad: {
      type: String,
      required: true
  },
  senha_cad: {
      type: String,
      required: true
  },
  comentario: {
      type: String
  },
  date: {
      type: String,
      default: Date.now()
  },
});

//Modelo que vai representar a estrutura dos dados
module.exports = Pessoa = mongoose.model("pessoa", PessoaSchema);
