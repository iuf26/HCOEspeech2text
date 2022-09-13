import React from "react";
import { useState } from "react";
import { environment } from "../environments/environment";
import { renderToString } from "react-dom/server";
import axios from "axios";

export function EvaluateTranscription() {
  const [transcribedTextFile, setTranscribedTextFile] = useState();
  const [originalTextFile, setOriginalTextFile] = useState();
  const [comparisonResult, setComparisonResult] = useState({});
  const [downloadAvailable,setDownloadAvailable] = useState(false);
  const filesTextComparisonUrl = `${environment.apiUrl}/compare-documents`;

  const onSubmitButtonClick = () => {
    var bodyFormData = new FormData();
    bodyFormData.append("doc1", transcribedTextFile);
    bodyFormData.append("doc2", originalTextFile);
    axios({
      method: "post",
      url: filesTextComparisonUrl,
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((response) => response.data)
      .then((data) => {
        setComparisonResult(data);
        setDownloadAvailable(true);
      })
      .catch((error) => console.error(error));
  };

  const ComparisonResults = ({ transcribedWords, evaluationWords }) => {
    if(transcribedWords && evaluationWords){
    return (
      <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
        <table>
          <tr>
            <th>Transcribed Words</th>
          </tr>
          {transcribedWords.map((word) => (
            <tr>
              <td>{word}</td>
            </tr>
          ))}
          {/* <tr><td>Your word</td></tr> */}
        </table>

        <table>
          <tr>
            <th>Actual Words</th>
          </tr>
          {evaluationWords.map((wordData) => {
            let wordColor =
              wordData.status === "missing"
                ? "blue"
                : wordData.status === "wrong"
                ? "red"
                : "black";
            return (
                <tr>
                    <td style={{color:wordColor}}>{wordData.word}</td>
                </tr>
            )
          })}
        </table>
        <footer>
            <p>*blue = missing words in the transcribed text</p>
            <p>*red = wrong spelled words in the transcribed text</p>
        </footer>
      </div>
    );}
  };

  const onDownloadButtonClick = () => {
    let resultContent = renderToString(
      <ComparisonResults
      transcribedWords={comparisonResult.transcribedWords}
      evaluationWords={comparisonResult.evaluation}
      />
    );
    const element = document.createElement("a");
    const file = new Blob([resultContent], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = "Comparison-Report.html";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="container__evaluate-transcription">
      <h4>Inspect Transcription</h4>
      <label htmlFor="transcribed">Transcription text file:</label>
      <br></br>
      <input
        id="input-audio"
        type="file"
        name="transcribed"
        onChange={(event) => {
          setTranscribedTextFile(event.target.files[0]);
        }}
      />
      <br></br>
      <br></br>
      <label htmlFor="original">Original text file:</label>
      <br></br>
      <input
        id="input-audio"
        type="file"
        name="original"
        onChange={(event) => {
          setOriginalTextFile(event.target.files[0]);
        }}
      />
      <br></br>
      <br></br>
      <div style={{display:"flex",gap:"10px"}}>
        <button className="submit-button" onClick={() => {setDownloadAvailable(false);onSubmitButtonClick()}}>
          Start comparison
        </button>
        { downloadAvailable? <button className="submit-button" onClick={onDownloadButtonClick}>
          Download results
        </button> : null}
      </div>
    </div>
  );
}
