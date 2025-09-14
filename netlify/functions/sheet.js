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
      headers: {
        "Access-Control-Allow-Origin": "*", // allow all origins
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      },
      body: JSON.stringify(data.results),
    };
  } catch (err) {
    console.error("Error fetching from PostHog:", err);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*", // add here too
      },
      body: JSON.stringify({ error: "Failed to fetch data from PostHog." }),
    };
  }
}
