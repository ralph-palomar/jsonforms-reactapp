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
import { UISchemaElement } from '@jsonforms/core';

function App() {
  const [errorMessage, setErrorMessage] = React.useState<string>();
  const [generatedJsonSchema, setJsonSchema] = React.useState<object>({});
  const [generatedUISchema, setUiSchema] = React.useState<UISchemaElement>({ type: 'VerticalLayout' });
  const [defaultData, setDefaultData] = React.useState<object>({});
  return (
    <div className="App">
      <h1>Web Form Builder</h1>
      <JsonForms
        schema={schema}
        uischema={uischema}
        data={defaultData}
        renderers={materialRenderers}
        cells={materialCells}
        onChange={({ errors, data }) => { 
          if (errors?.length !== 0) {
            const errorMsg = errors?.map((item) => item.dataPath + " " + item.message).reduce((acc, item) => acc + item + "; ", "");
            setErrorMessage(errorMsg);
          } else {
            setErrorMessage("");
            const fields: any[] | undefined = data.fields;
            var properties = {};
            var required: any = [];
            var uiElements: any = [];
            fields?.map((item) => {
              Object.assign(properties, {
                [item.name]: Object.assign(
                  item.type === 'date' ? { type: 'string', format: 'date' } : { type: item.type }
                , item.enumerations != null && item.enumerations?.length !== 0 ? { enum: item.enumerations } : {})
              });
              if (item.mandatory) {
                required.push(item.name);
              }
              uiElements.push({
                type: 'Control',
                scope: '#/properties/' + item.name,
                label: item.description
              });
            });
            const jsonSchema = {
              type: 'object',
              properties: properties,
              required: required
            }
            const uiSchema = {
              type: data.layout,
              elements: uiElements
            }
            setJsonSchema(jsonSchema);
            setUiSchema(uiSchema);
          }
        }}
      />
      <br/>
      {/* <Alert severity="error">{errorMessage}</Alert> */}
      <br/>
      <h1>Preview</h1>
      <JsonForms
        schema={generatedJsonSchema}
        uischema={generatedUISchema}
        data={defaultData}
        renderers={materialRenderers}
        cells={materialCells}
      />
      {/* <Button variant="contained" color="primary" onClick={(e) => save(errorMessage, payload)}>
         Submit
      </Button> */}
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
