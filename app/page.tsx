"use client";

import SearchBar from "@/components/SearchBar";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleSearch = (searchTerm: string) => {
    router.push(`/articles?term=${searchTerm.trim()}`);
  };

  return (
    <main className="flex min-h-screen flex-col justify-between p-24">
      <SearchBar handleSearch={handleSearch} />
    </main>
  );
}
