const express = require("express");

const jose = require("jose");

// Pull private key and app ID from env
const PRIVATE_PEM = process.env.private_key;
const APP_ID = process.env.app_id;
const PORT = 8080;

const app = express();
app.set("view engine", "ejs");
app.set("views", "src/views");

app.get("/", async (_, res) => {
  // Load private key from PEM
  const pk = await jose.importPKCS8(PRIVATE_PEM, "RS256");

  // Construct and sign JWS
  let jws = await new jose.SignJWT({})
    .setProtectedHeader({ alg: "RS256" })
    .setIssuedAt()
    .setIssuer(APP_ID)
    .setExpirationTime("5s")
    .sign(pk);

  // Write content to client and end the response
  return res.render("index", { jws });
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
