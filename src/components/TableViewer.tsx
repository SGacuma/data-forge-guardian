
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
  ChevronsRight
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface TableViewerProps {
  table: DatabaseTable;
  data: QueryResult;
}

const TableViewer = ({ table, data }: TableViewerProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const rowsPerPage = 10;
  const totalPages = Math.ceil(data.rows.length / rowsPerPage);

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

  const filteredRows = data.rows.filter((row) => {
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
                  {data.columns.map((column) => (
                    <TableHead key={column} className="whitespace-nowrap">
                      {column}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRows.length > 0 ? (
                  paginatedRows.map((row, index) => (
                    <TableRow key={index}>
                      {data.columns.map((column) => (
                        <TableCell key={column} className="whitespace-nowrap">
                          {row[column]?.toString() || "NULL"}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={data.columns.length} className="h-24 text-center">
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
