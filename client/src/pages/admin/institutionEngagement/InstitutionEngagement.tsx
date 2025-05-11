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
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";

export type Volunteer = {
  _id: string;
  volunteerName: string;
  description: string;
  eventName: string;
  assignedBy: string;
  volunteerPic: string;
  institution: string;
  createdAt: string;
  updatedAt: string;
};

export function AdminInstitutionEngagement() {
  const { user } = useAuth();
  const [data, setData] = React.useState<Volunteer[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

  React.useEffect(() => {
    const fetchVolunteers = async () => {
      if (!user?.token) return;

      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/institution-engagements`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch volunteers.");
        }

        const result = await response.json();
        if (result.success) {
          setData(result.data);
        } else {
          throw new Error(result.message || "Failed to fetch volunteers.");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteers();
  }, [user]);

  const handleDelete = async (volunteerId: string) => {
  
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/institution-engagements/${volunteerId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete volunteer.");
      }
  
      // Remove the deleted volunteer from the local state
      setData((prevData) => prevData.filter((v) => v._id !== volunteerId));
  
      toast.success("Volunteer deleted successfully!");
    } catch (error: any) {
      toast.error(error.message || 'Error Occured');
    }
  };

  const columns: ColumnDef<Volunteer>[] = [
    {
      accessorKey: "volunteerPic",
      header: "Image",
      cell: ({ row }) => (
        <img
          src={`${row.original.volunteerPic}`}
          alt="Event"
          className="w-12 h-12 object-cover rounded"
        />
      ),
    },
    {
      accessorKey: "volunteerName",
      header: "Volunteer Name",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "eventName",
      header: "Event Name",
    },
    {
      accessorKey: "assignedBy",
      header: "Assigned By",
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleString(),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const volunteer = row.original;
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
                onClick={() => navigator.clipboard.writeText(volunteer._id)}
              >
                Copy Volunteer ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* <DropdownMenuItem>
                <Link to={`/admin/update-institution-engagement/${volunteer._id}`}>
                  View Volunteer
                </Link>
              </DropdownMenuItem> */}
              <DropdownMenuItem>
                <Link to={`/admin/update-institution-engagement/${volunteer._id}`}>
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(volunteer._id)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnVisibility,
    },
  });

  if (loading) return <p>Loading volunteer's achievements...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="w-[90%] m-auto">
      <h1 className="text-3xl mt-8">Discover</h1>
      <div className="flex justify-between items-center">
        <h1 className="text-xl mt-4">Institution Engagement</h1>
        <Link to='/admin/add-institution-engagement'>
          <Button variant="default" className="mt-4">Add New Engagement</Button>
        </Link>
      </div>

      { !loading && !error && (
        <>
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter volunteers..."
              value={(table.getColumn("volunteerName")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("volunteerName")?.setFilterValue(event.target.value)
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
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length > 0 ? 
                  ( table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                )) ): (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center">
                      No volunteers found.
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
