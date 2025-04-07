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
  role: string;
  createdAt: string;
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
  createClass: (
    name: string,
    tutorId: string,
    studentIds: string[],
  ) => Promise<boolean>;
  updateClass: (
    classId: string,
    newName: string,
    newTutorId: string,
    studentIds: string[],
  ) => Promise<boolean>;
  deleteClass: (classId: string) => Promise<boolean>;
  removeStudentFromClass: (
    classId: string,
    studentId: string,
  ) => Promise<boolean>;
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

interface Dashboard {
  role?: "admin" | "tutor" | "student";
}

interface AdminDashboard extends Dashboard {
  studentsCount: number;
  totalUsers: number;
  tutorsCount: number;
}

interface TutorDashboard extends Dashboard {
  totalClasses: number;
  totalStudents: number;
  classes: Class[];
}

interface StudentDashboard extends Dashboard {
  classes: Class[];
}

export interface IDashboardState {
  adminDashboard: AdminDashboard;
  tutorDashboard: TutorDashboard;
  studentDashboard: StudentDashboard;
  classDocuments: {
    [classId: string]: {
      _id: string;
      filename: string;
      url: string;
      uploadedAt: string;
      uploadedBy: {
        _id: string;
        username: string;
        email: string;
      };
    }[];
  };
  classAttendance: {
    [classId: string]: Array<{
      _id: string;
      title: string;
      time: string;
      attendees: Array<{
        student: {
          _id: string;
          username: string;
          email: string;
        };
        attended: boolean;
      }>;
    }>;
  };

  getDashboard: () => Promise<void>;
  getClassDocuments: (classId: string) => Promise<any>;
  getAllClassDocuments: () => Promise<void>;
  getClassAttendance: (classId: string) => Promise<any>;
  getAllClassesAttendance: () => Promise<void>;
}

export interface IUserState {
  students: {
    _id: string;
    username: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  }[];
  tutors: {
    _id: string;
    username: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  }[];
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
  updateBlog: (
    blogId: string,
    title: string,
    content: string,
    image?: string,
  ) => Promise<boolean>;
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
export interface allOfflineMeetings extends OfflineMeeting {}
export interface allOnlineMeetings extends OnlineMeeting {}

export interface IMeetingState {
  offlineMeetings: OfflineMeeting[];
  onlineMeetings: OnlineMeeting[];
  allOfflineMeetings: allOfflineMeetings[];
  allOnlineMeetings: allOnlineMeetings[];
  loading: boolean;
  selectedMeeting: OfflineMeeting | OnlineMeeting | null;

  setSelectedMeeting: (
    selectedMeeting: OfflineMeeting | OnlineMeeting | null,
  ) => void;
  getAllOfflineMeetings: () => Promise<void>;
  getAllOnlineMeetings: () => Promise<void>;
  getOfflineMeetings: (selectedClassId: string) => Promise<void>;
  getOnlineMeetings: (selectedClassId: string) => Promise<void>;
  createOfflineMeeting: (
    title: string,
    description: string,
    location: string,
    time: Date | null,
  ) => Promise<void>;
  createOnlineMeeting: (
    title: string,
    linkggmeet: string,
    time: Date | null,
  ) => Promise<void>;
  markOfflineAttendance: (
    meetingId: string,
    studentIds: string[],
  ) => Promise<void>;
  markOnlineAttendance: (
    meetingId: string,
    studentIds: string[],
  ) => Promise<void>;
}
