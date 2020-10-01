import React from 'react';
import './App.css';
import { schema, uischema } from './config';
import { 
  materialRenderers,
  materialCells
} from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import { Button } from '@material-ui/core';
import { postData } from './api';
import { UISchemaElement } from '@jsonforms/core';

function App() {
  const [errorMessage, setErrorMessage] = React.useState<string>();
  const [generatedJsonSchema, setJsonSchema] = React.useState<object>({});
  const [jsonPayload, setJsonPayload] = React.useState<object>({});
  const [generatedUISchema, setUiSchema] = React.useState<UISchemaElement>({ type: 'VerticalLayout' });
  const [defaultData] = React.useState<object>({});
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
              item.type !== 'array' ? 
              Object.assign(properties, {
                [item.name]: Object.assign(
                  item.type === 'date' || item.type === 'date-time' || item.type === 'time' ? { type: 'string', format: item.type } : { type: item.type }
                , item.enumerations != null && item.enumerations?.length !== 0 ? { enum: item.enumerations } : {})
              }) :
              Object.assign(properties, {
                [item.name]: {
                  type: 'array',
                  items: Object.assign({
                    type: 'string'
                  }, item.enumerations != null && item.enumerations?.length !== 0 ? { enum: item.enumerations } : {}),
                  uniqueItems: true
                }
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
      <br/><br/>
      {/* <Alert severity="error">{errorMessage}</Alert> */}
      <JsonForms
        schema={generatedJsonSchema}
        uischema={generatedUISchema}
        data={defaultData}
        renderers={materialRenderers}
        cells={materialCells}
        onChange={({ errors, data }) => { 
          setJsonPayload(data);
        }}
      />
      <br/><br/>
      <Button variant="contained" color="primary" onClick={(e) => save(errorMessage, jsonPayload, generatedJsonSchema, generatedUISchema)}>
         SAVE
      </Button>
      <br/><br/><br/><br/>
    </div>
  );
}

function save(errorMsg: any, payload: any, jsonSchema: any, uiSchema: any) {
  if (errorMsg === "") {
    // postData(process.env.REACT_APP_PERSISTENCE_COLLECTION, payload)
    //   .then((response) => console.log("Success"))
    //
  }
}

export default App;
