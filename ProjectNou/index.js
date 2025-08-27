import express from "express";

const app=express();
const port=3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

app.get("/",(req,res)=>{
    res.render("index.ejs");
});

app.get("/about",(req,res)=>{
    res.render("about.ejs");
});

app.get("/publish", (req, res) => {
    res.render("publish.ejs", {
        titleToPost: "",
        essayToPost: ""
    });
});

app.post("/submit", (req, res) => {
    var titleContent=req.body["title"];
    var essayContent=req.body["essay"];
    res.render("publish.ejs",{
        titleToPost:titleContent,
        essayToPost:essayContent,
    });
});

app.get("/posts",(req,res)=>{
    res.render("posts.ejs")
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});