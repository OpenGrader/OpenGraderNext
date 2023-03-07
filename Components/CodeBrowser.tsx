import Prism from "prismjs"; //used for syntax highlighting
import "prismjs/components/prism-python"; //supports syntax highlighting for python only
import "prismjs/themes/prism-okaidia.css"; //stylizes syntax highlighting

interface CodeBrowserProps {
  language: string;
  code: string;
}

const CodeBrowser: React.FC<CodeBrowserProps> = ({ language, code }) => {
  const html = Prism.highlight(code, Prism.languages[language], language);
  return <pre dangerouslySetInnerHTML={{ __html: html }} />;
};
// className="leading-6 text-md font-mono font-Fira_Code"
export default CodeBrowser;
