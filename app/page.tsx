"use client";

import { useState } from "react";
import useArticles from "@/hooks/useArticles";
import SearchBar from "@/components/SearchBar";
import ArticleCard from "@/components/ArticleCard";

export default function Home() {
  const { articles, setArticles, toggleSavedStatus } = useArticles([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (searchTerm: string) => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/articles?term=${searchTerm}`);

      if (response.ok) {
        const articles = await response.json();
        setArticles(articles);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="p-12">
      <SearchBar handleSearch={handleSearch} isLoading={isLoading} />
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
          toggleSave={(articleId) => toggleSavedStatus(articleId)}
        />
      ))}
    </section>
  );
}
