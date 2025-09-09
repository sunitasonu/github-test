import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Check } from "lucide-react";

const InvoiceTemplates = ({ selectedTemplate, onTemplateSelect }) => {
  const [, setPreviewTemplate] = useState(null);
  // const [previewTemplate, setPreviewTemplate] = useState(null);

  const templates = [
    {
      id: "classic",
      name: "Classic",
      description: "Clean and professional design with traditional layout",
      preview: "/template-previews/classic.png",
      isPremium: false,
    },
    {
      id: "modern",
      name: "Modern",
      description: "Contemporary design with bold typography and colors",
      preview: "/template-previews/modern.png",
      isPremium: false,
    },
    {
      id: "minimal",
      name: "Minimal",
      description: "Simple and elegant with lots of white space",
      preview: "/template-previews/minimal.png",
      isPremium: false,
    },
    {
      id: "corporate",
      name: "Corporate",
      description: "Professional design perfect for B2B invoices",
      preview: "/template-previews/corporate.png",
      isPremium: true,
    },
    {
      id: "creative",
      name: "Creative",
      description: "Colorful and unique design for creative agencies",
      preview: "/template-previews/creative.png",
      isPremium: true,
    },
    {
      id: "tech",
      name: "Tech",
      description: "Modern tech-inspired design with gradients",
      preview: "/template-previews/tech.png",
      isPremium: true,
    },
  ];

  const handlePreview = (templateId) => {
    setPreviewTemplate(templateId);
    console.log("Preview template:", templateId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Choose Invoice Template</h3>
        <p className="text-sm text-muted-foreground">
          Select a template that matches your brand and style preferences
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedTemplate === template.id
                ? "ring-2 ring-primary border-primary"
                : "hover:border-muted-foreground"
            }`}
            onClick={() => onTemplateSelect(template.id)}
          >
            <CardHeader className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    {template.name}
                    {template.isPremium && (
                      <Badge variant="secondary" className="text-xs">
                        Premium
                      </Badge>
                    )}
                  </CardTitle>
                </div>
                {selectedTemplate === template.id && (
                  <div className="bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-4 pt-0">
              <div className="aspect-[3/4] bg-muted rounded-lg mb-3 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <div className="w-12 h-12 bg-muted-foreground/20 rounded mb-2 mx-auto"></div>
                  <p className="text-sm font-medium">{template.name}</p>
                  <p className="text-xs">Template Preview</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-3">
                {template.description}
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePreview(template.id);
                  }}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Preview
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => onTemplateSelect(template.id)}
                  variant={
                    selectedTemplate === template.id ? "default" : "outline"
                  }
                >
                  {selectedTemplate === template.id ? "Selected" : "Select"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InvoiceTemplates;
