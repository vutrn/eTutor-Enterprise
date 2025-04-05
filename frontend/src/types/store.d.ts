import { Socket } from "socket.io-client";

interface Form {
  username: string;
  email: string;
  role: string;
  password: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
}

interface Class {
  _id: string;
  name: string;
  students: User[];
  tutor: User;
  admin: User;
  createdAt: string;
}

export interface IAuthState {
  authUser: {
    _id: string;
    username: string;
    email: string;
    role: string;
    accessToken: string;
    refreshToken: string;
  } | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  isTokenExpired: boolean;
  socket: Socket | null;
  onlineUsers: string[];

  signup: (formData: Form) => Promise<boolean>;
  login: (formData: { username: string; password: string }) => Promise<boolean>;
  logout: () => void;
  verifyToken: () => Promise<boolean>;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

interface Class {
  _id: string;
  name: string;
  students: User[];
  tutor: User;
  admin: User;
  createdAt: string;
}

export interface IClassState {
  classes: Class[];
  selectedClass: Class;
  loading: boolean;

  setSelectedClass: (selectedClass: any) => void;
  getClasses: () => Promise<void>;
  createClass: (name: string, tutorId: string, studentIds: string[]) => Promise<boolean>;
  updateClass: (
    classId: string,
    newName: string,
    newTutorId: string,
    studentIds: string[]
  ) => Promise<boolean>;
  deleteClass: (classId: string) => Promise<boolean>;
  removeStudentFromClass: (classId: string, studentId: string) => Promise<boolean>;
}

interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  text: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IMessageState {
  messages: Message[];
  users: {
    _id: string;
    username: string;
    email: string;
    role: string;
    createdAt: string;
  }[];
  selectedUser: {
    _id: string;
    username: string;
    email: string;
    role: string;
  };

  setSelectedUser: (selectedUser: any) => void;
  getUsersToChat: (classId: string) => Promise<void>;
  getMessages: (receiverId: string) => Promise<void>;
  sendMessage: (messageData: { text: string; image?: string }) => Promise<void>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
}

export interface IDashboardState {
  dashboard: {
    role?: "admin" | "tutor" | "student";
    totalClasses?: number;
    totalStudents?: number;
    classes?: {
      _id: string;
      name: string;
      tutor: string;
      students: {
        _id: string;
        username: string;
      }[];
      admin: string;
      createdAt: string;
    }[];
  };

  getDashboard: () => Promise<void>;
}

export interface IUserState {
  students: any[];
  tutors: any[];
  users: {
    _id: string;
    username: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  }[];
  loading: boolean;
  getUsers: () => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
}

interface Blog {
  _id: string;
  title: string;
  image?: string;
  content: string;
  author: User;
  comments: {
    _id: string;
    text: string;
    user: string;
    createdAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface IBlogState {
  blogs: Blog[];
  selectedBlog: Blog;
  setSelectedBlog: (selectedBlog: any) => void;
  getAllBlogs: () => Promise<void>;
  getBlogById: (blogId: string) => Promise<void>;
  createBlog: (title: string, content: string, image?: string) => Promise<void>;
  updateBlog: (blogId: string, title: string, content: string, image?: string) => Promise<boolean>;
  deleteBlog: (blogId: string) => Promise<void>;
  commentBlog: (text: string) => Promise<boolean>;
}

interface Document {
  _id: string;
  filename: string;
  url: string;
  uploadedBy: User;
  uploadedAt: string;
}

export interface IDocumentState {
  documents: Document[];
  selectedDocument: Document;
  loading: boolean;

  setSelectedDocument: (selectedDocument: Document) => void;
  getDocuments: (classId: string) => Promise<void>;
  uploadDocument: (formData: FormData, classId: string) => Promise<any>;
  deleteDocument: (classId: string, documentId: string) => Promise<void>;
}

interface Meeting {
  _id: string;
  title: string;
  time: Date;
  class: {
    _id: string;
    name: string;
  };
  attendees: {
    student: User;
    attended: boolean;
  }[];
  createdAt: Date;
  createdBy: string;
}

export interface OfflineMeeting extends Meeting {
  description: string;
  location: string;
}
export interface OnlineMeeting extends Meeting {
  linkggmeet: string;
}

export interface IMeetingState {
  offlineMeetings: OfflineMeeting[];
  onlineMeetings: OnlineMeeting[];
  loading: boolean;
  selectedMeeting: OfflineMeeting | OnlineMeeting;
  
  setSelectedMeeting: (selectedMeeting: OfflineMeeting | OnlineMeeting | null) => void;
  getOfflineMeetings: () => Promise<void>;
  getOnlineMeetings: () => Promise<void>;
  createOfflineMeeting: (
    title: string,
    description: string,
    location: string,
    time: Date | null
  ) => Promise<void>;
  createOnlineMeeting: (title: string, linkggmeet: string, time: Date | null) => Promise<void>;
  markOfflineAttendance: (meetingId: string, studentIds: string[]) => Promise<void>;
  markOnlineAttendance: (meetingId: string, studentIds: string[]) => Promise<void>;
}

// router.post("/", middlewareController.verifyTokenAndAdminAndTutor, onlMeetingController.createOnlMeeting);

// router.get("/:classId", middlewareController.verifyTokenAndAdminAndTutor, onlMeetingController.getMeetingsByClass);

// router.put("/attendance/:meetingId", middlewareController.verifyTokenAndAdminAndTutor, onlMeetingController.markAttendance);

// router.post("/", middlewareController.verifyTokenAndAdminAndTutor, meetingController.createMeeting);

// router.get("/:classId", middlewareController.verifyTokenAndAdminAndTutor, meetingController.getMeetingsByClass);

// router.put("/attendance/:meetingId", middlewareController.verifyTokenAndAdminAndTutor, meetingController.markAttendance);
