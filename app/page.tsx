"use client";

import { useState } from "react";
import Link from "next/link";

import Article from "@/types/article";
import SearchBar from "@/components/SearchBar";

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);

  const handleSearch = async (searchTerm: string) => {
    try {
      const response = await fetch(
        `/api/articles?term=${searchTerm}`
      );

      if (response.ok) {
        const articles = await response.json();
        setArticles(articles);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="p-12">
      <SearchBar handleSearch={handleSearch} />

      {articles.map((article) => (
        <Link
          key={article.id}
          href={`/articles/${article.id}`}
          className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 mt-3"
        >
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {article.title}
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            {article.abstract}
          </p>
        </Link>
      ))}
    </section>
  );
}
