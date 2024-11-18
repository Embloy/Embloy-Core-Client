"use client";
import { getDictionary } from "@/app/[lang]/dictionaries";
import { getListedJob, getListedJobs } from "@/lib/api/jobs";
import { Job } from "@/types/job-schema";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaAt, FaFacebook, FaGithub, FaInstagram, FaLink, FaLinkedin, FaPhone, FaTwitter } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { AlignEndHorizontal, ArrowLeft, Bookmark, MapPin, Share2 } from "lucide-react";
import { cn, formatDate, replaceNumberWithString } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { EmbloySpacer } from "@/components/ui/stuff";
import { toast } from "@/components/ui/use-toast";
import { siteConfig } from "@/config/site";
import { parseLocale } from "@/i18n-config";
import parse, { domToReact } from 'html-react-parser';
import { Company, JobLi, JobParagraph, JobStrong, JobTitle, JobUl } from "@/app/[lang]/(board)/board/[slug]/utils";
import { Stats, Socials as MainSocials } from "../utils";


function Socials ({company, dict}) {
    return (
        <div className="flex w-full flex-row items-start justify-end">
            {company.phone && (
                <button 
                    onClick={() => {
                        navigator.clipboard.writeText(company.phone);
                        return toast({
                            title: replaceNumberWithString(dict?.board.list.copied, "Phone"),
                            variant: "default",
                            });
                    }}
                    className="mx-1 cursor-copy"
                >
                    <FaPhone className="text-gray-800 dark:text-gray-200" />
                </button>
            )}
            {company.email && (
                <button 
                    onClick={() => {
                        navigator.clipboard.writeText(company.email);
                        return toast({
                            title: replaceNumberWithString(dict?.board.list.copied, "Email"),
                            variant: "default",
                        });
                    }}
                    className="mx-1 cursor-copy"
                >
                    <FaAt className="text-gray-800 dark:text-gray-200" />
                </button>
            )}
            {company.portfolio_url && (
                <a href={company.facebook_url} target="_blank" rel="noopener noreferrer" className="mx-1">
                    <FaLink className="text-gray-800 dark:text-gray-200" />
                </a>
            )}
            {company.facebook_url && (
                <a href={company.facebook_url} target="_blank" rel="noopener noreferrer" className="mx-1">
                    <FaFacebook className="text-blue-600" />
                </a>
            )}
            {company.instagram_url && (
                <a href={company.instagram_url} target="_blank" rel="noopener noreferrer" className="mx-1">
                    <FaInstagram className="text-pink-500" />
                </a>
            )}
            {company.linkedin_url && (
                <a href={company.linkedin_url} target="_blank" rel="noopener noreferrer" className="mx-1">
                    <FaLinkedin className="text-blue-700" />
                </a>
            )}
            {company.github_url && (
                <a href={company.github_url} target="_blank" rel="noopener noreferrer" className="mx-1">
                    <FaGithub className="text-gray-800 dark:text-gray-200" />
                </a>
            )}
            {company.twitter_url && (
                <a href={company.twitter_url} target="_blank" rel="noopener noreferrer" className="mx-1">
                    <FaTwitter className="text-blue-400" />
                </a>
            )}
        </div>
    );
}

