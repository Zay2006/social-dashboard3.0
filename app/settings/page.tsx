"use client";

import { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { ThemeToggle } from '@/components/theme-toggle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Save, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PlatformManagement } from '@/components/settings/platform-management';
import { toast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';

export default function SettingsPage() {
  const router = useRouter();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [dataRefreshInterval, setDataRefreshInterval] = useState('30');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveSettings = () => {
    // Mock saving settings
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated"
    });
  };

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <Toaster />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and platform preferences.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how the dashboard looks and feels.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="theme">Theme</Label>
                  <p className="text-sm text-muted-foreground">
                    Switch between light and dark mode.
                  </p>
                </div>
                <ThemeToggle />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="refresh">Data Refresh Interval</Label>
                  <p className="text-sm text-muted-foreground">
                    How often to refresh dashboard data.
                  </p>
                </div>
                <select
                  id="refresh"
                  value={dataRefreshInterval}
                  onChange={(e) => setDataRefreshInterval(e.target.value)}
                  className="w-24 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="15">15 min</option>
                  <option value="30">30 min</option>
                  <option value="60">1 hour</option>
                  <option value="360">6 hours</option>
                </select>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Configure how you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                  <Label htmlFor="email-notifications" className="ml-2">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications for important updates.
                  </p>
                </div>
              </div>
              <div className="flex justify-between">
                <Button onClick={handleSaveSettings} className="w-32">
                  <Save className="h-4 w-4 mr-2" />
                  {saveSuccess ? "Saved!" : "Save"}
                </Button>
                
                <Button variant="destructive" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-6">
          <PlatformManagement />
        </div>
      </div>
    </MainLayout>
  );
}
