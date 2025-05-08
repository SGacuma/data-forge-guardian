
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DatabaseConnection } from "@/types/database";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  type: z.enum(["mysql", "postgres", "sqlite", "mssql", "oracle"], {
    required_error: "Database type is required.",
  }),
  host: z.string().min(1, {
    message: "Host is required.",
  }),
  port: z.coerce.number().int().positive(),
  username: z.string().min(1, {
    message: "Username is required.",
  }),
  password: z.string().optional(),
  database: z.string().min(1, {
    message: "Database name is required.",
  }),
});

interface ConnectionFormProps {
  connection?: DatabaseConnection;
  onSave: (connection: Omit<DatabaseConnection, 'id' | 'status' | 'lastConnected'>) => void;
}

export function ConnectionForm({ connection, onSave }: ConnectionFormProps) {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: connection
      ? {
          name: connection.name,
          type: connection.type,
          host: connection.host,
          port: connection.port,
          username: connection.username,
          database: connection.database,
        }
      : {
          name: "",
          type: "postgres",
          host: "localhost",
          port: 5432,
          username: "",
          database: "",
          password: "",
        },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsConnecting(true);

    // Simulate connection testing
    setTimeout(() => {
      setIsConnecting(false);
      
      // In a real app, you would test the connection here

      toast({
        title: "Connection successful",
        description: `Successfully connected to ${values.database}`,
      });

      onSave({
        ...values,
        favorite: connection?.favorite ?? false,
      });
    }, 1500);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Connection Name</FormLabel>
              <FormControl>
                <Input placeholder="My Database Connection" {...field} />
              </FormControl>
              <FormDescription>
                A friendly name to identify this connection
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Database Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a database type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="mysql">MySQL</SelectItem>
                  <SelectItem value="postgres">PostgreSQL</SelectItem>
                  <SelectItem value="sqlite">SQLite</SelectItem>
                  <SelectItem value="mssql">SQL Server</SelectItem>
                  <SelectItem value="oracle">Oracle</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                The type of database to connect to
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="host"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Host</FormLabel>
                <FormControl>
                  <Input placeholder="localhost" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="port"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Port</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="database"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Database Name</FormLabel>
              <FormControl>
                <Input placeholder="my_database" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-dbforge-teal hover:bg-dbforge-teal/90"
            disabled={isConnecting}
          >
            {isConnecting ? "Testing Connection..." : "Test & Save Connection"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default ConnectionForm;
