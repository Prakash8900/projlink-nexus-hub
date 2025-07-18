import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Project {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'project' | 'webapp';
  tags: string[];
}

interface AddProjectDialogProps {
  onAdd: (project: Omit<Project, 'id'>) => void;
  editProject?: Project;
  onEdit?: (project: Project) => void;
}

export const AddProjectDialog = ({ onAdd, editProject, onEdit }: AddProjectDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(editProject?.title || "");
  const [description, setDescription] = useState(editProject?.description || "");
  const [url, setUrl] = useState(editProject?.url || "");
  const [type, setType] = useState<'project' | 'webapp'>(editProject?.type || 'project');
  const [tagsInput, setTagsInput] = useState(editProject?.tags.join(', ') || "");
  const { toast } = useToast();

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setUrl("");
    setType('project');
    setTagsInput("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !url.trim()) {
      toast({
        title: "Error",
        description: "Title and URL are required fields.",
        variant: "destructive",
      });
      return;
    }

    const tags = tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const projectData = {
      title: title.trim(),
      description: description.trim(),
      url: url.trim(),
      type,
      tags,
    };

    if (editProject && onEdit) {
      onEdit({ ...projectData, id: editProject.id });
      toast({
        title: "Success",
        description: "Project updated successfully!",
      });
    } else {
      onAdd(projectData);
      toast({
        title: "Success",
        description: "Project added successfully!",
      });
    }

    resetForm();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {editProject ? (
          <Button variant="ghost" size="sm">
            Edit
          </Button>
        ) : (
          <Button variant="hero" className="gap-2">
            <Plus className="h-4 w-4" />
            Add New Link
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-gradient-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            {editProject ? 'Edit Project' : 'Add New Project Link'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={(value: 'project' | 'webapp') => setType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="project">Project</SelectItem>
                <SelectItem value="webapp">Web App</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter project title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of your project"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL *</Label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="React, Next.js, TypeScript (comma separated)"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" variant="hero" className="flex-1">
              {editProject ? 'Update' : 'Add'} Project
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};