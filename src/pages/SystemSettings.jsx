import React, { useState } from "react";
import {
  Save,
  Upload,
  Palette,
  Settings,
  Building,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const SystemSettings = () => {
  const { toast } = useToast();
  const [currentTheme, setCurrentTheme] = useState("default");

  const [companySettings, setCompanySettings] = useState({
    name: "SabajiMandi Invoice",
    email: "contact@SabajiMandi.com",
    phone: "+1 (555) 123-4567",
    address: "123 Business Street\nSuite 456\nBusiness City, BC 12345",
    website: "https://SabajiMandi.com",
    taxId: "TAX123456789",
    logo: null,
  });

  const [invoiceSettings, setInvoiceSettings] = useState({
    defaultCurrency: "USD",
    defaultTemplate: "modern",
    invoicePrefix: "INV",
    invoiceStartNumber: 1001,
    defaultPaymentTerms: "Net 30",
    defaultDueDate: 30,
    showTaxColumn: true,
    autoCalculateTax: true,
    defaultTaxRate: 10,
  });

  const [systemSettings, setSystemSettings] = useState({
    dateFormat: "MM/DD/YYYY",
    timeZone: "America/New_York",
    language: "en",
    enableNotifications: true,
    enableAutoBackup: true,
    enableAuditLog: true,
    sessionTimeout: 60,
  });

  const [customSettings, setCustomSettings] = useState([
    {
      key: "email_signature",
      value: "Best regards,\nSabajiMandi Team",
      description: "Default email signature",
    },
    {
      key: "late_fee_rate",
      value: "5",
      description: "Late fee percentage rate",
    },
    {
      key: "backup_frequency",
      value: "24",
      description: "Backup frequency in hours",
    },
  ]);

  const themes = [
    { id: "default", name: "Default", class: "" },
    { id: "blue", name: "Blue", class: "theme-blue" },
    { id: "green", name: "Green", class: "theme-green" },
    { id: "purple", name: "Purple", class: "theme-purple" },
    { id: "orange", name: "Orange", class: "theme-orange" },
  ];

  const handleThemeChange = (themeId) => {
    const theme = themes.find((t) => t.id === themeId);
    if (theme) {
      // Remove existing theme classes
      themes.forEach((t) => {
        if (t.class) {
          document.documentElement.classList.remove(t.class);
        }
      });

      // Add new theme class
      if (theme.class) {
        document.documentElement.classList.add(theme.class);
      }

      setCurrentTheme(themeId);
      localStorage.setItem("theme-color", themeId);

      toast({
        title: "Theme Updated",
        description: `Theme changed to ${theme.name}`,
      });
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCompanySettings({ ...companySettings, logo: file });
    }
  };

  const handleSaveCompany = () => {
    console.log("Saving company settings:", companySettings);
    toast({
      title: "Company Settings Saved",
      description: "Company information has been updated successfully.",
    });
  };

  const handleSaveInvoice = () => {
    console.log("Saving invoice settings:", invoiceSettings);
    toast({
      title: "Invoice Settings Saved",
      description: "Invoice preferences have been updated successfully.",
    });
  };

  const handleSaveSystem = () => {
    console.log("Saving system settings:", systemSettings);
    toast({
      title: "System Settings Saved",
      description: "System preferences have been updated successfully.",
    });
  };

  const handleSaveCustom = () => {
    console.log("Saving custom settings:", customSettings);
    toast({
      title: "Custom Settings Saved",
      description: "Custom configuration has been updated successfully.",
    });
  };

  const addCustomSetting = () => {
    setCustomSettings([
      ...customSettings,
      { key: "", value: "", description: "" },
    ]);
  };

  const updateCustomSetting = (index, field, value) => {
    const updated = [...customSettings];
    updated[index] = { ...updated[index], [field]: value };
    setCustomSettings(updated);
  };

  const removeCustomSetting = (index) => {
    setCustomSettings(customSettings.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">System Settings</h1>
        <p className="text-muted-foreground">
          Configure your system preferences and company details
        </p>
      </div>

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="invoice">Invoice</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={companySettings.name}
                    onChange={(e) =>
                      setCompanySettings({
                        ...companySettings,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="companyEmail">Email Address</Label>
                  <Input
                    id="companyEmail"
                    type="email"
                    value={companySettings.email}
                    onChange={(e) =>
                      setCompanySettings({
                        ...companySettings,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="companyPhone">Phone Number</Label>
                  <Input
                    id="companyPhone"
                    value={companySettings.phone}
                    onChange={(e) =>
                      setCompanySettings({
                        ...companySettings,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="companyWebsite">Website</Label>
                  <Input
                    id="companyWebsite"
                    value={companySettings.website}
                    onChange={(e) =>
                      setCompanySettings({
                        ...companySettings,
                        website: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="companyTaxId">Tax ID</Label>
                  <Input
                    id="companyTaxId"
                    value={companySettings.taxId}
                    onChange={(e) =>
                      setCompanySettings({
                        ...companySettings,
                        taxId: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="companyLogo">Company Logo</Label>
                  <Input
                    id="companyLogo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="companyAddress">Company Address</Label>
                <Textarea
                  id="companyAddress"
                  rows={4}
                  value={companySettings.address}
                  onChange={(e) =>
                    setCompanySettings({
                      ...companySettings,
                      address: e.target.value,
                    })
                  }
                />
              </div>
              <Button onClick={handleSaveCompany}>
                <Save className="h-4 w-4 mr-2" />
                Save Company Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoice">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Invoice Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="defaultCurrency">Default Currency</Label>
                  <Select
                    value={invoiceSettings.defaultCurrency}
                    onValueChange={(value) =>
                      setInvoiceSettings({
                        ...invoiceSettings,
                        defaultCurrency: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                      <SelectItem value="AUD">
                        AUD - Australian Dollar
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="defaultTemplate">Default Template</Label>
                  <Select
                    value={invoiceSettings.defaultTemplate}
                    onValueChange={(value) =>
                      setInvoiceSettings({
                        ...invoiceSettings,
                        defaultTemplate: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="classic">Classic</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
                  <Input
                    id="invoicePrefix"
                    value={invoiceSettings.invoicePrefix}
                    onChange={(e) =>
                      setInvoiceSettings({
                        ...invoiceSettings,
                        invoicePrefix: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="invoiceStartNumber">
                    Starting Invoice Number
                  </Label>
                  <Input
                    id="invoiceStartNumber"
                    type="number"
                    value={invoiceSettings.invoiceStartNumber}
                    onChange={(e) =>
                      setInvoiceSettings({
                        ...invoiceSettings,
                        invoiceStartNumber: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="defaultPaymentTerms">
                    Default Payment Terms
                  </Label>
                  <Select
                    value={invoiceSettings.defaultPaymentTerms}
                    onValueChange={(value) =>
                      setInvoiceSettings({
                        ...invoiceSettings,
                        defaultPaymentTerms: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select terms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Due on Receipt">
                        Due on Receipt
                      </SelectItem>
                      <SelectItem value="Net 15">Net 15</SelectItem>
                      <SelectItem value="Net 30">Net 30</SelectItem>
                      <SelectItem value="Net 60">Net 60</SelectItem>
                      <SelectItem value="Net 90">Net 90</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="defaultDueDate">
                    Default Due Date (days)
                  </Label>
                  <Input
                    id="defaultDueDate"
                    type="number"
                    value={invoiceSettings.defaultDueDate}
                    onChange={(e) =>
                      setInvoiceSettings({
                        ...invoiceSettings,
                        defaultDueDate: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="defaultTaxRate">Default Tax Rate (%)</Label>
                  <Input
                    id="defaultTaxRate"
                    type="number"
                    step="0.01"
                    value={invoiceSettings.defaultTaxRate}
                    onChange={(e) =>
                      setInvoiceSettings({
                        ...invoiceSettings,
                        defaultTaxRate: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="showTaxColumn">Show Tax Column</Label>
                  <Switch
                    id="showTaxColumn"
                    checked={invoiceSettings.showTaxColumn}
                    onCheckedChange={(checked) =>
                      setInvoiceSettings({
                        ...invoiceSettings,
                        showTaxColumn: checked,
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="autoCalculateTax">Auto Calculate Tax</Label>
                  <Switch
                    id="autoCalculateTax"
                    checked={invoiceSettings.autoCalculateTax}
                    onCheckedChange={(checked) =>
                      setInvoiceSettings({
                        ...invoiceSettings,
                        autoCalculateTax: checked,
                      })
                    }
                  />
                </div>
              </div>

              <Button onClick={handleSaveInvoice}>
                <Save className="h-4 w-4 mr-2" />
                Save Invoice Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                System Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select
                    value={systemSettings.dateFormat}
                    onValueChange={(value) =>
                      setSystemSettings({
                        ...systemSettings,
                        dateFormat: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="timeZone">Time Zone</Label>
                  <Select
                    value={systemSettings.timeZone}
                    onValueChange={(value) =>
                      setSystemSettings({ ...systemSettings, timeZone: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">
                        Eastern Time
                      </SelectItem>
                      <SelectItem value="America/Chicago">
                        Central Time
                      </SelectItem>
                      <SelectItem value="America/Denver">
                        Mountain Time
                      </SelectItem>
                      <SelectItem value="America/Los_Angeles">
                        Pacific Time
                      </SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={systemSettings.language}
                    onValueChange={(value) =>
                      setSystemSettings({ ...systemSettings, language: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="sessionTimeout">
                    Session Timeout (minutes)
                  </Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={systemSettings.sessionTimeout}
                    onChange={(e) =>
                      setSystemSettings({
                        ...systemSettings,
                        sessionTimeout: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableNotifications">
                    Enable Notifications
                  </Label>
                  <Switch
                    id="enableNotifications"
                    checked={systemSettings.enableNotifications}
                    onCheckedChange={(checked) =>
                      setSystemSettings({
                        ...systemSettings,
                        enableNotifications: checked,
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableAutoBackup">Enable Auto Backup</Label>
                  <Switch
                    id="enableAutoBackup"
                    checked={systemSettings.enableAutoBackup}
                    onCheckedChange={(checked) =>
                      setSystemSettings({
                        ...systemSettings,
                        enableAutoBackup: checked,
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableAuditLog">Enable Audit Log</Label>
                  <Switch
                    id="enableAuditLog"
                    checked={systemSettings.enableAuditLog}
                    onCheckedChange={(checked) =>
                      setSystemSettings({
                        ...systemSettings,
                        enableAuditLog: checked,
                      })
                    }
                  />
                </div>
              </div>

              <Button onClick={handleSaveSystem}>
                <Save className="h-4 w-4 mr-2" />
                Save System Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="theme">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="h-5 w-5 mr-2" />
                Theme Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Color Theme</Label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-2">
                  {themes.map((theme) => (
                    <div
                      key={theme.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        currentTheme === theme.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => handleThemeChange(theme.id)}
                    >
                      <div className="text-center">
                        <div
                          className={`w-8 h-8 rounded-full mx-auto mb-2 ${
                            theme.id === "default"
                              ? "bg-primary"
                              : theme.id === "blue"
                              ? "bg-blue-500"
                              : theme.id === "green"
                              ? "bg-green-500"
                              : theme.id === "purple"
                              ? "bg-purple-500"
                              : "bg-orange-500"
                          }`}
                        />
                        <p className="text-sm font-medium">{theme.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom">
          <Card>
            <CardHeader>
              <CardTitle>Custom Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {customSettings.map((setting, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg"
                  >
                    <div>
                      <Label>Key</Label>
                      <Input
                        value={setting.key}
                        onChange={(e) =>
                          updateCustomSetting(index, "key", e.target.value)
                        }
                        placeholder="setting_key"
                      />
                    </div>
                    <div>
                      <Label>Value</Label>
                      <Input
                        value={setting.value}
                        onChange={(e) =>
                          updateCustomSetting(index, "value", e.target.value)
                        }
                        placeholder="setting_value"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Input
                        value={setting.description}
                        onChange={(e) =>
                          updateCustomSetting(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Description"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeCustomSetting(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={addCustomSetting}>
                  Add Custom Setting
                </Button>
                <Button onClick={handleSaveCustom}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Custom Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemSettings;
