import React, { useState } from "react";
import axios from "axios";
import { CSSProperties } from "react";
import { ClipLoader } from "react-spinners";
import { SpinnerCircular } from "spinners-react";
import "../styles/Main.css";

export function FileUploadPage() {
  let [loading, setLoading] = useState(false);
  let [color, setColor] = useState("#ffffff");

  const UPLOAD_TRANSCRIBE_FILE = "http://localhost:5000/uploadfile";
  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [responseTextContent, setResponseTextContent] = useState("");
  const [transcriptionFin, setTranscriptionFin] = useState(false);
  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsSelected(true);
  };

  const handleSubmission = () => {
    setLoading(true);
    const DEST_FILENAME = "transcription";
    console.log(selectedFile);
    var bodyFormData = new FormData();
    bodyFormData.append("file", selectedFile);
    bodyFormData.append("destination-file-name", DEST_FILENAME);
    let FINAL_TRANSCRIPTION_REQUEST_LINK = UPLOAD_TRANSCRIBE_FILE;
    let api = "";
    if (document.getElementById("assembly").checked) {
      //Male radio button is checked
      api = "assembly";
    } else if (document.getElementById("deepgram").checked) {
      //Female radio button is checked
      api = "deepgram";
    }
    FINAL_TRANSCRIPTION_REQUEST_LINK =
      FINAL_TRANSCRIPTION_REQUEST_LINK + "/" + api;

    axios({
      method: "post",
      url: FINAL_TRANSCRIPTION_REQUEST_LINK,
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        if (api === "assembly") {
          console.log(response.data);
          const utterances = response.data.utterances;
          let finalText =
            "<!DOCTYPE html><html><head><title>Transcription</title><style>mark.red {color:#ff0000;background: none;}mark.blue {color:#0000A0;background: none;}</style></head><body>";

          for (let i = 0; i < utterances.length; i++) {
            let speaker = utterances[i].speaker;

            let text = utterances[i].text;

            if (speaker == "A") {
              finalText = finalText + "<p>" + speaker + ":";
            } else {
              if (speaker == "B") {
                finalText = finalText + "<p><em>" + speaker + ":";
              }
            }
            for (let word = 0; word < utterances[i].words.length; word++) {
              if (utterances[i].words[word].confidence < 0.8) {
                finalText =
                  finalText +
                  '<mark class="red">' +
                  utterances[i].words[word].text +
                  "</mark>";
              } else {
                finalText = finalText + utterances[i].words[word].text;
              }
              finalText =
                finalText +
                "(" +
                utterances[i].words[word].confidence +
                ")" +
                " ";
            }
            if (speaker == "A") {
              finalText = finalText + "</p><br>";
            } else {
              if (speaker == "B") finalText = finalText + "</em></p><br>";
            }
          }
          finalText =
            finalText +
            "<p>*Numerele din paranteza reprezinta nivelul de acuratete al traducerii pentru fiecare cuvant</p>";
          finalText =
            finalText +
            "<p>*Cuvintele marcate cu rosu sunt cuvintele care nu sunt sigur ca au fost convertite corect</p>";
          finalText = finalText + "</body></html>";
          setLoading(false);
          setResponseTextContent(finalText);
          setTranscriptionFin(true);
        } else {
          if (api === "deepgram") {
            let speaker;
            let finalText =
            "<!DOCTYPE html><html><head><title>Transcription</title><style>mark.red {color:#ff0000;background: none;}mark.blue {color:#0000A0;background: none;}</style></head><body>";

              console.log(response);
              let transcriptedPhrases = response.data;
              for (let i = 0; i < transcriptedPhrases.length; i++) {
               speaker = transcriptedPhrases[i].speaker;
                if (speaker === 0) {
                  finalText = finalText + "<p>" + speaker + ":";
                } else {
                  if (speaker === 1) {
                    finalText = finalText + "<p><em>" + speaker + ":";
                  }
                }


                  for (let j = 0;j< transcriptedPhrases[i].words.length;j++){
                    let word = transcriptedPhrases[i].words[j];
                    let wordConfidence = word.confidence
                    let wordText = word.word;

                    if (wordConfidence < 0.8) {
                      finalText =
                        finalText +
                        '<mark class="red">' +
                       wordText +
                        "</mark>";
                    } else {
                      finalText = finalText + wordText;
                    }
                    finalText =
                      finalText +
                      "(" +
                      wordConfidence +
                      ")" +
                      " ";

                  }

              }
              if (speaker === 0 ) {
                finalText = finalText + "</p><br>";
              } else {
                if (speaker === 1) finalText = finalText + "</em></p><br>";
              }


              finalText = finalText + "</body></html>";
              setLoading(false);
          setResponseTextContent(finalText);
          setTranscriptionFin(true);
          }
        }
      })
      .catch(function (response) {
        console.log(response);
        setLoading(false);
      });
  };

  const downloadTxtFile = () => {
    const element = document.createElement("a");
    const file = new Blob([responseTextContent], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = "Transcription-Report.html";
    document.body.appendChild(element);
    element.click();
  };
  return (
    <>
      <div className="sign-section"></div>
      <div className="main">
        <h1>Audio Transcription</h1>
        <label for="input-audio">
          Pick an audio file for transcription:<br></br>
          <input
            id="input-audio"
            type="file"
            name="file"
            onChange={changeHandler}
          />
        </label>
        <br></br>
        <br></br>
        <label>Pick a transcription provider:</label>
        <br />
        <div className="radio-api">
          <div className="option">
            <input
              type="radio"
              id="assembly"
              name="apis"
              value="Assembly AI Api"
            />
            <label for="assembly">Assembly AI</label>
          </div>

          <div className="option">
            <input type="radio" id="deepgram" name="apis" value="Other Api" />
            <label for="other">DeepGram</label>
          </div>
        </div>

        {isSelected ? (
          <div className="loading-section">
            <p>Filename: {selectedFile.name}</p>
            <p>Filetype: {selectedFile.type}</p>
            <p>
              Last Modified Date:{" "}
              {selectedFile.lastModifiedDate.toLocaleDateString()}
            </p>
          </div>
        ) : null}
        <br></br>
        <div>
          <div className="buttons">
            <button className="submit-button" onClick={handleSubmission}>
              Submit
            </button>
            {/* <button className="submit-button">Test performance</button> */}
            {transcriptionFin ? (
              <button className="submit-button" onClick={downloadTxtFile}>
                Download
              </button>
            ) : null}
          </div>

          <br></br>
          {loading ? <SpinnerCircular size={30} color="red" /> : null}
        </div>
      </div>
    </>
  );
}
