
import { useState } from "react";
import { mockConnections } from "@/data/mockData";
import { DatabaseConnection } from "@/types/database";
import { Button } from "@/components/ui/button";
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
  Plus, 
  Star, 
  Trash2, 
  Edit, 
  Link, 
  XCircle 
} from "lucide-react";
import ConnectionForm from "./ConnectionForm";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-dbforge-blue">Database Connections</h2>
        <Button 
          onClick={() => setShowNewConnectionForm(true)}
          className="bg-dbforge-teal hover:bg-dbforge-teal/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Connection
        </Button>
      </div>

      {showNewConnectionForm ? (
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
      ) : (
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredConnections.map((connection) => (
                <Card key={connection.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {connection.type === "postgres" && "🐘"}
                        {connection.type === "mysql" && "🐬"}
                        {connection.type === "sqlite" && "🔍"}
                        {connection.type === "mssql" && "🪟"}
                        {connection.type === "oracle" && "🔮"}
                        {connection.name}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleFavorite(connection)}
                      >
                        <Star
                          className={cn(
                            "h-4 w-4",
                            connection.favorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                          )}
                        />
                      </Button>
                    </div>
                    <CardDescription>
                      {connection.host}:{connection.port}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Database:</span>
                        <span className="text-sm font-medium">{connection.database}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Type:</span>
                        <span className="text-sm font-medium capitalize">{connection.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <span className={cn(
                          "text-sm font-medium flex items-center",
                          connection.status === "connected" ? "text-green-500" : 
                          connection.status === "error" ? "text-red-500" : "text-gray-500"
                        )}>
                          {connection.status === "connected" ? "●" : 
                           connection.status === "error" ? "●" : "○"} 
                          <span className="ml-1 capitalize">{connection.status}</span>
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(connection)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    {connection.status === "connected" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDisconnect(connection)}
                        className="flex gap-1"
                      >
                        <XCircle className="h-4 w-4" />
                        Disconnect
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleConnect(connection)}
                        className="bg-dbforge-teal hover:bg-dbforge-teal/90 flex gap-1"
                      >
                        <Link className="h-4 w-4" />
                        Connect
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ConnectionPanel;
