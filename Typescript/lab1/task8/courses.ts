interface Course {
    title: string;
    duration: number;
    students: string[];
}

class OnlineCourse implements Course {
    title: string;
    duration: number;
    students: string[];

    constructor(title: string, duration: number) {
        this.title = title;
        this.duration = duration;
        this.students = [];
    }

    registerStudent(studentName: string): void {
        if (!this.students.includes(studentName)) {
            this.students.push(studentName);
            console.log(`${studentName} has been registered for the course: ${this.title}`);
        } else {
            console.log(`${studentName} is already registered for the course: ${this.title}`);
        }
    }

    ifStudentRegistered(studentName: string): boolean {
        return this.students.includes(studentName);
    }
}

class CourseManager {
    private courses: Course[] = [];

    addCourse(course: Course): void {
        this.courses.push(course);
        console.log(`Course added: ${course.title}`);
    }

    removeCourse(courseTitle: string): void {
        const initialLength = this.courses.length;
        this.courses = this.courses.filter(course => course.title !== courseTitle);
        if (this.courses.length < initialLength) {
            console.log(`Course removed: ${courseTitle}`);
        } else {
            console.log(`Course not found: ${courseTitle}`);
        }
    }

    findCourse(courseTitle: string): Course | undefined {
        return this.courses.find(course => course.title === courseTitle);
    }

    printCourses(): void {
        if (this.courses.length === 0) {
            console.log("No courses available.");
            return;
        } else {
            console.log("Available courses:");
            this.courses.forEach(course => {
                console.log(`- ${course.title} (Duration: ${course.duration} hours)`);
            });
        }
    }
}



const courseManager = new CourseManager();

const course1 = new OnlineCourse("TypeScript Basics", 10); 
const course2 = new OnlineCourse("Advanced TypeScript", 15);
const course3 = new OnlineCourse("TypeScript for Web Development", 20);

courseManager.addCourse(course1);
courseManager.addCourse(course2);
courseManager.addCourse(course3);   

course1.registerStudent("Alice");
course1.registerStudent("Bob");
course1.registerStudent("Alice");

course2.registerStudent("Charlie");
course3.registerStudent("David");

courseManager.printCourses();

courseManager.removeCourse("Advanced TypeScript");

const foundCourse = courseManager.findCourse("TypeScript Basics");
if (foundCourse) {
    console.log(`Found course: ${foundCourse.title}`);
}

courseManager.printCourses();



    


