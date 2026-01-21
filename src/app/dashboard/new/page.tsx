"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DashboardLayout from "@/layout/dashboardLayout";
import api from "@/libs/api";
import { useState } from "react";

export default function newOrganizationPage() {
    const [formData, setFormData] = useState({
        name: "",
        type: "PERSONAL"
    })

    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(formData)
        const response = await api().post("/teams", formData);

        if (response.status === 201) {
            window.location.href = "/dashboard/new/" + response.data.team.slug
        }
    }

    const updateField = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    return (
        <DashboardLayout>
            <div className="flex justify-center py-16">
                <form onSubmit={submitForm} className="w-full max-w-2xl rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-100 shadow-lg">

                    {/* Header */}
                    <div className="border-b border-neutral-800 px-6 py-5">
                        <h1 className="text-lg font-semibold">Create a new team</h1>
                        <p className="mt-1 text-sm text-neutral-400">
                            Organizations are a way to group your projects. Each organization<br /> can be configured with different team members and billing settings.
                        </p>
                    </div>

                    {/* Form */}
                    <div className="space-y-6 px-6 py-6">

                        {/* Project name */}
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label>Name</Label>
                            <Input
                                className="col-span-2"
                                placeholder="Team Name"
                                onChange={(e) => updateField("name", e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label>Type</Label>
                            <Select defaultValue={formData.type} onValueChange={value => updateField("type", value)}>
                                <SelectTrigger className="col-span-2">
                                    <SelectValue placeholder="Select account type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PERSONAL">Personal</SelectItem>
                                    <SelectItem value="EDUCATIONAL">Educational</SelectItem>
                                    <SelectItem value="STARTUP">Startup</SelectItem>
                                    <SelectItem value="AGENCY">Agency</SelectItem>
                                    <SelectItem value="COMPANY">Company</SelectItem>
                                    <SelectItem value="UNDISCLOSED">N/A</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 border-t border-neutral-800 px-6 py-4">
                        <Button variant="ghost">Cancel</Button>
                        <Button className="bg-emerald-500 hover:bg-emerald-600">
                            Create new project
                        </Button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    )
}