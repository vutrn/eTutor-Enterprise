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
  tutor_dashboard: undefined;
  tutor_class: undefined;
  class_feature_tab:
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

  tutor_blog: undefined;
  tutor_message: {
    params: {
      _id: string;
    };
  };
  tutor_document: undefined;
  tutor_meeting: undefined;
  tutor_profile: undefined;

  // Student navigator
  student_dashboard: undefined;
  student_document: undefined;
  student_blog: undefined;
  student_profile: undefined;
};
