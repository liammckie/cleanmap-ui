
/**
 * Documentation Structure View Component
 */
import { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DocumentationNode } from "@/utils/documentationManager";
import { ChevronDown, ChevronRight, FileText, Folder } from 'lucide-react';

interface StructureViewProps {
  structure: DocumentationNode[];
  basePath?: string;
}

/**
 * Renders a tree view of the application structure
 */
export function DocumentationStructureView({ structure, basePath = '' }: StructureViewProps) {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});

  const toggleNode = (path: string) => {
    setExpandedNodes(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const renderNode = (node: DocumentationNode, currentPath: string) => {
    const fullPath = `${currentPath}/${node.name}`;
    const isExpanded = expandedNodes[fullPath] || false;
    
    if (node.type === 'file') {
      return (
        <div key={fullPath} className="pl-4 py-1">
          <div className="flex items-center">
            <FileText size={16} className="text-gray-500 mr-2" />
            <span>{node.name}</span>
            {node.isComponent && (
              <Badge variant="outline" className="ml-2">Component</Badge>
            )}
            {node.isHook && (
              <Badge variant="secondary" className="ml-2">Hook</Badge>
            )}
          </div>
        </div>
      );
    }
    
    return (
      <Collapsible
        key={fullPath}
        open={isExpanded}
        onOpenChange={() => toggleNode(fullPath)}
        className="pl-4"
      >
        <div className="flex items-center py-1">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="p-0 h-auto">
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </Button>
          </CollapsibleTrigger>
          <Folder size={16} className="text-blue-500 mr-2" />
          <span className="font-medium">{node.name}</span>
          {node.children && (
            <Badge variant="outline" className="ml-2 text-xs">
              {node.children.length} {node.children.length === 1 ? 'item' : 'items'}
            </Badge>
          )}
        </div>
        
        <CollapsibleContent>
          {node.children && node.children.map(childNode => 
            renderNode(childNode, fullPath)
          )}
        </CollapsibleContent>
      </Collapsible>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Structure</CardTitle>
        <CardDescription>
          Visual representation of the application file structure
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md p-4">
          {structure.map(node => renderNode(node, basePath))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setExpandedNodes({})}>
          Collapse All
        </Button>
        <Button variant="destructive" onClick={() => {
          const allExpanded: Record<string, boolean> = {};
          const expandAll = (nodes: DocumentationNode[], path: string) => {
            nodes.forEach(node => {
              const fullPath = `${path}/${node.name}`;
              allExpanded[fullPath] = true;
              if (node.children) {
                expandAll(node.children, fullPath);
              }
            });
          };
          expandAll(structure, basePath);
          setExpandedNodes(allExpanded);
        }}>
          Expand All
        </Button>
      </CardFooter>
    </Card>
  );
}
