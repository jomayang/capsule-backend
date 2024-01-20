const express = require("express");
const cors = require("cors");
const https = require("https");
const { ref, getDownloadURL } = require("firebase/storage");
const { sequence2, sequence1, sequence3 } = require("./seq");
const { storage } = require("./firebase-config");
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

app.use(cors());

/*
 * - Get parcels by tracking id -> /parcels/yal-123456 or /parcel/?tracking=yal1,yal2
 * - Retrieve specific parcels fields -> /parcel/?fields=field1, fiels2
 * - Retrieve
 * - The easiest solution is to pass a request tail parameter in the body of the request, then add it to the link.
 * - in this way, we don't have to recreate a completely new API.
 */
app.get("/", async (req, res) => {
  res.status(200).json({ message: "goo" });
});

app.post("/", async (req, res) => {
  const index = req.body.idx;
  const sequence = req.body.seq;
  const isEnd = req.body.ise;
  const isStart = req.body.iss;

  console.log("index = ", index);
  console.log(`sequence = ${sequence}`);

  let selectedSequence;
  let start, end;
  if (sequence === "sequence1") {
    selectedSequence = sequence1;
    start = 42;
    end = 47;
  } else if (sequence === "sequence2") {
    selectedSequence = sequence2;
    start = 40;
    end = 45;
  } else if (sequence === "sequence3") {
    selectedSequence = sequence3;
    start = 51;
    end = 68;
  }
  try {
    const pathRefStart = ref(
      storage,
      `${sequence}/${selectedSequence[start - index]}`
    );
    const pathRefEnd = ref(
      storage,
      `${sequence}/${selectedSequence[end + index]}`
    );
    const startUrl = isStart ? null : await getDownloadURL(pathRefStart);
    const endUrl = isEnd ? null : await getDownloadURL(pathRefEnd);

    res.status(200).json({ start: startUrl, end: endUrl });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`connected sucessfully on port ${port}`);
});
