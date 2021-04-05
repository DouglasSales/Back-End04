const express = require('express');
//objeto router para fazer o tratamento de rotas
const router = express.Router();

//importar a coleção
const Pessoa = require("../models/pessoa");
//criptografia
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.post('/signup', (req, res) => {
//método findOne
  Pessoa.findOne({email_cad: req.body.email_cad})
  .then(
    doc_pessoa => {
      if (doc_pessoa){
        //Email existente
        return res.status(400).json({emailerror: "Email já registrado no sistema"});
      }else{
        //cadastrar usuário no banco de dados
        const novo_registro_pessoa = Pessoa({
          nome_cad: req.body.nome_cad,
          email_cad: req.body.email_cad,
          senha_cad: req.body.senha_cad,
          username_cad: req.body.username_cad,
        });

        //Criptografia de senha - instalar pacote bcrypt
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(novo_registro_pessoa.senha_cad, salt, function(err, hash) {
                if (err) throw err;
                novo_registro_pessoa.senha_cad = hash;
            });
        });

        //salvar no Banco
        novo_registro_pessoa
        .save()
        .then(p => res.json(p))
        .catch(err => console.log(err));

      }
    }
  )
  .catch(err => console.log(err));
});

//acessar raiz
router.get("/", (req, res) => res.json({status: "Acesso permitido"}));


//exportando objeto router que vai ser recebido na raiz
module.exports = router;
