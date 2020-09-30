export const schema = {
    type: 'object',
    properties: {
      layout: {
        type: 'string',
        enum: ['VerticalLayout', 'HorizontalLayout']
      },
      fields: {
        type: 'array',
        items: {
          $ref: '#/definitions/fields'
        }
      }
    },
    required: ['layout', 'fields'],
    definitions: {
      fields: {
        type: 'object',
        properties: {
          name: {
            type: 'string'
          },
          description: {
            type: 'string'
          },
          type: {
            type: 'string',
            enum: ['string', 'date', 'number', 'integer', 'boolean']
          },
          mandatory: {
            type: 'boolean'
          },
          enumerations: {
            type: 'array',
            items: {
              type: 'string'
            }
          }
        },
        required: ['name', 'type']
      }
    }
  }
  export const uischema = {
    type: "VerticalLayout",
    elements: [
      {
        type: "Control",
        scope: "#/properties/layout",
        label: "Choose layout"
      },
      {
        type: "Control",
        scope: "#/properties/fields",
        label: "Add form fields"
      }
    ]
  }