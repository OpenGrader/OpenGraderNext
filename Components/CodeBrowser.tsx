import Prism from "prismjs"; //used for syntax highlighting
import "prismjs/components/prism-python"; //supports syntax highlighting for python only
import "prismjs/themes/prism-okaidia.css"; //stylizes syntax highlighting

interface CodeBrowserProps {
  language: string;
  code: string;
}

const CodeBrowser: React.FC<CodeBrowserProps> = ({ language, code }) => {
  const lines = code.split("\n");
  return (
  <div className="code-browser">
    <table>
      <tbody>
        {lines.map((line, index) => (
          <tr key={index}>
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
// className="leading-6 text-md font-mono font-Fira_Code"
export default CodeBrowser;
