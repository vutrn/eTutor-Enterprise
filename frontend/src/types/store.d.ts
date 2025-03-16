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
  classes: any[];
  loading: boolean;
  selectedClass: {
    _id: string;
    name: string;
    students: any[];
    tutor: string;
    adminId: string;
    createdAt: string;
  };

  setSelectedClass: (selectedClass: any) => void;
  getClasses: () => Promise<void>;
  createClass: (
    name: string,
    tutorId: string,
    studentIds: string[]
  ) => Promise<boolean>;
  updateClass: (
    classId: string,
    newName: string,
    newTutorId: string,
    studentIds: string[]
  ) => Promise<boolean>;
  deleteClass: (classId: string) => Promise<boolean>;
  removeStudentFromClass: (
    classId: string,
    studentId: string
  ) => Promise<boolean>;
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
  users: any[];
  loading: boolean;
  getUsers: () => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
}

export interface IBlogState {
  blogs: {
    _id: string;
    title: string;
    content: string;
    author: {
      _id: string;
      username: string;
      email: string;
    };
    comments: {
      _id: string;
      text: string;
      userId: string;
      createdAt: string; 
    }[];
    createdAt: string;
    updatedAt: string;
  }[];

  getAllBlogs: () => Promise<void>;
  getBlogById: (blogId: string) => Promise<void>;
  createBlog: (title: string, content: string) => Promise<boolean>;
  updateBlog: (blogId: string, title: string, content: string) => Promise<boolean>;
  deleteBlog: (blogId: string) => Promise<boolean>;
}
// router.post("/createblog", middlewareController.verifyToken, blogController.createBlog);

// router.get("/", blogController.getAllBlogs);

// router.get("/:blogId/getbyId", blogController.getBlogById);

// router.put("/:blogId/updateblog", middlewareController.verifyToken, blogController.updateBlog);

// router.delete("/:blogId", middlewareController.verifyToken, blogController.deleteBlog);

// router.post("/:blogId/comment", middlewareController.verifyToken, blogController.commentBlog);
