import { Note } from "../models/note";
import { User } from "../models/user";

export type RootStackParamList = {
    Login: undefined;
    NoteList: undefined;
    NoteAdd : {user : User,note? : Note,
      onNoteAdded?: (note: Note) => void;
      onUpdateNote?: (note: Note) => void;
  };
};
  