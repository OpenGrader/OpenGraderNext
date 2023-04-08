import Prism from "prismjs"; //used for syntax highlighting
import "prismjs/components/prism-python"; //supports syntax highlighting for python only
import "prismjs/themes/prism-okaidia.css"; //stylizes syntax highlighting
import React from "react";

interface CodeBrowserProps {
  language: string;
  code: string;
}

interface Comment {
  lineNumber: number;
  text: string;
}

interface CommentsProps {
  comments: Comment[];
}

const CodeBrowser: React.FC<CodeBrowserProps> = ({ language, code }) => {
  const lines = code.split("\n");
  const [selectedLine, setSelectedLine] = React.useState<number | null>(null);

  const handleLineClick = (lineNumber: number) => {
    setSelectedLine(lineNumber);
  };

  return (
  <div className="code-browser">
    <table>
      <tbody>
        {lines.map((line, index) => (
          <tr 
          key={index}
          className={selectedLine === index + 1 ? "selected" : ""}
          onClick={() => handleLineClick(index + 1)}
          >
            <td className="line-number">{index + 1}</td>
            <td>
              <pre
                className="line-code"
                dangerouslySetInnerHTML={{
                  __html: Prism.highlight(line, Prism.languages[language], language),
                }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>)
};
export default CodeBrowser;
