const domainName = Deno.args[0];
if (!domainName) {
  throw new Error("Domain name not specified in first argument");
}

const records = await Deno.resolveDns(domainName, "A");
for (const ip of records) {
  console.log(ip);
}
