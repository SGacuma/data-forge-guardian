
import { DatabaseConnection } from "@/types/database";
import ConnectionCard from "./ConnectionCard";

interface ConnectionListProps {
  connections: DatabaseConnection[];
  onConnect: (connection: DatabaseConnection) => void;
  onDisconnect: (connection: DatabaseConnection) => void;
  onToggleFavorite: (connection: DatabaseConnection) => void;
  onDelete: (connection: DatabaseConnection) => void;
}

const ConnectionList = ({
  connections,
  onConnect,
  onDisconnect,
  onToggleFavorite,
  onDelete,
}: ConnectionListProps) => {
  if (connections.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No connections found. Add a new connection to get started.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {connections.map((connection) => (
        <ConnectionCard
          key={connection.id}
          connection={connection}
          onConnect={onConnect}
          onDisconnect={onDisconnect}
          onToggleFavorite={onToggleFavorite}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ConnectionList;
