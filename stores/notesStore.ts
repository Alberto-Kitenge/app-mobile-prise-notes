import { create } from "zustand";
import {
  createNote,
  deleteNote,
  getNotes,
  updateNote,
} from "@/services/notesServices";
import { NotesActions, NotesState } from "@/types/notesTypes";

export const useNotesStore = create<NotesActions & NotesState>((set, get) => ({
  notes: [],
  loading: false,
  error: null,
  getNotes: async () => {
    set({
      loading: true,
      error: null,
    });

    try {
      const response = await getNotes();

      if (response.success && response.data) {
        set({
          notes: response.data,
          loading: false,
        });
      } else {
        set({
          error: response.error || "Erreur lors de la récupération des notes",
          loading: false,
        });
      }
    } catch (error) {
      set({
        error: "Erreur lors de la récupération des notes",
        loading: false,
      });
    }
  },

  addNote: async (noteData) => {
    set({
      loading: true,
      error: null,
    });

    try {
      const response = await createNote(noteData);

      if (response.success && response.data) {
        set((state) => ({
          notes: [response.data!, ...state.notes],
          loading: false,
        }));
      } else {
        set({
          error: response.error || "Erreur lors de la création de la note",
          loading: false,
        });
      }
    } catch (error) {
      set({
        error: "Erreur lors de la création de la note",
        loading: false,
      });
    }
  },

  updateNote: async (noteId, noteData) => {
    set({
      loading: true,
      error: null,
    });

    try {
      const response = await updateNote(noteId, noteData);

      if (response.success && response.data) {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === noteId ? response.data! : note,
          ),
          loading: false,
        }));
      } else {
        set({
          error: response.error || "Erreur lors de la mise à jour de la note",
          loading: false,
        });
      }
    } catch (error) {
      set({
        error: "Erreur lors de la mise à jour de la note",
        loading: false,
      });
    }
  },

  deleteNote: async (noteId) => {
    set({
      loading: true,
      error: null,
    });

    try {
      const response = await deleteNote(noteId);

      if (response.success) {
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== noteId),
          loading: false,
        }));
      } else {
        set({
          error: response.error || "Erreur lors de la suppression de la note",
          loading: false,
        });
      }
    } catch (error) {
      set({
        error: "Erreur lors de la suppression de la note",
        loading: false,
      });
    }
  },
}));

export const useNotes = () => useNotesStore((state) => state.notes);
