// const server = require('./server');

// const port = process.env.PORT || 3000;

// server.create()
//     .then(app => {
//         app.listen(port, () => {
//             console.log(`Server has started on port ${port}!`);
//         });
//     }).catch(err => console.log(err));

// const express = require("express");
// const fileUpload = require("express-fileupload");
// const pdfParse = require("pdf-parse");

// const app = express();
// // test
// app.use("/", express.static("public"));
// app.use(fileUpload());

// app.post("/extract-text", (req, res) => {
//     if (!req.files && !req.files.pdfFile) {
//         res.status(400);
//         res.end();
//     }

//     pdfParse(req.files.pdfFile).then(result => {
//         //here result.text= data
//         var audioFile = "test.mp3";
//         // This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
//         const speechConfig = sdk.SpeechConfig.fromSubscription(
//             "b974c7e81115411aa5076a392dad3380",
//             "eastus"
//         );
//         const audioConfig = sdk.AudioConfig.fromAudioFileOutput(audioFile);
    
//         // The language of the voice that speaks.
//         speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural";
//         // Create the speech synthesizer.
//         var synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
    
//         // var rl = readline.createInterface({
//         //   input: process.stdin,
//         //   output: process.stdout
//         // });
    
//         // rl.question("Enter some text that you want to speak >\n> ", function (text) {
//         //   rl.close();
//         // Start the synthesizer and wait for a result.
//         synthesizer.speakTextAsync(
//             result.text,
//             function (result) {
//                 if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
//                     console.log("synthesis finished.");
//                 } else {
//                     console.error(
//                         "Speech synthesis canceled, " +
//                             result.errorDetails +
//                             "\nDid you set the speech resource key and region values?"
//                     );
//                 }
//                 synthesizer.close();
//                 synthesizer = null;
//             },
//             function (err) {
//                 console.trace("err - " + err);
//                 synthesizer.close();
//                 synthesizer = null;
//             }
//         ).then(audio => {res.send(audio)});
//         console.log("Now synthesizing to: " + audioFile);
//     });
// });

// app.listen(3000);
