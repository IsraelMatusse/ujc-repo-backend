import express from "express";
import { HealthController } from "#interfaces/controller/health";
import { rateLimiter } from "#application/middleware/rateLimiter.js";
import { authenticateToken } from "#application/middleware/tokenValidation.js";
import { UserController } from "#interfaces/controller/user";
import { AuthController } from "#interfaces/controller/auth";
import { uploadSingle } from "#application/middleware/uploadFile";
import { FileController } from "#interfaces/controller/file";
import { YearController } from "#interfaces/controller/year";
import { SemesterController } from "#interfaces/controller/semester";
import { CourseController } from "#interfaces/controller/course";
import { SubjectController } from "#interfaces/controller/subject";

const routes = express.Router();

const healthController = new HealthController();
const userController = new UserController();
const authController = new AuthController();
const fileController = new FileController();
const yearController = new YearController();
const semesterController = new SemesterController();
const courseController = new CourseController();
const subjectController = new SubjectController();

routes.get("/", rateLimiter, healthController.checkApiHealth);
routes.post("/auth/login", rateLimiter, authController.login.bind(authController));

routes.post("/users", rateLimiter, userController.createUser.bind(userController));
routes.patch("/users/password", rateLimiter, authenticateToken, userController.updateUserPassword.bind(userController));
routes.patch("/users/email", rateLimiter, authenticateToken, userController.updateUserEmail.bind(userController));
routes.get("/users", rateLimiter, authenticateToken, userController.getAllUsers.bind(userController));
routes.get("/users/me", rateLimiter, authenticateToken, userController.getOnlineUser.bind(userController));

// Files
routes.post("/files/upload", rateLimiter, uploadSingle, fileController.uploadFile.bind(fileController));
routes.get("/uploads/:filename", rateLimiter, fileController.getUploadedFile.bind(fileController));

//year
routes.post("/years", rateLimiter, authenticateToken, yearController.createYear.bind(yearController));
routes.get("/years", rateLimiter, authenticateToken, yearController.getAllYears.bind(yearController));

// semester

routes.post("/semesters", rateLimiter, authenticateToken, semesterController.createSemester.bind(yearController));
routes.get("/semesters", rateLimiter, authenticateToken, semesterController.getAllSemesters.bind(yearController));
routes.get("/semesters/year/:yearId", rateLimiter, authenticateToken, semesterController.getSemestersByYear.bind(yearController));

//course
routes.post("/courses", rateLimiter, authenticateToken, courseController.createCourse.bind(courseController));
routes.get("/courses", rateLimiter, courseController.getAllCourses.bind(courseController));

//subjects
routes.post("/subjects", rateLimiter, authenticateToken, subjectController.createSubject.bind(subjectController));
routes.get("/subjects", rateLimiter, subjectController.getAllSubjects.bind(subjectController));
routes.get("/subjects/course/:courseId", rateLimiter, subjectController.getSubjectsByCourse.bind(subjectController));
routes.get("/subjects/semester/:semesterId", rateLimiter, subjectController.getSubjectsBySemester.bind(subjectController));
export default routes;
