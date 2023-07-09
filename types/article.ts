type Passage = {
    offset: number;
    infons: {
        section_type: string;
        type: string;
    };
    text: string;
}

type Article = {
    id: string;
    date: Date;
    title: string;
    abstract: string;
    passages: Passage[];
};

export default Article;