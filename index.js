const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const path = require('path');

const port = 3000;


//----------------------------- Banco de Dados  ------------------------
const mongoose = require('mongoose');
const db_access = require('./setup/bd').mongoURL;

mongoose
.connect(db_access, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log("Conexão ao MongoDB bem sucedida!"))
.catch(err => console.log(err));

//----------------------------- Banco de Dados  ------------------------
//----------------------------- Login ------------------------
app.use(bodyparser.urlencoded({extended: false}));
//comunicação via json do front-end com back-end
app.use(bodyparser.json());

//objeto auth
const auth = require("./routes/auth");

app.use("/auth", auth);

//----------------------------- Login ------------------------


app.get("/", (req, res) => {
  res.send("Hello World!");
});

const meu_middleware = function(req, res, next){
    console.log("Executando o Middleware")
    next();
}

const meu_middleware_2 = function(req, res, next){
    console.log("Executando outro Middleware")
    next();
}

app.use(meu_middleware);
app.use(meu_middleware_2);

app.get('/', function(req, res) {
  res.send("Hello World!");
  console.log("Estou sendo chamado na rota, após o middleware.");
});

let get_request_time = function(req, res, next){
    let tempo_atual = Date.now();
    let hoje = new Date(tempo_atual);
    req.request_time = hoje.toUTCString();
    next();
}

app.use(get_request_time);

app.get('/data', function(req, res) {
    res.send("Olá Você acessou em " + req.request_time);
});


app.use('/inicio', function(req, res, next){
  console.log("Início");
  res.send("INICIO");
  next();
});

app.use('/meio', function(req, res, next){
  console.log("meio");
  res.send("MEIO");
  next();
});

app.use('/fim', function(req, res, next){
  console.log("fim");
  res.send("FIM");
  next();
});


app.use('/tempo', function(req, res, next) { //nosso midlle acessado somente se a url for acessada
    console.log("Middleware de tempo chamado.");
    let tempo_atual = Date.now();
    let hoje = new Date(tempo_atual);
    req.request_time = hoje.toUTCString();
    next();
});

app.get('/tempo', (req, res) => { //Acontece se acessar o link tempo
    res.send("Olá Você acessou em " + req.request_time);
});

//bodyparser
app.use(bodyparser.urlencoded({ extended: false}));
//Define quais diretórios o usuário vai poder acessar ou não
//Especificar os arquivos publicos
app.use('/login', express.static(__dirname + '/public/login'));

app.post('/login', (req, res) => {
  console.log("nome_login: " + req.body.nome_login);
  console.log("email_login: " + req.body.email_login);

//direciona para pasta raiz
  res.redirect('/');
});

//pug
app.set('view engine', 'pug');
//path para informar que estou trabalhando com estrutura de pastas
app.set('views', path.join(__dirname, "views"));

app.get("/pug", function (req, res){
  res.render("index");
});

//Acesso direto na pasta raiz, sem passar nenhum endereço
app.get('/', (req, res) => {
    res.send("Estou no endereço raiz.");
});

app.get('*', function (req, res) {
  res.send("Página Inválido: 404");
});

app.listen(port, () => console.log(`Escutando na porta ${port}`));
