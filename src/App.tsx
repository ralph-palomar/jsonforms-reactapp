import React from 'react';
import './App.css';
import { schema, uischema } from './config';
import { 
  materialRenderers,
  materialCells
} from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import { Button } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { postData } from './api';

function App() {
  const [errorMessage, setErrorMessage] = React.useState<string>();
  const [payload, setPayload] = React.useState<object>({});
  return (
    <div className="App">
      <h1>Survey on Forms Usage</h1>
      <JsonForms
        schema={schema}
        uischema={uischema}
        data={payload}
        renderers={materialRenderers}
        cells={materialCells}
        onChange={({ errors, data }) => { 
          if (errors?.length !== 0) {
            const errorMsg = errors?.map((item) => item.dataPath + " " + item.message).reduce((acc, item) => acc + item + "; ", "");
            setErrorMessage(errorMsg);
          } else {
            setErrorMessage("");
          }
          setPayload(data)
        }}
      />
      <br/>
      <Alert severity="error">{errorMessage}</Alert>
      <br/>
      <Button variant="contained" color="primary" onClick={(e) => save(errorMessage, payload)}>
         Submit
      </Button>
      <br/><br/><br/><br/>
    </div>
  );
}

function save(errorMsg: any, payload: any) {
  if (errorMsg === "") {
    postData(process.env.REACT_APP_PERSISTENCE_COLLECTION, payload)
      .then((response) => console.log("Success"))
  }
}

export default App;
