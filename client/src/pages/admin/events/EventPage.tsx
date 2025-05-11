"use client";

import * as React from "react";
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Link } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";

export type Event = {
  _id: string;
  name: string;
  description: string;
  region: string;
  city: string;
  skillLevel: string;
  startDate: string;
  endDate: string;
  location: string;
  numberOfVolunteer: number;
  eventPic: any;
  volunteers: any[];
};

export function AdminEventPage() {
  const { user } = useAuth();
  const [events, setEvents] = React.useState<Event[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch data from API
  React.useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/event/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user?.token}`,
            // Do NOT add "Content-Type": "multipart/form-data" (browser will set it automatically)
          },
        });
        
        if (!response.ok) throw new Error("Failed to fetch events");

        const data = await response.json();
        setEvents(data.data);
      } catch (error) {
        setError("Error fetching events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  
  const handleDelete = async (eventId: string) => {  
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/event/${eventId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete event.");
      }
  
      // Remove the deleted volunteer from the local state
      setEvents((prevData) => prevData.filter((v) => v._id !== eventId));
  
      toast.success("Event deleted successfully!");
    } catch (error: any) {
      toast.error(error.message || 'Error Occured');
    }
  };
  

  const columns: ColumnDef<Event>[] = [
    {
      accessorKey: "eventPic",
      header: "Image",
      cell: ({ row }) => (
        <img
          src={`${row.original.eventPic}`}
          alt="Event"
          className="w-12 h-12 object-cover rounded"
        />
      ),
    },
    {
      accessorKey: "name",
      header: "Event Name",
    },
    {
      accessorKey: "region",
      header: "Region",
    },
    {
      accessorKey: "city",
      header: "City",
    },
    {
      accessorKey: "skillLevel",
      header: "Skill Level",
      cell: ({ row }) => (
        <span className="capitalize">{row.getValue("skillLevel")}</span>
      ),
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ row }) => new Date(row.getValue("startDate")).toLocaleDateString(),
    },
    {
      accessorKey: "endDate",
      header: "End Date",
      cell: ({ row }) => new Date(row.getValue("endDate")).toLocaleDateString(),
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      accessorKey: "numberOfVolunteer",
      header: "Volunteers Needed",
    },
    {
      accessorKey: "volunteers",
      header: "Enrolled",
      cell: ({ row }) => <div>{row.original.volunteers.length}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const event = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(event._id)}
              >
                Copy Event ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to={`/admin/view-event/${event._id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to={`/admin/update-event/${event._id}`}>
                  Edit Event
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(event._id)}>
                Delete Event
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: events,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-[90%] m-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl mt-4">Events Management</h1>
        <Link to="/admin/add-event">
          <Button variant="default" className="mt-4">
            Add New Event
          </Button>
        </Link>
      </div>

      {loading && <p>Loading events...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter events by name..."
              value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="my-4 rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No events found. 
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
}
