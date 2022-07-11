import logo from './logo.svg';
import './App.css';

import { FileUploadPage } from './components/FileUploadPage';

function App() {
  
  const downloadTxtFile = () => {
    const element = document.createElement("a");
    const file = new Blob(["hello world"], {
      type: "text/plain"
    });
    element.href = URL.createObjectURL(file);
    element.download = "myFile.txt";
    document.body.appendChild(element);
    element.click();
  };


  return (
    <div>
      {/* <button onClick={downloadTxtFile}>Download txt</button> */}
      <FileUploadPage/>
    </div>
  );
}

export default App;
