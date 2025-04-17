import { typeDirectory } from "../types/types";

export const AVAILABLE_DIRECTORIES: typeDirectory[] = [
    {
        directory: '',
        subdirectories: [
            {
                directory: 'Documents',
                subdirectories: [
                    {
                        directory: 'commands',
                        // data: ''
                    }
                ] 
            },
            {
                directory: 'portfolio',
                subdirectories: [
                    {
                        directory: 'profile',
                        files: [
                            {
                                name: 'profile.txt',
                                data:   'Name:\tLukas Busch\n\n' +
                                        'Profession:\tFull-Stack Web Developer\n\n' +
                                        'Experience:\t2 years\n\n' +
                                        'Location:\tMerida, Mexico\n\n' +
                                        'Description:\tAs a Full-Stack Developer I enjoy helping designers and companies bring their ideas to life. Specializing in Angular, TypeScript, SCSS and Node.js, I develop dynamic and responsive web applications. I am seeking a mid-level web developer position to advance my career. My ability to solve complex problems and my passion for programming make me a valuable asset to your team.'
                            }
                        ]
                    },
                    {
                        directory: 'projects',
                        files: [
                            {
                                name: 'expensetracker.txt',
                                data:   'Expense Tracker\n\n' + 
                                        'Angular, TypeScript, SCSS, HTML, Supabase, Node.js, Express\n\n' + 
                                        'Expense Tracker is a full-stack financial management app. Create an account to access a dynamic dashboard that lets you manage expenses, budgets, and settings in one interface.\n\n' + 
                                        'https://expensetracker.lukasbusch.dev',
                            },
                            {
                                name: 'join.txt',
                                data:   'Join\n\n' +
                                        'JavaScript, HTML, CSS, Firebase\n\n' +
                                        'Task Manager, inspired by the Kanban system, lets you create and organize tasks with drag-and-drop ease. Assign users and categories to manage your workflow and improve task tracking.\n\n' +
                                        'https://lukasbusch.dev/Join/init/login/login.html'
                            },
                            {
                                name: 'polloloco.txt',
                                data:   'Pollo Loco\n\n' +
                                        'JavaScript, HTML, CSS\n\n' +
                                        'Jump, run, and throw game built with an object-oriented approach. Help Pepe find coins and tabasco salsa to battle the crazy hen in an exciting quest.\n\n' +
                                        'https://lukasbusch.dev/PolloLoco/index.html'
                            },
                            {
                                name: 'notes.txt',
                                data:   'Notes\n\n' +
                                        'JavaScript, HTML, CSS, Firebase\n\n' +
                                        'Create, edit, archive, and delete notes effortlessly with inbuilt search functionality. Available in 5 languages and as PWA.\n\n' +
                                        'https://lukasbusch.dev/Notes/index.html'
                            },
                        ]
                    },
                    {
                        directory: 'contact.txt',
                        files: [
                            {
                                name: 'contact',
                                data:   'Name:\tLukas Busch\n\n' + 
                                        'email:\twebdeveloper@lukasbusch.dev'
                            }
                        ]
                    }
                ]
            }
        ] 
    }
]