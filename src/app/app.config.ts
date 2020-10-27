import { environment } from '../environments/environment';

//*******************AUTH*************************/
export const LOCAL_STORAGE_TOKEN_KEY = 'token';
export const LOCAL_STORAGE_THEME_KEY = 'theme';
export const LOCAL_STORAGE_QUIZ_WEB_SOCKET_KEY = 'quizWebSocket';

export const SESSION_STORAGE_TOKEN_KEY = 'token';
export const SESSION_STORAGE_THEME_KEY = 'theme';

export const NOT_AUTHENTICATED_MESSAGE = 'Not Authenticated';


//*******************WEB-SOCKET*************************/
export const BROKER_URL = environment.SOCKET;
export const APP_NOTIFICATION = '/app/notification';
export const TOPIC_NOTIFICATION ='/topic/notification';
export const TOPIC_SEND_QUIZ = '/topic/send-quiz/course';
export const TOPIC_GRADE_TO_STUDENT = '/topic/grade-to-student/student';



//*******************REST*************************/
export const API_BACKEND_SERVER = environment.API;

export const URI_TOKEN_AUTH = '/token/generate-token';

export const URI_SOCKET = 'socket';

export const URI_WELCOME = '/welcome';
export const URI_HOME = '/home';
export const URI_LOGIN= '/login';

export const URI_USER = '/user';

export const URI_TOKEN = '/token';
export const URI_ID = '/id';
export const URI_USERNAME = '/username';
export const URI_PASS = '/pass';
export const URI_ROLE = '/role';

export const URI_ADMIN = '/admin';
export const URI_MANAGER = '/manager';
export const URI_TEACHER = '/teacher';
export const URI_STUDENT = '/student';

export const URI_COURSE = '/course';
export const URI_YEAR = '/year';
export const URI_NAME = '/name';

export const URI_SUBJECT = '/subject';

export const URI_GRADE = '/grade';
export const URI_TITLE = '/title';

export const URI_EVALUATION = '/evaluation';

export const URI_ATTENDANCE = '/attendance';

export const URI_QUIZ = '/quiz';
export const URI_QUIZ_STUDENT = '/quiz-student';

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

export const ROLE_MANAGERS_SPANISH = 'Administradores';
export const ROLE_TEACHERS_SPANISH = 'Docentes';
export const ROLE_STUDENTS_SPANISH = 'Estudiantes';


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

export const QUIZ_GET_ERROR = 'Error al Obtener Prueba(s)';
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

export const SET_PASS_ERROR = 'Error al Actualizar Contraseña';
export const SET_PASS_SUCCEED = 'Contraseña Actualizada';

export const IMAGE_CHANGE_EVENT = 'imageChangeEvent';
export const IMAGE_BASE64 = 'imageBase64';

export const SET_ROLE_ERROR = 'Error al Actualizar Roles';
export const SET_ROLE_SUCCEED = 'Roles Actualizados';

//*******************WELCOME-MESSAGES*************************/
export const WELCOME_ADMIN = 'Bienvenido Sr. ';
export const WELCOME_MALE = 'Bienvenido. ';
export const WELCOME_FEMALE = 'Bienvenida. ';
//*******************DATE-FORMAT*************************/
export const DD_MM_YYYY ='DD/MM/YYYY';

//*******************BTN-ACTIONS*************************/
export const BTN_ACTION_CREATE = 'Crear';
export const BTN_ACTION_UPDATE = 'Actualizar';
export const BTN_ACTION_DELETE = 'Borrar';

//*******************DIALOG-TYPES*************************/
export const IMAGE_ZOOM = 'imageZoom';
export const CARD_USER = 'cardUser'
export const CRUD_TYPE_DETAIL = 'detail';
export const CRUD_TYPE_EDIT = 'edit';
export const CRUD_TYPE_CREATE = 'create';
export const CRUD_TYPE_DELETE = 'delete';
export const RESET_PASS = 'resetPass'
export const SEARCH_USER = 'searchUser'
export const SET_ROLES = 'setRoles'
export const SIMPLE_DIALOG_CLASSIC = 'classic'
export const SIMPLE_DIALOG_CARD = 'card'

//*******************HOME-USER*************************/
export const TITLE_COURSES = 'Cursos';
export const TITLE_SUBJECTS = 'Asignaturas';
export const TITLE_MY_SUBJECTS = 'Mis Asignaturas';
export const TITLE_QUIZES = 'Mis Pruebas';
export const TITLE_PROFILE = 'Perfil';
export const TITLE_PREFERENCES = 'Preferencias';

//*******************QUIZ-ITEMS*************************/
export const CORRESPOND_ITEM_TYPE = 'correspondItem';
export const TRUE_FALSE_ITEM_TYPE = 'trueFalseItem';
export const MULTIPLE_SELECTION_ITEM_TYPE = 'multipleSelectionItem';
export const INCOMPLETE_TEXT_ITEM_TYPE = 'incompleteTextItem';

export const CORRESPOND_ITEM_TITLE = 'Correspondencia';
export const TRUE_FALSE_ITEM_TITLE = 'Verdaredo o Falso';
export const MULTIPLE_SELECTION_ITEM_TITLE = 'Selección Multiple';
export const INCOMPLETE_TEXT_ITEM_TITLE = 'Respuesta Corta';