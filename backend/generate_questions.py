import pandas as pd
import os

def get_devicon(tech, index):
    mapping = {
        "Python": ["python/python-original.svg", "django/django-plain.svg", "pycharm/pycharm-original.svg"],
        "Java": ["java/java-original.svg", "spring/spring-original.svg", "android/android-original.svg"],
        "C++": ["cplusplus/cplusplus-original.svg", "qt/qt-original.svg", "unrealengine/unrealengine-original.svg"],
        "VS Code": ["vscode/vscode-original.svg", "typescript/typescript-original.svg", "azure/azure-original.svg"],
        "Git": ["git/git-original.svg", "github/github-original.svg", "bitbucket/bitbucket-original.svg"],
        "Docker": ["docker/docker-original.svg", "kubernetes/kubernetes-plain.svg", "linux/linux-original.svg"],
        "PostgreSQL": ["postgresql/postgresql-original.svg", "mysql/mysql-original.svg", "sqlite/sqlite-original.svg"],
        "MongoDB": ["mongodb/mongodb-original.svg", "couchdb/couchdb-original.svg", "redis/redis-original.svg"],
        "FastAPI": ["fastapi/fastapi-original.svg", "python/python-original.svg", "swagger/swagger-original.svg"],
        "Node.js": ["nodejs/nodejs-original.svg", "npm/npm-original-wordmark.svg", "express/express-original.svg"],
        "React": ["react/react-original.svg", "redux/redux-original.svg", "nextjs/nextjs-original.svg"],
        "Terminal / CLI": ["bash/bash-original.svg", "linux/linux-original.svg", "apple/apple-original.svg"],
        "Android Studio": ["android/android-original.svg", "kotlin/kotlin-original.svg", "androidstudio/androidstudio-original.svg"],
        "GitHub": ["github/github-original.svg", "git/git-original.svg", "gitlab/gitlab-original.svg"],
        "Firebase": ["firebase/firebase-plain.svg", "googlecloud/googlecloud-original.svg", "android/android-original.svg"],
        "Kubernetes": ["kubernetes/kubernetes-plain.svg", "docker/docker-original.svg", "googlecloud/googlecloud-original.svg"],
        "Linux": ["linux/linux-original.svg", "ubuntu/ubuntu-plain.svg", "debian/debian-plain.svg"],
        "HTML": ["html5/html5-original.svg", "chrome/chrome-original.svg", "firefox/firefox-original.svg"],
        "CSS": ["css3/css3-original.svg", "sass/sass-original.svg", "tailwindcss/tailwindcss-original.svg"],
        "JavaScript": ["javascript/javascript-original.svg", "typescript/typescript-original.svg", "babel/babel-original.svg"],
    }
    
    icons = mapping.get(tech, [])
    if index < len(icons):
        return f"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/{icons[index]}"
    return f"https://api.dicebear.com/7.x/identicon/svg?seed={tech}{index}"

