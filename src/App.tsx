import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useCustomCursor } from './hooks/useCustomCursor'
import AboutFeatures from './components/ui/about-features'
import { useScrollPosition } from './hooks/useScrollPosition'
import { useIntersectionObserver as useInView } from './hooks/useIntersectionObserver'
import { 
  Terminal as TerminalIcon, 
  Play, 
  Copy, 
  Check, 
  Folder, 
  FileCode, 
  Search as SearchIcon, 
  GitBranch, 
  Code2,
  X,
  FileText,
  Menu
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

/* ============== CONTACT FORM STATE ============== */
interface FormData {
  firstName: string
  lastName: string
  email: string
  subject: string
  message: string
}

/* ============== FORMAT HELPERS ============== */
function formatStat(n: number, target: number): string {
  if (target >= 10000000) {
    const m = n / 1000000
    return `${m.toFixed(m % 1 === 0 ? 0 : 1)}M`
  }
  if (target >= 1000) return n.toLocaleString()
  return String(n)
}

/* ============== TECH STACK CUSTOM IDE DATA ============== */
const techCategories: Record<string, string> = {
  '.NET 6+': 'Backend',
  'C#': 'Backend',
  'React.js': 'Frontend',
  'Angular': 'Frontend',
  'TypeScript': 'Frontend',
  'Node.js': 'Backend',
  'MongoDB': 'Database',
  'PostgreSQL': 'Database',
  'Azure': 'DevOps & Cloud',
  'Docker': 'DevOps & Cloud',
  'Kubernetes': 'DevOps & Cloud',
  'Python': 'Backend',
  'Go': 'Backend',
  'Java': 'Backend',
  'Rust': 'Backend',
  'SQL': 'Database',
  'PHP': 'Backend'
};

const mockTerminalLogs: Record<string, string[]> = {
  '.NET 6+': [
    '$ dotnet run --project NoeXa.Solutions',
    'Build started...',
    'Compiling NoeXa.Solutions.DigitalTransformation...',
    'AssembleDedicatedTeam() -> Assembling senior engineers, QA & PM...',
    'Architecting modern microservices on Azure AKS...',
    'Build successful. Zero warnings, zero errors.',
    'Executing NoeXa core solutions. Quality guarantee: 100%',
    'Execution complete.'
  ],
  'C#': [
    '$ dotnet run --project NoeXa.Core',
    'Build started...',
    'Successfully loaded patterns: DDD, CQRS, EventSourcing.',
    'Executing SolutionBuilder.BuildAsync() task...',
    'Execution complete. Status: SUCCESS in 124ms.'
  ],
  'React.js': [
    '$ npm run build',
    'vite v8.0.8 building client environment for production...',
    '✓ 1731 modules transformed.',
    'dist/assets/index-b48f93e.js  142.18 kB │ gzip: 42.12 kB',
    'dist/assets/index-c18f21a.css   25.40 kB │ gzip:  6.12 kB',
    '✓ built in 1.48s',
    'Production build complete!'
  ],
  'Angular': [
    '$ ng build --configuration production',
    'Building NoeXa Client Bundle...',
    'Initial chunk files | Names         | Size',
    'main.js             | Main          | 185.34 kB',
    'polyfills.js        | Polyfills     |  33.12 kB',
    'styles.css          | Styles        |  24.50 kB',
    'Build successful. Compiled on AOT mode.',
    'Bundle size optimized. Execution complete.'
  ],
  'TypeScript': [
    '$ tsc --noEmit',
    'Performing static type-checking of all .ts and .tsx files...',
    'Found 0 type errors. Everything is fully sound!',
    'Compilation complete.'
  ],
  'Node.js': [
    '$ node noexa.api.js',
    'Starting NoeXa API Gateway...',
    'Connecting to Database Cluster...',
    'Server running on port 3000 (HTTPS)',
    'API is fully healthy and ready for queries.'
  ],
  'MongoDB': [
    '$ mongo "mongodb+srv://cluster0.noexa.mongodb.net/prod"',
    'Connecting to cluster0.noexa.mongodb.net...',
    'MongoDB Shell v7.0.5',
    'db.projects.aggregate() -> processing pipeline aggregates...',
    'Completed aggregation. Output: { totalDocs: 154, avgTeamSize: 6.8 }'
  ],
  'PostgreSQL': [
    '$ psql -h db.noexa.pt -U dev_admin -d noexa_prod',
    'psql (16.2, server 15.6)',
    'Type "help" for help.',
    'Running index query optimizer...',
    'CREATE INDEX idx_projects_client SUCCESSFUL.',
    'Query completed in 1.5ms.'
  ],
  'Azure': [
    '$ az deployment group create --resource-group noexa-prod --template-file azure-deploy.bicep',
    'Initializing Bicep transpile compiler...',
    'Creating resource deployment task: [noexa-api-prod] in [West Europe]...',
    'Deployment successful. Output endpoint: https://api.noexa.pt'
  ],
  'Docker': [
    '$ docker build -t noexa/api:latest .',
    'Sending build context to Docker daemon  42.5kB',
    'Step 1/12 : FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base',
    ' ---> f0e2d1a3f5c',
    'Step 2/12 : WORKDIR /app',
    ' ---> Using cache',
    'Step 12/12 : RUN dotnet publish -c Release',
    ' ---> Running in b12a4f6d',
    'Successfully built b12a4f6d',
    'Successfully tagged noexa/api:latest'
  ],
  'Kubernetes': [
    '$ kubectl apply -f k8s-deployment.yaml',
    'deployment.apps/noexa-api created',
    'service/noexa-api-service created',
    'kubectl get pods',
    'NAME                         READY   STATUS    RESTARTS   AGE',
    'noexa-api-8fcd12a4-abc12     1/1     Running   0          5s',
    'noexa-api-8fcd12a4-def34     1/1     Running   0          5s',
    'noexa-api-8fcd12a4-ghi56     1/1     Running   0          5s'
  ],
  'Python': [
    '$ uvicorn noexa_api:app --host 0.0.0.0 --port 8000',
    'INFO:     Started server process [4512]',
    'INFO:     Waiting for application startup.',
    'INFO:     Application startup complete.',
    'INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)'
  ],
  'Go': [
    '$ go run noexa.go',
    'Starting Go net/http microservice server...',
    'Database connection pools initialized.',
    'Listening on :8080'
  ],
  'Java': [
    '$ mvn spring-boot:run',
    '  .   ____          _            __ _ _',
    ' /\\\\ / ___\\\'_ __ _ _(_)_ __  __ _ \\ \\ \\ \\',
    '( ( )\\___ | \'_ | \'_| | \'_ \\/ _` | \\ \\ \\ \\',
    ' \\\\/  ___)| |_)| | | | | | | (_| |  ) ) ) )',
    '  \'  |____| .__|_| |_|_|_| |_\\__, | / / / /',
    ' =========|_|==============|___/=/=/_/_/_/',
    ' :: Spring Boot ::                (v3.2.3)',
    'INFO: Started ProjectController in 2.85 seconds.'
  ],
  'Rust': [
    '$ cargo run --release',
    '   Compiling noexa v0.1.0 (/app)',
    '    Finished release [optimized] target(s) in 8.32s',
    '     Running `target/release/noexa`',
    '[INFO] actix_web::server: Http-Server started on 127.0.0.1:8080'
  ],
  'SQL': [
    '$ sqlite3 noexa.db < queries.sql',
    'Executing query aggregate client budgets...',
    'Done. 20 rows matched in 0.8ms.'
  ],
  'PHP': [
    '$ php artisan serve',
    'Starting Laravel development server: http://127.0.0.1:8000',
    '[Fri May  8 11:54:12 2026] 127.0.0.1:54124 Accepted'
  ]
};

const fileExplorer = [
  {
    name: 'backend',
    type: 'folder',
    children: [
      { name: 'noexa.solution.cs', tech: '.NET 6+' },
      { name: 'NoeXa.Core.cs', tech: 'C#' },
      { name: 'noexa.api.js', tech: 'Node.js' },
      { name: 'noexa_api.py', tech: 'Python' },
      { name: 'noexa.go', tech: 'Go' },
      { name: 'NoeXaService.java', tech: 'Java' },
      { name: 'noexa.rs', tech: 'Rust' },
      { name: 'NoeXaController.php', tech: 'PHP' },
    ]
  },
  {
    name: 'frontend',
    type: 'folder',
    children: [
      { name: 'NoeXa.Web.tsx', tech: 'React.js' },
      { name: 'noexa.service.ts', tech: 'Angular' },
      { name: 'noexa.types.ts', tech: 'TypeScript' },
    ]
  },
  {
    name: 'database',
    type: 'folder',
    children: [
      { name: 'noexa.mongo.js', tech: 'MongoDB' },
      { name: 'noexa.sql', tech: 'PostgreSQL' },
      { name: 'queries.sql', tech: 'SQL' },
    ]
  },
  {
    name: 'devops',
    type: 'folder',
    children: [
      { name: 'azure-deploy.bicep', tech: 'Azure' },
      { name: 'Dockerfile', tech: 'Docker' },
      { name: 'k8s-deployment.yaml', tech: 'Kubernetes' },
    ]
  }
];

/* ============== MAIN APP ============== */
function App() {
  const { cursorRef, ringRef, isMobile } = useCustomCursor()
  const scrolled = useScrollPosition()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedTech, setSelectedTech] = useState('.NET 6+')
  const [displayedCode, setDisplayedCode] = useState<string[]>([])
  
  // Interactive IDE state variables
  const [activeCategory, setActiveCategory] = useState('All')
  const [isCopied, setIsCopied] = useState(false)
  const [isConsoleOpen, setIsConsoleOpen] = useState(false)
  const [consoleLogs, setConsoleLogs] = useState<string[]>([])
  const [isCompiling, setIsCompiling] = useState(false)

  const [expandedJob, setExpandedJob] = useState<number | null>(null)
  const [formData, setFormData] = useState<FormData>({
    firstName: '', lastName: '', email: '', subject: '', message: ''
  })
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // GSAP cleanup refs
  const scrollTriggerRefs = useRef<ScrollTrigger[]>([])

  const jobDetails: Record<number, { description: string; responsibilities: string[]; skills: string[] }> = {
    0: {
      description: 'We are looking for a Senior .NET Full-Stack to strengthen our Development Team.',
      responsibilities: [
        'Develop, maintain, and optimize scalable Solutions using .NET 6+ and C# for the Backend, HTML5/CSS3, JavaScript, React and Angular on Frontend, using a DDD approach and Microservices Architecture.',
        'Design and implement robust and performant .NET WebAPIs, leveraging Entity Framework, LINQ and Raw SQL for seamless data management.',
        'Create high-quality, maintainable code with good Automated Unit Test Code Coverage using xUnit.',
        'Work closely with Product Owners, other Developers and UX/UI Designers.',
        'Collaborate with cross-functional Teams to embed DevOps practices in the Development lifecycle.',
        'Utilize Jira, Azure DevOps and GitLab for streamlined Project tracking, version control, and collaboration.',
        'Apply Agile Development Methodology to deliver iterative, high-quality software solutions.',
      ],
      skills: [
        "Bachelor's degree in Computer Science, Computer Engineering, or related field.",
        '5+ years of professional experience with .NET (.NET 6+), C#, WebAPI, Entity Framework, LINQ, and SQL.',
        '5+ years of Frontend Development experience using React and Angular.',
        'Proficiency in Database Modeling and Design (Microsoft SQL Server mandatory, PostgreSQL is a plus).',
        'Automated Unit Testing using xUnit.',
        'Strong familiarity with DevOps approaches and CI/CD processes.',
        'Experience using tools like Jira, GitLab, and GitHub.',
        'Proficiency in Agile Development Methodology and collaborative team environments.',
        'Excellent problem-solving skills and clear communication abilities.',
        'Fluent in both spoken and written English.',
      ],
    },
    1: {
      description: "Join our team as a full-stack developer (JavaScript/TypeScript) and contribute to our group's mission of delivering top-tier craftsmen's ERP solutions.",
      responsibilities: [
        'Develop, maintain and operate Accurator, the purchasing tool for the construction industry, using a tech stack consisting of Javascript, Typescript, Node.js, Express, React.js, Mongoose, MongoDB and Azure.',
        'Design and implement robust and performant APIs to enable integration with other systems both internally and externally.',
        'Become part of a closely knit cross-functional team taking full ownership of the Accurator SaaS product.',
        'Participate in code reviews, testing, and debugging.',
        'Apply agile development methodology to deliver high-quality software solutions in an iterative way.',
      ],
      skills: [
        "Bachelor's degree in Computer Science, Computer Engineering, or related field.",
        'At least 5 years of professional experience with modern JavaScript/Typescript development.',
        'Proficiency in database modeling and design (MongoDB is a plus).',
        'Proficiency in automated testing, code quality assurance, and security scanning tools.',
        'Strong familiarity with DevOps approaches, version control in Git and CI/CD processes.',
        'Proficiency in agile development methodologies and thrives in collaborative team environments.',
        'Self-driven and capable of owning the development of features across the software development lifecycle.',
        'Strong problem-solving skills and attention to detail.',
        'Fluent in both spoken and written English.',
      ],
    },
    2: {
      description: "Join our team as a QA Engineer and contribute to our group's mission of delivering top-tier craftsmen's ERP solutions.",
      responsibilities: [
        "As a Quality Assurance (QA) Engineer, you will work as an integral member of a collaborative product development team.",
        'You will design and execute effective test strategies, automate testing processes, identify defects early, and continuously improve quality.',
        'Your proactive involvement in team discussions, planning, and delivery will help ensure standards of excellence.',
      ],
      skills: [
        'Collaborative Mindset: Able to work effectively in a cross-functional, agile team.',
        'Test Automation: Proficiency with frameworks such as Selenium, Cypress, Playwright, or similar.',
        'Analytical Thinking: Strong problem-solving skills, attention to detail, and ability to identify root causes.',
        'Technical Acumen: Understanding of SDLC, agile methodologies, continuous integration, and version control.',
        'Communication: Clear, constructive communicator able to express testing results and risks.',
        'Performance & Security Testing: Familiarity with relevant tools for load, performance, and security validation.',
        'Continuous Learning: Commitment to staying informed about evolving QA practices.',
      ],
    },
    3: {
      description: 'We are looking for a Mid-Senior Frontend to strengthen our Development Team.',
      responsibilities: [
        'Mentor and Tech coach a Frontend Development Team on Product Development and Maintenance activities.',
        'Create and maintain User Interfaces for Web Apps using HTML5/CSS3, JavaScript, TypeScript, React.js and Stencil.',
        'Build reusable components and frontend libraries for future use within the Group.',
        'Build and Maintain Microfrontends and Web Components.',
        'Transposing designs and wireframes into high quality code.',
        'Optimize components for maximum performance across devices and browsers.',
        'Create Technical Documentation for reference and reporting.',
        'Work closely with Product Owners, other Developers and UX/UI Designers.',
        'Utilize Jira and GitLab for streamlined Project tracking, version control, and collaboration.',
        'Apply Agile Development Methodology to deliver iterative, high-quality software solutions.',
      ],
      skills: [
        "Bachelor's degree in Computer Science, Computer Engineering, or related field.",
        '3-5 years of professional experience with HTML5/CSS3, JavaScript, TypeScript, React.js and Stencil.',
        'Experience with Microfrontends and Web Components is a huge plus.',
        'Solid understanding of related web technologies such as JavaScript (ES6+), HTML5, and CSS3.',
        'Experience with popular React.js workflows as Redux, Flux, React Hooks.',
        'Good understanding of RESTful APIs and experience integrating them into Web Applications.',
        'Experience with Automated Frontend Testing Tools such as Cypress, Selenium or similar.',
        'Strong familiarity with DevOps approaches and CI/CD processes.',
        'Experience using tools like Jira, GitLab, and GitHub.',
        'Proficiency in Agile Development Methodology and collaborative team environments.',
        'Excellent problem-solving skills and clear communication abilities.',
        'Fluent in both spoken and written English.',
      ],
    },
  }

  const codeExamples: Record<string, { filename: string; code: string[] }> = {
    '.NET 6+': {
      filename: 'noexa.solution.cs',
      code: [
        // NoeXa – Engineering Excellence',
        'namespace NoeXa.Solutions {',
        '  public class DigitalTransformation {',
        '    private readonly ITeamService _team;',
        '    private readonly ICloudProvider _cloud;',
        '',
        '    public async Task<Solution> BuildAsync(',
        '      ProjectSpec spec) {',
        '      var team = await _team',
        '        .AssembleDedicatedTeam(spec);',
        '',
        '      return await Architect(',
        '        approach: "DDD + Microservices",',
        '        delivery: "Agile sprints",',
        '        quality: 100 /* % */',
        '      );',
        '    }',
        '  }',
        '}',
      ],
    },
    'C#': {
      filename: 'NoeXa.Core.cs',
      code: [
        '// C# Modern Features',
        'public record ProjectRequest(',
        '  string ClientName,',
        '  List<Requirement> Requirements',
        ');',
        '',
        'public class SolutionBuilder',
        '{',
        '  public async ValueTask<Result> Build(',
        '    ProjectRequest request,',
        '    CancellationToken ct)',
        '  {',
        '    var architecture = new Architecture(',
        '      Patterns: [Pattern.DDD, Pattern.CQRS]',
        '    );',
        '',
        '    return await architecture',
        '      .ExecuteAsync(request, ct);',
        '  }',
        '}',
      ],
    },
    'React.js': {
      filename: 'NoeXa.Web.tsx',
      code: [
        '// React + TypeScript',
        'interface Project {',
        '  id: string;',
        '  client: string;',
        '  status: "planning" | "dev" | "live";',
        '}',
        '',
        'export const ProjectCard: React.FC<',
        '  { project: Project }',
        '> = ({ project }) => {',
        '  const [progress, setProgress]',
        '    = useState(0);',
        '',
        '  return (',
        '    <div className="project-card">',
        '      <h3>{project.client}</h3>',
        '      <Progress value={progress} />',
        '    </div>',
        '  );',
        '};',
      ],
    },
    'Angular': {
      filename: 'noexa.service.ts',
      code: [
        '// Angular Modern',
        '@Injectable({',
        '  providedIn: "root"',
        '})',
        'export class ProjectService {',
        '  private http = inject(HttpClient);',
        '',
        '  getProjects(): Observable',
        '    <Project[]> {',
        '    return this.http',
        '      .get<Project[]>("/api/v1/projects")',
        '      .pipe(map(projects =>',
        '        projects.filter(p => p.active)',
        '      ));',
        '  }',
        '}',
      ],
    },
    'TypeScript': {
      filename: 'noexa.types.ts',
      code: [
        '// TypeScript Types',
        'type Solution = {',
        '  id: string;',
        '  architecture: ArchitectureType;',
        '  stack: readonly TechStack[];',
        '};',
        '',
        'interface Team {',
        '  lead: Engineer;',
        '  members: Engineer[];',
        '  capacity: number;',
        '}',
        '',
        'const deliver = (',
        '  team: Team,',
        '  solution: Solution',
        '): Promise<Result> => ...',
      ],
    },
    'Node.js': {
      filename: 'noexa.api.js',
      code: [
        '// Node.js Express',
        'const express = require("express");',
        'const app = express();',
        '',
        'app.get("/api/projects",',
        '  async (req, res) => {',
        '    const projects = await db.projects',
        '      .find({ status: "active" })',
        '      .limit(50)',
        '      .toArray();',
        '',
        '    res.json({ data: projects });',
        '  }',
        ');',
        '',
        'app.listen(3000, () =>',
        '  console.log("NoeXa API running");',
      ],
    },
    'MongoDB': {
      filename: 'noexa.mongo.js',
      code: [
        '// MongoDB Aggregation',
        'db.projects.aggregate([',
        '  { $match: { status: "active" } },',
        '  { $addFields: {',
        '    teamSize: { $size: "$team" }',
        '  }},',
        '  { $group: {',
        '    _id: "$client",',
        '    total: { $sum: 1 },',
        '    avgSize: { $avg: "$teamSize" }',
        '  }},',
        '  { $sort: { total: -1 } }',
        '])',
      ],
    },
    'PostgreSQL': {
      filename: 'noexa.sql',
      code: [
        '-- PostgreSQL Advanced',
        'CREATE TABLE projects (',
        '  id UUID PRIMARY KEY DEFAULT',
        '    gen_random_uuid(),',
        '  client VARCHAR(255) NOT NULL,',
        "  status project_status DEFAULT",
        "    'planning',",
        '  created_at TIMESTAMPTZ DEFAULT NOW()',
        ');',
        '',
        'CREATE INDEX idx_projects_client',
        "  ON projects(client) WHERE",
        "    status = 'active';",
      ],
    },
    'Azure': {
      filename: 'azure-deploy.bicep',
      code: [
        '// Azure Infrastructure',
        "resource webApp 'Microsoft.Web' {",
        "  name: 'noexa-api-${environment}',",
        "  location: 'West Europe',",
        "  kind: 'app',",
        '  properties: {',
        '    serverFarmId: appServicePlan.id,',
        '    httpsOnly: true,',
        '  },',
        '}',
      ],
    },
    'Docker': {
      filename: 'Dockerfile',
      code: [
        '# Multi-stage Build',
        'FROM mcr.microsoft.com/dotnet/',
        '  aspnet:6.0 AS base',
        '  WORKDIR /app',
        '  EXPOSE 80',
        '',
        'FROM mcr.microsoft.com/dotnet/',
        '  sdk:6.0 AS build',
        '  COPY ["*.csproj", "./"]',
        '  RUN dotnet restore',
        '  COPY . .',
        '  RUN dotnet publish -c Release',
      ],
    },
    'Kubernetes': {
      filename: 'k8s-deployment.yaml',
      code: [
        'apiVersion: apps/v1',
        'kind: Deployment',
        'metadata:',
        '  name: noexa-api',
        'spec:',
        '  replicas: 3',
        '  selector:',
        '    matchLabels:',
        '      app: noexa-api',
        '  template:',
        '    spec:',
        '      containers:',
        '      - name: api',
        '        image: noexa/api:latest',
        '        ports:',
        '        - containerPort: 80',
      ],
    },
    'Python': {
      filename: 'noexa_api.py',
      code: [
        '# Python FastAPI',
        'from fastapi import FastAPI, HTTPException',
        'from pydantic import BaseModel',
        '',
        'app = FastAPI(title="NoeXa API")',
        '',
        'class Project(BaseModel):',
        '    client: str',
        '    status: str',
        '',
        '@app.get("/projects")',
        'async def get_projects():',
        '    projects = await db.projects.find(',
        '      {"status": "active"}).to_list()',
        '    return {"data": projects}',
        '',
        '@app.post("/projects")',
        'async def create_project(',
        '  project: Project):',
        '    result = await db.projects.insert_one(',
        '      project.dict())',
        '    return {"id": str(result.inserted_id)}',
      ],
    },
    'Go': {
      filename: 'noexa.go',
      code: [
        '// Go Microservice',
        'package main',
        '',
        'type Project struct {',
        '  ID     string `json:"id" bson:"_id"`',
        '  Client string `json:"client" bson:"client"`',
        '  Status string `json:"status" bson:"status"`',
        '}',
        '',
        'func (s *Server) GetProjects(',
        '  w http.ResponseWriter,',
        '  r *http.Request)',
        '{',
        '  ctx := r.Context()',
        '  cursor, err := s.db.Collection(',
        '    "projects").Find(ctx, bson.M{})',
        '  if err != nil {',
        '    http.Error(w, err.Error(), 500)',
        '    return',
        '  }',
        '  var projects []Project',
        '  cursor.All(ctx, &projects)',
        '  json.NewEncoder(w).Encode(projects)',
        '}',
      ],
    },
    'Java': {
      filename: 'NoeXaService.java',
      code: [
        '// Java Spring Boot',
        '@RestController',
        '@RequestMapping("/api/v1")',
        'public class ProjectController {',
        '',
        '  @Autowired',
        '  private ProjectService projectService;',
        '',
        '  @GetMapping("/projects")',
        '  public ResponseEntity<List<Project>>',
        '    getActiveProjects() {',
        '    return ResponseEntity.ok(',
        '      projectService.findByStatus("active")',
        '    );',
        '  }',
        '',
        '  @PostMapping("/projects")',
        '  public ResponseEntity<Project>',
        '    createProject(',
        '      @RequestBody ProjectRequest req) {',
        '    Project project = new Project();',
        '    project.setClient(req.getClient());',
        '    return ResponseEntity.ok(',
        '      projectService.save(project)',
        '    );',
        '  }',
        '}',
      ],
    },
    'Rust': {
      filename: 'noexa.rs',
      code: [
        '// Rust Actix-web',
        'use actix_web::{',
        '  web, App, HttpResponse, Responder',
        '};',
        '',
        '#[derive(Serialize)]',
        'struct Project {',
        '  id: String,',
        '  client: String,',
        '  status: String,',
        '}',
        '',
        'async fn get_projects(',
        '  pool: web::Data<DbPool>',
        ') -> impl Responder {',
        '  let projects = web::block(move || {',
        '    let conn = pool.get()?;',
        '    projects::table',
        '      .filter(status.eq("active"))',
        '      .load::<Project>(&conn)',
        '  })',
        '',
        '  match projects {',
        '    Ok(p) => HttpResponse::Ok().json(p),',
        '    Err(e) => HttpResponse::InternalServerError()',
        '      .body(e.to_string()),',
        '  }',
        '}',
      ],
    },
    'SQL': {
      filename: 'queries.sql',
      code: [
        '-- Advanced SQL Queries',
        'SELECT',
        '  c.name AS client,',
        '  COUNT(p.id) AS project_count,',
        '  SUM(p.budget) AS total_budget,',
        '  AVG(p.completion_pct) AS avg_completion',
        'FROM clients c',
        'JOIN projects p ON c.id = p.client_id',
        "WHERE p.status IN ('active', 'live')",
        'GROUP BY c.id, c.name',
        'HAVING COUNT(p.id) > 3',
        'ORDER BY total_budget DESC',
        'LIMIT 20;',
        '',
        '-- Window Functions',
        'SELECT',
        '  project_name,',
        '  client,',
        '  budget,',
        '  ROW_NUMBER() OVER (',
        '    PARTITION BY client',
        '    ORDER BY budget DESC',
        '  ) AS rank_in_client',
        'FROM projects;',
      ],
    },
    'PHP': {
      filename: 'NoeXaController.php',
      code: [
        '<?php',
        '// Laravel Controller',
        'namespace App\\Http\\Controllers;',
        '',
        'use App\\Models\\Project;',
        'use Illuminate\\Http\\Request;',
        '',
        'class ProjectController extends Controller',
        '{',
        '    public function index()',
        '    {',
        '        $projects = Project::where(',
        "          'status', 'active')",
        "          ->with(['client', 'team'])",
        "          ->orderBy('created_at', 'desc')",
        '          ->paginate(20);',
        '',
        '        return response()->json([',
        "          'data' => $projects",
        '        ]);',
        '    }',
        '',
        '    public function store(Request $request)',
        '    {',
        '        $validated = $request->validate([',
        "          'client_id' => 'required|exists:clients,id',",
        "          'name' => 'required|string|max:255',",
        "          'budget' => 'required|numeric|min:0',",
        '        ]);',
        '',
        '        $project = Project::create(',
        '          $validated',
        '        );',
        '',
        '        return response()->json([',
        "          'data' => $project,",
        "          'message' => 'Project created'",
        '        ], 201);',
        '    }',
        '}',
      ],
    },
  }

  const currentCode = codeExamples[selectedTech] || codeExamples['.NET 6+']

  // Typing animation with proper cleanup
  useEffect(() => {
    setDisplayedCode([])
    const lines = currentCode.code
    let index = 0
    let cancelled = false
    let timer: ReturnType<typeof setTimeout>

    const typeNext = () => {
      if (cancelled || index >= lines.length) return
      setDisplayedCode(prev => [...prev, lines[index]])
      index++
      timer = setTimeout(typeNext, 30)
    }
    timer = setTimeout(typeNext, 30)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [selectedTech])

  // Interactive IDE helper handlers
  const handleCopyCode = async () => {
    try {
      const codeString = currentCode.code.join('\n')
      await navigator.clipboard.writeText(codeString)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const handleRunCode = () => {
    if (isCompiling) return
    setIsConsoleOpen(true)
    setIsCompiling(true)
    setConsoleLogs([])
    
    const logs = mockTerminalLogs[selectedTech] || ['Running task...']
    let lineIndex = 0
    
    const printNextLine = () => {
      if (lineIndex >= logs.length) {
        setIsCompiling(false)
        return
      }
      setConsoleLogs(prev => [...prev, logs[lineIndex]])
      lineIndex++
      setTimeout(printNextLine, 350 + Math.random() * 250) // Compilation delay interval
    }
    
    printNextLine()
  }

  // GSAP ScrollTrigger with proper cleanup
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
        const trigger = gsap.fromTo(el,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.75, ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        )
        scrollTriggerRefs.current.push(trigger.scrollTrigger!)
      })
    })

    return () => {
      scrollTriggerRefs.current.forEach(st => st.kill())
      scrollTriggerRefs.current = []
      ctx.revert()
    }
  }, [])

  // Stats with animated counters
  const stats = [
    { id: 'stat1', target: 10000000, suffix: '€', label: 'Revenue Generated' },
    { id: 'stat2', target: 200, suffix: '+', label: 'Successful Projects' },
    { id: 'stat3', target: 20, suffix: '+', label: 'Years of Expertise' },
    { id: 'stat4', target: 15, suffix: '%', label: 'Annual Growth Rate' },
    { id: 'stat5', target: 14, suffix: '', label: 'Nationalities' },
  ]

  const { ref: statsRef, inView: statsInView } = useInView(0.3)

  // Form handling
  const handleFormChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors(prev => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}
    if (!formData.firstName.trim()) errors.firstName = 'First name is required'
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required'
    if (!formData.email.trim()) errors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Invalid email format'
    if (!formData.message.trim()) errors.message = 'Message is required'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setFormStatus('sending')
    try {
      const mailtoLink = `mailto:info@noexa.pt?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
        `Name: ${formData.firstName} ${formData.lastName}\nEmail: ${formData.email}\n\n${formData.message}`
      )}`
      window.location.href = mailtoLink
      setFormStatus('sent')
      setFormData({ firstName: '', lastName: '', email: '', subject: '', message: '' })
      setTimeout(() => setFormStatus('idle'), 4000)
    } catch {
      setFormStatus('error')
      setTimeout(() => setFormStatus('idle'), 4000)
    }
  }

  return (
    <>
      {!isMobile && (
        <>
          <div className="cursor" ref={cursorRef}></div>
          <div className="cursor-ring" ref={ringRef}></div>
        </>
      )}
      <div className="grid-overlay"></div>

      {/* NAV */}
      <nav className={`${scrolled ? 'scrolled' : ''} ${isMobileMenuOpen ? 'menu-open' : ''}`}>
        <div className="nav-inner">
          <a href="#" className="nav-logo" aria-label="NoeXa Home">
            <img src="https://noexa.pt/wp-content/uploads/2024/12/logo-noexa-it-solutions-1.png" alt="NoeXa IT Solutions" />
          </a>
          <ul className="nav-links" role="navigation">
            <li><a href="#services">What we do?</a></li>
            <li><a href="#about">Get to know us</a></li>
            <li><a href="#careers">There’s a place for you</a></li>
            <li><a href="#contact">Get in contact</a></li>
          </ul>
          
          <div className="nav-right">
            <a href="#careers" className="nav-cta">Join Us →</a>
            <button 
              className="mobile-menu-btn" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-grid"></div>
        <div className="mobile-menu-inner">
          <ul className="mobile-menu-links">
            <li><a href="#services" onClick={() => setIsMobileMenuOpen(false)}>What we do?</a></li>
            <li><a href="#about" onClick={() => setIsMobileMenuOpen(false)}>Get to know us</a></li>
            <li><a href="#careers" onClick={() => setIsMobileMenuOpen(false)}>There’s a place for you</a></li>
            <li><a href="#contact" onClick={() => setIsMobileMenuOpen(false)}>Get in contact</a></li>
          </ul>
          <a href="#careers" className="mobile-menu-cta" onClick={() => setIsMobileMenuOpen(false)}>Join Us →</a>
        </div>
      </div>

      {/* HERO */}
      <section id="hero" aria-label="Hero section">
        <video className="hero-bg-video" autoPlay muted loop playsInline>
          <source src="https://noexa.pt/wp-content/uploads/2024/12/home-mainbannerslider-s1-0002.mp4" type="video/mp4" />
        </video>
        <div className="hero-bg-overlay"></div>
        <div className="hero-grid-overlay"></div>
        <div className="hero-inner">
          <div className="hero-content">
            <div className="hero-tag" style={{ opacity: 1 }}>Member of Xrxes Holding · Lisbon, PT</div>
            <h1 className="hero-h1">
              <span className="line">Develop a World</span>
              <span className="line">of <span className="grad">Solutions.</span></span>
            </h1>
            <p className="hero-sub">Twenty years crafting digital solutions for the real world. Custom software, dedicated teams, and enterprise-grade support from Lisbon to the globe.</p>
            <div className="hero-actions">
              <a href="#services" className="btn-primary">Explore Services</a>
              <a href="#about" className="btn-ghost">Our Story</a>
            </div>
          </div>
        </div>
        <div className="hero-scroll">
          <span>Scroll</span>
          <div className="scroll-line"></div>
        </div>
      </section>

      {/* STATS BAR */}
      <div className="stats-bar" ref={statsRef}>
        <div className="stats-inner">
          {stats.map((stat, i) => (
            <div className="stat-item" key={stat.id}>
              <div className="stat-number" id={stat.id}>
                {statsInView ? <AnimatedStat target={stat.target} suffix={stat.suffix} delay={i * 200} /> : '0'}
              </div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SERVICES */}
      <section id="services" aria-label="Services">
        <div className="section-inner">
          <div className="section-eyebrow reveal">What We Do</div>
          <h2 className="section-title reveal">Tailor-made digital<br />innovative solutions.</h2>
          <p className="section-sub reveal">We engineer software that drives real-world transformation — from greenfield builds to complex enterprise integrations.</p>
          <div className="services-grid">
            <div className="service-card reveal">
              <div className="service-icon">
                <svg viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
              </div>
              <div className="service-num">01 — </div>
              <div className="service-name">Software Development</div>
              <p className="service-desc">We craft innovative, customized software solutions — from microservices architecture to complex enterprise platforms — engineered for scale, performance, and maintainability.</p>
              <a href="#contact" className="service-arrow">Get a project quote →</a>
            </div>
            <div className="service-card reveal">
              <div className="service-icon">
                <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              </div>
              <div className="service-num">02 — </div>
              <div className="service-name">Dedicated Teams</div>
              <p className="service-desc">Our skilled teams integrate seamlessly into your workflows. Senior engineers, QA specialists, and project managers that operate as true extensions of your organization.</p>
              <a href="#contact" className="service-arrow">Build your team →</a>
            </div>
            <div className="service-card reveal">
              <div className="service-icon">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              </div>
              <div className="service-num">03 — </div>
              <div className="service-name">Support & Maintenance</div>
              <p className="service-desc">Reliable, responsive support to keep your operations running smoothly. SLA-backed agreements, 24/7 monitoring, incident response, and continuous improvement cycles.</p>
              <a href="#contact" className="service-arrow">View SLA options →</a>
            </div>
          </div>
        </div>
      </section>

      {/* TECH STACK */}
      <section id="tech" aria-label="Tech Stack">
        <div className="tech-inner">
          <div className="tech-info-column">
            <div className="section-eyebrow reveal">Tech Stack</div>
            <h2 className="section-title reveal">Built with the tools that matter.</h2>
            <p className="section-sub reveal">Our engineers work across the full stack — cloud-native, microservices, and modern CI/CD pipelines.</p>
            
            {/* Category tabs */}
            <div className="tech-filters reveal">
              {['All', 'Backend', 'Frontend', 'Database', 'DevOps & Cloud'].map((category) => (
                <button
                  key={category}
                  className={`tech-filter-tab ${activeCategory === category ? 'active' : ''}`}
                  onClick={() => {
                    setActiveCategory(category)
                    const filtered = Object.keys(codeExamples).filter(
                      tag => category === 'All' || techCategories[tag] === category
                    )
                    if (filtered.length > 0 && !filtered.includes(selectedTech)) {
                      setSelectedTech(filtered[0])
                    }
                  }}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Sub tech tags */}
            <div className="tech-tags reveal">
              {Object.keys(codeExamples)
                .filter(tag => activeCategory === 'All' || techCategories[tag] === activeCategory)
                .map((tag) => (
                  <span
                    className={`tech-tag ${selectedTech === tag ? 'active' : ''}`}
                    key={tag}
                    onClick={() => setSelectedTech(tag)}
                    onKeyDown={(e) => e.key === 'Enter' && setSelectedTech(tag)}
                    role="button"
                    tabIndex={0}
                  >
                    {tag}
                  </span>
                ))}
            </div>
          </div>

          <div className="tech-editor-column">
            <div className="ide-window reveal">
              {/* Titlebar */}
              <div className="ide-titlebar">
                <div className="ide-dots">
                  <div className="dot r"></div>
                  <div className="dot y"></div>
                  <div className="dot g"></div>
                </div>
                
                {/* Horizontal tabs */}
                <div className="ide-tabs">
                  <div className="ide-tab active">
                    <FileCode size={14} className={`ide-tab-icon ext-${currentCode.filename.split('.').pop()}`} />
                    <span className="ide-tab-name">{currentCode.filename}</span>
                  </div>
                  {/* Supplemental document tab */}
                  <div className="ide-tab inactive">
                    <FileText size={14} className="ide-tab-icon ext-txt" />
                    <span className="ide-tab-name">README.md</span>
                  </div>
                </div>

                {/* Quick actions on the right */}
                <div className="ide-actions">
                  <button 
                    className={`ide-action-btn copy-btn ${isCopied ? 'copied' : ''}`} 
                    onClick={handleCopyCode}
                    title="Copy Code"
                  >
                    {isCopied ? <Check size={14} className="success-icon" /> : <Copy size={14} />}
                  </button>
                  <button 
                    className={`ide-action-btn run-btn ${isCompiling ? 'running' : ''}`}
                    onClick={handleRunCode}
                    title="Run Code"
                  >
                    <Play size={14} />
                  </button>
                </div>
              </div>

              {/* Workspace */}
              <div className="ide-workspace">
                {/* Activity Bar */}
                <div className="ide-activity-bar">
                  <button className="ide-act-btn active" title="Explorer">
                    <Code2 size={18} />
                  </button>
                  <button className="ide-act-btn" title="Search">
                    <SearchIcon size={18} />
                  </button>
                  <button className="ide-act-btn" title="Source Control">
                    <GitBranch size={18} />
                  </button>
                  <button className="ide-act-btn" title="DevOps Console" onClick={() => setIsConsoleOpen(!isConsoleOpen)}>
                    <TerminalIcon size={18} />
                  </button>
                </div>

                {/* Sidebar File Explorer */}
                <div className="ide-sidebar">
                  <div className="ide-sidebar-title">EXPLORER: NOEXA</div>
                  <div className="ide-tree">
                    {fileExplorer.map((folder) => {
                      const isFolderVisible = activeCategory === 'All' || folder.name === activeCategory.toLowerCase().replace('devops & cloud', 'devops')
                      return (
                        <div className={`ide-tree-folder ${isFolderVisible ? 'expanded' : 'collapsed'}`} key={folder.name}>
                          <div className="ide-tree-folder-title">
                            <Folder size={13} className="folder-icon" />
                            <span>{folder.name}</span>
                          </div>
                          <div className="ide-tree-folder-files">
                            {folder.children.map((child) => {
                              const isActiveFile = selectedTech === child.tech
                              const isChildMatchingFilter = activeCategory === 'All' || techCategories[child.tech] === activeCategory
                              if (!isChildMatchingFilter) return null
                              return (
                                <div 
                                  key={child.name} 
                                  className={`ide-tree-file ${isActiveFile ? 'active' : ''}`}
                                  onClick={() => setSelectedTech(child.tech)}
                                >
                                  <FileCode size={12} className={`file-icon ext-${child.name.split('.').pop()}`} />
                                  <span>{child.name}</span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Code Editor */}
                <div className="ide-editor">
                  <div className="ide-lines">
                    {displayedCode.map((_, idx) => (
                      <span key={idx} className="ide-line-num">{idx + 1}</span>
                    ))}
                  </div>
                  <div className="ide-code-body">
                    {displayedCode.map((line, i) => (
                      <div key={i} className="ide-code-line">
                        {highlightCode(line)}
                      </div>
                    ))}
                    {displayedCode.length === 0 && <div className="ide-cursor-blink">|</div>}
                  </div>
                </div>

                {/* Console terminal output */}
                <div className={`ide-terminal ${isConsoleOpen ? 'open' : ''}`}>
                  <div className="ide-terminal-header">
                    <div className="ide-terminal-title">
                      <TerminalIcon size={12} style={{ marginRight: '6px' }} />
                      <span>TERMINAL — bash</span>
                    </div>
                    <button className="ide-terminal-close" onClick={() => setIsConsoleOpen(false)}>
                      <X size={12} />
                    </button>
                  </div>
                  <div className="ide-terminal-body">
                    {consoleLogs.map((log, i) => (
                      <div key={i} className={`ide-terminal-log ${log.startsWith('$') ? 'command' : log.includes('SUCCESS') || log.includes('successful') || log.includes('successful!') || log.includes('complete') ? 'success' : 'info'}`}>
                        {log}
                      </div>
                    ))}
                    {isCompiling && (
                      <div className="ide-terminal-prompt">
                        <span className="prompt-symbol">$</span>
                        <span className="terminal-cursor">█</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <AboutFeatures />

      {/* TEAM QUOTES */}
      <section id="team" aria-label="Team testimonials">
        <div className="section-inner">
          <div className="section-eyebrow reveal">Our People</div>
          <h2 className="section-title reveal">Built by those who believe in it.</h2>
          <div className="quotes-grid">
            <div className="quote-card reveal">
              <div className="quote-mark">"</div>
              <p className="quote-text">Being part of Noexa's foundation from the ground up has been a great challenge — but entirely possible with the right energy and dedication. It is an outstanding privilege to contribute actively to a brighter future.</p>
              <div className="quote-author">
                <div className="quote-avatar">JM</div>
                <div>
                  <div className="quote-name">João Moreira</div>
                  <div className="quote-role">Head of ITWS</div>
                </div>
              </div>
            </div>
            <div className="quote-card reveal">
              <div className="quote-mark">"</div>
              <p className="quote-text">Beyond the broad portfolio that Xrxes provides, the opportunity to engage in governmental projects — where your dedication directly influences the lives of many — represents an ideal mission-driven role.</p>
              <div className="quote-author">
                <div className="quote-avatar" style={{ background: 'linear-gradient(135deg,#7c4dff,#b39ddb)' }}>AR</div>
                <div>
                  <div className="quote-name">Admir Rashidi</div>
                  <div className="quote-role">Project Manager</div>
                </div>
              </div>
            </div>
            <div className="quote-card reveal">
              <div className="quote-mark">"</div>
              <p className="quote-text">I started as a project assistant. Now I am a Senior Project Manager. Xrxes is definitely the best company to grow — a great team and fascinating projects in the public sector.</p>
              <div className="quote-author">
                <div className="quote-avatar" style={{ background: 'linear-gradient(135deg,#27c93f,#00e5ff)' }}>JS</div>
                <div>
                  <div className="quote-name">Jasmin Schöller</div>
                  <div className="quote-role">Senior Project Manager</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CAREERS */}
      <section id="careers" aria-label="Open positions">
        <div className="section-inner">
          <div className="section-eyebrow reveal">Open Positions</div>
          <h2 className="section-title reveal">There's a place for you.</h2>
          <p className="section-sub reveal">Join a team building real solutions for real-world impact. Lisbon-based, globally minded — hybrid model, 2–3 days in office.</p>
          <div className="jobs-list reveal">
            {[
              { title: 'Senior Full-Stack Developer (.NET + React)', tags: ['Lisbon', 'Full-Time'], tech: '.NET 6+ · C# · React · Angular' },
              { title: 'Senior Full-Stack Developer (JS / TypeScript)', tags: ['Lisbon', 'Full-Time'], tech: 'Node.js · React · MongoDB · Azure' },
              { title: 'Senior QA Engineer', tags: ['Lisbon', 'Full-Time'], tech: 'Cypress · Playwright · Selenium' },
              { title: 'Mid-Senior Front-End Developer', tags: ['Lisbon', 'Full-Time'], tech: 'TypeScript · React · Stencil · Web Components' },
            ].map((job, i) => (
              <div key={i}>
                <div
                  className="job-item"
                  onClick={() => setExpandedJob(expandedJob === i ? null : i)}
                  onKeyDown={(e) => e.key === 'Enter' && setExpandedJob(expandedJob === i ? null : i)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={expandedJob === i}
                >
                  <div className="job-left">
                    <div className="job-title">{job.title}</div>
                    <div className="job-meta">
                      {job.tags.map((tag, j) => (
                        <span className={`job-tag ${tag === 'Lisbon' ? 'tag-lisbon' : 'tag-ft'}`} key={j}>{tag}</span>
                      ))}
                      <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{job.tech}</span>
                    </div>
                  </div>
                  <div className="job-arrow" style={{ transform: expandedJob === i ? 'rotate(90deg)' : 'rotate(0)' }}>→</div>
                </div>
                <div className={`job-details ${expandedJob === i ? 'expanded' : ''}`}>
                  {jobDetails[i] && (
                    <>
                      <p className="job-description">{jobDetails[i].description}</p>
                      <div className="job-section">
                        <h4>Responsibilities</h4>
                        <ul>
                          {jobDetails[i].responsibilities.map((resp, j) => (
                            <li key={j}>{resp}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="job-section">
                        <h4>Skills & Requirements</h4>
                        <ul>
                          {jobDetails[i].skills.map((skill, j) => (
                            <li key={j}>{skill}</li>
                          ))}
                        </ul>
                      </div>
                      <p className="job-cta">Are you ready to change the future?</p>
                      <p className="job-contact">If you are looking for a challenging opportunity in a growing international company, please send your updated CV and cover letter to <a href="mailto:recruitment@noexa.pt">recruitment@noexa.pt</a>. We look forward to hearing from you!</p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <a href="mailto:recruitment@noexa.pt" className="btn-primary" style={{ display: 'inline-block' }}>Send CV to recruitment@noexa.pt</a>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" aria-label="Contact form">
        <div className="contact-inner">
          <div>
            <div className="section-eyebrow reveal">Get in Contact</div>
            <h2 className="section-title reveal">Let's build something together.</h2>
            <p className="section-sub reveal">Choose the channel that fits you best. We're available working days, 09:00–18:00 WET.</p>
            <div className="contact-methods">
              <div className="contact-method reveal">
                <div className="contact-icon">
                  <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.69 3.4 2 2 0 0 1 3.68 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                </div>
                <div>
                  <div className="contact-label">Phone</div>
                  <div className="contact-value">+351 962 292 003</div>
                </div>
              </div>
              <div className="contact-method reveal">
                <div className="contact-icon">
                  <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                </div>
                <div>
                  <div className="contact-label">Email</div>
                  <div className="contact-value">info@noexa.pt</div>
                </div>
              </div>
              <div className="contact-method reveal">
                <div className="contact-icon">
                  <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                </div>
                <div>
                  <div className="contact-label">Address</div>
                  <div className="contact-value">Edifício IDB Lisbon · Praça José Queirós Nº1, 1800-237 Lisboa</div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="section-eyebrow reveal" style={{ marginTop: 0 }}>Send a Message</div>
            <form className="contact-form reveal" onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    id="firstName"
                    type="text"
                    placeholder="João"
                    value={formData.firstName}
                    onChange={e => handleFormChange('firstName', e.target.value)}
                    aria-invalid={!!formErrors.firstName}
                    aria-describedby={formErrors.firstName ? 'firstName-error' : undefined}
                  />
                  {formErrors.firstName && <span id="firstName-error" style={{ color: '#e53e3e', fontSize: '0.75rem', marginTop: '0.25rem' }}>{formErrors.firstName}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    id="lastName"
                    type="text"
                    placeholder="Silva"
                    value={formData.lastName}
                    onChange={e => handleFormChange('lastName', e.target.value)}
                    aria-invalid={!!formErrors.lastName}
                  />
                  {formErrors.lastName && <span style={{ color: '#e53e3e', fontSize: '0.75rem', marginTop: '0.25rem' }}>{formErrors.lastName}</span>}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="joao@company.pt"
                  value={formData.email}
                  onChange={e => handleFormChange('email', e.target.value)}
                  aria-invalid={!!formErrors.email}
                />
                {formErrors.email && <span style={{ color: '#e53e3e', fontSize: '0.75rem', marginTop: '0.25rem' }}>{formErrors.email}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <select
                  id="subject"
                  value={formData.subject}
                  onChange={e => handleFormChange('subject', e.target.value)}
                >
                  <option value="">Select a subject...</option>
                  <option>Software Development Project</option>
                  <option>Dedicated Team</option>
                  <option>Support Contract</option>
                  <option>Careers</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  placeholder="Tell us about your project..."
                  value={formData.message}
                  onChange={e => handleFormChange('message', e.target.value)}
                  aria-invalid={!!formErrors.message}
                />
                {formErrors.message && <span style={{ color: '#e53e3e', fontSize: '0.75rem', marginTop: '0.25rem' }}>{formErrors.message}</span>}
              </div>
              {formStatus === 'sent' && (
                <div style={{ padding: '0.75rem', background: '#f0fff4', border: '1px solid #9ae6b4', borderRadius: '4px', color: '#276749', fontSize: '0.875rem' }}>
                  ✓ Message sent successfully! We'll get back to you soon.
                </div>
              )}
              {formStatus === 'error' && (
                <div style={{ padding: '0.75rem', background: '#fff5f5', border: '1px solid #feb2b2', borderRadius: '4px', color: '#9b2c2c', fontSize: '0.875rem' }}>
                  ✗ Something went wrong. Please try again or email us directly.
                </div>
              )}
              <button
                className="form-submit"
                type="submit"
                disabled={formStatus === 'sending'}
              >
                {formStatus === 'sending' ? 'Sending...' : 'Send Message →'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-inner">
          <div className="footer-logo">
            <img src="https://noexa.pt/wp-content/uploads/2024/12/logo-noexa-it-solutions-1.png" alt="NoeXa" />
          </div>
          <div className="footer-copy">© 2026 NoeXa IT Solutions · Member of Xrxes Holding</div>
          <div className="footer-links">
            <a href="#services">Services</a>
            <a href="#careers">Careers</a>
            <a href="#contact">Contact</a>
            <a href="https://www.linkedin.com/company/noexa-it-solutions/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
      </footer>
    </>
  )
}

/* ============== CODE HIGHLIGHTER ============== */
function highlightCode(line: string) {
  if (!line) return <span>&nbsp;</span>
  const indentMatch = line.match(/^(\s*)/)
  const indent = indentMatch ? indentMatch[1] : ''
  const content = line.slice(indent.length)
  if (!content.trim()) return <span>&nbsp;</span>

  // Complete comments
  if (content.startsWith('//') || content.startsWith('#') || content.startsWith('--') || content.startsWith('/*') || content.startsWith('*') || content.startsWith('*/')) {
    return (
      <span style={{ paddingLeft: `${indent.length}ch` }}>
        <span className="c-cm">{content}</span>
      </span>
    )
  }

  // Token regex for multiline matching keywords, types, strings, numbers, punctuation
  const tokenRegex = /(\/\/.*|#.*|--.*|"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|`(?:\\`|[^`])*`|\b(?:public|private|protected|namespace|class|interface|type|const|let|var|export|import|from|return|async|await|new|def|func|use|package|struct|enum|impl|trait|self|Self|virtual|override|readonly|get|set|fn|void|string|int|double|float|bool|boolean|char|null|true|false)\b|\b\d+\b|\b[A-Z]\w*\b|\b\w+(?=\()|[{}()\[\].,:;+\-*\/&|=!<>?%^~])/g

  let lastIndex = 0
  const spans: React.ReactNode[] = []
  let match: RegExpExecArray | null

  while ((match = tokenRegex.exec(content)) !== null) {
    const textBefore = content.substring(lastIndex, match.index)
    if (textBefore) {
      spans.push(<span key={`text-${lastIndex}`}>{textBefore}</span>)
    }

    const token = match[0]
    let className = ''

    if (token.startsWith('//') || token.startsWith('#') || token.startsWith('--')) {
      className = 'c-cm'
    } else if (token.startsWith('"') || token.startsWith("'") || token.startsWith('`')) {
      className = 'c-str'
    } else if (/^\d+$/.test(token)) {
      className = 'c-num'
    } else if (/^(public|private|protected|namespace|class|interface|type|const|let|var|export|import|from|return|async|await|new|def|func|use|package|struct|enum|impl|trait|self|Self|fn)$/.test(token)) {
      className = 'c-kw'
    } else if (/^(void|string|int|double|float|bool|boolean|char|null|true|false)$/.test(token)) {
      className = 'c-type'
    } else if (/^[A-Z]\w*$/.test(token)) {
      className = 'c-class'
    } else if (content[match.index + token.length] === '(') {
      className = 'c-fn'
    }

    spans.push(
      <span key={`token-${match.index}`} className={className}>
        {token}
      </span>
    )

    lastIndex = tokenRegex.lastIndex
  }

  const textAfter = content.substring(lastIndex)
  if (textAfter) {
    spans.push(<span key="text-end">{textAfter}</span>)
  }

  return (
    <span style={{ paddingLeft: `${indent.length}ch` }}>
      {spans.length > 0 ? spans : content}
    </span>
  )
}

/* ============== ANIMATED STAT COMPONENT ============== */
function AnimatedStat({ target, suffix, delay }: { target: number; suffix: string; delay: number }) {
  const [value, setValue] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true

    const start = performance.now() + delay
    const duration = 2500

    const tick = (now: number) => {
      if (now < start) { requestAnimationFrame(tick); return }
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(Math.floor(eased * target))
      if (p < 1) requestAnimationFrame(tick)
      else setValue(target)
    }
    requestAnimationFrame(tick)
  }, [target, delay])

  return <>{formatStat(value, target)}{suffix && <span>{suffix}</span>}</>
}

export default App
