const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const path =require('path');

const app=express();
const port = 3000;
const db = mysql.createConnection({
    host: 'localhost',
    user:'root',
    password:'n0m3l0',
    database: 'db_usuarios'
});
db.connect((err)=>{
    if(err){
        console.log("error al conectar");
    }
    console.log("conectado a la bd");
});

app.use(session({
    secret:'clave_secreta',
    resave:false,
    saveUninitialized:true
}));

app.use(express.urlencoded({extend:true}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/login', (req,res)=>{
const{username, password}=req.body;
if(!username || !password){
    return res.status(400).send('por favor ingresa usuario y contraseña');
}

const sql = 'select * from usuarios where username = ?'
    db.query(sql, [username], (err,results)=>{
        if(err){
            console.log("error en la consulta", err);
            return res.status(500).send('error en el servidor')
        }
        if(results.lenght === 0){
            return res.status(401).send('usuario no encontrado')
        }
        const user =results[0];
        if(password=== user.password){
            req.session.userId=user.id;
            req.session.username=user.username;
            res.send('sesion iniciada correctamente');
        }else{
            res.status(401).send('contraseña incorrecta')
        }


    });
    
});

app.get('/logout', (req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            return res.status(500).send('error al cerrar la sesion')
        }
        res.send('sesion cerrada')
    })
})

app.listen(port,()=>{

    console.log(`servidor escuchando  http://localhost:${port}`);
})
