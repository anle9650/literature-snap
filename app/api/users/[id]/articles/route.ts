import User from "@/models/user";
import { fetchArticles } from "@/utils/articles";
import { connectToDB } from "@/utils/database";

type Params = {
    id: string;
};

export const GET = async (req: Request, { params }: { params: Params }) => {
    try {
        await connectToDB();

        const user = await User.findById(params.id);

        if (!user) {
            return new Response("User not found", { status: 404 });
        }

        const articles = await fetchArticles(user.articleIds, params.id);
        return new Response(JSON.stringify(articles), { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response("Failed to fetch articles", { status: 500 });
    }
};

export const POST = async (req: Request, { params }: { params: Params }) => {
    const { searchParams } = new URL(req.url);
    const articleId = searchParams.get("id");

    try {
        await connectToDB();

        const user = await User.findById(params.id);

        if (!user) {
            return new Response("User not found", { status: 404 });
        }

        if (!user.articleIds.includes(articleId)) {
            user.articleIds.push(articleId)
            user.save();
        }

        return new Response(JSON.stringify(user), { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response("Failed to save article", { status: 500 });
    }
};

export const DELETE = async (req: Request, { params }: { params: Params }) => {
    const { searchParams } = new URL(req.url);
    const articleId = searchParams.get("id");

    try {
        await connectToDB();

        const user = await User.findById(params.id);

        if (!user) {
            return new Response("User not found", { status: 404 });
        }

        user.articleIds = user.articleIds.filter((id: string) => id !== articleId)
        user.save();

        return new Response(JSON.stringify(user), { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response("Failed to unsave article", { status: 500 });
    }
};