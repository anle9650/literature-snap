import { fetchArticles } from "@/utils/articles";
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
    const articles = await fetchArticles(articleIds);

    return new Response(JSON.stringify(articles), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch articles", { status: 500 });
  }
};
