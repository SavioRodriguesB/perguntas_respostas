const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");

const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");

const port = process.env.PORT || 3131

connection
    .authenticate()
    .then(() => {
        console.log("Conexão realizada com o banco de dados!");
    }).catch((erro) => {
        console.log(erro);
    })

app.set('view engine', 'ejs')
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())



app.get("/",(req, res)=>{
    Pergunta.findAll({raw: true, order: [
            ['id','desc']
        ]}).then(perguntas =>{
        res.render("index",{
            perguntas: perguntas
        });
    });
    
});

app.get("/perguntar",(req, res) => {
    res.render("perguntar");
});

app.post("/cadastrarPergunta",(req, res) => {
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect("/");
    });
});

app.get("/pergunta/:id",(req, res) => {
    var id = req.params.id;

    Pergunta.findOne({
        where: 
            {id: id}
        }).then(pergunta => {
            if(pergunta != undefined){
                Resposta.findAll({
                    where: {perguntaId: id},
                    order:[
                        ['id', 'desc']
                    ]}).then(respostas => {
                    res.render("pergunta", {
                        respostas: respostas,
                        pergunta: pergunta
                    });
                });
            }else{
                res.redirect("/");
            }
        })
});

app.post("/responder",(req, res) => {
    var corpo = req.body.corpo;
    var id = req.body.id;
    Resposta.create({
        corpo: corpo,
        perguntaId: id
    }).then(() => {
        res.redirect("/pergunta/" + id);
    });
});

app.post("/pergunta-delete",(req, res) => {
    var id = req.body.id;
    Pergunta.findOne({
        where: {
            id: id
        }
    }).then(pergunta => {
        pergunta.destroy();
        res.redirect("/");
    });
});

app.post("/resposta-delete",(req, res) => {
    var id = req.body.id;
    var pergunta = req.body.pergunta;
    Resposta.findOne({
        where: {
            id: id
        }
    }).then(resposta => {
        resposta.destroy();
        res.redirect("/pergunta/" + pergunta);
    });
});

app.listen(port,() => console.log("Aplicação iniciada em http://localhost:"+ port));