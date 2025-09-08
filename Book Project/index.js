import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app=express();
const port=3000;

const db=new pg.Client({
    user:"postgres",
    host:"localhost",
    database:"postgres",
    password:"BazaDateVlad7",
    port:5432,
});

db.connect();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(`public`));

app.get("/",(req,res)=>{
    res.render("index.ejs");
});

app.get("/about",(req,res)=>{
    res.render("about.ejs");
});

app.get("/contact",(req,res)=>{
    res.render("contact.ejs");
});

app.get("/add",(req,res)=>{
    res.render("add.ejs");
});

app.post("/add",async (req,res)=>{
    try{
        const { title, author, release_date, rating, description, notes, isbn } = req.body;
        await db.query(`INSERT INTO books (title,author,release_date,rating,description,notes,isbn)
            VALUES ($1,$2,$3,$4,$5,$6,$7)`,[title, author, release_date, rating, description, notes, isbn]);
        res.render("succes.ejs");
    }catch(err){
        console.error(err);
        res.status(500).render("error.ejs", { message: "Failed to add the book. Please try again." });
    }
});

app.get("/explore",async (req,res)=>{
    try{
        const result=await db.query("SELECT * FROM books ORDER BY id DESC");//newest book first
        const books=result.rows;
        res.render("explore.ejs",{books});
    } catch(err) {
        console.error(err);
        res.status(500).render("error.ejs", { message: "Failed to load the books. Please try again." });
    }
});

app.post("/delete", async (req, res) => {
    try {
        const { id } = req.body;
        await db.query("DELETE FROM books WHERE id = $1", [id]);
        res.redirect("/explore"); // redirect back to the explore page
    } catch (err) {
        console.error(err);
        res.status(500).render("error.ejs", { message: "Failed to delete the book. Please try again." });
    }
});

app.listen(port, () =>{
    console.log(`Server running on port ${port}`);
});