export const wfb_schema = {
  type: "object",
  properties: {
    title: {
      type: "string",
      maxLength: 25,
    },
    layout: {
      type: "string",
      enum: ["VerticalLayout", "HorizontalLayout"],
    },
    fields: {
      type: "array",
      items: {
        $ref: "#/definitions/fields",
      },
    },
  },
  required: ["title", "layout", "fields"],
  definitions: {
    fields: {
      type: "object",
      properties: {
        name: {
          type: "string",
          pattern: "^[^\\s]+[\\w][^\\s]+$",
        },
        description: {
          type: "string",
        },
        type: {
          type: "string",
          enum: [
            "string",
            "date",
            "date-time",
            "time",
            "number",
            "integer",
            "boolean",
            "array",
          ],
        },
        mandatory: {
          type: "boolean",
        },
        enumerations: {
          type: "array",
          items: {
            type: "string",
          },
        },
      },
      required: ["name", "type"],
    },
  },
};
export const wfb_uischema = {
  type: "VerticalLayout",
  elements: [
    {
      type: "Control",
      scope: "#/properties/title",
      label: "Enter title",
    },
    {
      type: "Control",
      scope: "#/properties/layout",
      label: "Choose layout",
    },
    {
      type: "Control",
      scope: "#/properties/fields",
      label: "Add form fields",
    },
  ],
};
export const vf_schema = {
  type: "array",
  items: {
    $ref: "#/definitions/record",
  },
  definitions: {
    record: {
      type: "object",
      properties: {
        formId: {
          type: "string",
        },
        title: {
          type: "string",
        },
        view: {
          type: "boolean",
        },
      },
    },
  },
};
