const express = require("express");
const fileUpload = require("express-fileupload");
const pdfParse = require("pdf-parse");

const app = express();
// test
app.use("/", express.static("public"));
app.use(fileUpload());

app.post("/extract-text", (req, res) => {
    if (!req.files && !req.files.pdfFile) {
        res.status(400);
        res.end();
    }

    pdfParse(req.files.pdfFile).then(result => {
        res.send(result.text);
        //here result.text= data
    });
});

app.get('/download', function(req, res){
  const file = `${__dirname}/public/test.mp3`;
  res.download(file); // Set disposition and send it.
});


app.listen(3000);
