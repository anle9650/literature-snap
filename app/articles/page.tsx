"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Article = {
  id: string;
  date: Date;
  title: string;
  abstract: string;
  passages: [];
};

const Articles = () => {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("term");

  const [articleIds, setArticleIds] = useState<string[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);

  console.log(articles);

  useEffect(() => {
    const fetchArticleIds = async () => {
      try {
        const response = await fetch(
          `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&format=json&term=science%5bjournal%5d+AND+${searchTerm}`
        );

        if (response.ok) {
          const data = await response.json();
          setArticleIds(data.esearchresult.idlist);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (searchTerm) {
      fetchArticleIds();
    }
  }, []);

  useEffect(() => {
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

    const fetchArticles = async () => {
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

    fetchArticles();
  }, [articleIds]);

  return <div>Articles</div>;
};

export default Articles;
