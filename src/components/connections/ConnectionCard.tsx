
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
  Star, 
  Trash2, 
  Edit, 
  Link, 
  XCircle 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ConnectionCardProps {
  connection: DatabaseConnection;
  onConnect: (connection: DatabaseConnection) => void;
  onDisconnect: (connection: DatabaseConnection) => void;
  onToggleFavorite: (connection: DatabaseConnection) => void;
  onDelete: (connection: DatabaseConnection) => void;
}

const ConnectionCard = ({
  connection,
  onConnect,
  onDisconnect,
  onToggleFavorite,
  onDelete,
}: ConnectionCardProps) => {
  return (
    <Card>
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
            onClick={() => onToggleFavorite(connection)}
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
            onClick={() => onDelete(connection)}
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
            onClick={() => onDisconnect(connection)}
            className="flex gap-1"
          >
            <XCircle className="h-4 w-4" />
            Disconnect
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={() => onConnect(connection)}
            className="bg-dbforge-teal hover:bg-dbforge-teal/90 flex gap-1"
          >
            <Link className="h-4 w-4" />
            Connect
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ConnectionCard;
