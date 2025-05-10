import { Metadata } from "next";
import App from "@/components/pages/app";
import { APP_URL } from "@/lib/constants";

const frame = {
  version: "next",
  imageUrl: `${APP_URL}/images/feed.png`,
  button: {
    title: "Check your vibes",
    action: {
      type: "launch_frame",
      name: "Monad Vibes",
      url: APP_URL,
      splashImageUrl: `${APP_URL}/images/splash.png`,
      splashBackgroundColor: "#f7f7f7",
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Monad Vibes",
    openGraph: {
      title: "Monad Vibes",
      description: "Discover your random NFT",
      images: [
        {
          url: `${APP_URL}/images/feed.png`,
          width: 1200,
          height: 630,
          alt: "Games and Art Mini App",
        },
      ],
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

export default function Home() {
  return <App />;
}
