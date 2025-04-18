import { typeDirectory } from "../types/types";

export const AVAILABLE_DIRECTORIES: typeDirectory[] = [
    {
        directory: '',
        files: [],
        subdirectories: [
            {
                directory: 'Documents',
                files: [],
                subdirectories: [
                    {
                        directory: 'commands',
                        subdirectories: [],
                        files: [
                            {
                                name: 'commands.txt',
                                data:   '1\tclear\n' +
                                        '2\twhoami\n' +
                                        '3\techo\n' +
                                        '4\thelp\n' +
                                        '5\tipaddr\n' +
                                        '6\tcd\n' +
                                        '7\tls\n' +
                                        '8\tcat\n' +
                                        '9\tpwd\n' +
                                        '10\tcurl\n' +
                                        '11\texit\n' +
                                        '12\tping\n' +
                                        '13\tdig\n' +
                                        '14\tnslookup\n' +
                                        '15\ttraceroute\n' +
                                        '16\thistory\n' +
                                        '17\tweather\n' +
                                        '18\tuname\n' +
                                        '19\tuptime\n' +
                                        '20\tdate\n' +
                                        '21\tmkdir\n' +
                                        '22\trmdir\n' +
                                        '23\ttouch'
                            }
                        ]
                    }
                ] 
            },
            {
                directory: 'portfolio',
                files: [],
                subdirectories: [
                    {
                        directory: 'profile',
                        subdirectories: [],
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
                        subdirectories: [],
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
                        directory: 'contact',
                        subdirectories: [],
                        files: [
                            {
                                name: 'contact.txt',
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