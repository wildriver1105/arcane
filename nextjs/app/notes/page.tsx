'use client';

import { useState, useEffect } from 'react';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 로컬 스토리지에서 노트 불러오기
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes);
      setNotes(parsedNotes);
    }
  }, []);

  // 자동 저장
  useEffect(() => {
    if (selectedNote && (title || content)) {
      const timer = setTimeout(() => {
        saveNote();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [title, content, selectedNote]);

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: '제목 없음',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes((prev) => [newNote, ...prev]);
    setSelectedNote(newNote);
    setTitle('제목 없음');
    setContent('');
    setIsEditing(true);
    saveNotesToStorage([newNote, ...notes]);
  };

  const selectNote = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
    setIsEditing(true);
  };

  const saveNote = () => {
    if (!selectedNote) return;

    const updatedNote: Note = {
      ...selectedNote,
      title: title || '제목 없음',
      content,
      updatedAt: new Date().toISOString(),
    };

    const updatedNotes = notes.map((note) =>
      note.id === selectedNote.id ? updatedNote : note
    );

    setNotes(updatedNotes);
    setSelectedNote(updatedNote);
    saveNotesToStorage(updatedNotes);
  };

  const deleteNote = (noteId: string) => {
    if (confirm('이 노트를 삭제하시겠습니까?')) {
      const updatedNotes = notes.filter((note) => note.id !== noteId);
      setNotes(updatedNotes);
      saveNotesToStorage(updatedNotes);

      if (selectedNote?.id === noteId) {
        setSelectedNote(null);
        setTitle('');
        setContent('');
        setIsEditing(false);
      }
    }
  };

  const saveNotesToStorage = (notesToSave: Note[]) => {
    localStorage.setItem('notes', JSON.stringify(notesToSave));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen">
      {/* 사이드바 - 노트 목록 */}
      <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">노트</h1>
            <button
              onClick={createNewNote}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              + 새 노트
            </button>
          </div>
          <input
            type="text"
            placeholder="노트 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredNotes.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchQuery ? '검색 결과가 없습니다' : '노트가 없습니다'}
            </div>
          ) : (
            <div className="p-2">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => selectNote(note)}
                  className={`p-4 mb-2 rounded-lg cursor-pointer transition-colors ${
                    selectedNote?.id === note.id
                      ? 'bg-blue-100 border-2 border-blue-500'
                      : 'bg-white border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 truncate flex-1">
                      {note.title}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNote(note.id);
                      }}
                      className="text-gray-400 hover:text-red-600 ml-2"
                    >
                      🗑️
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {note.content || '내용 없음'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatDate(note.updatedAt)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 메인 에디터 영역 */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedNote ? (
          <>
            <div className="border-b border-gray-200 p-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                className="w-full text-2xl font-bold text-gray-900 border-none outline-none bg-transparent"
              />
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <span>생성: {formatDate(selectedNote.createdAt)}</span>
                <span>수정: {formatDate(selectedNote.updatedAt)}</span>
                {title !== selectedNote.title || content !== selectedNote.content ? (
                  <span className="text-blue-600">저장 중...</span>
                ) : (
                  <span className="text-green-600">저장됨</span>
                )}
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="여기에 내용을 작성하세요..."
                className="w-full h-full resize-none border-none outline-none text-gray-900 leading-relaxed"
                style={{ fontFamily: 'inherit', fontSize: '16px' }}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                노트를 선택하거나 새로 만드세요
              </h2>
              <p className="text-gray-600 mb-6">
                왼쪽에서 노트를 선택하거나 "새 노트" 버튼을 클릭하여 시작하세요
              </p>
              <button
                onClick={createNewNote}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                + 새 노트 만들기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

