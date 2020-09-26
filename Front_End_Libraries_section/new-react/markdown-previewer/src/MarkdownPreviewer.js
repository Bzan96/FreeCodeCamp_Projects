import React, { useState } from "react";
import marked from "marked";

const initialMarkdown = `
  # h1
  ## h2
  ### h3
  #### h4
  ##### h5
  ###### h6

  [This is a link](learn.freecodecamp.com)

  * List Item

  > blockquote

  \` this is inline-code \`
  \`\`\`
    <h1>this is a code block</h1>
  \`\`\`

  ![img](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Logo Title Text 2")

  __bold text__

  _italic text_

  ~strikethrough~

  hello  
  this  
  should  
  be  
  a  
  carriage  
  return
`;

const MarkdownPreviewer = () => {
  const [content, setContent] = useState(initialMarkdown);

  const handleChange = (event) => {
    setContent(event.target.value);
  };

  return (
    <div id="container">
      <textarea id="editor" onChange={handleChange} value={content}></textarea>
      <div
        id="preview"
        dangerouslySetInnerHTML={{
          __html: marked(content),
        }}
      />
    </div>
  );
};

export default MarkdownPreviewer;
