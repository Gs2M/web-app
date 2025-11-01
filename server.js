const express = require("express");
const path = require("path");

const app = express();
const port = 3000;

// __dirname is available automatically in CommonJS
app.use(express.static(path.join(__dirname, "src")));
app.use("/css", express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")));
app.use("/js", express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")));
app.use("/scss", express.static(path.join(__dirname, "node_modules/bootstrap/scss")));
app.use("/font", express.static(path.join(__dirname, "node_modules/bootstrap-icons/font")));
app.use("/icons", express.static(path.join(__dirname, "node_modules/bootstrap-icons/icons")));

app.use("/pub", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "index.html"));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
