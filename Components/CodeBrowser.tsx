import Prism from "prismjs"; //used for syntax highlighting
import "prismjs/components/prism-python"; //supports syntax highlighting for python only
import "prismjs/themes/prism-okaidia.css"; //stylizes syntax highlighting
import React from "react";
import Button from "./Button";

interface CodeBrowserProps {
  language: string;
  code: string;
  onCommentSubmit: (submissionNanoID: string, lineNumber: number, lineContent: string, text: string) => void; //fix this later
}

const CodeBrowser: React.FC<CodeBrowserProps> = ({ language, code, onCommentSubmit }) => {
  const lines = code.split("\n");
  const [selectedLine, setSelectedLine] = React.useState<number | null>(null);
  const [comments, setComments] = React.useState<{[key: number]: string}>({});

  const handleLineClick = (lineNumber: number) => {
    setSelectedLine(lineNumber);
  };

  const handleCommentSubmit = (event: React.FormEvent<HTMLFormElement>, lineContent:string, lineNumber: number) => {
    event.preventDefault();
    const submissionNanoID = "ZmXBpMYoWYTkYrzLC15Ac"; //hardcoded for now, don't know how to request this given the way our current backend is set up.
    
    const formData = new FormData(event.currentTarget);
    const commentText = formData.get("comment") as string;
    setComments({...comments, [lineNumber]: commentText});
    onCommentSubmit(submissionNanoID, lineNumber, lineContent, commentText);
  };
  return (
  <div className="py-5">
    <table>
      <tbody>
        {lines.map((line, index) => (
          <tr 
          key={index}
          className={selectedLine === index + 1 ? "selected" : ""}
          onClick={() => handleLineClick(index + 1)}
          >
            <td className="select-none text-[#aaa] font-mono">{index + 1}</td>
            <td className="line-content">
                <pre
                  className="line-code"
                  dangerouslySetInnerHTML={{
                    __html: Prism.highlight(line, Prism.languages[language], language),
                  }}
                />
                {selectedLine === index + 1 && (
                  <div className={`comment-box ${selectedLine === index ? "open" : ""}`}>
                    <form onSubmit={(event) =>handleCommentSubmit(event, line, index + 1)} autoComplete="off">
                      <textarea name="comment" placeholder="Add a comment" autoComplete="off"/>
                      <Button type="submit" size="md" className="whitespace-nowrap w-min ml-auto" >
                        Submit
                      </Button>
                    </form>
                  </div>
                )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>)
};
export default CodeBrowser;
