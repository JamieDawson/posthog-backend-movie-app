// netlify/functions/sheet.js

export async function handler(event, context) {
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

    return {
      statusCode: 200,
      body: JSON.stringify(data.results),
    };
  } catch (err) {
    console.error("Error fetching from PostHog:", err);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch data from PostHog." }),
    };
  }
}
