import Article from "@/types/article";
import Passage from "@/types/passage";

export async function fetchArticle(articleId: string): Promise<Article | null> {
  try {
    const response = await fetch(
      `https://www.ncbi.nlm.nih.gov/research/bionlp/RESTful/pmcoa.cgi/BioC_json/${articleId}/unicode`
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const passages: Passage[] = data.documents[0].passages;

    const abstract =
      passages.find((passage) => passage.infons.type === "abstract")?.text ??
      "";

    const date = new Date(
      `${data.date.slice(0, 4)}-${data.date.slice(4, 6)}-${data.date.slice(
        6,
        8
      )}`
    );

    return {
      id: articleId,
      date,
      title: passages[0].text,
      abstract,
      passages,
    };
  } catch (error) {
    return null;
  }
}
