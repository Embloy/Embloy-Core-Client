"use client";
import React, { useEffect, useState } from "react";
import { getDictionary } from "../../../dictionaries";
import { useRouter } from "next/navigation";
import { getListedJobs } from "@/lib/api/jobs";
import { Job } from "@/types/job-schema";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react"; // Assuming you're using Lucide for icons
import { EmbloySpacer } from "@/components/ui/stuff";
import { FaPhone, FaAt, FaLink, FaFacebook, FaInstagram, FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';

function JobItem({ params, job }) {
    return (
        <div className="flex w-full flex-row items-start justify-between rounded-lg border border-input bg-background px-6 py-4 dark:border-background dark:bg-border">
            <div className="flex flex-row items-start justify-start gap-6">
                <h1 className="text-sm ">{job.title}</h1>
                <div className="flex flex-row items-center">
                    <h1 className="text-xs italic">{job.city}</h1>
                    {job.country_code && <h1 className="text-sm italic">{", "}{job.country_code}</h1>}
                </div>
                
            </div>
        </div>
    );

}


function FilterItem({ label, onRemove }) {
    return (
        <div className="border-3 flex flex-row items-center gap-2 rounded-full border-high bg-low px-4 py-1">
            <p className="text-xs text-white ">{label}</p>
            <X className="size-4 cursor-pointer text-white" onClick={onRemove} />
        </div>
    );
}

function JobList({ params, jobs }) {
    function replaceNumberWithString(message: string, replacement: string): string {
        if (!message) {
            return "";
        }
        return message.replace(/\{.*?\}/, replacement);
    }

    const [dict, setDict] = useState<Record<string, any> | null>(null);
    const [filteredJobs, setFilteredJobs] = useState<Job[]>(jobs);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedCity, setSelectedCity] = useState<string | null>(null);
    const [uniqueCities, setUniqueCities] = useState<string[]>([]);

    useEffect(() => {
        const fetchDictionary = async () => {
            const dictionary = await getDictionary(params.lang);
            setDict(dictionary);
        };
        fetchDictionary();

        // Extract unique cities from job data
        const cities = Array.from(
            new Set(
                jobs
                    .filter(job => job.city)
                    .map(job => job.city)
            )
        );
        setUniqueCities(cities);
        setFilteredJobs(jobs);
    }, [params.lang, jobs]);

    useEffect(() => {
        let updatedJobs = jobs;

        if (searchQuery) {
            updatedJobs = updatedJobs.filter((job) =>
                job.title?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedCity) {
            updatedJobs = updatedJobs.filter((job) => job.city === selectedCity);
        } 

        setFilteredJobs(updatedJobs);
    }, [searchQuery, selectedCity, jobs]);

    const handleRemoveFilter = (filterType: "searchQuery" | "selectedCity") => {
        if (filterType === "searchQuery") {
            setSearchQuery("");
        } else if (filterType === "selectedCity") {
            setSelectedCity(null); // Reset selected city to ensure placeholder is shown
        }
    };

    return (
        <div className="flex w-full flex-col items-start justify-start gap-2">
            <div className="flex w-full flex-row items-center justify-between gap-2">
                <Input
                    id="qry"
                    placeholder={dict?.board.list.search}
                    type="text"
                    autoCapitalize="none"
                    autoCorrect="off"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-background"
                />
            <Select
                onValueChange={(value) => setSelectedCity(value)}
                value={selectedCity || ""}
                
            >
                <SelectTrigger className="w-[180px] bg-background dark:bg-border ">
                    <SelectValue placeholder={dict?.board.list.loc_search} />
                </SelectTrigger>
                <SelectContent className="bg-background dark:bg-border">
                    {selectedCity === null && (
                        <SelectItem value="" >
                            <p className="text-accent-foreground/60">
                                {dict?.board.list.loc_search}
                            </p>
                        </SelectItem>
                    )} 
                    
                    {uniqueCities.map((city) => (
                        <SelectItem key={city} value={city}>
                            {city}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            </div>
            <div className="h-[2px] w-full rounded-full bg-border" />
            <div className="flex w-full flex-row items-start justify-between">
                <div className="flex flex-row items-center justify-start">
                    <h1 className="text-left font-heading text-base">
                        {replaceNumberWithString(dict?.board.list.found, filteredJobs.length.toString())}
                    </h1>
                    {/* Display applied filters */}
                    <div className="ml-4 flex flex-row items-center gap-2">
                        {searchQuery && (
                            <FilterItem label={`Search: ${searchQuery}`} onRemove={() => handleRemoveFilter("searchQuery")} />
                        )}
                        {selectedCity && (
                            <FilterItem
                                label={`Location: ${selectedCity}`}
                                onRemove={() => handleRemoveFilter("selectedCity")}
                            />
                        )}
                    </div>
                </div>
            </div>
            <div className="flex w-full flex-row items-start justify-between">
                <div className="flex w-9/12 flex-col items-start justify-start">
                    {filteredJobs.map((job) => (
                        <div key={job.job_id} className="my-1.5 w-full">
                            <JobItem params={params} job={job} />
                        </div>
                    ))}
                </div>
                <div className="min-w-2/12 flex flex-col items-start justify-start"></div>
            </div>
        </div>
    );
}

export default function Page({ params }) {
    const [dict, setDict] = useState<Record<string, any> | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [jobs, setJobs] = useState<Job[]>([]);
    interface Company {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
        user_role: string;
        user_type: string;
        portfolio_url: string;
        facebook_url: string;
        instagram_url: string;
        linkedin_url: string;
        github_url: string;
        twitter_url: string | null;
        image_url: string;
    }

    const [company, setCompany] = useState<Company | null>(null);
    const [error, setError] = useState<Number | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchDictionary = async () => {
            const dictionary = await getDictionary(params.lang);
            setDict(dictionary);
        };
        fetchDictionary();

        const fetchJobs = async () => {
            setIsLoading(true);
            const { response, err } = await getListedJobs(params.slug);
            if (err) {
                setError(err);
            } else if (!response) {
                setError(500);
            } else {
                setError(null);
                setJobs(response.jobs || []);
                setCompany(response.company ? (response.company as Company) : null);
            }
            setIsLoading(false);
        };
        fetchJobs();
    }, [params.slug, router, params.lang]);

    return (
        dict && (
            <div className="flex flex-col items-start justify-start px-4 py-1.5">
                <div className="w-full rounded-lg bg-secondary p-4">
                    {isLoading ? (
                        <div className="flex flex-row items-center justify-center">
                            <p className="italic text-muted-foreground">Loading</p>
                            <div role="status">
                                <svg
                                    aria-hidden="true"
                                    className="ml-2 inline size-4 animate-spin fill-white text-gray-500"
                                    viewBox="0 0 100 101"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="currentFill"
                                    />
                                </svg>
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                    ) : error ? (
                        (error.toString() === "404" || error.toString() === "403") ? (
                            <div className="flex w-full flex-col items-start justify-start">
                                <h1 className="text-left font-heading text-xl">
                                    {dict.board.list._404.head}
                                </h1>
                                <p className="text-left text-sm text-muted-foreground dark:text-muted-foreground">
                                    {dict.board.list._404.subHead}
                                </p>
                            </div>
                        ) : (
                            <div className="flex w-full flex-col items-start justify-start">
                                <h1 className="text-left font-heading text-xl">
                                    {dict.board.list._500.head}
                                </h1>
                                <p className="text-left text-sm text-muted-foreground dark:text-muted-foreground">
                                    {dict.board.list._500.subHead}
                                </p>
                            </div>
                        )
                    ) : (
                        <div className="flex w-full flex-col items-start justify-start">
                            <div className="flex w-full flex-col items-start justify-start">
                                <div className="flex w-full flex-row items-start justify-between">
                                    <div className="flex w-5/12 flex-row items-start justify-start">
                                    </div>
                                    <div className="flex w-2/12 flex-row items-start justify-center">
                                        {company?.image_url ? (
                                            <Image
                                                src={company.image_url}
                                                alt="Company Logo"
                                                width={50}
                                                height={50}
                                                className="rounded-full"
                                            />
                                        ) : (
                                            <h1 className="text-left font-heading text-2xl">
                                                {company?.first_name}
                                            </h1>
                                        )}
                                    </div>
                                    <div className="flex w-5/12 flex-row items-start justify-end">
                                        <div className="flex flex-col items-start justify-start gap-2">
                                            <p className="w-full text-right text-xs">{company?.first_name}{" "}{company?.last_name}</p>
                                            <div className="flex w-full flex-row items-start justify-end">
                                                {company?.phone && (
                                                    <button 
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(company.phone);
                                                            alert("Phone number copied to clipboard!"); // Optional: Alert to notify the user
                                                        }}
                                                        className="mx-1 cursor-copy"
                                                    >
                                                        <FaPhone className="text-gray-800 dark:text-gray-200" />
                                                    </button>
                                                )}
                                                {company?.email && (
                                                    <button 
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(company.email);
                                                            alert("Email copied to clipboard!"); // Optional: Alert to notify the user
                                                        }}
                                                        className="mx-1 cursor-copy"
                                                    >
                                                        <FaAt className="text-gray-800 dark:text-gray-200" />
                                                    </button>
                                                )}
                                                {company?.portfolio_url && (
                                                    <a href={company.facebook_url} target="_blank" rel="noopener noreferrer" className="mx-1">
                                                        <FaLink className="text-gray-800 dark:text-gray-200" />
                                                    </a>
                                                )}
                                                {company?.facebook_url && (
                                                    <a href={company.facebook_url} target="_blank" rel="noopener noreferrer" className="mx-1">
                                                        <FaFacebook className="text-blue-600" />
                                                    </a>
                                                )}
                                                {company?.instagram_url && (
                                                    <a href={company.instagram_url} target="_blank" rel="noopener noreferrer" className="mx-1">
                                                        <FaInstagram className="text-pink-500" />
                                                    </a>
                                                )}
                                                {company?.linkedin_url && (
                                                    <a href={company.linkedin_url} target="_blank" rel="noopener noreferrer" className="mx-1">
                                                        <FaLinkedin className="text-blue-700" />
                                                    </a>
                                                )}
                                                {company?.github_url && (
                                                    <a href={company.github_url} target="_blank" rel="noopener noreferrer" className="mx-1">
                                                        <FaGithub className="text-gray-800 dark:text-gray-200" />
                                                    </a>
                                                )}
                                                {company?.twitter_url && (
                                                    <a href={company.twitter_url} target="_blank" rel="noopener noreferrer" className="mx-1">
                                                        <FaTwitter className="text-blue-400" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-left text-sm text-muted-foreground dark:text-muted-foreground">
                                    {dict.board.list.subHead}
                                </p>
                            </div>
                            <EmbloySpacer className={"h-4"} />
                            <JobList params={params} jobs={jobs} />
                        </div>
                    )}
                </div>
            </div>
        )
    );
}
