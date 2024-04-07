"use client";
import { useEffect, useState } from "react";
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { newUser } from "@/actions/newUser";
import { Checkbox } from "./ui/checkbox";

export default function Users({ users }: { users: any[] }) {
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [userList, setUserList] = useState<any[]>(users);
    const [newUserIsAdmin, setNewUserIsAdmin] = useState(false);
    const [newUserIsOpen, setNewUserIsOpen] = useState(false);

    useEffect(() => {
        setUserList(users);
    }, [users]);

    function handleDelete(id: string) {
        if (deleteId === id) {
            deleteUser(id)
                .then(() => {
                    toast.success("User deleted.");
                    setDeleteId(null);
                    setUserList(userList.filter((u) => u.id !== id));
                })
                .catch((e) => {
                    console.error(e);
                    toast.error(e.message);
                });
        } else {
            setDeleteId(id);
        }
    }

    function newUserWrapper(e: FormData) {
        e.append("admin", newUserIsAdmin ? "true" : "false");
        newUser(e)
            .then((res) => {
                console.log(res);
                setUserList([...userList, res]);
                setNewUserIsOpen(false);
                toast.success("User created.");
            })
            .catch((e) => {
                console.error(e);
                toast.error(e.message);
            });
    }

    return (
        <div className="flex flex-row justify-center w-full">
            <div style={{ width: "clamp(320px, 70%, 1024px)" }}>
                <div className="mt-4 md:mt-12 mx-2 md:mx-6">
                    <div className="flex flex-row w-full justify-between my-2 items-center">
                        <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold my-8">
                            Users
                        </h1>
                        <Dialog open={newUserIsOpen} onOpenChange={setNewUserIsOpen}>
                            <DialogTrigger asChild>
                                <Button>New User</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <form action={newUserWrapper}>
                                    <DialogHeader>
                                        <DialogTitle>Add User</DialogTitle>
                                        <DialogDescription>
                                            Add a new user to the system.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label
                                                htmlFor="username"
                                                className="text-right"
                                            >
                                                Username
                                            </Label>
                                            <Input
                                                id="username"
                                                name="username"
                                                placeholder="sami yousef"
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label
                                                htmlFor="name"
                                                className="text-right"
                                            >
                                                Password
                                            </Label>
                                            <Input
                                                id="password"
                                                placeholder="********"
                                                className="col-span-3"
                                                type="password"
                                                name="password"
                                            />
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="admin"
                                                checked={newUserIsAdmin}
                                                onCheckedChange={(checked) =>
                                                    setNewUserIsAdmin(
                                                        checked ==
                                                            "indeterminate"
                                                            ? false
                                                            : checked
                                                    )
                                                }
                                            />
                                            <label
                                                htmlFor="admin"
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                User is an admin?
                                            </label>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit">
                                            Save changes
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
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
                            {userList.map((user) => (
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
