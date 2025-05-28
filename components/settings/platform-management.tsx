"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Save } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface Platform {
  id: number;
  name: string;
  icon: string;
  color: string;
}

export function PlatformManagement() {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPlatform, setNewPlatform] = useState({ name: '', icon: '', color: '#000000' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch platforms from API
  const fetchPlatforms = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/platform-management');
      
      if (!response.ok) {
        throw new Error('Failed to fetch platforms');
      }
      
      const data = await response.json();
      setPlatforms(data);
    } catch (error) {
      console.error('Error fetching platforms:', error);
      toast({
        title: "Error",
        description: "Failed to load platforms",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlatforms();
  }, []);

  const handleAddPlatform = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPlatform.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Platform name is required",
        variant: "destructive"
      });
      return;
    }

    // Auto-generate icon name if not provided
    const iconName = newPlatform.icon.trim() || newPlatform.name.toLowerCase().replace(/\s+/g, '');
    
    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/platform-management', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newPlatform.name,
          icon: iconName,
          color: newPlatform.color,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add platform');
      }
      
      const addedPlatform = await response.json();
      
      // Update local state
      setPlatforms([...platforms, addedPlatform]);
      
      // Reset form
      setNewPlatform({ name: '', icon: '', color: '#000000' });
      
      toast({
        title: "Success",
        description: `${addedPlatform.name} platform added successfully`
      });
      
    } catch (error) {
      console.error('Error adding platform:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add platform",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemovePlatform = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name}? This will delete all associated data.`)) {
      return;
    }
    
    try {
      const response = await fetch('/api/platform-management', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove platform');
      }
      
      // Update local state
      setPlatforms(platforms.filter(platform => platform.id !== id));
      
      toast({
        title: "Success",
        description: `${name} platform removed successfully`
      });
      
    } catch (error) {
      console.error('Error removing platform:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove platform",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Management</CardTitle>
        <CardDescription>
          Add or remove platforms from your dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Current Platforms</h3>
            {loading ? (
              <div className="text-sm text-muted-foreground">Loading platforms...</div>
            ) : platforms.length === 0 ? (
              <div className="text-sm text-muted-foreground">No platforms configured</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {platforms.map(platform => (
                  <div 
                    key={platform.id} 
                    className="flex items-center justify-between p-3 border rounded-md"
                    style={{ borderLeftColor: platform.color, borderLeftWidth: '4px' }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center rounded-full" style={{ backgroundColor: platform.color }}>
                        <i className={`fa-brands fa-${platform.icon} text-white text-sm`}></i>
                      </div>
                      <span>{platform.name}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleRemovePlatform(platform.id, platform.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Add New Platform</h3>
            <form onSubmit={handleAddPlatform} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="platform-name">Platform Name</Label>
                  <Input
                    id="platform-name"
                    placeholder="e.g. Facebook"
                    value={newPlatform.name}
                    onChange={(e) => setNewPlatform({ ...newPlatform, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="platform-icon">Icon Name (optional)</Label>
                  <Input
                    id="platform-icon"
                    placeholder="e.g. facebook"
                    value={newPlatform.icon}
                    onChange={(e) => setNewPlatform({ ...newPlatform, icon: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="platform-color">Brand Color</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    id="platform-color"
                    value={newPlatform.color}
                    onChange={(e) => setNewPlatform({ ...newPlatform, color: e.target.value })}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <Input
                    value={newPlatform.color}
                    onChange={(e) => setNewPlatform({ ...newPlatform, color: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Adding...' : 'Add Platform'}
                {!isSubmitting && <Plus className="ml-2 h-4 w-4" />}
              </Button>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
