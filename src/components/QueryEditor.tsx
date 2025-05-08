
import { useState } from "react";
import { mockConnections, mockTableData } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { 
  Play, 
  Save, 
  Clock,
  Database,
  Download,
  Copy
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import TableViewer from "./TableViewer";
import { mockSchemas } from "@/data/mockData";

const QueryEditor = () => {
  const { toast } = useToast();
  const [selectedConnection, setSelectedConnection] = useState(mockConnections[0].id);
  const [query, setQuery] = useState("SELECT * FROM users LIMIT 10;");
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any | null>(null);
  const [executionTime, setExecutionTime] = useState(0);
  const [resultTab, setResultTab] = useState("results");

  const handleRunQuery = () => {
    if (!query.trim()) {
      toast({
        title: "Empty Query",
        description: "Please enter a SQL query to execute",
        variant: "destructive",
      });
      return;
    }

    setIsRunning(true);

    // Simulate query execution
    setTimeout(() => {
      setIsRunning(false);
      setResultTab("results");
      
      // Very basic "parser" to determine which table's data to show
      let tableName = "users"; // default
      if (query.toLowerCase().includes("from orders")) {
        tableName = "orders";
      }
      
      const executionTimeMs = Math.random() * 100 + 10;
      setExecutionTime(executionTimeMs);
      
      const resultData = mockTableData[tableName];
      setResults({
        columns: resultData.columns,
        rows: resultData.rows,
        rowCount: resultData.rows.length,
        tableName,
      });

      toast({
        title: "Query executed",
        description: `Executed in ${executionTimeMs.toFixed(2)}ms`,
      });
    }, 800);
  };

  const handleSaveQuery = () => {
    toast({
      title: "Query saved",
      description: "Your query has been saved",
    });
  };

  const handleCopyQuery = () => {
    navigator.clipboard.writeText(query);
    toast({
      title: "Query copied",
      description: "Query copied to clipboard",
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white p-4 border-b">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium flex items-center">
            <Database className="h-4 w-4 mr-2 text-dbforge-teal" />
            SQL Query Editor
          </h2>
          <Select
            value={selectedConnection}
            onValueChange={(value) => setSelectedConnection(value)}
          >
            <SelectTrigger className="w-60">
              <SelectValue placeholder="Select a connection" />
            </SelectTrigger>
            <SelectContent>
              {mockConnections.map((connection) => (
                <SelectItem key={connection.id} value={connection.id}>
                  {connection.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full relative">
          <Textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-h-32 font-mono text-sm resize-none p-4"
            placeholder="SELECT * FROM users LIMIT 10;"
          />
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center">
            <Button 
              variant="default" 
              className="bg-dbforge-teal hover:bg-dbforge-teal/90 me-2" 
              onClick={handleRunQuery}
              disabled={isRunning}
            >
              <Play className="h-4 w-4 mr-2" />
              {isRunning ? "Running..." : "Run"}
            </Button>
            <Button variant="outline" className="me-2" onClick={handleSaveQuery}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" onClick={handleCopyQuery}>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>
          <div className="text-sm text-muted-foreground flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            Last execution: {executionTime > 0 ? `${executionTime.toFixed(2)}ms` : "N/A"}
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col">
        {results ? (
          <div className="flex-1 flex flex-col">
            <Tabs value={resultTab} onValueChange={setResultTab} className="flex-1 flex flex-col">
              <div className="bg-white border-b px-4">
                <TabsList>
                  <TabsTrigger value="results">Results</TabsTrigger>
                  <TabsTrigger value="messages">Messages</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="results" className="flex-1 p-0 m-0">
                <div className="flex-1">
                  <TableViewer
                    table={mockSchemas[0].tables.find(t => t.name === results.tableName) || mockSchemas[0].tables[0]}
                    data={{
                      columns: results.columns,
                      rows: results.rows,
                      rowCount: results.rows.length,
                      executionTime: executionTime
                    }}
                  />
                </div>
              </TabsContent>
              <TabsContent value="messages" className="p-4">
                <div className="bg-white p-4 border rounded-md">
                  <p className="text-sm">
                    <span className="text-green-600">✓</span> Query executed successfully in {executionTime.toFixed(2)}ms
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Returned {results.rows.length} rows
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center p-8">
            <div>
              <Play className="mx-auto h-12 w-12 text-dbforge-gray mb-4" strokeWidth={1} />
              <h3 className="text-lg font-medium mb-2">No results yet</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Run a query to see results here. You can select tables from the database explorer 
                and view data or write custom SQL queries.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QueryEditor;
