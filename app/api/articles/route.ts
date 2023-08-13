import { authOptions } from '@/app/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"
import { NextRequest } from "next/server";
import { fetchArticles } from "@/utils/articles";
import SessionUser from '@/types/sessionUser';

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const term = searchParams.get("term");
  const session = await getServerSession(authOptions);
  const user = session?.user as SessionUser;

  try {
    const response = await fetch(
      `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&format=json&term=science%5bjournal%5d+AND+${term}`
    );

    const data = await response.json();
    const articleIds = data.esearchresult.idlist;
    const articles = await fetchArticles(articleIds, user?.id);

    return new Response(JSON.stringify(articles), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch articles", { status: 500 });
  }
};
