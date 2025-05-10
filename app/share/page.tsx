import { Metadata } from "next";
import { redirect } from "next/navigation";

const MINIAPP_URL = process.env.NEXT_PUBLIC_URL || "/";

export async function generateMetadata({ searchParams }: { searchParams: { img?: string; score?: string } }): Promise<Metadata> {
  console.log("searchParams", searchParams);
  const img = searchParams.img || "";
  return {
    title: "Monad Vibes",
    description: "Monad Vibes is a platform for discovering and sharing NFTs with a unique twist. It allows users to create and share their own NFTs, as well as discover and collect NFTs created by others.",
    openGraph: {
      title: "Monad Vibes",
      description: "Monad Vibes is a platform for discovering and sharing NFTs with a unique twist. It allows users to create and share their own NFTs, as well as discover and collect NFTs created by others.",
      images: [
        {
          url: img,
          width: 600,
          height: 600,
          alt: "Score Screenshot",
        },
      ],
    },
  };
}

export default function SharePage() {
  redirect(MINIAPP_URL);
} 
