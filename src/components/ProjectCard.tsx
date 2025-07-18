import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Edit, Trash2, Globe, Code } from "lucide-react";

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'project' | 'webapp';
  tags?: string[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ProjectCard = ({ 
  id, 
  title, 
  description, 
  url, 
  type, 
  tags = [], 
  onEdit, 
  onDelete 
}: ProjectCardProps) => {
  const handleOpen = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="group bg-gradient-card border-border/50 hover:border-primary/50 hover:shadow-glow transition-all duration-300 animate-scale-in">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {type === 'project' ? (
              <Code className="h-5 w-5 text-primary" />
            ) : (
              <Globe className="h-5 w-5 text-primary-glow" />
            )}
            <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {title}
            </CardTitle>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(id)}
              className="h-8 w-8 p-0 hover:bg-muted"
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(id)}
              className="h-8 w-8 p-0 hover:bg-destructive/20 hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-muted rounded-md text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <Button
          onClick={handleOpen}
          variant="hero"
          className="w-full group/btn"
        >
          <ExternalLink className="h-4 w-4 mr-2 group-hover/btn:translate-x-0.5 transition-transform" />
          Open {type === 'project' ? 'Project' : 'Web App'}
        </Button>
      </CardContent>
    </Card>
  );
};