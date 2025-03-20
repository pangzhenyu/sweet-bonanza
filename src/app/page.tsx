"use client";

import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import GameContainer to prevent SSR issues
const GameContainer = dynamic(
  () => import('../components/game/GameContainer').then(mod => mod.GameContainer),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4">
      <div className="z-10 w-full max-w-5xl items-center justify-between text-sm lg:flex">
        <div className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          <p className="font-bold text-xl">Sweet Bonanza Clone</p>
        </div>
        <div className="fixed bottom-0 left-0 flex w-full justify-center space-x-4 border-t border-gray-300 bg-gradient-to-t from-white via-white dark:from-black dark:via-black py-4 dark:border-neutral-800 lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          <Link
            href="/assets"
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
          >
            Generate Assets
          </Link>
        </div>
      </div>

      <div className="relative flex place-items-center flex-col">
        <h1 className="text-3xl font-bold mb-4 text-center">Sweet Bonanza Slot</h1>
        <p className="mb-8 text-center max-w-2xl">
          A clone of Pragmatic Play's popular Sweet Bonanza slot game. This project uses PixiJS for rendering
          and implements the tumbling reels mechanic where winning symbols disappear and new ones fall in.
        </p>
      </div>

      <div className="w-full h-[600px] max-w-[1280px] mx-auto border-4 border-gray-800 rounded-lg overflow-hidden">
        <GameContainer />
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>This project is for educational purposes only. All rights belong to their respective owners.</p>
      </div>
    </main>
  );
}
