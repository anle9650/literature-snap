"use client";

import { useState, useEffect } from "react";
import Article from "@/types/article";
import ArticlePanel from "@/components/ArticlePanel";
import { inherits } from "util";
import Spinner from "@/components/Spinner";

type Props = {
  params: {
    id: string;
  };
};

const ArticlePage = ({ params }: Props) => {
  const [article, setArticle] = useState<Article>();
  const [bulletPoints, setBulletPoints] = useState<string[]>([]);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const discussion = article?.passages
    .filter((passage) => passage.infons.section_type === "DISCUSS")
    .map((passage) => passage.text)
    .join("/n");

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/articles/${params.id}`);

        if (!response.ok) {
          return null;
        }

        const article = await response.json();
        setArticle(article);
      } catch (error) {
        console.error(error);
        return null;
      }
    };

    if (params.id) {
      fetchArticle();
    }
  }, []);

  const summarize = async () => {
    setIsSummarizing(true);
    setIsLoading(true);

    try {
      const response = await fetch("/api/articles/summarize", {
        method: "POST",
        body: JSON.stringify({
          content: `${article?.abstract}/n${discussion}`,
        }),
      });

      if (response.ok) {
        const bulletPoints = await response.json();
        setBulletPoints(bulletPoints);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ul className="flex justify-end p-3">
        <li>
          <button
            className="inline-block border border-blue-500 rounded py-1 px-3 bg-blue-500 text-white"
            disabled={!article}
            onClick={summarize}
          >
            Summarize
          </button>
        </li>
      </ul>
      <div className="grid grid-cols-3 gap-4 mt-3">
        <section className={isSummarizing ? "col-span-2" : "col-span-3"}>
          {article && <ArticlePanel passages={article.passages} />}
        </section>

        {isSummarizing && (
          <section
            className="flex flex-col border-l-2 border-gray-500"
            style={{ height: "calc(100vh - 190px)" }}
          >
            {isLoading ? (
              <Spinner className="self-center my-auto" />
            ) : (
              <ul
                className="list-disc leading-loose overflow-scroll px-12 py-6"
                style={{ height: "inherit" }}
              >
                {bulletPoints.map((bulletPoint, index) => (
                  <li key={`bulletPoint${index}`}>{bulletPoint}</li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>
    </>
  );
};

export default ArticlePage;
