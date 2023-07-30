import Passage from "./passage";

type Article = {
    id: string;
    date: Date;
    title: string;
    abstract: string;
    passages: Passage[];
    saved?: boolean;
};

export default Article;