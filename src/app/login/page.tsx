"use client";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import signIn from "@/actions/signin";
import { toast } from "sonner";

export default function Login() {
    return (
        <div className="w-full h-screen flex flex-row justify-center items-center">
            <Card className="w-[350px]">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const form = e.currentTarget as HTMLFormElement;
                        const username = form.username.value;
                        const password = form.password.value;
                        signIn(username, password).then(() => {
                            window.location.href = "/";
                        }).catch((err) => {
                            console.error(err);
                            toast.error(err.message);
                        });
                    }}
                >
                    <CardHeader>
                        <CardTitle>Login</CardTitle>
                        <CardDescription>
                            Please enter your credentials to login.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Username</Label>
                                <Input id="username" placeholder="Username" />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    placeholder="********"
                                    type="password"
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Button>Login</Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