def generate_questions():
    questions = []
    
    # ROUND 1: IMAGE CLUE IDENTIFICATION (1-20)
    round1_data = [
        ("Identify the programming language.", "Python", ["Java", "Python", "C++", "Ruby", "C#"]),
        ("Identify the programming language.", "Java", ["Java", "Kotlin", "Scala", "Groovy", "C#"]),
        ("Identify the programming language.", "C++", ["C", "C++", "Rust", "Go", "Assembly"]),
        ("Identify the development tool.", "VS Code", ["IntelliJ", "Eclipse", "VS Code", "NetBeans", "Sublime"]),
        ("Identify the version control system.", "Git", ["Git", "SVN", "Mercurial", "Bitbucket", "Perforce"]),
        ("Identify the container platform.", "Docker", ["Docker", "Kubernetes", "Podman", "OpenShift", "LXC"]),
        ("Identify the database.", "PostgreSQL", ["MySQL", "MongoDB", "PostgreSQL", "SQLite", "Oracle"]),
        ("Identify the database.", "MongoDB", ["MongoDB", "MySQL", "Redis", "MariaDB", "Cassandra"]),
        ("Identify the framework.", "FastAPI", ["Django", "Flask", "FastAPI", "Spring", "Laravel"]),
        ("Identify the runtime.", "Node.js", ["Node.js", "Deno", "Bun", "Express", "V8"]),
        ("Identify the library.", "React", ["Angular", "React", "Vue", "Svelte", "Ember"]),
        ("Identify the tool.", "Terminal / CLI", ["File Manager", "Terminal / CLI", "Task Manager", "Notepad", "Explorer"]),
        ("Identify the development tool.", "Android Studio", ["Android Studio", "Flutter", "React Native", "Xcode", "Unity"]),
        ("Identify the platform.", "GitHub", ["GitHub", "GitLab", "Bitbucket", "SourceForge", "Azure"]),
        ("Identify the backend platform.", "Firebase", ["Firebase", "Supabase", "AWS", "Azure", "Cloudflare"]),
        ("Identify the orchestration tool.", "Kubernetes", ["Kubernetes", "Docker Swarm", "Jenkins", "Terraform", "Ansible"]),
        ("Identify the OS.", "Linux", ["Windows", "Linux", "macOS", "Unix", "ChromeOS"]),
        ("Identify the technology.", "HTML", ["HTML", "CSS", "JavaScript", "PHP", "XML"]),
        ("Identify the technology.", "CSS", ["HTML", "CSS", "JavaScript", "Bootstrap", "Tailwind"]),
        ("Identify the language.", "JavaScript", ["TypeScript", "JavaScript", "Python", "Java", "PHP"]),
    ]

    for i, (q_text, tech, opts) in enumerate(round1_data):
        questions.append({
            'type': 'Image',
            'question': q_text,
            'option1': opts[0],
            'option2': opts[1],
            'option3': opts[2],
            'option4': opts[3],
            'option5': opts[4],
            'correct_answer': tech,
            'image1': get_devicon(tech, 0),
            'image2': get_devicon(tech, 1),
            'image3': get_devicon(tech, 2)
        })

    # ROUND 2: THEORETICAL QUESTIONS (21-40)
    round2_data = [
        ("Which concept allows a class to inherit properties from another class?", ["Encapsulation", "Inheritance", "Abstraction", "Polymorphism", "Delegation"], "Inheritance"),
        ("Which Python data type is immutable?", ["List", "Dictionary", "Tuple", "Set", "Array"], "Tuple"),
        ("Which keyword creates an object in Java?", ["new", "create", "object", "class", "instantiate"], "new"),
        ("Which C++ feature supports runtime polymorphism?", ["Templates", "Virtual Functions", "Inline Functions", "Macros", "Friend classes"], "Virtual Functions"),
        ("Which Git command sends local commits to remote repository?", ["git commit", "git push", "git clone", "git add", "git fetch"], "git push"),
        ("Which HTTP method retrieves data from server?", ["GET", "POST", "PUT", "DELETE", "PATCH"], "GET"),
        ("Which Python keyword handles exceptions?", ["catch", "try", "error", "except", "finally"], "except"),
        ("Which Java collection does NOT allow duplicates?", ["List", "Set", "ArrayList", "Vector", "Queue"], "Set"),
        ("Which tool is used for containerization?", ["Docker", "Jenkins", "Git", "Maven", "Gradle"], "Docker"),
        ("Which protocol is mainly used for web communication?", ["FTP", "SMTP", "HTTP", "SSH", "TCP"], "HTTP"),
        ("Which Python library is used for data analysis?", ["Pandas", "Matplotlib", "Requests", "Pygame", "Flask"], "Pandas"),
        ("Which tool automates CI/CD?", ["Jenkins", "Docker", "VS Code", "Node.js", "GitLab"], "Jenkins"),
        ("Which Java keyword prevents inheritance?", ["static", "final", "private", "abstract", "protected"], "final"),
        ("Which C++ keyword defines constant variable?", ["static", "const", "final", "fixed", "immutable"], "const"),
        ("Which database is relational?", ["PostgreSQL", "MongoDB", "Redis", "Cassandra", "Neo4j"], "PostgreSQL"),
        ("Which command installs Python packages?", ["pip install", "npm install", "apt install", "brew install", "conda install"], "pip install"),
        ("Which tool manages Node.js packages?", ["npm", "pip", "maven", "composer", "cargo"], "npm"),
        ("Which architecture uses API + frontend?", ["Client-Server", "Monolithic", "P2P", "Serverless", "Event-driven"], "Client-Server"),
        ("Which data structure uses FIFO?", ["Stack", "Queue", "Tree", "Graph", "LinkedList"], "Queue"),
        ("Which language runs in browser?", ["Python", "Java", "JavaScript", "C++", "C#"], "JavaScript"),
    ]

    for q, opts, ans in round2_data:
        questions.append({
            'type': 'Theory',
            'question': q,
            'option1': opts[0],
            'option2': opts[1],
            'option3': opts[2],
            'option4': opts[3],
            'option5': opts[4],
            'correct_answer': ans,
            'image1': None, 'image2': None, 'image3': None
        })

    # ROUND 3: CODE ANALYSIS (41-60)
    round3_data = [
        ("Python: x=[1,2,3]; print(x*2) - Output?", ["[2,4,6]", "[1,2,3,1,2,3]", "Error", "None", "[1,2,3,1,2,3,1,2,3]"], "[1,2,3,1,2,3]"),
        ("Java: int x=5; System.out.println(x++); - Output?", ["5", "6", "Error", "4", "0"], "5"),
        ("C++: int a=10; int b=3; cout<<a/b; - Output?", ["3", "3.33", "4", "Error", "5"], "3"),
        ("Python: for i in range(3): print(i) - Error?", ["Syntax error", "Indentation error", "Type error", "Name error", "Attribute error"], "Indentation error"),
        ("Java: String s=\"Hello\"; System.out.println(s.length()); - Output?", ["4", "5", "6", "Error", "0"], "5"),
        ("C++: int main(){ cout<<\"Hello\" } - Error?", ["Missing semicolon", "Missing bracket", "Missing include", "Syntax error", "No error"], "Missing semicolon"),
        ("Python: print(bool(\"\")) - Output?", ["True", "False", "None", "Error", "1"], "False"),
        ("Java: int arr[]={1,2,3}; System.out.println(arr[3]); - Error?", ["Null pointer", "ArrayIndexOutOfBounds", "Syntax error", "None", "StackOverflow"], "ArrayIndexOutOfBounds"),
        ("C++: int x=5; if(x=10) cout<<\"Yes\"; - Problem?", ["Assignment instead of comparison", "Syntax error", "Type error", "No error", "Logical error"], "Assignment instead of comparison"),
        ("Python: a={1,2,3}; print(type(a)) - Output?", ["list", "dict", "set", "tuple", "set_obj"], "set"),
        ("Python: def f(a, L=[]): L.append(a); return L; print(f(1)); print(f(2))?", ["[1], [2]", "[1], [1, 2]", "[1, 2], [1, 2]", "Error", "None"], "[1], [1, 2]"),
        ("Java: String a=\"hi\"; String b=\"hi\"; System.out.println(a == b);?", ["true", "false", "Error", "null", "undefined"], "true"),
        ("C++: int x=10; int &y=x; y=20; cout<<x;?", ["10", "20", "Error", "30", "Address"], "20"),
        ("Python: print([i for i in range(5) if i%2==0])?", ["[0,2,4]", "[1,3]", "[0,1,2,3,4]", "Error", "[]"], "[0,2,4]"),
        ("Java: static int x=10; public void m(){ x++; } - Behaviour?", ["Each object has own x", "Shared across all objects", "Error", "Local variable", "Constant"], "Shared across all objects"),
        ("C++: int *p; *p=10; - What happens?", ["Memory leak", "Segmentation fault/Undefined", "x points to 10", "Success", "Compilation error"], "Segmentation fault/Undefined"),
        ("Python: lambda x: x*2 - What is it?", ["Loop", "Anonymous function", "Class", "Module", "Variable"], "Anonymous function"),
        ("Java: How to start a thread?", ["t.run()", "t.start()", "t.execute()", "t.begin()", "t.launch()"], "t.start()"),
        ("C++: delete p; - What is this?", ["Memory allocation", "Memory deallocation", "Pointer creation", "Error", "System call"], "Memory deallocation"),
        ("Python: print(factorial(5)) using recursion - Output?", ["120", "24", "720", "60", "100"], "120"),
    ]

    for q, opts, ans in round3_data:
        questions.append({
            'type': 'Code',
            'question': q,
            'option1': opts[0],
            'option2': opts[1],
            'option3': opts[2],
            'option4': opts[3],
            'option5': opts[4],
            'correct_answer': ans,
            'image1': None, 'image2': None, 'image3': None
        })

    df = pd.DataFrame(questions)
    df.to_excel('technical_quiz_questions.xlsx', index=False)
    print("Excel file 'technical_quiz_questions.xlsx' updated with 60 high-quality questions and DevIcons.")

if __name__ == "__main__":
    generate_questions()
