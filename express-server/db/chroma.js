const { ChromaClient } = require("chromadb");
const client = new ChromaClient();

let test = async () => {
  //   const collection = await client.createCollection({
  //     name: "my_collection",
  //   });

  //   await collection.add({
  //     documents: [
  //       "This is a document about pineapple",
  //       "This is a document about oranges",
  //     ],
  //     ids: ["id1", "id2"],
  //   });

  //   const results = await collection.query({
  //     queryTexts: ["This is a query document about hawaii"], // Chroma will embed this for you
  //     nResults: 2, // how many results to return
  //   });

  //   console.log(results);

  // switch `createCollection` to `getOrCreateCollection` to avoid creating a new collection every time
  const collection = await client.getOrCreateCollection({
    name: "my_collection",
  });
  // switch `add` to `upsert` to avoid adding the same documents every time
  await collection.upsert({
    documents: [
      "This is a document about pineapple",
      "This is a document about oranges",
    ],
    ids: ["id1", "id2"],
  });
  const results = await collection.query({
    queryTexts: ["This is a query document about hawaii"], // Chroma will embed this for you
    nResults: 2, // how many results to return
  });
  console.log(results);
};

test();
