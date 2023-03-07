import Prism from "prismjs"; //used for syntax highlighting
import "prismjs/components/prism-python"; //supports syntax highlighting for python only
import "prismjs/themes/prism-okaidia.css"; //stylizes syntax highlighting

interface CodeBrowserProps {
  language: string;
  code: string;
}

const CodeBrowser: React.FC<CodeBrowserProps> = ({ language, code }) => {
  if (typeof code !== "string"){
    return <div>Value is in wrong format</div>
  } else if (typeof code === 'undefined' || typeof code === null){
    return <div>Value is undefined or null</div>
  }
  const html = Prism.highlight(code, Prism.languages[language], language);
  return <pre className="leading-6" style={{ fontFamily: "Jetbrains Mono, monospace", fontSize: "14px"}} dangerouslySetInnerHTML={{ __html: html }} />;
};

export default CodeBrowser;
