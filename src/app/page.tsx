"use client";

import Image from "next/image";
import { ConnectButton } from "thirdweb/react";
import thirdwebIcon from "@public/thirdweb.svg";
import { client } from "./client";
import {
  inAppWallet,
  createWallet,
  unlinkProfile,
  getProfiles,
} from "thirdweb/wallets";

const wallets = [
  inAppWallet({
    auth: {
      options: ["x", "github"], // Allow Google and GitHub login
    },
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
];

export default function Home() {
  const handleUnlinkGitHub = async () => {
    try {
      // Get the profiles
      const profiles = await getProfiles({ client });
      console.log("Profiles:", profiles); // Log the profiles to ensure correct structure

      // Find the GitHub profile
      const githubProfile = profiles.find(profile => profile.type === "github");

      if (!githubProfile) {
        console.log("No GitHub profile found. Please ensure the GitHub account is properly linked.");
        return;
      }

      // Check the profile format being passed to unlinkProfile
      console.log("GitHub Profile to Unlink:", githubProfile);

      // Unlink the GitHub profile
      const updatedProfiles = await unlinkProfile({
        client,
        profileToUnlink: githubProfile, // Pass the profile to unlink
      });

      console.log("Updated Profiles:", updatedProfiles); // Log the updated profiles after unlinking
    } catch (error) {
      console.error("Error unlinking GitHub profile:", error);
      if (error instanceof Error) {
        // Handle specific error details, if any
        alert(error.message || "An error occurred while unlinking the GitHub profile.");
      }
    }
  };


  return (
    <main className="p-4 pb-10 min-h-[100vh] flex items-center justify-center container max-w-screen-lg mx-auto">
      <div className="py-20">
        <Header />

        <div className="flex justify-center mb-20">
          <ConnectButton
            client={client}
            wallets={wallets}
            appMetadata={{
              name: "Example App",
              url: "https://example.com",
            }}
          />
        </div>

        {/* Add the button to unlink GitHub */}
        <div className="flex justify-center">
          {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
          <button
            onClick={handleUnlinkGitHub}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Unlink GitHub
          </button>
        </div>
      </div>
    </main>
  );
}

function Header() {
  return (
    <header className="flex flex-col items-center mb-20 md:mb-20">
      <Image
        src={thirdwebIcon}
        alt=""
        className="size-[150px] md:size-[150px]"
        style={{
          filter: "drop-shadow(0px 0px 24px #a726a9a8)",
        }}
      />

      <h1 className="text-2xl md:text-6xl font-semibold md:font-bold tracking-tighter mb-6 text-zinc-100">
        thirdweb SDK
        <span className="text-zinc-300 inline-block mx-1"> + </span>
        <span className="inline-block -skew-x-6 text-blue-500"> Next.js </span>
      </h1>
    </header>
  );
}

