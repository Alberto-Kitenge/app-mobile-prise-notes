import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import {
  CreateNote,
  Note,
  ServiceResponse,
  UpdateNote,
} from "../types/notesTypes";

const NOTES_COLLECTION = "notes";

export async function getNotes(): Promise<ServiceResponse<Note[]>> {
  try {
    const q = collection(db, NOTES_COLLECTION);
    const querySnapshot = await getDocs(q);

    const notes: Note[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      const note: Note = {
        id: doc.id,
        title: data.title,
        description: data.description,
        category: data.category,
        color: data.color,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      };

      notes.push(note);
    });

    notes.sort((a, b) => {
      const dateA = (a.createdAt as Date) || new Date(0);
      const dateB = (b.createdAt as Date) || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });

    return {
      success: true,
      data: notes,
    };
  } catch (error) {
    return {
      success: false,
      error: "Erreur lors de la récupération des notes",
    };
  }
}

export async function createNote(
  noteData: CreateNote,
): Promise<ServiceResponse<Note>> {
  try {
    const noteToCreate = {
      ...noteData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, NOTES_COLLECTION), noteToCreate);

    const note: Note = {
      id: docRef.id,
      ...noteToCreate,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return {
      success: true,
      data: note,
    };
  } catch (error) {
    return {
      success: false,
      error: "Erreur lors de la création de la note",
    };
  }
}

export async function updateNote(
  id: string,
  noteData: Partial<UpdateNote>,
): Promise<ServiceResponse<Note>> {
  try {
    const updateData = {
      ...noteData,
      updatedAt: serverTimestamp(),
    };

    delete (updateData as any).id;

    const docRef = doc(db, NOTES_COLLECTION, id);
    await updateDoc(docRef, updateData);

    const updatedNote = await getDoc(docRef);

    if (!updatedNote.exists()) {
      return {
        success: false,
        error: "Note non trouvée",
      };
    }

    const data = updatedNote.data();

    const updatedNoteDoc: Note = {
      id: updatedNote.id,
      title: data.title,
      description: data.description,
      category: data.category,
      color: data.color,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    };

    return {
      success: true,
      data: updatedNoteDoc,
    };
  } catch (error) {
    return {
      success: false,
      error: "Erreur lors de la mise à jour de la note",
    };
  }
}

export async function deleteNote(id: string): Promise<ServiceResponse<void>> {
  try {
    const docRef = doc(db, NOTES_COLLECTION, id);
    await deleteDoc(docRef);

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: "Erreur lors de la suppression de la note",
    };
  }
}
