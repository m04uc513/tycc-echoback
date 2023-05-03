// server.js
// where your node app starts

// init project
const fs = require('fs');
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require('node-fetch');

// date: 日付オブジェクト
// format: 書式フォーマット
function formatDate (date, format) {
  format = format.replace(/yyyy/g, date.getFullYear());
  format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
  format = format.replace(/dd/g, ('0' + date.getDate()).slice(-2));
  format = format.replace(/HH/g, ('0' + date.getHours()).slice(-2));
  format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
  format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
  format = format.replace(/SSS/g, ('00' + date.getMilliseconds()).slice(-3));
  return format;
}

async function fetchWAVdata(text, id, name) {
  //console.log(`#fetchWAVdata: text: ${text}`);
  //console.log(`#fetchWAVdata: id: ${id}`);
  console.log(`#fetchWAVdata: name: ${name}`);
  const response = await fetch("http://153.126.153.39:3000/texttospeach", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, id })
  });
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(name, buffer);
}

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

app.use(express.static("public"));

app.get("/", function(request, response) {
  response.sendFile(__dirname + "/public/index.html");
});

app.post("/texttospeach", async (req, res) => {
  //console.log(req.body);
  const text = req.body.text;
  const id = parseInt(req.body.id);
  const date = new Date();
  const name = formatDate(date, 'yyyyMMddHHmmssSSS')+".wav";
  await fetchWAVdata(text, id, name);
  const wavBuffer = fs.readFileSync(name);
  res.set({
    "Content-Type": "audio/wav",
    "Content-Disposition": 'attachment; filename="audio.wav"',
  });
  await res.send(wavBuffer);
  fs.unlinkSync(name);
});

// listen for requests :)
const listener = app.listen(port, function() {
  //console.log("Your app is listening on port " + listener.address().port);
  console.log(`Server listening on port ${port}`);
});
