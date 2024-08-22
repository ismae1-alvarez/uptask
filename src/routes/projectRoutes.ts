import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { body, param } from "express-validator";
import { handleInputErrores } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { projectExists } from "../middleware/project";
import { hasAutorization, taksExists, taskBelongToProject } from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamController } from "../controllers/TeamController";
import { NoteController } from "../controllers/NoteController";

const router:Router= Router();

router.use(authenticate);

router.post('/', 
    body('projectName')
        .notEmpty().withMessage('El Nombre del proyecto es obligatorio'),
    body('clientName')
        .notEmpty().withMessage('El Nombre del cliete es obligatorio'),
    body('description')
        .notEmpty().withMessage('El Nombre de la descripcion es obligatorio'),
    handleInputErrores, 
    ProjectController.createProject
);
router.get('/', ProjectController.getAllProjects);

router.get('/:id', 
    param('id')
        .isMongoId()
        .withMessage('ID no valido'), 
    handleInputErrores,
    ProjectController.getProjectById
);

/**Routes for Task */
router.param('projectId', projectExists);

router.put('/:projectId', 
    param('projectId')
        .isMongoId()
        .withMessage('ID no valido'),
    body('projectName')
        .notEmpty().withMessage('El Nombre del proyecto es obligatorio'),
    body('clientName')
        .notEmpty().withMessage('El Nombre del cliete es obligatorio'),
    body('description')
        .notEmpty().withMessage('El Nombre de la descripcion es obligatorio'), 
    handleInputErrores,
    hasAutorization,
    ProjectController.updateProject
);


router.delete('/:projectId', 
    param('projectId')
        .isMongoId()
        .withMessage('ID no valido'), 
    handleInputErrores,
    hasAutorization, 
    ProjectController.deleteProject
);


router.post('/:projectId/taks', 
    hasAutorization, 
    body('name')
    .notEmpty().withMessage('El Nombre del proyecto es obligatorio'),
    body('description')
    .notEmpty().withMessage('El description del cliete es obligatorio'),
    handleInputErrores,
    TaskController.createTask
);

router.get('/:projectId/taks', 
    TaskController.getAllTask
);

router.param('taskId', taksExists);
router.param('taskId', taskBelongToProject);

router.get('/:projectId/taks/:taskId', 
    param('taskId')
    .isMongoId()
    .withMessage('ID no valido'),
    TaskController.getTaskById
);

router.put('/:projectId/taks/:taskId', 
    hasAutorization, 
    param('taskId')
    .isMongoId()
    .withMessage('ID no valido'),
    body('name')
    .notEmpty().withMessage('El Nombre del proyecto es obligatorio'),
    body('description')
    .notEmpty().withMessage('El description del cliete es obligatorio'),
    TaskController.updateTask
);

router.delete('/:projectId/taks/:taskId', 
    hasAutorization,
    param('taskId')
    .isMongoId()
    .withMessage('ID no valido'),
    TaskController.deleteTask
);

router.post('/:projectId/taks/:taskId/status', 
    param('taskId')
    .isMongoId()
    .withMessage('ID no valido'),
    body('status')
    .notEmpty()
    .withMessage("El estado es obligatorio"),
    handleInputErrores,
    TaskController.updateStatus
);

/** Routes for teams */

router.post('/:projectId/team/find', 
    body('email')
        .isEmail().toLowerCase().withMessage('E-mail no valido'),
    handleInputErrores,
    TeamController.findMemberByEmail
);

router.get('/:projectId/team', 
    TeamController.getProjectTeam
);

router.post('/:projectId/team', 
    body('id')
        .isMongoId().withMessage('ID no valido'),
    handleInputErrores,
    TeamController.addMemberById
);

router.delete('/:projectId/team/:userId', 
    param('userId')
        .isMongoId().withMessage('ID no valido'),
    handleInputErrores,
    TeamController.removeMemberById
);


/** Routeso for Notes */
router.post('/:projectId/tasks/:taskId/notes', 
    body('content')
        .notEmpty().withMessage('El Contenido de la nota es obligatorio'),
    handleInputErrores,
    NoteController.createNote
);

router.get('/:projectId/tasks/:taskId/notes', 
    NoteController.getAllNotes
);

router.delete('/:projectId/tasks/:taskId/notes/:noteId',
    param('noteId')
        .isMongoId().withMessage("Id no valido"),
    handleInputErrores, 
    NoteController.deleteNote
);

export default router;