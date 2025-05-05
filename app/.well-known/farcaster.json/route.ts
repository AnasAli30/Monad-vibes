import { NextResponse } from "next/server";
import { APP_URL } from "../../../lib/constants";

export async function GET() {
  const farcasterConfig = {

  "accountAssociation": {
    "header": "eyJmaWQiOjI0OTcwMiwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweEVCNDRFYTBlODBhQzE4MjIwREM5RjY0MjEyRWI3OTAwMzAwMTAxNjUifQ",
    "payload": "eyJkb21haW4iOiJtb25hZC12aWJlcy1zZGYudmVyY2VsLmFwcCJ9",
    "signature": "MHhmYTczY2M3NWI2NTA3YjJmNWUzYmQ3N2M0MDg3MjY4YmQwYjQ1MzUwN2QyNmJmNzdmNWUyZjEwNDA3OTFhN2E5MmZmOGYwNTdiNGE2YWE4ZDE2NmEwNjgwNDc4ZTc1NWVjNzUxYTdjYmVjNDNjNDI5MjFkNWNlNDYzMzFlNmI1YzFj"
  },

    frame: {
      version: "1",
      name: "Monad Vibe",
      iconUrl: `${APP_URL}/images/icon.png`,
      homeUrl: `${APP_URL}`,
      imageUrl: `${APP_URL}/images/feed.png`,
      screenshotUrls: [],
      tags: ["monad", "farcaster", "miniapp"],
      primaryCategory: "social",
      buttonTitle: "Join the Vibe",
      splashImageUrl: `${APP_URL}/images/splash.png`,
      splashBackgroundColor: "#ffffff",
      webhookUrl: `${APP_URL}/api/webhook`,
    },
  };

  return NextResponse.json(farcasterConfig);
}
