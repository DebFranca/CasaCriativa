const express = require("express")
const server = express()

const db = require("./db")
//vetores
// const ideas = [
//     {
//         img: "https://image.flaticon.com/icons/svg/2728/2728995.svg",
//         title: "Cursos de Programação",
//         category: "Estudo",
//         description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Expedita officiis modi porro illo",
//         url: "http://rocketseat.com.br"
//     },

//     {
//         img: "https://image.flaticon.com/icons/svg/2729/2729069.svg",
//         title: "Exercícios Fisicos",
//         category: "Saude",
//         description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Expedita officiis modi porro illo",
//         url: "http://rocketseat.com.br"
//     },

//     {
//         img: "https://image.flaticon.com/icons/svg/2729/2729076.svg",
//         title: "Cinema Em Casa",
//         category: "Lazer",
//         description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Expedita officiis modi porro illo",
//         url: "http://rocketseat.com.br"
//     },

//     {
//         img: "https://image.flaticon.com/icons/svg/2729/2729009.svg",
//         title: "Cozinhar Em Casa",
//         category: "Lazer",
//         description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Expedita officiis modi porro illo",
//         url: "http://rocketseat.com.br"
//     },
// ]


//configurar arquivos para serem aceitos no server
server.use(express.static("public"))

//habilitar uso do req.body
server.use(express.urlencoded({extended: true}))

//configuração do nunjucks
const nunjucks = require("nunjucks")
nunjucks.configure("views", {
    express:server, 
    noCache: true,
})

//rota com captura de pedido para responder
server.get("/", function(req,res){

    //Consultar dados na tabela
    db.all(`SELECT * FROM ideas`, function(err,rows){
        if(err) {
            console.log(err)
            return res.send("erro no banco de dados!")
        }

        const reversedIdeas = [...rows].reverse()

        let lastIdeas = []
        for (let idea of reversedIdeas) {
            if (lastIdeas.length < 2) {
                lastIdeas.push(idea)
            }
        }

        return res.render("index.html", {ideas: lastIdeas})

    })

})

server.get("/ideias", function(req,res){
    db.all(`SELECT * FROM ideas`, function(err,rows){
        if(err) {
            console.log(err)
            return res.send("erro no banco de dados!")
        }
        const reversedIdeas = [...rows].reverse()
        return res.render("ideias.html", {ideas:reversedIdeas})

    })
})

server.post("/", function(req, res){
            //Inserir dados na tabela
    const query = `
    INSERT INTO ideas(
        image,
        title,
        category,
        description,
        link

    ) VALUES(?,?,?,?,?);
`
    const values = [
        req.body.image,
        req.body.title,
        req.body.category,
        req.body.description,
        req.body.link

]

    db.run(query, values, function(err ){
        if(err) {
            console.log(err)
            return res.send("erro no banco de dados!")
        }

        return res.redirect("/ideias")
    })


})

server.listen(3000)