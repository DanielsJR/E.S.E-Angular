
//*******************AUTH*************************/
export const LOCAL_STORAGE_TOKEN_KEY = 'token';
export const LOCAL_STORAGE_THEME_KEY = 'theme';
export const LOCAL_STORAGE_QUIZ_WEB_SOCKET_KEY = 'quizWebSocket';

export const SESSION_STORAGE_TOKEN_KEY = 'token';
export const SESSION_STORAGE_THEME_KEY = 'theme';

export const NOT_AUTHENTICATED_MESSAGE = 'Not Authenticated';

//*******************WEB-SOCKET*************************/
export const BROKER_URL = 'ws://192.168.1.90:8080/api/v0/socket';


//*******************REST*************************/
export const API_SERVER = 'http://192.168.1.90:8080/api/v0';
export const API_GENERIC_URI = '/api/v0';

export const URI_TOKEN_AUTH = '/token/generate-token';

export const URI_SOCKET = 'socket';

export const URI_WELCOME = '/welcome';
export const URI_HOME = '/home';
export const URI_LOGIN= '/login';

export const URI_USERS = '/users';

export const URI_TOKEN = '/token';
export const URI_ID = '/id';
export const URI_USERNAME = '/username';
export const URI_PASS = '/pass';
export const URI_ROLE = '/role';

export const URI_ADMINS = '/admins';
export const URI_MANAGERS = '/managers';
export const URI_TEACHERS = '/teachers';
export const URI_STUDENTS = '/students';

export const URI_COURSES = '/courses';
export const URI_YEAR = '/year';
export const URI_NAME = '/name';

export const URI_SUBJECTS = '/subjects';
export const URI_TEACHER = '/teacher';
export const URI_COURSE = '/course';

export const URI_GRADES = '/grades';
export const URI_TITLE = '/title';
export const URI_STUDENT = '/student';

export const URI_EVALUATIONS = '/evaluations';

export const URI_ATTENDANCES = '/attendances';
export const URI_SUBJECT = '/subject';

export const URI_QUIZES = '/quizes';
export const URI_QUIZES_STUDENT = '/quizes-student';

export const URI_PREFERENCES = '/preferences';
export const URI_THEME = '/theme';


//*******************ROLES*************************/
export const ROLE_ADMIN = 'ADMIN';
export const ROLE_MANAGER = 'MANAGER';
export const ROLE_TEACHER = 'TEACHER';
export const ROLE_STUDENT = 'STUDENT';
export const ROLE_ADMIN_SPANISH = 'Super-Admin';
export const ROLE_MANAGER_SPANISH = 'Administrador';
export const ROLE_TEACHER_SPANISH = 'Docente';
export const ROLE_STUDENT_SPANISH = 'Estudiante';


//*******************SNACKBAR---DIALOG_REF*************************/
export const RESULT_SUCCEED = 'succeed';
export const RESULT_CANCELED = 'canceled';
export const RESULT_ERROR = 'error';
export const RESULT_EDIT = 'edit';
export const RESULT_DETAIL = 'detail';
export const RESULT_DELETE = 'delete';
export const RESULT_ACCEPT = 'accept';
export const RESULT_ACTION1 = 'action1';
export const RESULT_ACTION2 = 'action2';
export const RESULT_ACTION3 = 'action3';
export const RESULT_WARN = 'warn';

export const USER_CREATE_ERROR = 'Error al Crear Usuario';
export const USER_CREATE_SUCCEED = 'Usuario Creado';
export const USER_UPDATE_ERROR = 'Error al Actualizar Usuario';
export const USER_UPDATE_SUCCEED = 'Usuario Actualizado';
export const USER_DELETE_ERROR = 'Error al Eliminar Usuario';
export const USER_DELETE_SUCCEED = 'Usuario Eliminado';

export const COURSE_CREATE_ERROR = 'Error al Crear Curso';
export const COURSE_CREATE_SUCCEED = 'Curso Creado'
export const COURSE_UPDATE_ERROR = 'Error al Actualizar Curso';
export const COURSE_UPDATE_SUCCEED = 'Curso Actualizado';
export const COURSE_DELETE_ERROR = 'Error al Eliminar Curso';
export const COURSE_DELETE_SUCCEED = 'Curso Eliminado';

export const SUBJECT_CREATE_ERROR = 'Error al Crear Asignatura';
export const SUBJECT_CREATE_SUCCEED = 'Asignatura Creada';
export const SUBJECT_UPDATE_ERROR = 'Error al Actualizar Asignatura';
export const SUBJECT_UPDATE_SUCCEED = 'Asignatura Actualizada';
export const SUBJECT_DELETE_ERROR = 'Error al Eliminar Asignatura';
export const SUBJECT_DELETE_SUCCEED = 'Asignatura Eliminada';

export const EVALUATION_CREATE_ERROR = 'Error al Crear Evaluación';
export const EVALUATION_CREATE_SUCCEED = 'Evaluación Creada';
export const EVALUATION_UPDATE_ERROR = 'Error al Actualizar Evaluación';
export const EVALUATION_UPDATE_SUCCEED = 'Evaluación Actualizada';
export const EVALUATION_DELETE_ERROR = 'Error al Eliminar Evaluación';
export const EVALUATION_DELETE_SUCCEED = 'Evaluación Eliminada';

export const GRADE_CREATE_ERROR = 'Error al Crear Calificación';
export const GRADE_CREATE_SUCCEED = 'Calificación Creada';
export const GRADE_UPDATE_ERROR = 'Error al Actualizar Calificación';
export const GRADE_UPDATE_SUCCEED = 'Calificación Actualizada';
export const GRADE_DELETE_ERROR = 'Error al Eliminar Calificación';
export const GRADE_DELETE_SUCCEED = 'Calificación Eliminada';

export const QUIZ_CREATE_ERROR = 'Error al Crear Prueba';
export const QUIZ_CREATE_SUCCEED = 'Prueba Creada';
export const QUIZ_UPDATE_ERROR = 'Error al Actualizar Prueba';
export const QUIZ_UPDATE_SUCCEED = 'Prueba Actualizada';
export const QUIZ_DELETE_ERROR = 'Error al Eliminar Prueba';
export const QUIZ_DELETE_SUCCEED = 'Prueba Eliminada';

export const ATTENDANCE_CREATE_ERROR = 'Error al Crear Asistencia';
export const ATTENDANCE_CREATE_SUCCEED = 'Asistencia Creada';
export const ATTENDANCE_UPDATE_ERROR = 'Error al Actualizar Asistencia';
export const ATTENDANCE_UPDATE_SUCCEED = 'Asistencia Actualizada';
export const ATTENDANCE_DELETE_ERROR = 'Error al Eliminar Asistencia';
export const ATTENDANCE_DELETE_SUCCEED = 'Asistencia Eliminada';


export const CANCEL_MESSAGE = 'Operación Cancelada';

//*******************WELCOME-MESSAGES*************************/
export const WELCOME_ADMIN = 'Bienvenido Sr. ';


//*******************DATE-FORMAT*************************/
export const DD_MM_YYYY ='DD/MM/YYYY';


//*******************CRUD_TYPE*************************/
export const CRUD_TYPE_DETAIL = 'detail';
export const CRUD_TYPE_EDIT = 'edit';
export const CRUD_TYPE_CREATE = 'create';
export const CRUD_TYPE_DELETE = 'delete';

//*******************BTN-ACTIONS*************************/
export const BTN_ACTION_CREATE = 'Crear';
export const BTN_ACTION_UPDATE = 'Actualizar';
export const BTN_ACTION_DELETE = 'Borrar';
