import { FC, useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

type Props = {
    content: string;
    isPreviewMode: boolean;
    onContentChange: (content: string) => void;
};

export const NoteEditor: FC<Props> = ({
    content,
    isPreviewMode,
    onContentChange,
}) => { 
    /**
     * 親から受け取った content をテキストエリア用に複製してローカルで管理。
     * 変換中やBackspaceの入力をローカルで受け止めるため。
     */
    const [draft, setDraft] = useState(content);

    // IME変換中かどうかをフラグで管理
    const [isComposing, setIsComposing] = useState(false);

    // 親のcontentが変化した時は、ローカルdraftを同期
    useEffect(() => {
        setDraft(content);
    }, [content]);

    // プレビュー表示時
    if (isPreviewMode) {
        return (
            <div className="markdown">
                <ReactMarkdown>{draft}</ReactMarkdown>
            </div>
        );
    }

    // 編集モード時
    return (
        <textarea
            className="w-full h-[500px] p-2 border border-gray-300 rounded"
            value={draft}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={(e) => {
                setIsComposing(false);
                const newValue = e.currentTarget.value;
                setDraft(newValue);
                // IME変換が確定したタイミングでサーバー更新
                onContentChange(newValue);
            }}
            onChange={(e) => {
                const newValue = e.target.value;
                setDraft(newValue);

                // 変換中でなければリアルタイムにサーバー更新
                if (!isComposing) {
                    onContentChange(newValue);
                }
            }}
        />
    );
};