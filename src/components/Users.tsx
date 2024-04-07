"use client";
import { Suspense, useState } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { deleteUser } from "@/actions/delete";
import { toast } from "sonner";

export default function Users({ users }: { users: any[] }) {
    const [deleteId, setDeleteId] = useState<string | null>(null);

    function handleDelete(id: string) {
        if (deleteId === id) {
            deleteUser(id).then(() => {
                toast.success("User deleted.");
                setDeleteId(null);
            }).catch((e) => {
                console.error(e);
                toast.error(e.message);
            })
        } else {
            setDeleteId(id);
        }
    }

    return (
        <div className="flex flex-row justify-center w-full">
            <div style={{ width: "clamp(320px, 70%, 1024px)" }}>
                <div className="mt-4 md:mt-12 mx-2 md:mx-6">
                    <div className="flex flex-row w-full justify-between my-2 items-center">
                        <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold my-8">
                            Users
                        </h1>
                        <Button>New User</Button>
                    </div>
                    <Table>
                        <TableCaption>
                            A list of users on the system.
                        </TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Username</TableHead>
                                <TableHead className="w-[70px]">
                                    Admin
                                </TableHead>
                                <TableHead className="text-right w-[90px]">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>
                                        {user.admin ? "Yes" : "No"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <span
                                            className="hover:underline text-red-500 cursor-pointer"
                                            onClick={() => {
                                                handleDelete(user.id);
                                            }}
                                        >
                                            {deleteId === user.id
                                                ? "confirm?"
                                                : "delete"}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Username</TableCell>
                                <TableCell>Admin</TableCell>
                                <TableCell className="text-right">
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
            </div>
        </div>
    );
}
