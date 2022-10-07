import React from "react";
import { useState } from "react";
import { environment } from "../environments/environment";
import { renderToString } from "react-dom/server";
import axios from "axios";

export function EvaluateTranscription() {
  const [firstText, setFirstText] = useState("");
  const [secondText, setSecondText] = useState("");
  const [comparisonResult, setComparisonResult] = useState();
  const [downloadAvailable, setDownloadAvailable] = useState(false);
  const textComparisonApi = `https://api.diffchecker.com/public/text?output_type=html&email=none@inexistent.com`;

  const onSubmitButtonClick = () => {
    axios
      .post(textComparisonApi, {
        left: firstText,
        right: secondText,
      })
      .then((response) => {
        setComparisonResult(response.data);
        setDownloadAvailable(true);
      })
      .catch((error) => console.error(error));
  };

  const onDownloadButtonClick = () => {
    const element = document.createElement("a");
    const file = new Blob([comparisonResult], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = "Comparison-report.html";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="container__evaluate-transcription">
      <textarea
        id="first-text"
        name="first-text"
        cols="50"
        rows="20"
        style={{ resize: "none" }}
        onChange={(event) => setFirstText(event.target.value.trim())}
      ></textarea>
      <textarea
        id="second-text"
        name="second-text"
        cols="50"
        rows="20"
        style={{ resize: "none" }}
        onChange={(event) => setSecondText(event.target.value.trim())}
      ></textarea>
      <br></br>
      <button
        className="submit-button"
        onClick={() => {
          setDownloadAvailable(false);
          onSubmitButtonClick();
        }}
      >
        Start comparison
      </button>
      {downloadAvailable ? (
        <button className="submit-button" onClick={onDownloadButtonClick}>
          Download results
        </button>
      ) : null}
    </div>
  );
}
