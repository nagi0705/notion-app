import { FC } from "react";
import ReactMarkdown from "react-markdown";
type Props = {
    content: string;
    isPreviewMode: boolean;
};

export const NoteEditor: FC<Props> = ({ content, isPreviewMode }) => { 
    return isPreviewMode ? (
        <div className="markdown">
          <ReactMarkdown>{content}</ReactMarkdown>  
      </div> 
    ) : (
        <textarea
            className="w-full h-[500px] p-2 border border-gray-300 rounded"
            value={content}
        />
    )
};