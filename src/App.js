import './App.css';

import { FileUploadPage } from './components/FileUploadPage';
import React  from 'react';
function App() {
  
  return (
    <div>
      {/* <button onClick={downloadTxtFile}>Download txt</button> */}
      <FileUploadPage/>
    </div>
  );
}

export default App;
