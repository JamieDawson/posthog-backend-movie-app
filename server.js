require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();
app.use(cors());

app.get("/api/sheet", async (req, res) => {
  try {
    const response = await fetch(
      `${process.env.POSTHOG_API_URL}/api/projects/${process.env.POSTHOG_PROJECT_ID}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.POSTHOG_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: {
            kind: "HogQLQuery",
            query: "SELECT * FROM googlesheets.sheet1 LIMIT 10",
          },
        }),
      }
    );
    const data = await response.json();

    // Log the full response for debugging
    console.log("PostHog API response:", data);

    res.json(data.results);
  } catch (err) {
    console.error("Error fetching from PostHog:", err);
    res.status(500).json({ error: "Failed to fetch data from PostHog." });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
