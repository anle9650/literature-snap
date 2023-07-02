"use client";

import { useState } from "react";
import SearchBar from "./components/SearchBar";

export default function Home() {
  const [articleIds, setArticleIds] = useState<string[]>([]);

  const handleSearch = async (searchTerm: string) => {
    const response = await fetch(
      `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&format=json&term=science%5bjournal%5d+AND+${searchTerm.trim()}`
    );
    const data = await response.json();
    setArticleIds(data.esearchresult.idlist);
  };

  return (
    <main className="flex min-h-screen flex-col justify-between p-24">
      <SearchBar handleSearch={handleSearch} />
    </main>
  );
}
