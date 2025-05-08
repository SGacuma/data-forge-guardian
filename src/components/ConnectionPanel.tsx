
import { useState } from "react";
import { mockConnections } from "@/data/mockData";
import { DatabaseConnection } from "@/types/database";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Database, 
  Star, 
  Link 
} from "lucide-react";
import ConnectionForm from "./ConnectionForm";
import { useToast } from "@/hooks/use-toast";
import ConnectionHeader from "./connections/ConnectionHeader";
import ConnectionList from "./connections/ConnectionList";
import { Button } from "./ui/button";

const ConnectionPanel = () => {
  const { toast } = useToast();
  const [connections, setConnections] = useState<DatabaseConnection[]>(mockConnections);
  const [activeTab, setActiveTab] = useState("all");
  const [showNewConnectionForm, setShowNewConnectionForm] = useState(false);

  const handleConnect = (connection: DatabaseConnection) => {
    // In a real app, this would initiate a connection
    toast({
      title: "Connecting to database",
      description: `Establishing connection to ${connection.name}...`,
    });

    const updatedConnections = connections.map((c) =>
      c.id === connection.id ? { ...c, status: "connected" as const, lastConnected: new Date() } : c
    );
    setConnections(updatedConnections);
  };

  const handleDisconnect = (connection: DatabaseConnection) => {
    const updatedConnections = connections.map((c) =>
      c.id === connection.id ? { ...c, status: "disconnected" as const } : c
    );
    setConnections(updatedConnections);

    toast({
      title: "Disconnected",
      description: `Connection to ${connection.name} closed`,
    });
  };

  const handleToggleFavorite = (connection: DatabaseConnection) => {
    const updatedConnections = connections.map((c) =>
      c.id === connection.id ? { ...c, favorite: !c.favorite } : c
    );
    setConnections(updatedConnections);

    toast({
      title: connection.favorite ? "Removed from favorites" : "Added to favorites",
      description: `${connection.name} ${
        connection.favorite ? "removed from" : "added to"
      } favorites`,
    });
  };

  const handleDelete = (connection: DatabaseConnection) => {
    const updatedConnections = connections.filter((c) => c.id !== connection.id);
    setConnections(updatedConnections);

    toast({
      title: "Connection deleted",
      description: `${connection.name} has been removed`,
    });
  };

  const handleSaveConnection = (newConnection: Omit<DatabaseConnection, 'id' | 'status' | 'lastConnected'>) => {
    const connectionToAdd: DatabaseConnection = {
      ...newConnection,
      id: `${connections.length + 1}`,
      status: "disconnected",
    };

    setConnections([...connections, connectionToAdd]);
    setShowNewConnectionForm(false);

    toast({
      title: "Connection saved",
      description: `${newConnection.name} has been added to your connections`,
    });
  };

  const filteredConnections = connections.filter((connection) => {
    if (activeTab === "all") return true;
    if (activeTab === "connected") return connection.status === "connected";
    if (activeTab === "favorites") return connection.favorite;
    return true;
  });

  if (showNewConnectionForm) {
    return (
      <div className="p-6">
        <ConnectionHeader onNewConnection={() => setShowNewConnectionForm(true)} />
        <Card>
          <CardHeader>
            <CardTitle>New Database Connection</CardTitle>
            <CardDescription>
              Create a new connection to your database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ConnectionForm onSave={handleSaveConnection} />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button 
              variant="ghost" 
              onClick={() => setShowNewConnectionForm(false)}
            >
              Cancel
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <ConnectionHeader onNewConnection={() => setShowNewConnectionForm(true)} />
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all" className="flex gap-2">
            <Database className="h-4 w-4" />
            All
          </TabsTrigger>
          <TabsTrigger value="connected" className="flex gap-2">
            <Link className="h-4 w-4" />
            Connected
          </TabsTrigger>
          <TabsTrigger value="favorites" className="flex gap-2">
            <Star className="h-4 w-4" />
            Favorites
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <ConnectionList
            connections={filteredConnections}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
            onToggleFavorite={handleToggleFavorite}
            onDelete={handleDelete}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConnectionPanel;
