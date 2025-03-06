const defaultJSON = {
    name: "New Survey",
    json: {
      title: "Default Title",
      description: "Default Description",
      tags: ["default", "example"],
      elements: [
        {
          type: "radiogroup",
          name: "question1",
          choices: ["1", "2", "3"]
        }
      ]
    }
};

const newSurvey = `New Survey`

module.exports = {
  defaultJSON,
  newSurvey
};