export default function Page({ params }) {
    const [dict, setDict] = useState<Record<string, any> | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [jobs, setJobs] = useState<Job[] | null>(null);
    const [job, setJob] = useState<Job | null>(null);
    
    const [error, setError] = useState<Number | null>(null);
    const router = useRouter();
    const [company, setCompany] = useState<Company | null>(null);

    const [shareDropdownOpen, setShareDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null)
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
    useEffect(() => {
        const fetchDictionary = async () => {
            const dictionary = await getDictionary(params.lang);
            setDict(dictionary);
        };
        fetchDictionary();
        setIsLoading(true);
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
                const res = await getListedJob(params.slug, params.job_slug);
                if (res.err) {
                    setError(res.err);
                } else if (!res.response) {
                    setError(500);
                } else {
                    const job = res.response;
                    if (job !== undefined && job !== null) {
                        setJob(job)
                    } else {
                        setError(404);
                    }
                }
            }
            setIsLoading(false);
        };
        fetchJobs();
    }, [params.job_slug, router, params.lang]);
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
    return (
        dict && (
            <div className="flex flex-col items-start justify-start px-2 py-1.5 md:px-4">
                <div className="flex w-full flex-row items-start justify-between gap-6">
                    {!isLoading && (
                        <div className="sticky hidden max-h-screen w-3/12 flex-col items-start justify-start gap-2 overflow-y-scroll rounded-lg bg-secondary p-4 xl:flex">
                            {error === null && jobs && (
                                <div className="flex w-full flex-col items-start justify-start gap-2">
                                    <h1 className="font-heading text-xl">{dict.board.post.similar}</h1>
                                    <EmbloySpacer className={"h-4"} />
                                    {jobs.map((job_o) => (
                                        job_o.job_type === job?.job_type && (
                                            <Link
                                                key={job_o.job_slug}
                                                href={`/${params.lang}/board/${params.slug}/${job_o.job_slug}`}
                                                className={cn(
                                                    buttonVariants({ variant: "link", size: "default" }),
                                                    "z-50 flex h-fit w-full flex-col items-start justify-start gap-px rounded-sm border border-input bg-background px-2 text-base font-normal text-secondary-foreground dark:border-background dark:bg-border dark:text-primary-foreground",
                                                    cn({
                                                        "border-low text-low dark:border-input dark:text-input pointer-events-none hover:no-underline": job_o.job_slug === params.job_slug
                                                    })
                                                )}
                                            >
                                                {job_o.title}
                                                <br />
                                                <span className="decoration-none hover:decoration-none text-xs">
                                                    {job_o.city && job_o.country_code ? (
                                                        `${job_o.city}, ${job_o.country_code}`
                                                    ) : job_o.city ? (
                                                        job_o.city
                                                    ) : null}
                                                </span>
                                            </Link>


                                        )
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    <div className="w-full rounded-lg bg-secondary p-4 xl:w-9/12">
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
                                <div className="flex w-full flex-col items-start justify-start gap-2">
                                    <div className="flex w-full flex-col items-start justify-start md:flex-row md:justify-between">
                                        <div className="flex w-full flex-row items-center justify-start md:w-5/12 md:gap-16">
                                            <Link href={`/${params.lang}/board/${params.slug}`} className={cn(buttonVariants({ variant: "link", size: "default" }), "rounded-full p-0 text-secondary-foreground dark:text-primary-foreground")}>
                                                <ArrowLeft />
                                                {replaceNumberWithString(dict?.board.post.back, company?.company_name)}
                                            </Link>
                                        </div>
                                        <EmbloySpacer className={"h-4 md:hidden"} />
                                        <div className="flex w-full flex-row items-start justify-start md:w-5/12 md:justify-end">
                                            <div className="flex flex-col items-start justify-start gap-2">
                                                {company?.company_logo ? (
                                                    <div className="flex flex-row items-start justify-start gap-2">
                                                        <Image
                                                            src={company.company_logo}
                                                            alt="Company Logo"
                                                            width={50}
                                                            height={50}
                                                            className="rounded-full border-2 border-input"
                                                        />
                                                        <div className="flex flex-col items-start justify-start">
                                                            <h1 className="text-left font-heading text-xl">
                                                                {company?.company_name}
                                                            </h1>
                                                            <Stats company={company} dict={dict} className={"border bg-white dark:border-input dark:bg-border "} />  
                                                        </div>  
                                                    </div>
                                                ) : (
                                                    <h1 className="text-left font-heading text-2xl">
                                                        {company?.company_name}
                                                    </h1>
                                                    
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <EmbloySpacer className={"h-4"} />
                                    <div className="h-[2px] w-full rounded-full bg-border" />
                                    <div className="flex w-full flex-col items-start justify-start gap-8 rounded-lg border border-input bg-background p-3 dark:border-background dark:bg-border md:px-6 md:py-4">
                                        <div className="flex w-full flex-col items-start justify-start gap-2">
                                            <div className="flex w-full flex-col items-center justify-between md:flex-row">
                                                <h1 className="text-left font-heading text-3xl">
                                                    {job?.title}
                                                </h1>
                                                <div className="relative hidden flex-row items-center justify-start gap-3 md:flex">
                                                    <Button
                                                        onClick={toggleShareDropdown}
                                                        className={cn(buttonVariants({ variant: "transparent", size: "default" }), "h-fit p-0 font-semibold text-muted-foreground hover:text-secondary-foreground")}
                                                    >
                                                        <Share2 className="size-5" />
                                                    </Button>
                                                    
                                                    {shareDropdownOpen && job && (
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
                                                    <Button className={cn(buttonVariants({ variant: "transparent", size: "default" }), "h-fit p-0 font-semibold text-muted-foreground hover:text-secondary-foreground")}>
                                                        <Bookmark className="size-5" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="justfy-start flex flex-row items-center gap-2">
                                                {job?.city && (
                                                    <div className="flex flex-row items-center rounded-full border px-2 dark:border-background dark:text-muted-foreground">
                                                            <h1 className="flex flex-row items-center justify-start gap-1.5 text-sm">
                                                                <MapPin className="size-4" />
                                                                {job.city}
                                                            </h1>
                                                        {job.country_code && <h1 className="text-sm">{", "}{job.country_code}</h1>}
                                                    </div>
                                                )}
                                                {job?.job_type && (
                                                    <div className="flex flex-row items-center rounded-full border px-2 dark:border-background dark:text-muted-foreground">
                                                            <h1 className="flex flex-row items-center justify-start gap-1.5 text-sm">
                                                                <AlignEndHorizontal className="size-4" />
                                                                {job.job_type}
                                                            </h1>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex w-full flex-col items-start justify-start gap-2">
                                            <div className="md:justfy-start flex w-full flex-row items-center justify-between gap-2 md:w-fit">
                                                <Link
                                                    href={`${siteConfig.apply_url}/?eType=manual&mode=job&id=${params.slug}&url=${siteConfig.url}/${params.lang}/board/${params.slug}/${job?.job_slug}`}
                                                    className={cn(buttonVariants({ variant: "filled", size: "bold" }), "w-auto lg:w-auto")}
                                                >
                                                    {dict.board.list.apply}
                                                </Link>
                                                <div className="relative flex flex-row items-center justify-end gap-3 md:hidden md:justify-start">
                                                    <Button
                                                        onClick={toggleShareDropdown}
                                                        className={cn(buttonVariants({ variant: "transparent", size: "default" }), "h-fit p-0 font-semibold text-muted-foreground hover:text-secondary-foreground")}
                                                    >
                                                        <Share2 className="size-5" />
                                                    </Button>
                                                    {shareDropdownOpen && job && (
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

                                                    <Button className={cn(buttonVariants({ variant: "transparent", size: "default" }), "h-fit p-0 font-semibold text-muted-foreground hover:text-secondary-foreground")}>
                                                        <Bookmark className="size-5" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="h-[2px] w-full rounded-full bg-border dark:bg-input" />
                                        </div>
                                        <div className="flex w-full flex-col items-start justify-start gap-2">
                                            {job && job.description && parse(job.description.body || '', options)}
                                        </div>
                                        <div className="justfy-start flex flex-row items-center gap-2">
                                            {job && <p className="text-xs text-muted-foreground">{dict.board.post.last_updated}{": "}{formatDate(parseLocale(params.lang),job?.updated_at)}</p>}
                                        </div>
                                    </div>
                                    <div className="h-[2px] w-full rounded-full bg-border" />
                                    <EmbloySpacer className={"h-4"} />
                                    <div className="flex w-full flex-row items-start justify-center gap-2 md:justify-start">
                                        {company?.company_logo && (
                                            <div className="flex w-1/12 flex-row items-center justify-start gap-2">
                                                <Image
                                                    src={company.company_logo}
                                                    alt="Company Logo"
                                                    width={100}
                                                    height={100}
                                                    className="rounded-full border-2 border-input"
                                                />
                                                
                                            </div>
                                        ) }
                                        <div className="flex w-11/12 flex-col items-start justify-start gap-1.5">
                                            <h1 className="text-left font-heading text-xl">
                                                {company?.company_name}
                                            </h1>
                                            <MainSocials company={company} dict={dict} />  
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    );
}
