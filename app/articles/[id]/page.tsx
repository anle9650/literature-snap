"use client";

import { useState, useEffect } from "react";
import Article from "@/types/article";
import ArticlePanel from "@/components/ArticlePanel";

type Props = {
  params: {
    id: string;
  };
};

const ArticlePage = ({ params }: Props) => {
  const [article, setArticle] = useState<Article>();
  const [bulletPoints, setBulletPoints] = useState<string[]>([]);
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false);

  const discussion: string | undefined = article?.passages
    .filter((passage) => passage.infons.section_type === "DISCUSS")
    .map((passage) => passage.text)
    .join("/n");

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(
          `https://www.ncbi.nlm.nih.gov/research/bionlp/RESTful/pmcoa.cgi/BioC_json/${params.id}/unicode`
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

        setArticle({
          id: params.id,
          date,
          title: passages[0].text,
          abstract: passages[1].text,
          passages: passages.slice(2),
        });
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
    try {
      const response = await fetch("/api/article/summarize", {
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
      setIsSummarizing(true);
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
        <section className="col-span-2">
          <ArticlePanel article={article} />
        </section>
        {isSummarizing && (
          <section className="border-l-2 border-gray-500">
            <ul
              className="list-disc leading-loose overflow-scroll px-12 py-6"
              style={{ maxHeight: "calc(100vh - 190px)" }}
            >
              {bulletPoints.map((bulletPoint, index) => (
                <li key={`bulletPoint${index}`}>{bulletPoint}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  );
};

export default ArticlePage;
