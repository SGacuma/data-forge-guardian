
import { useState } from "react";
import { DatabaseTable, QueryResult } from "@/types/database";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Download,
  RefreshCw,
  Table as TableIcon, 
  FileText,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit,
  Trash2
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TableViewerProps {
  table: DatabaseTable;
  data: QueryResult | null | undefined;
}

const TableViewer = ({ table, data }: TableViewerProps) => {
  const { toast } = useToast();
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Record<string, any> | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const rowsPerPage = 10;
  
  // Handle potentially undefined or null data
  const safeData = data || { columns: [], rows: [], rowCount: 0, executionTime: 0 };
  
  // Ensure rows is always an array, even if data is undefined or null
  const rows = safeData.rows || [];
  const totalPages = Math.ceil(rows.length / rowsPerPage);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleEdit = (row: Record<string, any>) => {
    setSelectedRow({...row});
    setIsEditDialogOpen(true);
  };

  const handleDelete = (row: Record<string, any>) => {
    // In a real app, this would send a delete request to the API
    toast({
      title: "Record deleted",
      description: `Successfully deleted record with ID: ${row.id || 'unknown'}`,
    });
  };

  const handleEditSave = () => {
    // In a real app, this would send an update request to the API
    setIsEditDialogOpen(false);
    toast({
      title: "Record updated",
      description: `Successfully updated record with ID: ${selectedRow?.id || 'unknown'}`,
    });
  };

  const filteredRows = rows.filter((row) => {
    if (!searchValue) return true;
    return Object.values(row).some(
      (value) =>
        value && value.toString().toLowerCase().includes(searchValue.toLowerCase())
    );
  });

  const paginatedRows = filteredRows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 bg-white border-b">
        <h3 className="text-lg font-medium flex items-center mb-1">
          <TableIcon className="h-4 w-4 mr-2 text-dbforge-teal" />
          {table.schema}.{table.name}
        </h3>
        <p className="text-sm text-muted-foreground">
          {table.rowCount.toLocaleString()} rows · {table.columns.length} columns
        </p>
      </div>

      <Tabs defaultValue="data" className="flex flex-col flex-1">
        <div className="bg-white border-b px-4">
          <TabsList>
            <TabsTrigger value="data" className="flex items-center gap-1">
              <TableIcon className="h-4 w-4" />
              Data
            </TabsTrigger>
            <TabsTrigger value="structure" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              Structure
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="data" className="flex-1 flex flex-col p-0">
          <div className="p-3 bg-white border-b flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search in results..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline" size="icon" onClick={handleRefresh}>
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <Table className="relative">
              <TableHeader className="bg-slate-50 sticky top-0">
                <TableRow>
                  {safeData.columns?.map((column, index) => (
                    <TableHead key={column || `column-${index}`} className="whitespace-nowrap">
                      {column}
                    </TableHead>
                  ))}
                  <TableHead className="whitespace-nowrap text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRows.length > 0 ? (
                  paginatedRows.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {safeData.columns?.map((column, colIndex) => (
                        <TableCell key={`${rowIndex}-${colIndex}`} className="whitespace-nowrap">
                          {row[column]?.toString() || "NULL"}
                        </TableCell>
                      ))}
                      <TableCell className="whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => handleEdit(row)}
                                className="h-8 w-8"
                              >
                                <Edit className="h-4 w-4 text-blue-600" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Record</DialogTitle>
                                <DialogDescription>
                                  Make changes to the record below.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                {selectedRow && safeData.columns?.map((column) => (
                                  <div key={column} className="grid grid-cols-4 items-center gap-4">
                                    <label htmlFor={column} className="text-right font-medium">
                                      {column}
                                    </label>
                                    <Input
                                      id={column}
                                      value={selectedRow[column] || ''}
                                      onChange={(e) => 
                                        setSelectedRow({...selectedRow, [column]: e.target.value})
                                      }
                                      className="col-span-3"
                                    />
                                  </div>
                                ))}
                              </div>
                              <DialogFooter>
                                <Button onClick={handleEditSave}>Save changes</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="icon"
                                className="h-8 w-8"
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete this
                                  record from the database.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDelete(row)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell 
                      colSpan={(safeData.columns?.length || 1) + 1} 
                      className="h-24 text-center"
                    >
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>

          <div className="p-3 border-t bg-white flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {Math.min(filteredRows.length, rowsPerPage)} of {filteredRows.length} rows
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm mx-2">
                Page {currentPage} of {totalPages || 1}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="structure" className="p-4 bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-60">Column</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Nullable</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Default</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {table.columns.map((column) => (
                <TableRow key={column.id}>
                  <TableCell className="font-medium">{column.name}</TableCell>
                  <TableCell>{column.type}</TableCell>
                  <TableCell>{column.nullable ? "YES" : "NO"}</TableCell>
                  <TableCell>
                    {column.isPrimaryKey ? "PK" : column.isForeignKey ? "FK" : ""}
                  </TableCell>
                  <TableCell>{column.defaultValue || ""}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TableViewer;
