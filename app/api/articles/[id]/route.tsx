import Article from "@/types/article";

type Params = {
  id: string;
};

export const GET = async (req: Request, { params }: { params: Params }) => {
  try {
    const response = await fetch(
      `https://www.ncbi.nlm.nih.gov/research/bionlp/RESTful/pmcoa.cgi/BioC_json/${params.id}/unicode`
    );

    if (!response.ok) {
      return new Response("Failed to fetch article", { status: 500 });
    }

    const data = await response.json();
    const date = new Date(
      `${data.date.slice(0, 4)}-${data.date.slice(4, 6)}-${data.date.slice(
        6,
        8
      )}`
    );
    const passages = data.documents[0].passages;

    const article: Article = {
      id: params.id,
      date,
      title: passages[0].text,
      abstract: passages[1].text,
      passages: passages.slice(2),
    };

    return new Response(JSON.stringify(article), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch article", { status: 500 });
  }
};
