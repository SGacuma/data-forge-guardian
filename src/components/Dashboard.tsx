
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockConnections } from "@/data/mockData";
import { DatabaseConnection } from "@/types/database";
import { Database, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ConnectionCardProps {
  connection: DatabaseConnection;
}

const ConnectionCard = ({ connection }: ConnectionCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-500';
      case 'disconnected': return 'text-gray-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const iconMap = {
    'postgres': '🐘',
    'mysql': '🐬',
    'sqlite': '🔍',
    'mssql': '🪟',
    'oracle': '🔮'
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <span>{iconMap[connection.type]}</span>
            {connection.name}
          </CardTitle>
          <span className={getStatusColor(connection.status)}>●</span>
        </div>
        <CardDescription>{connection.host}:{connection.port}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Database:</span>
            <span className="text-sm font-medium">{connection.database}</span>
          </div>
          {connection.lastConnected && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              Last connected {connection.lastConnected.toLocaleDateString()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-dbforge-blue">Dashboard</h2>
        <Button asChild variant="default" className="bg-dbforge-teal hover:bg-dbforge-teal/90">
          <Link to="/connections">
            New Connection <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Connections</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{mockConnections.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Connected</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-green-500">
              {mockConnections.filter(c => c.status === 'connected').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Favorites</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-yellow-500">
              {mockConnections.filter(c => c.favorite).length}
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Database className="h-5 w-5 mr-2 text-dbforge-teal" />
          Recent Connections
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockConnections.map(connection => (
            <ConnectionCard key={connection.id} connection={connection} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-20" asChild>
            <Link to="/connections">Manage Connections</Link>
          </Button>
          <Button variant="outline" className="h-20" asChild>
            <Link to="/explorer">Browse Data</Link>
          </Button>
          <Button variant="outline" className="h-20" asChild>
            <Link to="/query">Write a Query</Link>
          </Button>
          <Button variant="outline" className="h-20" asChild>
            <Link to="/settings">Settings</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
