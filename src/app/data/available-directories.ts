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
                                        '2\tstory\n'           +
                                        '3\tclear\n'          +
                                        '4\texit\n'           +
                                        '5\tpwd\n'            +
                                        '6\tcd\n'             +
                                        '7\tls\n'             +
                                        '8\twhoami\n'         +
                                        '9\tuname\n'          +
                                        '10\tcat\n'            +
                                        '11\tnano\n'          +
                                        '12\ttouch\n'         +
                                        '13\tmkdir\n'         +
                                        '14\trmdir\n'         +
                                        '15\trm\n'            +
                                        '16\techo\n'          +
                                        '17\tdate\n'          +
                                        '18\tuptime\n'        +
                                        '19\thistory\n'       +
                                        '20\tipaddr\n'        +
                                        '21\tcurl\n'          +
                                        '22\tping\n'          +
                                        '23\ttraceroute\n'    +
                                        '24\tdig\n'           +
                                        '25\tnslookup\n'      +
                                        '26\tweather'
                            }
                        ]
                    },
                    {
                        directory: 'docs',
                        subdirectories: [],
                        files: [
                            {
                                name: 'commandline_story.txt',
                                isRootOnly: true,
                                data:   "When I first got the idea of creating a command line, I wasn't really planning to build anything more than a small easter egg for my portfolio page - just a few commands like 'help', 'ls', and 'cd' to showcase my content in a fun way.\n" +
                                        "But after my initial implementation, I realized how much fun this project could be, and ideas kept pouring in.\n\n" +
                                        "Soon I was so driven by new features that I refactored my codebase (for commands) into two services:\n" +
                                        "\t- one for local, “static” commands\n" +
                                        "\t- one for HTTP-based commands\n\n" +
                                        "Most commands remained easy to implement thanks to this scalable setup, but two HTTP commands really caught me off guard:\n" +
                                        "\t1. **curl**: the browser blocked cross-origin requests, so I built a simple HTTP proxy on my VPS to fetch URLs server-side and inject the proper CORS headers.\n" +
                                        "\t2. **traceroute**: since browsers can't run network-layer commands, I added a VPS-hosted API to execute 'traceroute' on the server and stream the output back.\n\n" +
                                        "With those solutions in place, I could deliver real output instead of templates or errors only.\n\n" +
                                        "Next, I refactored the 'cat' command - originally it both displayed and edited file content, which isn't realistic—so now 'cat' only shows the content, and a new 'nano' command provides a full WYSIWYG editor with save/exit shortcuts (Ctrl+O, Ctrl+X).\n\n" +
                                        "After that, I implemented a 'sudo' command: enter the password 'TemetNosce!' to gain root permissions and edit/delete any file.\n\n" +
                                        "By now, I'd covered 25+ commands, complete with authentic bash-style errors and edge-case handling, plus command chaining ('&&') and batch file/dir creation or deletion.\n\n" +
                                        "Finally, I optimized the terminal for mobile devices—adding touch-friendly buttons for 'nano' and a 'stop ping' control since Ctrl+C isn't available on phones and tablets.\n\n" +
                                        "Now the core project is complete, but I'm already dreaming up new features. I hope this gives you a peek into how the terminal grew from a tiny easter egg into a full-blown Linux-style interface.\n" +
                                        "Thanks for reading - have fun exploring!\n\n" +
                                        "-Lukas"
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
                                        'Description:\tI am a detail-oriented, analytical, and self-driven Full-Stack Web Developer with over two years of experience building web applications. My main focus is on technologies like Angular, TypeScript, JavaScript, HTML and CSS/SCSS. Writing clean, efficient, and scalable code is just as important to me as being a coordinated and collaborative team player with attention to detail and a keen eye for graphic design.'
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