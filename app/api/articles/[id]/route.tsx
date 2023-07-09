import { fetchArticle } from "@/app/services/articles";

type Params = {
  id: string;
};

export const GET = async (req: Request, { params }: { params: Params }) => {
  const article = await fetchArticle(params.id);

  if (article) {
    return new Response(JSON.stringify(article), { status: 200 });
  }
  return new Response("Failed to fetch article", { status: 500 });
};
