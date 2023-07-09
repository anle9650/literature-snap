"use client";

import { useState } from "react";
import Link from "next/link";

import Article from "@/types/article";
import SearchBar from "@/components/SearchBar";

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);

  const fetchArticle = async (articleId: string): Promise<Article | null> => {
    try {
      const response = await fetch(
        `https://www.ncbi.nlm.nih.gov/research/bionlp/RESTful/pmcoa.cgi/BioC_json/${articleId}/unicode`
      );

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      const date = new Date(
        `${data.date.slice(0, 4)}-${data.date.slice(4, 6)}-${data.date.slice(
          6,
          8
        )}`
      );
      const passages = data.documents[0].passages;

      return {
        id: articleId,
        date,
        title: passages[0].text,
        abstract: passages[1].text,
        passages: passages.slice(2),
      };
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const fetchArticles = async (articleIds: string[]) => {
    const newArticles: Article[] = [];
    await Promise.all(
      articleIds.map(async (articleId) => {
        const article = await fetchArticle(articleId);
        if (article) {
          newArticles.push(article);
        }
      })
    );
    setArticles(newArticles);
  };

  const handleSearch = async (searchTerm: string) => {
    try {
      const response = await fetch(
        `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&format=json&term=science%5bjournal%5d+AND+${searchTerm}`
      );

      if (response.ok) {
        const data = await response.json();
        const articleIds = data.esearchresult.idlist;
        fetchArticles(articleIds);
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
