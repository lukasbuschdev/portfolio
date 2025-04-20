import { typeDirectory } from "../types/types";

export const AVAILABLE_DIRECTORIES: typeDirectory[] = [
    {
        directory: '',
        files: [
            {
                name: 'logs.txt',
                isRootOnly: true,
                data: ''
            }
        ],
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
                                isRootOnly: true,
                                data:
                                        '1\thelp\n'           +
                                        '2\tclear\n'          +
                                        '3\texit\n'           +                      
                                        '4\tpwd\n'            +
                                        '5\tcd\n'             +
                                        '6\tls\n'             +
                                        '7\twhoami\n'         +
                                        '8\tuname\n'          +                                                              
                                        '9\tcat\n'            +
                                        '10\tnano\n'          +
                                        '11\ttouch\n'         +
                                        '12\tmkdir\n'         +
                                        '13\trmdir\n'         +
                                        '14\trm\n'            +                                                              
                                        '15\techo\n'          +
                                        '16\tdate\n'          +
                                        '17\tuptime\n'        +
                                        '18\thistory\n'       +                                                              
                                        '19\tipaddr\n'        +
                                        '20\tcurl\n'          +
                                        '21\tping\n'          +
                                        '22\ttraceroute\n'    +
                                        '23\tdig\n'           +
                                        '24\tnslookup\n'      +
                                        '25\tweather'
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
                                isRootOnly: true,
                                data:   'Name:\t\t\tLukas Busch\n\n' +
                                        'Profession:\t\tFull-Stack Web Developer\n\n' +
                                        'Experience:\t\t2+ years\n\n' +
                                        'Location:\t\tMérida, México\n\n' +
                                        'Languages:\t\tEnglish, German, Spanish\n\n' +
                                        'Description:\tI am a detail-oriented, analytical, and self-driven Full-Stack Web Developer with over two years of experience building web applications. My main focus is on technologies like Angular, TypeScript, JavaScript, HTML and CSS/SCSS. Writing clean, efficient, and scalable code is just as important to me as being a coordinated and collaborative team player with attention to detail and a keen eye for graphic design.\n\n' +
                                        'Password:\t\tTemetNosce!'
                            }
                        ]
                    },
                    {
                        directory: 'projects',
                        subdirectories: [],
                        files: [
                            {
                                name: 'expensetracker.txt',
                                isRootOnly: true,
                                data:   'Expense Tracker\n\n' + 
                                        'Angular, TypeScript, SCSS, HTML, Supabase, Node.js, Express\n\n' + 
                                        'Expense Tracker is a full-stack financial management app. Create an account to access a dynamic dashboard that lets you manage expenses, budgets, and settings in one interface.\n\n' + 
                                        'https://expensetracker.lukasbusch.dev',
                            },
                            {
                                name: 'join.txt',
                                isRootOnly: true,
                                data:   'Join\n\n' +
                                        'JavaScript, HTML, CSS, Firebase\n\n' +
                                        'Task Manager, inspired by the Kanban system, lets you create and organize tasks with drag-and-drop ease. Assign users and categories to manage your workflow and improve task tracking.\n\n' +
                                        'https://lukasbusch.dev/Join/init/login/login.html'
                            },
                            {
                                name: 'polloloco.txt',
                                isRootOnly: true,
                                data:   'Pollo Loco\n\n' +
                                        'JavaScript, HTML, CSS\n\n' +
                                        'Jump, run, and throw game built with an object-oriented approach. Help Pepe find coins and tabasco salsa to battle the crazy hen in an exciting quest.\n\n' +
                                        'https://lukasbusch.dev/PolloLoco/index.html'
                            },
                            {
                                name: 'notes.txt',
                                isRootOnly: true,
                                data:   'Notes\n\n' +
                                        'JavaScript, HTML, CSS, Firebase\n\n' +
                                        'Create, edit, archive, and delete notes effortlessly with inbuilt search functionality. Available in 5 languages and as PWA.\n\n' +
                                        'https://lukasbusch.dev/Notes/index.html'
                            },
                            {
                                name: 'terminal.txt',
                                isRootOnly: false,
                                data:   'Interactive Terminal Simulation\n\n' +
                                        'Angular, TypeScript, SCSS, HTML, Node.js, Express, Flask\n\n' +
                                        'Embeds a fully-functional, Linux-style command-line interface right in your portfolio.  ' +
                                        'Supports 25+ real commands (ls, cat, nano, ping, curl, dig, nslookup, traceroute, weather, etc.), ' +
                                        'command chaining with &&, sudo-style authentication, and precise Linux-style error messaging to mirror bash behavior.\n\n' +
                                        'Features:\n' +
                                        ' • WYSIWYG nano editor for .txt files (with save/exit shortcuts ^O, ^X)\n' +
                                        ' • Session uptime, user count, and system info (uname)\n' +
                                        ' • Real-time network and HTTP/DNS lookups via a Node.js + Flask proxy (avoids CORS)\n' +
                                        ' • File creation, removal, renaming, and directory navigation—all with authentic error handling'
                              }
                        ]
                    },
                    {
                        directory: 'contact',
                        subdirectories: [],
                        files: [
                            {
                                name: 'contact.txt',
                                isRootOnly: true,
                                data:   'Name:\t\tLukas Busch\n\n' + 
                                        'Email:\t\twebdeveloper@lukasbusch.dev\n\n' +
                                        'WhatsApp:\t+52 9993 5180 61\n\n' +
                                        'GitHub:\t\thttps://github.com/lukasbuschdev\n\n' +
                                        'LinkedIn:\twww.linkedin.com/in/lukas-busch-4192001b5'
                            }
                        ]
                    }
                ]
            }
        ] 
    }
]