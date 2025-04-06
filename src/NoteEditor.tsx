import { FC } from "react";

type Props = {
    content: string;
};

export const NoteEditor: FC<Props> = ({ content }) => { 
    return (
        <textarea
            className="w-full h-[500px] p-2 border border-gray-300 rounded"
            value={content}
        />
    );
};