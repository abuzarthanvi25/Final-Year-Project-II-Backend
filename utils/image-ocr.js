const { ComputerVisionClient } = require("@azure/cognitiveservices-computervision");
const { CognitiveServicesCredentials } = require("@azure/ms-rest-azure-js");
require("dotenv").config();

const subscriptionKey = process.env.AZURE_API_KEY;
const endpoint = process.env.ENDPOINT;

const computervisionClient = new ComputerVisionClient(
    new CognitiveServicesCredentials(subscriptionKey),
    endpoint
  );

async function readTextFromImage(imageBuffer) {
    const readResponse = await computervisionClient.readInStream(
      imageBuffer,
      { raw: true }
    );

    const readOperationLocation = readResponse.operationLocation;
    const operationId = readOperationLocation.split("/").pop();
  
    let readResult;

    while (true) {
        readResult = await computervisionClient.getReadResult(operationId);
        if (readResult.status !== "notStarted" && readResult.status !== "running") {
        break;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    let text = "";
    if (readResult.status === "succeeded") {
        for (const textResult of readResult.analyzeResult.readResults) {
        for (const line of textResult.lines) {
            text += line.text + " ";
        }
        }
    }

    return text.trim();
  }

const handleTransformResponse = (text) => {
    return `<br/><p>${text}</p></br>`
}

module.exports = {readTextFromImage, handleTransformResponse}