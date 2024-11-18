"use client";
import React, { useEffect, useState, useRef } from "react";
import { getDictionary } from "../../../dictionaries";
import { useRouter } from "next/navigation";
import { getListedJobs } from "@/lib/api/jobs";
import { Job } from "@/types/job-schema";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bookmark, MapPin, Share2, X, AlignEndHorizontal, Building2} from "lucide-react"; // Assuming you're using Lucide for icons
import { EmbloySpacer } from "@/components/ui/stuff";
import { FaPhone, FaAt, FaLink, FaFacebook, FaInstagram, FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';
import { cn, replaceNumberWithString } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";
import { siteConfig } from "@/config/site";
import parse, { domToReact } from 'html-react-parser';

function JobItem({ params, job }) {
    const [dict, setDict] = useState<Record<string, any> | null>(null);
    const [shareDropdownOpen, setShareDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchDictionary = async () => {
            const dictionary = await getDictionary(params.lang);
            setDict(dictionary);
        };
        fetchDictionary();
    }, [params.lang]);

    // Handle click outside dropdown to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShareDropdownOpen(false);
            }
        };
        if (shareDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [shareDropdownOpen]);

    const toggleShareDropdown = () => setShareDropdownOpen(!shareDropdownOpen);

    return (
        <div className="relative flex w-full flex-col items-start justify-start gap-5 rounded-sm border border-input bg-background p-3 dark:border-background dark:bg-border md:flex-row md:items-center md:justify-between md:gap-0 md:px-6">
            <div className="flex flex-col items-start justify-start gap-0.5 md:flex-row md:items-center md:gap-6">
                <Link href={`/${params.lang}/board/${params.slug}/${job.job_slug}`}>
                    <h1 className="font-heading text-base">{job.title}</h1>
                </Link>
                {job.city && (
                    <div className="flex flex-row items-center rounded-full border px-2 dark:border-background dark:text-muted-foreground">
                        
                            <h1 className="flex flex-row items-center justify-start gap-1.5 text-xs">
                                <MapPin className="size-3" />
                                {job.city}
                            </h1>
                        
                        {job.country_code && <h1 className="text-xs">{", "}{job.country_code}</h1>}
                    </div>
                )}
                {job.job_type && (
                    <div className="flex flex-row items-center rounded-full border px-2 dark:border-background dark:text-muted-foreground">
                        
                            <h1 className="flex flex-row items-center justify-start gap-1.5 text-xs">
                                <AlignEndHorizontal className="size-3" />
                                {job.job_type}
                            </h1>
                    </div>
                )}
            </div>
            <div className="flex w-full flex-row items-center justify-between md:w-fit md:justify-start md:gap-16">
                <div className="relative flex flex-row items-center justify-start gap-3">
                    <Button
                        onClick={toggleShareDropdown}
                        className={cn(buttonVariants({ variant: "transparent", size: "default" }), "h-fit p-0 font-semibold text-muted-foreground hover:text-secondary-foreground")}
                    >
                        <Share2 strokeWidth={3} className="size-4" />
                    </Button>
                    {shareDropdownOpen && (
                        <div ref={dropdownRef} className="absolute z-50 mt-2 min-w-48 rounded-md border bg-white p-2 shadow-lg dark:bg-popover md:right-0">
                            <Button variant="ghost" onClick={() => {setShareDropdownOpen(false); }} disabled={true} className="block w-full px-4 py-2 text-left text-sm">
                                Share via Email
                            </Button>
                            <Button variant="ghost"onClick={() => {setShareDropdownOpen(false); }} disabled={true} className="block w-full px-4 py-2 text-left text-sm">
                                Share on LinkedIn
                                </Button>
                            <Button variant="ghost" onClick={() => {
                                navigator.clipboard.writeText(`${window.location.href}/${job.job_slug}`); 
                                setShareDropdownOpen(false); 
                                return toast({
                                    title: replaceNumberWithString(dict?.board.list.copied, "Link"),
                                    variant: "default",
                                  })
                                }} className="block w-full px-4 py-2 text-left text-sm">
                                {dict?.board.list.copy}
                            </Button>
                        </div>
                    )}

                    <Button className={cn(buttonVariants({ variant: "transparent", size: "default" }), "h-fit p-0 font-semibold text-muted-foreground hover:text-secondary-foreground")}>
                        <Bookmark strokeWidth={3} className="size-4" />
                    </Button>
                </div>
                <div className="flex flex-row items-center justify-start gap-2">
                    <Link
                        href={`/${params.lang}/board/${params.slug}/${job.job_slug}`}
                        className={cn(buttonVariants({ variant: "link", size: "default" }), "h-fit p-0 text-xs text-muted-foreground")}
                    >
                        {dict?.board.list.more}
                    </Link>
                    <Link
                        href={`${siteConfig.apply_url}/?eType=manual&mode=job&id=${params.slug}&url=${siteConfig.url}/${params.lang}/board/${params.slug}/${job.job_slug}`}
                        className={cn(buttonVariants({ variant: "ghost", size: "default" }), "h-fit p-0 px-2 font-semibold")}
                    >
                        {dict?.board.list.apply}
                    </Link>
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

function JobList({ params, jobs, excludeHeader, excludeFooter }) {
    

    const [dict, setDict] = useState<Record<string, any> | null>(null);
    const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedCity, setSelectedCity] = useState<string | null>(null);
    const [uniqueCities, setUniqueCities] = useState<string[]>([]);
    const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

        const categories = Array.from(
            new Set(
                jobs
                    .filter(job => job.job_type)
                    .map(job => job.job_type)
            )
        );
        setUniqueCategories(categories);

        // Sort jobs by job_type, accounting for possible null values
        const sortedJobs = [...jobs].sort((a, b) => {
            if (!a.job_type) return 1; // Treat null job_type as greater (put it last)
            if (!b.job_type) return -1;
            return a.job_type.localeCompare(b.job_type);
        });
        setFilteredJobs(sortedJobs);

    }, [params.lang, jobs]);

    useEffect(() => {
        let updatedJobs = [...jobs];

        if (searchQuery) {
            updatedJobs = updatedJobs.filter((job) =>
                job.title?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedCity) {
            updatedJobs = updatedJobs.filter((job) => job.city === selectedCity);
        } 
        
        if (selectedCategory) {
            updatedJobs = updatedJobs.filter((job) => job.job_type === selectedCategory);
        }

        // Sort filtered jobs by job_type, accounting for possible null values
        updatedJobs.sort((a, b) => {
            if (!a.job_type) return 1;
            if (!b.job_type) return -1;
            return a.job_type.localeCompare(b.job_type);
        });

        setFilteredJobs(updatedJobs);
    }, [searchQuery, selectedCity, selectedCategory, jobs]);

    const handleRemoveFilter = (filterType: "searchQuery" | "selectedCity" | "selectedCategory") => {
        if (filterType === "searchQuery") {
            setSearchQuery("");
        } else if (filterType === "selectedCity") {
            setSelectedCity(null);
        } else if (filterType === "selectedCategory") {
            setSelectedCategory(null);
        }
    };

    return (
        <div className="flex w-full flex-col xl:flex-row items-start justify-between gap-6">
            <div className="xl:hidden p-4 w-full flex flex-col items-start justify-start gap-6 rounded-lg bg-secondary">
                <div className="flex flex-col items-start justify-start gap-2">
                    <h1 className="text-left font-heading text-xl">
                        {replaceNumberWithString(dict?.board.list.found, filteredJobs.length.toString())}
                    </h1>
                </div>
                <div className="flex w-full flex-col items-start justify-start gap-2">
                    <Input
                        id="qry"
                        placeholder={dict?.board.list.search}
                        type="text"
                        autoCapitalize="none"
                        autoCorrect="off"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-background focus:ring-0"
                    />
                    <Select
                        onValueChange={(value) => setSelectedCity(value)}
                        value={selectedCity || ""}
                    >
                        <SelectTrigger className="w-full bg-background focus:ring-0 dark:bg-border">
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
                    <Select
                        onValueChange={(value) => setSelectedCategory(value)}
                        value={selectedCategory || ""}
                    >
                        <SelectTrigger className="w-full bg-background focus:ring-0 dark:bg-border">
                            <SelectValue placeholder={dict?.board.list.cat_search} />
                        </SelectTrigger>
                        <SelectContent className="bg-background dark:bg-border">
                            {selectedCategory === null && (
                                <SelectItem value="" >
                                    <p className="text-accent-foreground/60">
                                        {dict?.board.list.cat_search}
                                    </p>
                                </SelectItem>
                            )} 
                            {uniqueCategories.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                    {cat}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    
                </div>
                <div className="flex flex-col items-start justify-start gap-2">
                    <div className="flex flex-col items-start justify-start gap-1.5">
                        {searchQuery && (
                            <FilterItem label={`Search: ${searchQuery}`} onRemove={() => handleRemoveFilter("searchQuery")} />
                        )}
                        {selectedCity && (
                            <FilterItem
                                label={`Location: ${selectedCity}`}
                                onRemove={() => handleRemoveFilter("selectedCity")}
                            />
                        )}
                        {selectedCategory && (
                            <FilterItem
                                label={`Category: ${selectedCategory}`}
                                onRemove={() => handleRemoveFilter("selectedCategory")}
                            />
                        )}
                    </div>
                </div>


            </div>
            <div className="hidden w-3/12 flex-col items-start justify-start gap-6 rounded-lg bg-secondary p-4 xl:flex">
                <div className="flex flex-col items-start justify-start gap-2">
                    <h1 className="text-left font-heading text-xl">
                        {replaceNumberWithString(dict?.board.list.found, filteredJobs.length.toString())}
                    </h1>
                </div>
                <div className="flex w-full flex-col items-start justify-start gap-2">
                    <Input
                        id="qry"
                        placeholder={dict?.board.list.search}
                        type="text"
                        autoCapitalize="none"
                        autoCorrect="off"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-background focus:ring-0"
                    />
                    <Select
                        onValueChange={(value) => setSelectedCity(value)}
                        value={selectedCity || ""}
                    >
                        <SelectTrigger className="w-full bg-background focus:ring-0 dark:bg-border">
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
                    <Select
                        onValueChange={(value) => setSelectedCategory(value)}
                        value={selectedCategory || ""}
                    >
                        <SelectTrigger className="w-full bg-background focus:ring-0 dark:bg-border">
                            <SelectValue placeholder={dict?.board.list.cat_search} />
                        </SelectTrigger>
                        <SelectContent className="bg-background dark:bg-border">
                            {selectedCategory === null && (
                                <SelectItem value="" >
                                    <p className="text-accent-foreground/60">
                                        {dict?.board.list.cat_search}
                                    </p>
                                </SelectItem>
                            )} 
                            {uniqueCategories.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                    {cat}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <EmbloySpacer className={"h-4"} />
                <div className="flex flex-col items-start justify-start gap-2">
                    <div className="flex flex-col items-start justify-start gap-1.5">
                        {searchQuery && (
                            <FilterItem label={`Search: ${searchQuery}`} onRemove={() => handleRemoveFilter("searchQuery")} />
                        )}
                        {selectedCity && (
                            <FilterItem
                                label={`Location: ${selectedCity}`}
                                onRemove={() => handleRemoveFilter("selectedCity")}
                            />
                        )}
                        {selectedCategory && (
                            <FilterItem
                                label={`Category: ${selectedCategory}`}
                                onRemove={() => handleRemoveFilter("selectedCategory")}
                            />
                        )}
                    </div>
                </div>
            </div>
            <div className="flex w-full flex-col items-start justify-start rounded-lg bg-secondary p-4 xl:w-9/12">
                {filteredJobs.map((job) => (
                    <div key={job.job_id} className="my-1.5 w-full">
                        <JobItem params={params} job={job} />
                    </div>
                ))}
            </div>
          
        </div>
    );
}

export function Stats ({ dict, company, className }) {
    if (company.company_industry) {
        return (
            <>
            <div className="flex flex-wrap items-start justify-start gap-2">
                <div className={cn("flex flex-row items-center rounded-full border px-2 dark:border-background dark:text-muted-foreground", className)}>
                    <h1 className="flex flex-row items-center justify-start gap-1.5 text-xs">
                        <Building2 className="size-3" />
                        {company.company_industry}
                    </h1>
                </div>
            </div>
            <EmbloySpacer className={"h-[4px]"} />
            </>
        );} 
    return null;
}

export function Socials({ dict, company }) {
  const facebookRegex = /^(https?:\/\/)?(www\.)?facebook\.com\/[A-Za-z0-9_.-]+\/?$/;
  const githubRegex = /^(https?:\/\/)?(www\.)?github\.com\/[A-Za-z0-9_.-]+\/?$/;
  const linkedinRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/(company|in)\/[A-Za-z0-9_-]+\/?$/;
  const instagramRegex = /^(https?:\/\/)?(www\.)?instagram\.com\/[A-Za-z0-9_.-]+\/?$/;
  const twitterRegex = /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/[A-Za-z0-9_.-]+\/?$/;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const urls = company?.company_urls;
  const categorized = {
    facebook: [] as string[],
    github: [] as string[],
    linkedin: [] as string[],
    instagram: [] as string[],
    twitter: [] as string[],
    other_urls: [] as string[],
  };

  urls?.forEach((url) => {
    if (facebookRegex.test(url)) {
      categorized.facebook.push(url);
    } else if (githubRegex.test(url)) {
      categorized.github.push(url);
    } else if (linkedinRegex.test(url)) {
      categorized.linkedin.push(url);
    } else if (instagramRegex.test(url)) {
      categorized.instagram.push(url);
    } else if (twitterRegex.test(url)) {
      categorized.twitter.push(url);
    } else {
      categorized.other_urls.push(url);
    }
  });

  return (
    <>
      <div className="flex flex-wrap items-start justify-start gap-2 md:flex">
        {company?.company_phone && (
          <button
            onClick={() => {
              navigator.clipboard.writeText(company.company_phone);
              return toast({
                title: replaceNumberWithString(dict?.board.list.copied, "Phone"),
                variant: "default",
              });
            }}
            className="mx-1 cursor-copy block md:hidden"
          >
            <FaPhone className="text-gray-800 dark:text-gray-200" />
          </button>
        )}
        {company?.company_email && (
          <button
            onClick={() => {
              navigator.clipboard.writeText(company.company_email);
              return toast({
                title: replaceNumberWithString(dict?.board.list.copied, "Email"),
                variant: "default",
              });
            }}
            className="mx-1 cursor-copy block md:hidden"
          >
            <FaAt className="text-gray-800 dark:text-gray-200" />
          </button>
        )}
        <Button
            onClick={() => setIsModalOpen(true)}
            className={cn(buttonVariants({ variant: "transparent", size: "transparent" }), "block md:hidden text-xs underline text-primary-background p-0 h-fit")}
        >
            {dict?.board.list.more}
        </Button>
 

        <div className="hidden md:flex flex-wrap items-start justify-start gap-2">
            {company?.company_phone && (
            <button
                onClick={() => {
                navigator.clipboard.writeText(company.company_phone);
                return toast({
                    title: replaceNumberWithString(dict?.board.list.copied, "Phone"),
                    variant: "default",
                });
                }}
                className="mx-1 flex flex-row items-center gap-0.5 break-all cursor-copy"
            >
                <FaPhone className="text-gray-800 dark:text-gray-200 text-xs" />
                <p className="text-xs">{company.company_phone}</p>
            </button>
            )}
            {company?.company_email && (
            <button
                onClick={() => {
                navigator.clipboard.writeText(company.company_email);
                return toast({
                    title: replaceNumberWithString(dict?.board.list.copied, "Email"),
                    variant: "default",
                });
                }}
                className="mx-1 flex flex-row gap-0.5 items-center break-all cursor-copy"
            >
                <FaAt className="text-gray-800 dark:text-gray-200 text-xs" />
                <p className="text-xs">{company.company_email}</p>
            </button>
            )}
          {categorized.facebook.length > 0 &&
            categorized.facebook.map((url) => (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-1 flex flex-row gap-0.5 break-all items-center"
              >
                <FaFacebook className="text-blue-600 text-xs" />
                <p className="text-xs">{url}</p>
              </a>
            ))}
          {categorized.instagram.length > 0 &&
            categorized.instagram.map((url) => (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-1 flex flex-row gap-0.5 break-all items-center"
              >
                <FaInstagram className="text-pink-500 text-xs" />
                <p className="text-xs">{url}</p>
              </a>
            ))}
          {categorized.linkedin.length > 0 &&
            categorized.linkedin.map((url) => (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-1 flex flex-row gap-0.5 break-all items-center"
              >
                <FaLinkedin className="text-blue-700 text-xs" />
                <p className="text-xs">{url}</p>
              </a>
            ))}
          {categorized.github.length > 0 &&
            categorized.github.map((url) => (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-1 flex flex-row gap-0.5 break-all items-center"
              >
                <FaGithub className="text-gray-800 dark:text-gray-200 text-xs" />
                <p className="text-xs">{url}</p>
              </a>
            ))}
          {categorized.twitter.length > 0 &&
            categorized.twitter.map((url) => (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-1 flex flex-row gap-0.5 break-all items-center"
              >
                <FaTwitter className="text-blue-400 text-xs" />
                <p className="text-xs">{url}</p>
              </a>
            ))}
          {categorized.other_urls.length > 0 &&
            categorized.other_urls.map((url) => (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-1 flex flex-row gap-0.5 break-all items-center"
              >
                <FaLink className="text-gray-800 dark:text-gray-200 text-xs" />
                <p className="text-xs">{url}</p>
              </a>
            ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-md shadow-md w-11/12 md:w-1/2">
            <div className="flex flex-row justify-between items-start">
                <h2 className="text-xl font-semibold mb-4">Links</h2>
                <button
                    onClick={() => setIsModalOpen(false)}
                    className=" text-gray-800 dark:text-gray-200 text-xl font-heading"
                >
                    &times;
                </button>
            </div>
            
            <div className="flex flex-col gap-2">
              {Object.keys(categorized).map((key) => {
                if (categorized[key].length > 0) {
                  return (
                    <div key={key} className="flex flex-col gap-2">
                        {categorized[key].map((url) => (
                          <a
                            key={url}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center w-fit flex flex-row gap-1.5 items-center"
                          >
                            <FaLink className="text-gray-800 dark:text-gray-200 text-xs" />
                            <p className="text-xs">{url}</p>
                          </a>
                        ))}
                    </div>
                  );
                }
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export const JobTitle = ({ children }) => (
    <h1 className="font-heading text-xl ">{children}</h1>
);
export const JobParagraph = ({ children }) => (
    <p className="text-base">{children}</p>
);
export const JobUl = ({ children }) => (
    <ul className="ml-8 list-disc text-base">{children}</ul>
);
  
export const JobLi = ({ children }) => (
    <li className="text-base">{children}</li>
);
  
export const JobStrong = ({ children }) => (
    <strong className="font-heading text-base">{children}</strong>
);
export interface CompanyDescription {
    id: number;
    name: string;
    body: string;
    record_type: string;
    record_id: number;
    created_at: string;
    updated_at: string;
}
  
export interface Company {
    id: number;
    company_name: string;
    company_phone: string;
    company_email: string;
    company_urls: string[];
    company_industry: string;
    company_description: CompanyDescription;
    company_logo: string;
    company_slug: string;
}
export default function Page({ params, excludeHeader, excludeFooter }) {
    const [shareDropdownOpen, setShareDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [dict, setDict] = useState<Record<string, any> | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [jobs, setJobs] = useState<Job[]>([]);


    const [company, setCompany] = useState<Company | null>(null);
    const [error, setError] = useState<Number | null>(null);
    const router = useRouter();

    const options = {
        replace: (domNode) => {
            if (domNode.name === 'h1') {
                return (
                    <JobTitle>
                        {domToReact(domNode.children, options)}
                    </JobTitle>
                );
            }
            if (domNode.name === 'p') {
                return (
                    <JobParagraph>
                        {domToReact(domNode.children, options)}
                    </JobParagraph>
                );
            }
            if (domNode.name === 'ul') {
                return <JobUl>{domToReact(domNode.children, options)}</JobUl>;
            }
            if (domNode.name === 'li') {
                return <JobLi>{domToReact(domNode.children, options)}</JobLi>;
            }
            if (domNode.name === 'strong') {
                return <JobStrong>{domToReact(domNode.children, options)}</JobStrong>;
            }
            if (domNode.name === 'a') {
                return (
                    <a
                        href={domNode.attribs.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                    >
                        {domToReact(domNode.children)}
                    </a>
                );
            }
        },
    };

    useEffect(() => {
        const fetchDictionary = async () => {
            const dictionary = await getDictionary(params.lang);
            setDict(dictionary);
        };
        fetchDictionary();

        const fetchJobs = async () => {
            setIsLoading(true);
            const { response, err } = await getListedJobs(params.slug);
            console.log("RESPONSE", response);
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
    const toggleShareDropdown = () => setShareDropdownOpen(!shareDropdownOpen);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShareDropdownOpen(false);
            }
        };
    
        if (shareDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [shareDropdownOpen]);
    return (
        dict && (
            <div className="flex flex-col items-start justify-start px-2 py-1.5 md:px-4">
                <div className="w-full rounded-lg bg-background md:border md:p-4">
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
                        <div className="flex w-full flex-col items-start justify-start gap-4 px-3 md:px-0 ">
                            <div className="flex w-full flex-row items-start justify-between">
                                <div className="flex w-10/12 flex-row items-start justify-between">
                                    {company?.company_logo ? (
                                        <div className="flex flex-col items-start justify-start gap-4 md:flex-row">
                                            <Image
                                                src={company.company_logo}
                                                alt="Company Logo"
                                                width={100}
                                                height={100}
                                                className="rounded-full border-2 border-input"
                                            />
                                            <div className="flex flex-col items-start justify-start gap-2 ">
                                                <h1 className="font-heading text-3xl">{company?.company_name}</h1>
                                                <Stats dict={dict} company={company} className={undefined} />
                                                <Socials dict={dict} company={company} />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-start justify-start gap-2">
                                            <h1 className="font-heading text-3xl">{company?.company_name}</h1>
                                            <Stats dict={dict} company={company} className={undefined} />
                                            <Socials dict={dict} company={company} />
                                        </div>
                                    )}
                                    
                                    <div className="flex flex-row items-start justify-end gap-2">
                                        
                                    </div>
                                </div>
                                <div className="flex w-2/12 flex-row items-start justify-end">
                                    <Button
                                        onClick={toggleShareDropdown}
                                        className={cn(buttonVariants({ variant: "transparent", size: "default" }), "h-fit p-0 font-semibold text-muted-foreground hover:text-secondary-foreground")}
                                    >
                                        <Share2 strokeWidth={3} className="size-4" />
                                    </Button>
                                    {shareDropdownOpen && (
                                        <div ref={dropdownRef} className="absolute right-0 z-50 mt-2 min-w-48 rounded-md border bg-white p-2 shadow-lg dark:bg-popover">
                                            <Button variant="ghost" onClick={() => {setShareDropdownOpen(false); }} disabled={true} className="block w-full px-4 py-2 text-left text-sm">
                                                Share via Email
                                            </Button>
                                            <Button variant="ghost"onClick={() => {setShareDropdownOpen(false); }} disabled={true} className="block w-full px-4 py-2 text-left text-sm">
                                                Share on LinkedIn
                                                </Button>
                                            <Button variant="ghost" onClick={() => {
                                                navigator.clipboard.writeText(`${window.location.href}`); 
                                                setShareDropdownOpen(false); 
                                                return toast({
                                                    title: replaceNumberWithString(dict?.board.list.copied, "Link"),
                                                    variant: "default",
                                                })
                                                }} className="block w-full px-4 py-2 text-left text-sm">
                                                {dict?.board.list.copy}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <EmbloySpacer className={"h-4"} />
                        <div className="h-[2px] w-full rounded-full bg-border" />
                        <EmbloySpacer className={"h-4"} />
                        {company?.company_description.body && (
                            <>
                                <div className="flex w-full flex-col items-start justify-start gap-2">
                                    {company?.company_description.body && parse(company.company_description.body || '', options)}
                                </div>
                                <div className="h-[2px] w-full rounded-full bg-border" />
                                <EmbloySpacer className={"h-4"} />
                            </>
                        )}
                        <JobList params={params} jobs={jobs} excludeHeader={undefined} excludeFooter={undefined} />
                    </div>
                    )}
                </div>
            </div>
        )
    );
}
