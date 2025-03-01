"use client";

import Link from "next/link";
import { type ReactNode, useState } from "react";
import AboutFrame from "./AboutFrame";
import HyperButton from "./HyperButton";
import Frame from "./frame";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  return (
    <div className="min-h-screen  px-2.5 py-8 md:py-12 md:px-4  flex  justify-center overflow-x-hidden overflow-y-auto">
      <div className="relative w-full max-w-5xl">
        <div className="grid grid-cols-[1fr_minmax(auto,_90%)_1fr] md:grid-cols-[1fr_minmax(auto,_85%)_1fr] items-start">
          {/* Future Rabbit hole list */}
          <div className="pt-8">
            <div className="h-full" />
          </div>

          {/* Main Content Frame */}
          <div className={`relative 'h-[75vh]`}>
            <Frame
              className="font-mono"
              title="Banjo Rolls Deluxe"
              titleSize="lg"
              minHeight="min-h-[75vh]"
            >
              <div className={`py-8 px-2 md:p-8 'h-full overflow-hidden`}>
                {children}
                {isAboutOpen && (
                  <div className="mt-4">
                    <AboutFrame />
                  </div>
                )}
              </div>
            </Frame>
            <div className="flex flex-row justify-between text-xs text-right font-mono tracking-tight mt-2">
              <HyperButton
                text={isAboutOpen ? "Close About" : "About"}
                onClick={() => setIsAboutOpen(!isAboutOpen)}
              />
              <Link
                className="border-b border-black hover:border-b-[2px] text-right"
                href="https://twait.dev"
              >
                Made by Will
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
