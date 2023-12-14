import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "https://www.dnd5eapi.co";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index.ejs")
})

app.post("/monster-search", async (req, res) => {
    const monsterName = req.body.monsterInput
    console.log(monsterName)
    
    try {
        const response = await axios.get(API_URL + "/api/monsters");
        const monsters = response.data.results;
        const matchedMonster = monsters.find(
            (monster) => monster.name.toLowerCase() === monsterName
        );

        if (matchedMonster) {
            try {
                const monsterResponse = await axios.get(API_URL + matchedMonster.url)
                const monsterData = monsterResponse.data;
                console.log(monsterData);
                res.render("index.ejs", {
                    data: monsterData
                });
            } catch (error) {
                console.log(error);
                res.status(500);
            };
        } else {
            console.log("Monster not found");
            res.render("index.ejs")
        }
    } catch (error) {
        console.log(error);
        res.status(500);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
