"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTeams } from "@/hooks/useTeam";
import DashboardLayout from "@/layout/dashboardLayout";
import api from "@/libs/api";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function createProjectPage() {
    const { team_slug } = useParams();
    const { data: teams } = useTeams();

    const teamSlug = Array.isArray(team_slug)
        ? team_slug[0]
        : (team_slug as string | undefined);

    const [formData, setFormData] = useState({
        team_slug: teamSlug,
        name: "",
        password: "",
        region: "eu"
    })

    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const response = await api().post("/projects", formData);
        console.log(response)
        if (response.status === 201) {
            window.location.href = "/dashboard/project/" + response.data.slug
        }
    }

    const updateField = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <DashboardLayout>
            <div className="flex justify-center py-16">
                <form onSubmit={submitForm} className="w-full max-w-2xl rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-100 shadow-lg">

                    {/* Header */}
                    <div className="border-b border-neutral-800 px-6 py-5">
                        <h1 className="text-lg font-semibold">Create a new project</h1>
                        <p className="mt-1 text-sm text-neutral-400">
                            Your project will have its own dedicated instance and full Postgres database.
                            An API will be set up so you can easily interact with your new database.
                        </p>
                    </div>

                    {/* Form */}
                    <div className="space-y-6 px-6 py-6">

                        {/* Organization */}
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label>Organization</Label>
                            {(Array.isArray(teams) ? teams : teams ? [teams] : []).length === 0 ? (
                                <div className="col-span-2 h-9 flex items-center rounded-md border border-dashed border-neutral-700 bg-neutral-900 px-3 text-sm text-neutral-400">
                                    No organization available
                                </div>
                            ) : (
                                <div className="col-span-2">
                                    <Select
                                        name="team"
                                        value={formData.team_slug}
                                        onValueChange={(value) => updateField("team_slug", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select organization" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {(teams ?? []).map((team: any) => (
                                                <SelectItem key={team.slug} value={team.slug}>
                                                    <span className="flex items-center justify-between w-full">
                                                        <span>{team.name}</span>
                                                        <span className="ml-2 text-xs text-neutral-400">
                                                            {team.pricingPlan.name.charAt(0).toUpperCase() +
                                                                team.pricingPlan.name.slice(1)}{" "}
                                                            Plan
                                                        </span>
                                                    </span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>

                        {/* Project name */}
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label>Project name</Label>
                            <Input
                                className="col-span-2"
                                placeholder="Project name"
                                name="name"
                                onChange={(e) => updateField("name", e.target.value)}
                            />
                        </div>

                        {/* Database password */}
                        <div className="grid grid-cols-3 items-start gap-4">
                            <Label>Database password</Label>
                            <div className="col-span-2 space-y-2">
                                <Input
                                    placeholder="Type in a strong password"
                                    name="password"
                                    onChange={(e) => updateField("password", e.target.value)}
                                />
                                <p className="text-xs text-neutral-400">
                                    This is the password to your Postgres database, so it must be strong and hard to guess.{' '}
                                    <button className="text-emerald-400 hover:underline">
                                        Generate a password
                                    </button>
                                </p>
                            </div>
                        </div>

                        {/* Region */}
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label>Region</Label>
                            <Select value={formData.region} name='region' onValueChange={value => updateField("region", value)}>
                                <SelectTrigger className="col-span-2">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem key={"eu"} value="eu">🌍 Europe</SelectItem>
                                    <SelectItem key={"us"} value="us">🇺🇸 United States</SelectItem>
                                    <SelectItem key={"asia"} value="asia">🌏 Asia</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Collapsibles */}
                        {/* <div className="space-y-2 text-sm text-neutral-400">
                            <button className="flex items-center gap-2 hover:text-neutral-200">
                                Security options
                            </button>
                            <button className="flex items-center gap-2 hover:text-neutral-200">
                                Advanced configuration
                            </button>
                        </div> */}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 border-t border-neutral-800 px-6 py-4">
                        <Button variant="ghost">Cancel</Button>
                        <Button type='submit' className="bg-emerald-500 hover:bg-emerald-600">
                            Create new project
                        </Button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    )
}