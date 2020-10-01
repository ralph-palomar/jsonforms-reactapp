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
import { setUISchema, UISchemaElement } from '@jsonforms/core';

function App() {
  const [errorMessage, setErrorMessage] = React.useState<string>();
  const [generatedJsonSchema, setJsonSchema] = React.useState<object>({});
  const [jsonPayload, setJsonPayload] = React.useState<object>({});
  const [fromJsonSchemaEditor, setFromJsonSchemaEditor] = React.useState<object>({});
  const [generatedUISchema, setUiSchema] = React.useState<UISchemaElement>({ type: 'VerticalLayout' });
  const [defaultData, setDefaultData] = React.useState<object>({});
  return (
    <div className="App">
      <h1>Web Form Builder</h1>
      <h4>The Web Form Builder allows you to define the data definition for your web form. 
        You can define a list of fields you want to include in a web form, such as:
        <li>Name - unique identifier of the field. It should not contain any spaces / should be a word or token.</li>
        <li>Description - the user-friendly label you want to see on each field. it can be in a form of question.</li>
        <li>Type - the data type for the field, such as string, number, integer, date, or boolean (checkbox)</li>
        <li>Mandatory - indicate if the field requires a user input. if yes, it will show a red alert if no value is provided.</li>
        <li>Enumerations - a dropdown list. only string type is supported for enumerations so make sure to select type as string.</li>
        <li>Layout - either horizontal or vertical. vertical is good for web forms viewed in mobile devices with smaller screens.</li>
      </h4>
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
      <h1>Preview Web Form Builder</h1>
      <h4>This will show what your web form will look like, how it works; this is the finished product.</h4>
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
      <br/>
      <h1>JSON Schema Generator and Editor</h1>
      <h4>This is the generated JSON Schema and JSON payload from the web form builder; this is useful if you are ready to deploy your own web form.</h4>
      <textarea rows={20} cols={60} value={JSON.stringify(generatedJsonSchema, null, 2)} readOnly={true}></textarea>
      <textarea rows={20} cols={60} value={JSON.stringify(jsonPayload, null, 2)} readOnly={true}></textarea>
      <br/>
      <textarea rows={20} cols={60} onChange={(event) => { 
          const inputJsonSchema = JSON.parse(event.target.value);
          setFromJsonSchemaEditor(inputJsonSchema); 

        }}>Paste your JSON Schema here to preview it.</textarea>
      <br/>
      <h1>Preview Web Form Output from JSON Schema Editor</h1>
      <JsonForms
        schema={fromJsonSchemaEditor}
        data={defaultData}
        renderers={materialRenderers}
        cells={materialCells}
      />
      <h1>UI Schema</h1>
      <h4>This is the generated UI Schema. UI Schema is optional. If no UI Schema is provided, the label will be the field name.</h4>
      <textarea rows={20} cols={60} value={JSON.stringify(generatedUISchema, null, 2)}></textarea>
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
