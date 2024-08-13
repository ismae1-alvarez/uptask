import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { body, param } from "express-validator";
import { handleInputErrores } from "../middleware/validation";

const router:Router= Router();


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
)

export default router;