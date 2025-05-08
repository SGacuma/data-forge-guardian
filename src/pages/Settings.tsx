
import MainLayout from "@/layouts/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const Settings = () => {
  return (
    <MainLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Preferences</CardTitle>
              <CardDescription>
                Configure how DataForge behaves and displays information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dark-mode" className="font-medium">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Switch between light and dark themes
                    </p>
                  </div>
                  <Switch id="dark-mode" />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-save" className="font-medium">Auto-save Queries</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically save query drafts
                    </p>
                  </div>
                  <Switch id="auto-save" defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-row-numbers" className="font-medium">Show Row Numbers</Label>
                    <p className="text-sm text-muted-foreground">
                      Display row numbers in query results
                    </p>
                  </div>
                  <Switch id="show-row-numbers" defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Connection Settings</CardTitle>
              <CardDescription>
                Default settings for database connections
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="ssl-connections" className="font-medium">Use SSL for Connections</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable SSL for secure database connections
                    </p>
                  </div>
                  <Switch id="ssl-connections" defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-connect" className="font-medium">Auto-connect on Startup</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically connect to favorite databases
                    </p>
                  </div>
                  <Switch id="auto-connect" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
