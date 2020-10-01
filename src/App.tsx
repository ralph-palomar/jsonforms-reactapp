import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import { wfb_schema, wfb_uischema } from './config';
import { 
  materialRenderers,
  materialCells
} from '@jsonforms/material-renderers';
import { Button, Snackbar, Menu, MenuItem } from '@material-ui/core';
import { JsonForms } from '@jsonforms/react';
import { postData } from './api';
import { UISchemaElement } from '@jsonforms/core';

function App() {
  const [errorMessage, setErrorMessage] = React.useState<string>();
  const [generatedJsonSchema, setJsonSchema] = React.useState<object>({});
  const [jsonPayload, setJsonPayload] = React.useState<object>({});
  const [generatedUISchema, setUiSchema] = React.useState<UISchemaElement>({ type: 'VerticalLayout' });
  const [open, setOpen] = React.useState(false);
  const [defaultData, setDefaultData] = React.useState<object>({});

  return (
    <div className="App">
      <MenuInApp/>
      <br/><br/>
      <JsonForms
        schema={wfb_schema}
        uischema={wfb_uischema}
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
            setJsonPayload(data);
          }
        }}
      />
      <br/><br/>
      <h2>Preview</h2>
      <JsonForms
        schema={generatedJsonSchema}
        uischema={generatedUISchema}
        data={defaultData}
        renderers={materialRenderers}
        cells={materialCells}
      />
      <br/><br/>
      <Button variant="contained" color="primary" onClick={(e) => save(errorMessage, jsonPayload, generatedJsonSchema, generatedUISchema, setOpen, setDefaultData, setJsonSchema, setUiSchema)}>
         SAVE
      </Button>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={open}
        autoHideDuration={6000}
        onClose={(event) => setOpen(false)}
        message="Successfully Saved"
      />
      <br/><br/>
    </div>
  );
}

function MenuInApp() {

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClose = () => {
    setAnchorEl(null);
  }

  const handleClickVisualEditor = () => {
    setAnchorEl(null);
    ReactDOM.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
      document.getElementById('root')
    );
  }

  const handleClickViewForms = () => {
    setAnchorEl(null);
    ReactDOM.render(
      <React.StrictMode>
        <ViewForms />
      </React.StrictMode>,
      document.getElementById('root')
    );
  }

  return (
    <div className="Menu">
      <h1>Web Form Builder</h1>
      <Button variant="contained" aria-controls="simple-menu" aria-haspopup="true" onClick={(event) => { setAnchorEl(event.currentTarget) } }>OPTIONS</Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClickVisualEditor}>Visual Editor</MenuItem>
        <MenuItem onClick={handleClickViewForms}>View My Forms</MenuItem>
      </Menu>
    </div>
  );

}

function ViewForms() {
  return (
    <div className="App">
      <MenuInApp/>
    </div>
  )
}

function save(errorMsg: any, payload: any, jsonSchema: any, uiSchema: any, setOpen: any, setDefaultData: any, setJsonSchema: any, setUISchema: any) {
  if (errorMsg === "") {
    const webFormData = {
      webFormMeta: payload,
      jsonSchema: jsonSchema,
      uiSchema: uiSchema
    }
    postData('WEB_FORMS', webFormData)
      .then((response) => {
        setOpen(true);
        clearForm(setJsonSchema, setUISchema, setDefaultData);
      })
    
  }
}

function clearForm(setJsonSchema: any, setUISchema: any, setDefaultData: any) {
  setJsonSchema({});
  setUISchema({});
  setDefaultData({});
}

export default App;
