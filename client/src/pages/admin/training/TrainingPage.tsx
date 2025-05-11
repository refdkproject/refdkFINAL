'use client';

import * as React from 'react';
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
} from '@tanstack/react-table';
import { ChevronDown, MoreHorizontal } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-toastify';

export type Volunteer = {
  _id: string;
  title: string;
  description: string;
  tags: string;
  mediaUrl: string;
  createdAt: string;
  updatedAt: string;
};

export function AdminTraining() {
  const { user } = useAuth();
  const [data, setData] = React.useState<Volunteer[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

  React.useEffect(() => {
    const fetchVolunteers = async () => {
      if (!user?.token || !user?.institution?._id) return;

      try {

        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/training/${user.institution._id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Failed to fetch training videos.');
        }

        if (result.success) {
          setData(result.data);
          console.log(result.data);
        } else {
          throw new Error(result.message || 'Failed to fetch training videos.');
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
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/training/${volunteerId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete training.');
      }

      // Remove the deleted volunteer from the local state
      setData((prevData) => prevData.filter((v) => v._id !== volunteerId));

      toast.success('Training Item deleted successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Error Occured');
    }
  };

  const columns: ColumnDef<Volunteer>[] = [
    {
      accessorKey: 'mediaUrl',
      header: 'Media',
      cell: ({ row }) => (
        <video className='w-[200px] h-[100px] object-cover' controls src={row.getValue('mediaUrl')}></video>
      ),
    },
    {
      accessorKey: 'title',
      header: 'Title',
    },
    {
      accessorKey: 'description',
      header: 'Description',
    },
    {
      accessorKey: 'tags',
      header: 'Organization',
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ row }) => new Date(row.getValue('createdAt')).toLocaleString(),
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const volunteer = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(volunteer._id)}>
                Copy Volunteer ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* <DropdownMenuItem>
                <Link to={`/admin/update-institution-engagement/${volunteer._id}`}>
                  View Volunteer
                </Link>
              </DropdownMenuItem> */}
              <DropdownMenuItem>
                <Link to={`/admin/update-training/${volunteer._id}`}>Edit</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(volunteer._id)}>Delete</DropdownMenuItem>
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

  if (loading) return <p>Loading trainings...</p>;
  if (error) return <p className='text-black-500'>Some cache is mixed. Kindly reload the page...</p>;

  return (
    <div className='w-[90%] m-auto'>
      <h1 className='text-3xl mt-4'>Charity Center Tutorials</h1>
      <div className='flex justify-between items-center'>
        <h1 className='text-xl mt-4'>Trainings</h1>
        <Link to='/admin/add-training'>
          <Button variant='default' className='mt-4'>
            Add New Training
          </Button>
        </Link>
      </div>

      { !loading && !error && (
        <>
          <div className='flex items-center py-4'>
            <Input
              placeholder='Filter trainings by name...'
              value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
              onChange={(event) => table.getColumn('title')?.setFilterValue(event.target.value)}
              className='max-w-sm'
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' className='ml-auto'>
                  Columns <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className='capitalize'
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className='rounded-md border'>
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
              { table.getRowModel().rows.length > 0 ? ( table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                )) ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No trainings found. 
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
