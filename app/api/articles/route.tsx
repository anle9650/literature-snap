import Article from "@/types/article";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const term = searchParams.get("term");

  try {
    const response = await fetch(
      `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&format=json&term=science%5bjournal%5d+AND+${term}`
    );

    const data = await response.json();
    const articleIds = data.esearchresult.idlist;
    const articles: Article[] = await fetchArticles(articleIds);

    return new Response(JSON.stringify(articles), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch articles", { status: 500 });
  }
};

async function fetchArticles(articleIds: string[]): Promise<Article[]> {
  const articles: Article[] = [];

  await Promise.all(
    articleIds.map(async (articleId) => {
      const article = await fetchArticle(articleId);
      if (article) {
        articles.push(article);
      }
    })
  );

  return articles;
}

async function fetchArticle(articleId: string): Promise<Article | null> {
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
    return null;
  }
}
