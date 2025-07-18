import { useState, useEffect } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import { AddProjectDialog } from "@/components/AddProjectDialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Link2, Code, Globe, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Project {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'project' | 'webapp';
  tags: string[];
}

const Index = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const { toast } = useToast();

  // Load projects from localStorage on component mount
  useEffect(() => {
    const savedProjects = localStorage.getItem('projectLinks');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  // Save projects to localStorage whenever projects change
  useEffect(() => {
    localStorage.setItem('projectLinks', JSON.stringify(projects));
  }, [projects]);

  const addProject = (projectData: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...projectData,
      id: crypto.randomUUID(),
    };
    setProjects(prev => [...prev, newProject]);
  };

  const editProject = (updatedProject: Project) => {
    setProjects(prev => 
      prev.map(project => 
        project.id === updatedProject.id ? updatedProject : project
      )
    );
    setEditingProject(undefined);
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
    toast({
      title: "Deleted",
      description: "Project link has been removed.",
    });
  };

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const projectCount = filteredProjects.filter(p => p.type === 'project').length;
  const webappCount = filteredProjects.filter(p => p.type === 'webapp').length;

  return (
    <div className="min-h-screen bg-gradient-secondary">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/5 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg shadow-glow">
                <Link2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  ProjLink Nexus
                </h1>
                <p className="text-muted-foreground">
                  Your personal project & web app portfolio
                </p>
              </div>
            </div>
            <AddProjectDialog onAdd={addProject} />
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background/50 border-border/50"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {projects.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="p-4 bg-gradient-primary rounded-full w-16 h-16 mx-auto mb-4 shadow-glow">
              <Sparkles className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Ready to showcase your work?</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Add your first project or web app link to get started. Build your personal portfolio hub!
            </p>
            <AddProjectDialog onAdd={addProject} />
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-8 bg-background/50">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <span>All</span>
                <span className="bg-muted text-muted-foreground px-1.5 py-0.5 rounded text-xs">
                  {filteredProjects.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="project" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                <span>Projects</span>
                <span className="bg-muted text-muted-foreground px-1.5 py-0.5 rounded text-xs">
                  {projectCount}
                </span>
              </TabsTrigger>
              <TabsTrigger value="webapp" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span>Web Apps</span>
                <span className="bg-muted text-muted-foreground px-1.5 py-0.5 rounded text-xs">
                  {webappCount}
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    {...project}
                    onEdit={(id) => {
                      const projectToEdit = projects.find(p => p.id === id);
                      setEditingProject(projectToEdit);
                    }}
                    onDelete={deleteProject}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="project">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects
                  .filter(project => project.type === 'project')
                  .map((project) => (
                    <ProjectCard
                      key={project.id}
                      {...project}
                      onEdit={(id) => {
                        const projectToEdit = projects.find(p => p.id === id);
                        setEditingProject(projectToEdit);
                      }}
                      onDelete={deleteProject}
                    />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="webapp">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects
                  .filter(project => project.type === 'webapp')
                  .map((project) => (
                    <ProjectCard
                      key={project.id}
                      {...project}
                      onEdit={(id) => {
                        const projectToEdit = projects.find(p => p.id === id);
                        setEditingProject(projectToEdit);
                      }}
                      onDelete={deleteProject}
                    />
                  ))}
              </div>
            </TabsContent>

            {filteredProjects.length === 0 && searchTerm && (
              <div className="text-center py-16">
                <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No projects found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or add a new project.
                </p>
              </div>
            )}
          </Tabs>
        )}
      </div>

      {/* Edit Dialog */}
      {editingProject && (
        <AddProjectDialog
          editProject={editingProject}
          onEdit={editProject}
          onAdd={() => {}} // Not used in edit mode
        />
      )}
    </div>
  );
};

export default Index;
