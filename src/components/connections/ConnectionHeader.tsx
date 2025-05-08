
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ConnectionHeaderProps {
  onNewConnection: () => void;
}

const ConnectionHeader = ({ onNewConnection }: ConnectionHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-3xl font-bold text-dbforge-blue">Database Connections</h2>
      <Button 
        onClick={onNewConnection}
        className="bg-dbforge-teal hover:bg-dbforge-teal/90"
      >
        <Plus className="mr-2 h-4 w-4" />
        New Connection
      </Button>
    </div>
  );
};

export default ConnectionHeader;
