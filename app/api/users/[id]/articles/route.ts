import User from "@/models/user";
import { connectToDB } from "@/utils/database";

type Params = {
    id: string;
};

export const POST = async (req: Request, { params }: { params: Params }) => {
    const { articleId } = await req.json();

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