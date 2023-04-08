import Prism from "prismjs";


export interface Comment {
    lineNumber: number;
    lineContent: string;
    text: string;
    author: string | null;
}

interface CommentsProps {
    comments: Comment[];
}

const Comments: React.FC<CommentsProps> = ({comments}) => {
    return (
        <div>
            <div className="text-xl px-4 sm:px-6">Comments</div>
            {comments.length === 0 && <div className="text-gray-300 px-4 sm:px-6">No comments yet.</div>}
            <div className="divide-y divide-gray-600">
                {comments.map((comment, index) => (
                    <div className="px-4 sm:px-6" key={index}>
                        <div className="font-semibold">{comment.author}</div>
                        <div className="flex gap-x-3">
                            <div className="text-[#aaa] font-mono">{comment.lineNumber}</div>
                                <pre
                                    className="line-code"
                                    dangerouslySetInnerHTML={{
                                    __html: Prism.highlight(comment.lineContent, Prism.languages["python"], "python"),
                                    }}
                                />
                        </div>
                        <div className="comment">{comment.text}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Comments;