// import {
//   BedrockRuntimeClient,
//   InvokeModelCommand,
//   InvokeModelCommandInput,
//   InvokeModelCommandOutput,
//   InvokeModelWithResponseStreamCommand,
//   InvokeModelWithResponseStreamCommandInput,
//   InvokeModelWithResponseStreamCommandOutput,
// } from "@aws-sdk/client-bedrock-runtime";

// import {
//   BedrockClient,
//   CreateModelCustomizationJobCommand,
//   GetModelCustomizationJobCommand,
//   ListFoundationModelsCommand,
//   CreateModelCustomizationJobCommandInput,
//   CreateModelCustomizationJobCommandOutput,
//   GetModelCustomizationJobCommandInput,
//   GetModelCustomizationJobCommandOutput,
//   ListFoundationModelsCommandInput,
//   ListFoundationModelsCommandOutput,
// } from "@aws-sdk/client-bedrock";

// const client = new BedrockRuntimeClient({
//   region: process.env.REGION || "us-east-1",
// });
// const client = new BedrockClient({ region: process.env.REGION || "us-east-1" });
// const MODEL_ID = process.env.MODEL_ID || "anthropic.claude-instant-v1";
// const PROMPT = process.env.PROMPT || "Hi, who are you?";

// const params: InvokeModelWithResponseStreamCommandInput = {
//   modelId: MODEL_ID,
//   contentType: "application/json",
//   accept: "application/json",
//   body: JSON.stringify({
//     prompt: `Human:${PROMPT}Assistant:`,
//     max_tokens_to_sample: 300,
//     temperature: 0.5,
//     top_k: 250,
//     top_p: 1,
//   }),
// };
// const command = new InvokeModelWithResponseStreamCommand(param);
// const res = await client.send(command);

// const chunks = [];

// for await (const event of res.body) {
//   if (event.chunk && event.chunk.bytes) {
//     const chunk = JSON.parse(Buffer.from(event.chunk.bytes).toString("utf-8"));
//     chunks.push(chunk.completion); // change this line
//   } else if (
//     event.internalServerException ||
//     event.modelStreamErrorException ||
//     event.throttlingException ||
//     event.validationException
//   ) {
//     console.error(event);
//     break;
//   }
// }
// console.log({
//   prompt: PROMPT,
//   completion: chunks.join(""),
// });
