import React from "react";
import ReactDOM from "react-dom";
import "./App.css";
import { vf_schema, wfb_schema, wfb_uischema } from "./config";
import {
  materialRenderers,
  materialCells,
} from "@jsonforms/material-renderers";
import { Button, Snackbar, Menu, MenuItem } from "@material-ui/core";
import { JsonForms } from "@jsonforms/react";
import { postData, getAllData } from "./api";
import { UISchemaElement } from "@jsonforms/core";

function App() {
  const [errorMessage, setErrorMessage] = React.useState<string>();
  const [generatedJsonSchema, setJsonSchema] = React.useState<object>({});
  const [jsonPayload, setJsonPayload] = React.useState<object>({});
  const [generatedUISchema, setUiSchema] = React.useState<UISchemaElement>({
    type: "VerticalLayout",
  });
  const [open, setOpen] = React.useState(false);
  const [defaultData, setDefaultData] = React.useState<object>({});

  return (
    <div className="App">
      <MenuInApp />
      <br />
      <br />
      <h2>Form Designer</h2>
      <JsonForms
        schema={wfb_schema}
        uischema={wfb_uischema}
        data={defaultData}
        renderers={materialRenderers}
        cells={materialCells}
        onChange={({ errors, data }) => {
          if (errors?.length !== 0) {
            const errorMsg = errors
              ?.map((item) => item.dataPath + " " + item.message)
              .reduce((acc, item) => acc + item + "; ", "");
            setErrorMessage(errorMsg);
          } else {
            setErrorMessage("");
            const fields: any[] | undefined = data.fields;
            var properties = {};
            var required: any = [];
            var uiElements: any = [];
            fields?.map((item) => {
              item.type !== "array"
                ? Object.assign(properties, {
                    [item.name]: Object.assign(
                      item.type === "date" ||
                        item.type === "date-time" ||
                        item.type === "time"
                        ? { type: "string", format: item.type }
                        : { type: item.type },
                      item.enumerations != null &&
                        item.enumerations?.length !== 0
                        ? { enum: item.enumerations }
                        : {}
                    ),
                  })
                : Object.assign(properties, {
                    [item.name]: {
                      type: "array",
                      items: Object.assign(
                        {
                          type: "string",
                        },
                        item.enumerations != null &&
                          item.enumerations?.length !== 0
                          ? { enum: item.enumerations }
                          : {}
                      ),
                      uniqueItems: true,
                    },
                  });
              if (item.mandatory) {
                required.push(item.name);
              }
              uiElements.push({
                type: "Control",
                scope: "#/properties/" + item.name,
                label: item.description,
              });
            });
            const jsonSchema = {
              type: "object",
              properties: properties,
              required: required,
            };
            const uiSchema = {
              type: data.layout,
              elements: uiElements,
            };
            setJsonSchema(jsonSchema);
            setUiSchema(uiSchema);
            setJsonPayload(data);
          }
        }}
      />
      <br />
      <br />
      <h2>Preview</h2>
      <JsonForms
        schema={generatedJsonSchema}
        uischema={generatedUISchema}
        data={defaultData}
        renderers={materialRenderers}
        cells={materialCells}
      />
      <br />
      <br />
      <Button
        variant="contained"
        color="primary"
        onClick={(e) =>
          save(
            errorMessage,
            jsonPayload,
            generatedJsonSchema,
            generatedUISchema,
            setOpen,
            setDefaultData,
            setJsonSchema,
            setUiSchema
          )
        }
      >
        SAVE
      </Button>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={open}
        autoHideDuration={6000}
        onClose={(event) => setOpen(false)}
        message="Successfully Saved"
      />
      <br />
      <br />
    </div>
  );
}

function MenuInApp() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickVisualEditor = () => {
    setAnchorEl(null);
    ReactDOM.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
      document.getElementById("root")
    );
  };

  const handleClickViewForms = () => {
    setAnchorEl(null);
    getAllData(process.env.REACT_APP_PERSISTENCE_COLLECTION).then(
      (response) => {
        ReactDOM.render(
          <React.StrictMode>
            <ListForms data={response.data} />
          </React.StrictMode>,
          document.getElementById("root")
        );
      }
    );
  };

  return (
    <div className="Menu">
      <h1>Web Form Builder</h1>
      <Button
        variant="contained"
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={(event) => {
          setAnchorEl(event.currentTarget);
        }}
      >
        OPTIONS
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClickVisualEditor}>Form Designer</MenuItem>
        <MenuItem onClick={handleClickViewForms}>List all Web Forms</MenuItem>
      </Menu>
    </div>
  );
}

function ListForms(props: any) {
  const [webformsData] = React.useState(props.data);

  const summaryData = webformsData.map((item: any) => {
    return {
      formId: item._id,
      title: item.webFormMeta.title,
      view: false,
    };
  });

  return (
    <div className="App">
      <MenuInApp />
      <br />
      <br />
      <h2>List of Web Forms</h2>
      <JsonForms
        schema={vf_schema}
        data={summaryData}
        renderers={materialRenderers}
        cells={materialCells}
        onChange={({ errors, data }) => {
          const filterDataByView = data?.filter((item: any) => {
            return item.view;
          });
          const formId = filterDataByView[0]?.formId;
          if (formId != null) {
            const filterDataById = webformsData?.filter((item: any) => {
              return item._id === formId;
            });
            if (filterDataById != null) {
              ReactDOM.render(
                <React.StrictMode>
                  <ViewForm data={filterDataById[0]} />
                </React.StrictMode>,
                document.getElementById("root")
              );
            }
          }
        }}
      />
    </div>
  );
}

function ViewForm(props: any) {
  const [webformsData] = React.useState(props.data);

  return (
    <div className="App">
      <MenuInApp />
      <br />
      <br />
      <h2>{webformsData.webFormMeta.title}</h2>
      <JsonForms
        schema={webformsData.jsonSchema}
        uischema={webformsData.uiSchema}
        data={{}}
        renderers={materialRenderers}
        cells={materialCells}
      />
    </div>
  );
}

function save(
  errorMsg: any,
  payload: any,
  jsonSchema: any,
  uiSchema: any,
  setOpen: any,
  setDefaultData: any,
  setJsonSchema: any,
  setUISchema: any
) {
  if (errorMsg === "") {
    const webFormData = {
      webFormMeta: payload,
      jsonSchema: jsonSchema,
      uiSchema: uiSchema,
    };
    postData(process.env.REACT_APP_PERSISTENCE_COLLECTION, webFormData).then(
      (response) => {
        setOpen(true);
        clearForm(setJsonSchema, setUISchema, setDefaultData);
      }
    );
  }
}

function clearForm(setJsonSchema: any, setUISchema: any, setDefaultData: any) {
  setJsonSchema({});
  setUISchema({});
  setDefaultData({});
}

export default App;
