const fetch = require("node-fetch");

exports.imageToData = async (imageUrl) => {
  const buff = await (await fetch(imageUrl)).arrayBuffer();
  return `data:image/jpeg;base64,${Buffer.from(buff).toString("base64")}`;
};
