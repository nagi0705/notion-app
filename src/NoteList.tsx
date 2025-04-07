import { FC, useState } from "react";
import { Note } from "./Note";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

type Props = {
  notes: Note[];
  selectNoteId: number | null;
  onSelect: (note: Note) => void;
  handleChangeTitle: (title: string) => void;
};

export const NoteList: FC<Props> = ({
  notes,
  selectNoteId,
  onSelect,
  handleChangeTitle,
}) => {
  const [editingTitle, setEditingTitle] = useState("");
  const [selectedEditeTitleNoteId, setSelectedEditeTitleNoteId] = useState<
    number | null
  >(null);
  return (
    <ul className="space-y-2">
      {notes.map((note) => (
        <li
          key={note.id}
          className={`cursor-pointer p-2 rounded flex justify-between ${
            selectNoteId === note.id ? "bg-blue-200" : "bg-white"
            }`}
          onClick={() => onSelect(note)}
        >
          {selectedEditeTitleNoteId === note.id ? (
            <input
              name="title"
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleChangeTitle(editingTitle);
                  setSelectedEditeTitleNoteId(null);
                  setEditingTitle("");
                }
              }}
            />
          ) : (
            <span>{note.title}</span>
          )}
          <button className="ml-2 text-blue-500" onClick={
            () => {
              setEditingTitle(note.title);
              setSelectedEditeTitleNoteId(note.id);
            }}
            >
            <FontAwesomeIcon icon={faPen} />
          </button>
        </li>
    ))}
  </ul>
  );
};
