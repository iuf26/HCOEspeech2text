import React, { useState } from "react";
import axios from "axios";
import { CSSProperties } from "react";
import { ClipLoader } from "react-spinners";
import { SpinnerCircular } from 'spinners-react';

export function FileUploadPage() {
  let [loading, setLoading] = useState(false);
  let [color, setColor] = useState("#ffffff");
 
  const UPLOAD_TRANSCRIBE_FILE = "http://localhost:5000/uploadfile";
  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [responseTextContent,setResponseTextContent] = useState("");
  const [transcriptionFin,setTranscriptionFin] = useState(false);
  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsSelected(true);
  };

  const handleSubmission = () => {
   setLoading(true)
    const DEST_FILENAME = "transcription"
    console.log(selectedFile);
    var bodyFormData = new FormData();
    bodyFormData.append("file", selectedFile);
    bodyFormData.append("destination-file-name",DEST_FILENAME);
    
    axios({
      method: "post",
      url: UPLOAD_TRANSCRIBE_FILE,
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
       
        console.log(response.data);
        const utterances = response.data.utterances;
        let finalText = "<!DOCTYPE html><html><head><title>Transcription</title><style>mark.red {color:#ff0000;background: none;}mark.blue {color:#0000A0;background: none;}</style></head><body>"
        
        for (let i = 0;i<utterances.length;i++){
            let speaker = utterances[i].speaker;
          
            let text = utterances[i].text;
            finalText = finalText + "<p>" + speaker + ":";
            for(let word = 0;word<utterances[i].words.length;word++){
              if(utterances[i].words[word].confidence < 0.8){
                finalText = finalText  + '<mark class="red">' + utterances[i].words[word].text + "</mark>" ;
              }
              else{
                finalText = finalText + utterances[i].words[word].text;
              }
              finalText = finalText + "(" + utterances[i].words[word].confidence + ")" +" ";
            }
            
            finalText = finalText + "</p><br>"
        }
        finalText = finalText + "<p>*Numerele din paranteza reprezinta nivelul de acuratete al traducerii pentru fiecare cuvant</p>"
        finalText = finalText + "<p>*Cuvintele marcate cu rosu sunt cuvintele care nu sunt sigur ca au fost convertite corect</p>"
        finalText = finalText + "</body></html>"
        setLoading(false)
        setResponseTextContent(finalText)
        setTranscriptionFin(true) 
      })
      .catch(function (response) {
      
        console.log(response);
        setLoading(false)
      });
  };
  
  const downloadTxtFile = () => {
    const element = document.createElement("a");
    const file = new Blob([responseTextContent], {
      type: "text/plain"
    });
    element.href = URL.createObjectURL(file);
    element.download = "Transcription-Report.html";
    document.body.appendChild(element);
    element.click();
  };
  return (
    <div>
      <h1>Audio Transcription</h1>
      <input type="file" name="file" onChange={changeHandler} />
      {isSelected ? (
        <div>
          <p>Filename: {selectedFile.name}</p>
          <p>Filetype: {selectedFile.type}</p>
          <p>Size in bytes: {selectedFile.size}</p>
          <p>
            lastModifiedDate:{" "}
            {selectedFile.lastModifiedDate.toLocaleDateString()}
          </p>
        </div>
      ) : (
        <p>Select an audio file for transcription</p>
      )}
      <div>
        <button onClick={handleSubmission}>Submit</button>
        {transcriptionFin ? <button onClick={downloadTxtFile}>Download</button> : null}
       
          {loading?   <SpinnerCircular size={30} color="red"/> : null}
      </div>

    </div>
  );
}
