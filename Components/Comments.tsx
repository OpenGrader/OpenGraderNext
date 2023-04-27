import Prism from "prismjs";


export interface Comment {
    submission_nano_ID: string;
    line_number: number;
    comment_text: string;   //what a user submits as a comment
    name: string | null;    //the name of the user who submitted the comment
    line_content: string;   //the actual line of code
}

interface CommentsProps {
    comments: Comment[];
}

const Comments: React.FC<CommentsProps> = ({comments}) => {
    return (
        <div>
            <div className="text-xl px-4 sm:px-6">Comments</div>
            {comments === null && <div className="text-gray-300 px-4 sm:px-6">Loading comments...</div>}
            {comments.length === 0 && <div className="text-gray-300 px-4 sm:px-6">No comments yet.</div>}
            {comments && comments.length > 0 && ( 
                <div className="divide-y divide-gray-600">
                    {comments.map((comment, index) => (
                        <div className="px-4 sm:px-6" key={index}>
                            <div className="font-semibold">{comment.name}</div>
                            <div className="flex gap-x-3">
                                <div className="text-[#aaa] font-mono">{comment.line_number}</div>
                                <pre
                                    className="line-code"
                                    dangerouslySetInnerHTML={{
                                    __html: Prism.highlight(comment.line_content, Prism.languages["python"], "python"),
                                    }}
                                />
                            </div>
                            <div className="comment">{comment.comment_text}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Comments;