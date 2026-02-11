/* eslint-disable react-hooks/incompatible-library */
"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button, buttonVariants } from "@/components/ui/button";
import { PlusIcon, Settings2 } from "lucide-react";
import { Checkbox } from "./checkbox";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Input } from "./input";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  // Custom props
  addButton?: true | false;
  customaddButton?: React.ReactNode; // Allow React elements (e.g., buttons or dialogs)
  viewButton?: true | false;
  showSelected?: true | false;
  searchLabeledProperties?: { property: string; label?: string }[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  // Custom props
  addButton,
  customaddButton,
  viewButton,
  showSelected,
  searchLabeledProperties,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    defaultColumn: {
      size: 100, //starting column size
      minSize: 80, //enforced during column resizing
      maxSize: 200, //enforced during column resizing
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const pathname = usePathname();

  return (
    <div className="w-full">
      <div className="flex items-center">
        {searchLabeledProperties &&
          searchLabeledProperties.map((propWithName, idx) => {
            return table.getColumn(propWithName.property) ? (
              <Input
                key={idx}
                placeholder={`Search ${
                  propWithName.label || propWithName.property
                }s...`}
                value={
                  (table
                    .getColumn(propWithName.property)
                    ?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table
                    .getColumn(propWithName.property)
                    ?.setFilterValue(event.target.value)
                }
                className="max-w-[150px] mr-2"
              />
            ) : (
              <></>
            );
          })}

        {customaddButton !== undefined ? (
          customaddButton
        ) : addButton !== false ? (
          <Link
            href={`${pathname}/new`}
            className={`${buttonVariants({
              variant: "outline",
              size: "sm",
            })} flex gap-1 items-center`}
          >
            <PlusIcon size={16} />
            Add
          </Link>
        ) : null}

        {viewButton !== false && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size={"sm"} className="ml-auto gap-2">
                <Settings2 size={16} />
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="max-h-[20rem] overflow-y-scroll"
            >
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <div
                      key={column.id}
                      className="flex items-center gap-3 capitalize p-2 border-border/50 border-b text-detail"
                    >
                      <Checkbox
                        id={column.id}
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      />
                      <label htmlFor={column.id}>
                        {/* Gets the header I defined and displays it only if it is a string, */}
                        {/* If header is a function (ex: a Sorting button) returns the ID instead */}
                        {typeof column.columnDef.header === "string"
                          ? column.columnDef.header
                              .toString()
                              .replace(/_/g, " ")
                          : column.id.replace(/_/g, " ")}
                      </label>
                    </div>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div className="rounded-md border bg-background mt-4">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex w-full justify-between flex-wrap py-4">
        {showSelected && (
          <div className="flex-1 text-subtle text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
        )}
        {data.length > 10 && (
          <div className="flex items-center justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
            <p className="text-detail pl-2 text-muted-foreground">
              Page {table.getState().pagination.pageIndex + 1} out of{" "}
              {table.getPageCount()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

//without next and prev buttons and select row counts
export function DataTable3<TData, TValue>({
  columns,
  data,
  // Custom props
  addButton,
  viewButton,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    defaultColumn: {
      size: 100, //starting column size
      minSize: 80, //enforced during column resizing
      maxSize: 200, //enforced during column resizing
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const pathname = usePathname();

  return (
    <div>
      <div className="flex items-center">
        {/* Filter a property */}
        {/* {table.getColumn("email") && (
          <Input
            placeholder="Filter emails..."
            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("email")?.setFilterValue(event.target.value)
            }
            className="max-w-[180px]"
          />
        )} */}
        {addButton !== false && (
          <Link
            href={`${pathname}/new`}
            className={`${buttonVariants({
              variant: "outline",
              size: "sm",
            })} flex gap-1 items-center`}
          >
            <PlusIcon size={16} />
            Add
          </Link>
        )}
        {viewButton !== false && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size={"sm"} className="ml-auto gap-2">
                <Settings2 size={16} />
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="max-h-[20rem] overflow-y-scroll"
            >
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <div
                      key={column.id}
                      className="flex items-center gap-2 capitalize p-2 px-4 border-border/50 border-b"
                    >
                      <Checkbox
                        id={column.id}
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      />
                      <label htmlFor={column.id}>
                        {/* Gets the header I defined and displays it only if it is a string, */}
                        {/* If header is a function (ex: a Sorting button) returns the ID instead */}
                        {typeof column.columnDef.header === "string"
                          ? column.columnDef.header
                              .toString()
                              .replace(/_/g, " ")
                          : column.id.replace(/_/g, " ")}
                      </label>
                    </div>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div className="rounded-md border bg-background mt-4">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex w-full justify-between flex-wrap py-4">
        <div className="flex items-center justify-end space-x-2">
          {/* <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button> */}
        </div>
      </div>
    </div>
  );
}
