import { useEffect, useState } from 'react';
import './App.css'
import { NoteList } from './NoteList';
import { supabase } from './supabase/client';
import { Note } from './Note';
import { NoteEditor } from './NoteEditor';

function App() { 
  const [notes, setNotes] = useState<Note[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [currentNoteId, setCurrentNoteId] = useState<number | null>(null);

  useEffect(() => {
    fetchNotes();

    const subscription = supabase
      .channel("note")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "note" },
        fetchNotes
      )
      .subscribe();
    
    return () => { 
      supabase.removeChannel(subscription);
    }
  }, []);

  const fetchNotes = async () => {
    const { data, error } = await supabase
      .from("note")
      .select('*')
      .order("id", { ascending: false });
    if (error) {
      console.error("Error fetching notes", error);
    } else {
      setNotes(data);
    }
  };

  const handleNewNote = async () => {
    const { error } = await supabase
      .from("note")
      .insert({ title: "新規ノート", content: "" });
    
    if (error) {
      console.error(error);
      return;
    }

    fetchNotes();
  };

  /**
   * NoteEditorから呼ばれる「本文更新」処理。
   * IME変換途中では呼ばれず、CompositionEndで確定したタイミングなどで更新される。
   */
  const handleContentChange = async (content: string) => {
    if (currentNoteId == null) return;

    const { error } = await supabase
      .from("note")
      .update({ content })
      .eq("id", currentNoteId);

    if (error) {
      console.error("Error updating note", error);
    }

    // 入力のたびのfetchNotes()呼び出しはしない
    // → IME変換中に文字がリセットされるのを防止
  };

  const handleChangeTitle = async (title: string) => {
    if (currentNoteId == null) return;

    const { error } = await supabase
      .from("note")
      .update({ title })
      .eq("id", currentNoteId);
    
    if (error) {
      console.error("Error updating note", error);
    }
  };

  return (
    <div className="flex h-screen">
      {/* ノート一覧サイドバー */}
      <div className="w-[300px] bg-gray-100 p-4">
        <div className='mb-4'>
          <button
            className="w-full p-2 bg-blue-500 text-white font-bold rounded"
            onClick={handleNewNote}
          >
            新規作成
          </button>
        </div>
        <NoteList
          notes={notes}
          selectNoteId={currentNoteId}
          onSelect={(note) => setCurrentNoteId(note.id)}
          handleChangeTitle={handleChangeTitle}
        />
      </div>
      
      {/* メインエリア */}
      <div className="flex-1 p-4">
        <div className="mb-4 flex justify-between">
          <h2 className="text-lg font-bold">Note Editor</h2>
          <button
            className="p-2 bg-green-500 text-white font-bold rounded"
            onClick={() => setPreviewMode(!previewMode)}
          >
            {previewMode ? "Edit" : "Preview"}
          </button>
        </div>

        <NoteEditor
          content={
            notes.find((note) => note.id === currentNoteId)?.content || ""
          }
          isPreviewMode={previewMode}
          onContentChange={handleContentChange}
        />
      </div>
    </div>
  );
}

export default App;