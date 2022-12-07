const express = require("express");
const path = require("path");
const { textToSpeech } = require("./azure-cognitiveservices-speech");
const http = require("http");
const url = require("url");
const fs = require("fs");

// ignore request for FavIcon. so there is no error in browser
const ignoreFavicon = (req, res, next) => {
    if (req.originalUrl.includes("favicon.ico")) {
        res.status(204).end();
    }
    next();
};

// fn to create express server
const create = async () => {
    // server
    const app = express();
    app.use("/", express.static("public"));

    // app.use(express.static("public", options));

    // configure nonFeature
    app.use(ignoreFavicon);

    // root route - serve static file
    app.get("/", (req, res) => {
        res.sendFile(path.join(__dirname, "../public/contactus.html"));
    });

    // creates a temp file on server, the streams to client
    /* eslint-disable no-unused-vars */
    app.get("/text-to-speech", async (req, res, next) => {
        const { key, region, phrase, file, textLang, voiceName } = req.query;

        if (!key || !region || !phrase)
            res.status(404).send("Invalid query string");

        let fileName = null;

        // stream from file or memory
        if (file && file === true) {
            fileName = `./temp/stream-from-file-${timeStamp()}.mp3`;
        }

        const audioStream = await textToSpeech(
            key,
            region,
            phrase,
            fileName,
            textLang,
            voiceName
        );
        res.set({
            "Content-Type": "audio/mpeg",
            "Transfer-Encoding": "chunked",
        });
        audioStream.pipe(res);
    });

    app.post("/extract-text", (req, res) => {
        if (!req.files && !req.files.pdfFile) {
            res.status(400);
            res.end();
        }
        pdfParse(req.files.pdfFile).then((result) => {
            res.send(result.text);
        });
    });

    // Error handler
    /* eslint-disable no-unused-vars */
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send("Something broke!");
    });
    return app;
};

module.exports = {
    create,
};
