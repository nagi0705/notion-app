import { FC } from "react";
import { Note } from "./Note";

type Props = {
    notes: Note[];
};

export const NoteList: FC<Props> = ({ notes }) => {
  return (
    <ul className="space-y-2">
      {notes.map((note) => (
        <li
          key={note.id}
          className={`cursor-pointer p-2 rounded flex justify-between`}
        >
        <span>{note.title}</span>
      </li>  
    ))}
  </ul>
  );
};
