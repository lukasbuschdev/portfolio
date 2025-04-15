import { typeDirectory } from "../types/types";

export const AVAILABLE_DIRECTORIES: typeDirectory[] = [
    {
        directory: '',
        subdirectories: [
            {
                directory: 'portfolio',
                subdirectories: [
                    {
                        directory: 'profile',
                        data: {
                            name: 'Lukas Busch',
                            profession: 'Full-Stack Web Developer',
                            experience: '2 years',
                            location: 'Merida, Mexico',
                            description: 'As a Full-Stack Developer I enjoy helping designers and companies bring their ideas to life. Specializing in Angular, TypeScript, SCSS and Node.js, I develop dynamic and responsive web applications. I am seeking a mid-level web developer position to advance my career. My ability to solve complex problems and my passion for programming make me a valuable asset to your team.'
                        }
                    },
                    {
                        directory: 'projects',
                        subdirectories: [
                            {
                                directory: 'expensetracker',
                                data: {
                                    name: 'Expense Tracker',
                                    technologies: 'Angular, TypeScript, SCSS, HTML, Supabase, Node.js, Express',
                                    description: 'Expense Tracker is a full-stack financial management app. Create an account to access a dynamic dashboard that lets you manage expenses, budgets, and settings in one interface.'
                                }
                            },
                            {
                                directory: 'join',
                                data: {
                                    name: 'Join',
                                    technologies: 'JavaScript, HTML, CSS, Firebase',
                                    description: 'Task Manager, inspired by the Kanban system, lets you create and organize tasks with drag-and-drop ease. Assign users and categories to manage your workflow and improve task tracking.'
                                }
                            },
                            {
                                directory: 'polloloco',
                                data: {
                                    name: 'Pollo Loco',
                                    technologies: 'JavaScript, HTML, CSS',
                                    description: 'Jump, run, and throw game built with an object-oriented approach. Help Pepe find coins and tabasco salsa to battle the crazy hen in an exciting quest.'
                                }
                            },
                            {
                                directory: 'notes',
                                data: {
                                    name: 'Notes',
                                    technologies: 'JavaScript, HTML, CSS, Firebase',
                                    description: 'Create, edit, archive, and delete notes effortlessly with inbuilt search functionality. Available in 5 languages and as PWA.'
                                }
                            },
                        ]
                    },
                    {
                        directory: 'contact',
                        data: {
                            name: 'Lukas Busch',
                            email: 'webdeveloper@lukasbusch.dev'
                        }
                    }
                ]
            }
        ] 
    }
]