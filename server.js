const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

const FILE = "notes.json";

function readNotes() {
    const data = fs.readFileSync(FILE);
    return JSON.parse(data);
}

function writeNotes(notes) {
    fs.writeFileSync(FILE, JSON.stringify(notes, null, 2));
}

app.get("/notes", (req, res) => {
    const notes = readNotes();
    res.json(notes);
});

app.post("/notes", (req, res) => {
    const notes = readNotes();
    const newNote = {
        id: Date.now(),
        title: req.body.title,
        content: req.body.content
    };

    notes.push(newNote);
    writeNotes(notes);

    res.json(newNote);
});

app.put("/notes/:id", (req, res) => {
    const notes = readNotes();
    const id = parseInt(req.params.id);

    const note = notes.find(n => n.id === id);

    if (!note) return res.status(404).send("Note not found");

    note.title = req.body.title;
    note.content = req.body.content;

    writeNotes(notes);
    res.json(note);
});

app.delete("/notes/:id", (req, res) => {
    const notes = readNotes();
    const id = parseInt(req.params.id);

    const filtered = notes.filter(n => n.id !== id);

    writeNotes(filtered);

    res.send("Note deleted");
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});