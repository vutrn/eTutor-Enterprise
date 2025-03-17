type RootStackParamList = {
  // Auth
  auth: undefined;
  login: undefined;
  signup: undefined;

  // Admin navigator
  admin_dashboard: undefined;
  student_list: undefined;
  tutor_list: undefined;
  create_class: undefined;
  view_class: undefined;
  admin_profile: undefined;

  // Tutor navigator
  tutor_class_stack: undefined;
  tutor_dashboard: undefined;

  // TUTOR CLASS
  tutor_class: undefined;
  tutor_feature_stack:
    | {
        params: {
          name: string;
          tutor: string;
          students: any[];
          createdAt: string;
          _id: string;
        };
      }
    | undefined;
  tutor_class_detail: {
    name: string;
    tutor: string;
    students: any[];
    createdAt: string;
    _id: string;
  };
  tutor_message: {
    params: {
      _id: string;
    };
  };
  tutor_message_detail: undefined;

  // TUTOR BLOG 
  tutor_blog: undefined;
  tutor_blog_create: undefined;
  tutor_blog_update: undefined;
  tutor_blog_detail: undefined;


  tutor_document: undefined;
  tutor_meeting: undefined;
  tutor_profile: undefined;

  // Student navigator
  student_dashboard: undefined;
  student_document: undefined;
  student_blog: undefined;
  student_profile: undefined;
};
