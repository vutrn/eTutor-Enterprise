type RootStackParamList = {
  main: undefined;

  // Auth
  auth: undefined;
  login: undefined;
  signup: undefined;

  // Admin navigator
  admin_home: undefined;
  admin_dashboard: undefined;
  student_list: undefined;
  tutor_list: undefined;
  create_class: undefined;
  view_class: undefined;
  admin_profile: undefined;

  tutor_navigator: undefined;
  // Tutor navigator
  tutor_class_stack: undefined;
  tutor_dashboard: undefined;

  // TUTOR CLASS
  tutor_class: undefined;
  tutor_feature_stack: undefined;
  tutor_feature_drawer: undefined;
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

  // BLOG
  blog_list: undefined;
  blog_create: undefined;
  blog_update: undefined;
  blog_detail: undefined;

  tutor_document: undefined;

  tutor_meeting: undefined;
  meeting_create: undefined;
  offline_meeting_create: undefined;
  online_meeting_create: undefined;
  meeting_details: undefined;

  tutor_profile: undefined;

  // Student navigator
  student_dashboard: undefined;
  student_class: undefined;
  student_feature_stack: undefined;
  student_document: undefined;
  student_message: undefined;
  student_message_detail: undefined;
  student_meeting: undefined;
  student_class_detail: undefined;

  student_home_stack: undefined;
  student_profile: undefined;
};
