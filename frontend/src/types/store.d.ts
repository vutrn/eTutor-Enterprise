interface Form {
  username: string;
  email: string;
  role: string;
  password: string;
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

  signup: (formData: Form) => Promise<boolean>;
  login: (formData: { username: string; password: string }) => Promise<boolean>;
  logout: () => void;
  verifyToken: () => Promise<boolean>;
}

export interface IClassState {
  classes: {
    _id: string;
    name: string;
    students: any[];
    tutor: string;
    admin: string;
    createdAt: string;
  }[];
  loading: boolean;
  selectedClass: {
    _id: string;
    name: string;
    students: any[];
    tutor: string;
    admin: string;
    createdAt: string;
  };

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

export interface MessageState {
  messages: {
    _id: string;
    senderId: string;
    receiverId: string;
    text: string;
    image: string;
    createdAt: string;
    updatedAt: string;
  }[];
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

export interface IBlogState {
  blogs: {
    _id: string;
    title: string;
    image?: string;
    content: string;
    author: {
      _id: string;
      username: string;
      email: string;
    };
    comments: {
      _id: string;
      text: string;
      user: string;
      createdAt: string;
    }[];
    createdAt: string;
    updatedAt: string;
  }[];
  selectedBlog: {
    _id: string;
    title: string;
    image?: string;
    content: string;
    author: {
      _id: string;
      username: string;
      email: string;
    };
    comments: {
      _id: string;
      text: string;
      user: string;
      createdAt: string;
    }[];
    createdAt: string;
    updatedAt: string;
  };
  setSelectedBlog: (selectedBlog: any) => void;
  getAllBlogs: () => Promise<void>;
  getBlogById: (blogId: string) => Promise<void>;
  createBlog: (title: string, content: string, image?: string) => Promise<void>;
  updateBlog: (blogId: string, title: string, content: string, image?: string) => Promise<boolean>;
  deleteBlog: (blogId: string) => Promise<void>;
  commentBlog: (text: string) => Promise<boolean>;
}

export interface IDocumentState {
  documents: {
    _id: string;
    filename: string;
    url: string;
    uploadedBy: {
      _id: string;
      username: string;
      email: string;
    };
    uploadedAt: string;
  }[];
  selectedDocument: {
    _id: string;
    filename: string;
    url: string;
    uploadedBy: {
      _id: string;
      username: string;
      email: string;
    };
    uploadedAt: string;
  };
  loading: boolean;
  setSelectedDocument: (selectedDocument: any) => void;
  getDocuments: (classId: string) => Promise<void>;
  uploadDocument: (formData: FormData, classId: string) => Promise<any>;
  deleteDocument: (classId: string, documentId: string) => Promise<void>;
}

export interface IMeetingState {
  meetings: {
    _id: string;
    title: string;
    description: string;
    location: string;
    time: Date;
    class: {
      _id: string;
      name: string;
    };
    attendees: {
      student: {
        _id: string;
        username: string;
        email: string;
      };
      attended: boolean;
    }[];
    createdAt: Date;
  }[];

  loading: boolean;
  getMeetingsByClass: (classId: string) => Promise<void>;
  createMeeting: (meetingData: Partial<Meeting>) => Promise<void>;
  markAttendance: (meetingId: string, studentIds: string[]) => Promise<void>;
}
