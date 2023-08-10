"use client";

import { useEffect, useState } from "react";
import useArticles from "@/hooks/useArticles";
import SearchBar from "@/components/SearchBar";
import ArticleCard from "@/components/ArticleCard";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("term");

  const { articles, setArticles, toggleSavedStatus } = useArticles([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchTerm) {
      handleSearch(searchTerm);
    }
  }, []);

  const handleSearch = async (searchTerm: string) => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/articles?term=${searchTerm}`);

      if (response.ok) {
        const articles = await response.json();
        setArticles(articles);
        sessionStorage.setItem('searchTerm', searchTerm);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="p-12">
      <SearchBar
        value={searchTerm}
        handleSearch={handleSearch}
        isLoading={isLoading}
      />
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
