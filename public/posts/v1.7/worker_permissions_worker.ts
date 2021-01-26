self.onmessage = async function (e) {
  const { cmd, fileName } = e.data;
  if (cmd !== "readFile") {
    throw new Error("Invalid command");
  }
  const buf = await Deno.readFile(fileName);
  const fileContents = new TextDecoder().decode(buf);
  console.log(fileContents);
  self.close();
};
