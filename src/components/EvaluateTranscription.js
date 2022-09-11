import React from "react";
import { useState } from "react";
import { environment } from "../environments/environment";
export function EvaluateTranscription() {
  const [transcribedTextFile, setTranscribedTextFile] = useState();
  const [originalTextFile, setOriginalTextFile] = useState();
  const filesTextComparisonUrl = `${environment.apiUrl}/compare-documents`;

  return (
    <div>
      <p>Inspect Transcription</p>
      <input
        id="input-audio"
        type="file"
        name="file"
        onChange={(event) => {
          setOriginalTextFile(event.target.files[0]);
        }}
      />
      <input
        id="input-audio"
        type="file"
        name="file"
        onChange={(event) => {
          setTranscribedTextFile(event.target.files[0]);
        }}
      />
      <button className="submit-button">Start comparison</button>
    </div>
  );
}
