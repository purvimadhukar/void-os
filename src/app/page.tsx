"use client";

import { useState } from "react";
import BootSequence from "@/components/Boot/BootSequence";
import Desktop from "@/components/Desktop/Desktop";

export default function Home() {
  const [booted, setBooted] = useState(false);

  return (
    <main className="w-screen h-screen overflow-hidden bg-black">
      <BootSequence onComplete={() => setBooted(true)} />
      {booted && <Desktop />}
    </main>
  );
}
