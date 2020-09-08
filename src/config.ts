export const schema = {
    type: 'object',
    properties: {
      age: {
        type: 'string',
        enum: ['12-17', '18-25','25-40','40-60','60-80','80-100']
      },
      gender: {
        type: 'string',
        enum: ['Male', 'Female', 'Undisclosed']
      },
      date: {
        type: 'string',
        format: 'date'
      },
      purpose: {
        type: 'string',
        enum: ['Business', 'Education', 'Marketing', 'Personal']
      },
      otherPurpose: {
        type: 'string'
      },
      rating: {
        type: 'integer',
        enum: [10,9,8,7,6,5,4,3,2,1,0]
      },
      location: {
        type: 'string',
        enum: ['Asia Pacific', 'America', 'Europe', 'Middle East / Africa']
      },
      comments: {
        type: 'array',
        items: {
          type: 'string'
        }
      }
    },
    required: ['age', 'gender', 'date', 'purpose','rating','location']
  }
  export const uischema = {
    type: "VerticalLayout",
    elements: [
      {
        type: "Control",
        scope: "#/properties/age",
        label: "What is your Age Group?"
      },
      {
        type: "Control",
        scope: "#/properties/gender"
      },
      {
        type: "Control",
        scope: "#/properties/date",
        label: "Date Submitted"
      },
      {
        type: "Control",
        scope: "#/properties/purpose",
        label: "What is your main purpose of using forms?"
      },
      {
        type: "Control",
        scope: "#/properties/otherPurpose",
        label: "Can you specify the exact purpose if not on the list? (optional)"
      },
      {
        type: "Control",
        scope: "#/properties/rating",
        label: "How do you rate this form in terms of look and feel, user friendliness, and whether it's fit to your purpose?"
      },
      {
        type: "Control",
        scope: "#/properties/location",
        label: "Where in the world are you located now?"
      },
      {
        type: "Control",
        scope: "#/properties/comments",
        label: "Additional comments you may have? Specify if you want more customizations or you want to focus on just building a dynamic tool which you can launch in seconds, such as for example generating online surveys, educational materials for test or assessments, or marketing campaigns? (click on + to add comment)"
      }
    ]
  }