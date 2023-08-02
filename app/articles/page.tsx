"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import Article from "@/types/article";
import useArticles from "@/hooks/useArticles";
import ArticleCard from "@/components/ArticleCard";
import Spinner from "@/components/Spinner";

const Articles = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { articles, setArticles, toggleSavedStatus } = useArticles([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);

      try {
        const response = await fetch(`/api/users/${userId}/articles`);

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

    if (userId) {
      fetchArticles();
    }
  }, [userId]);

  return (
    <section className="flex flex-col" style={{ height: "calc(100vh - 190px)" }}>
      {isLoading ? (
        <Spinner className="self-center my-auto" />
      ) : (
        articles.map((article) => (
          <ArticleCard key={article.id} article={article} toggleSave={(articleId) => toggleSavedStatus(articleId)} />
        ))
      )}
    </section>
  );
};

export default Articles;
