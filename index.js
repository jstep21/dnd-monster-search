import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

// Create application and create port/url constants
const app = express();
const port = 3000;
const API_URL = "https://www.dnd5eapi.co";

// Let app know where static files are
app.use(express.static("public"));
// Supports parsing using body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// Render home page
app.get("/", (req, res) => {
    res.render("index.ejs")
})

// Route for when user clicks search
app.post("/monster-search", async (req, res) => {
    // store monster from user input
    const monsterName = req.body.monsterInput
    console.log(monsterName)
    // search dnd api for monster from user input
    try {
        const response = await axios.get(API_URL + "/api/monsters");
        const monsters = response.data.results;
        const matchedMonster = monsters.find(
            (monster) => monster.name.toLowerCase() === monsterName
        );
        console.log(matchedMonster)
        // get data for monster and render index.ejs
        if (matchedMonster) {
            try {
                const monsterResponse = await axios.get(API_URL + matchedMonster.url)
                const monsterData = monsterResponse.data;
                console.log(monsterData)
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
