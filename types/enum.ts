//Auth Screens Names
export enum NAVIGATION_AUTH_NAMES {
  SIGN_IN = 'SignIn', // * Native Stack Navigation
  SIGN_UP = 'SignUp', // * Native Stack Navigation
  AVATAR_PICKER = 'AvatarPicker', // * Native Stack Navigation
}

//Notes/Drafts Screens Names
export enum NAVIGATION_NOTES_NAMES {
  NOTES = 'Notes', // * Bottom Navigation
  DRAFTS = 'Drafts', // * Bottom Navigation
}

//General Screens Names
export enum NAVIGATION_NAMES {
  AUTH = 'Auth', // * Native Stack Navigation
  NOTES_OVERVIEW = 'NotesOverview', // * Native Stack Navigation
  NOTES_MANAGING = 'NotesManaging', // * Native Stack Navigation
}

//Button modes - for styling
export enum BUTTON_TYPES {
  CONTAINED = 'contained',
  OUTLINED = 'outlined',
}

// Fetch pack of notes/drafts phases

export enum FETCH_PACK_TYPES {
  INITIAL = 'INITIAL',
  LOAD_MORE = 'LOAD_MORE',
}

// Socket

export enum SOCKET_ERROR_CODES {
  BAD_REQUEST = 400,
  UNAUTHORIZED,
}

export enum SOCKET_NOTE_STATUSES {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
}
