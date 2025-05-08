
import { useState, useEffect } from "react";
import { mockConnections, connectionSchemas, mockTableData } from "@/data/mockData";
import { DatabaseConnection, DatabaseTable, DatabaseSchema } from "@/types/database";
import { 
  ChevronDown, 
  ChevronRight, 
  Database, 
  Table, 
  TableProperties, 
  Search,
  Key,
  FileText,
  AlertCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TableViewer from "./TableViewer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const DatabaseExplorer = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConnection, setSelectedConnection] = useState(mockConnections.length > 0 ? mockConnections[0].id : "");
  const [expandedSchemas, setExpandedSchemas] = useState<Record<string, boolean>>({ "schema1_prod": true });
  const [expandedTables, setExpandedTables] = useState<Record<string, boolean>>({});
  const [selectedTable, setSelectedTable] = useState<DatabaseTable | null>(null);
  const [availableConnections, setAvailableConnections] = useState<DatabaseConnection[]>(mockConnections);
  const [schemas, setSchemas] = useState<DatabaseSchema[]>(connectionSchemas[selectedConnection] || []);
  const [isConnecting, setIsConnecting] = useState(false);

  // Get the current selected connection object
  const currentConnection = availableConnections.find(
    (connection) => connection.id === selectedConnection
  );

  useEffect(() => {
    // Reset selected table when connection changes
    setSelectedTable(null);
    
    // In a real app, this is where you would fetch schemas for the selected connection
    // For demo purposes, we'll use mock data based on connection status
    if (currentConnection?.status === "connected") {
      // Get the schemas for the selected connection
      setSchemas(connectionSchemas[selectedConnection] || []);
      toast({
        title: "Connected to database",
        description: `Showing tables from ${currentConnection.name}`,
      });
    } else {
      // If not connected, show empty schemas
      setSchemas([]);
    }
  }, [selectedConnection, currentConnection?.status]);

  const handleToggleSchema = (schemaId: string) => {
    setExpandedSchemas({
      ...expandedSchemas,
      [schemaId]: !expandedSchemas[schemaId],
    });
  };

  const handleToggleTable = (tableId: string) => {
    setExpandedTables({
      ...expandedTables,
      [tableId]: !expandedTables[tableId],
    });
  };

  const handleTableSelect = (table: DatabaseTable) => {
    setSelectedTable(table);
    toast({
      title: `Table selected: ${table.name}`,
      description: `Loaded ${table.rowCount} rows from ${table.schema}.${table.name}`,
    });
  };

  const handleConnectToDatabase = () => {
    if (!currentConnection) return;

    setIsConnecting(true);
    
    // Simulate connection process
    setTimeout(() => {
      const updatedConnections = availableConnections.map((conn) =>
        conn.id === currentConnection.id 
          ? { ...conn, status: "connected" as const, lastConnected: new Date() } 
          : conn
      );
      
      setAvailableConnections(updatedConnections);
      setIsConnecting(false);
      
      toast({
        title: "Connection established",
        description: `Successfully connected to ${currentConnection.name}`,
      });
    }, 1000);
  };

  // Filter schemas and tables based on search term
  const filteredSchemas = schemas
    .map(schema => {
      const filteredTables = schema.tables.filter(table => 
        table.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return {
        ...schema,
        tables: filteredTables
      };
    })
    .filter(schema => schema.tables.length > 0);

  return (
    <div className="flex h-full">
      {/* Left sidebar - DB Explorer */}
      <div className="w-64 border-r bg-white flex flex-col h-full">
        <div className="p-3 border-b">
          <Select
            value={selectedConnection}
            onValueChange={(value) => setSelectedConnection(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a connection" />
            </SelectTrigger>
            <SelectContent>
              {availableConnections.map((connection) => (
                <SelectItem key={connection.id} value={connection.id}>
                  {connection.name}
                  {connection.status === "connected" && " (Connected)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tables..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        {/* Connection status and connect button */}
        {currentConnection && currentConnection.status !== "connected" && (
          <div className="p-3 border-b bg-slate-50">
            <Alert className="p-3 mb-2 bg-amber-50">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="text-sm ml-2">Not connected</AlertTitle>
              <AlertDescription className="text-xs ml-6">
                Connect to view database tables
              </AlertDescription>
            </Alert>
            <Button 
              className="w-full bg-dbforge-teal hover:bg-dbforge-teal/90"
              onClick={handleConnectToDatabase}
              disabled={isConnecting}
            >
              {isConnecting ? "Connecting..." : "Connect to Database"}
            </Button>
          </div>
        )}
        
        <ScrollArea className="flex-1">
          {currentConnection?.status === "connected" ? (
            <div className="p-2">
              {filteredSchemas.length > 0 ? (
                filteredSchemas.map((schema) => (
                  <div key={schema.id}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start px-2 font-medium"
                      onClick={() => handleToggleSchema(schema.id)}
                    >
                      {expandedSchemas[schema.id] ? (
                        <ChevronDown className="h-4 w-4 mr-1" />
                      ) : (
                        <ChevronRight className="h-4 w-4 mr-1" />
                      )}
                      <Database className="h-4 w-4 mr-1 text-dbforge-blue" />
                      {schema.name}
                    </Button>
                    
                    {expandedSchemas[schema.id] && (
                      <div className="ml-6">
                        {schema.tables.map((table) => (
                          <div key={table.id}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={cn(
                                "w-full justify-start px-2 py-1 h-8 my-1",
                                selectedTable?.id === table.id && "bg-dbforge-teal/10 text-dbforge-teal"
                              )}
                              onClick={() => {
                                handleTableSelect(table);
                                handleToggleTable(table.id);
                              }}
                            >
                              {expandedTables[table.id] ? (
                                <ChevronDown className="h-3 w-3 mr-1" />
                              ) : (
                                <ChevronRight className="h-3 w-3 mr-1" />
                              )}
                              <Table className="h-3 w-3 mr-1 text-dbforge-gray" />
                              {table.name}
                            </Button>
                            
                            {expandedTables[table.id] && (
                              <div className="ml-6">
                                {table.columns.map((column) => (
                                  <div
                                    key={column.id}
                                    className="flex items-center px-2 py-1 text-xs text-gray-600"
                                  >
                                    {column.isPrimaryKey ? (
                                      <Key className="h-3 w-3 mr-1 text-yellow-500" />
                                    ) : (
                                      <FileText className="h-3 w-3 mr-1 text-gray-400" />
                                    )}
                                    <span className="font-medium">
                                      {column.name}
                                    </span>
                                    <span className="ml-1 text-gray-400">
                                      {column.type}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  No tables found.
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              Connect to a database to view tables.
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Main content - Table Viewer */}
      <div className="flex-1 flex flex-col h-full">
        {selectedTable ? (
          <TableViewer 
            table={selectedTable} 
            data={mockTableData[selectedTable.name]} 
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <TableProperties className="h-16 w-16 mb-4 text-dbforge-gray" />
            <h3 className="text-xl font-medium mb-2">No table selected</h3>
            <p className="text-sm text-gray-400">
              {currentConnection?.status === "connected" 
                ? "Select a table from the explorer to view its data"
                : "Connect to a database to explore tables"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatabaseExplorer;
