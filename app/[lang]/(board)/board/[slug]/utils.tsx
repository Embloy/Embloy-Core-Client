import { Button, buttonVariants } from "@/components/ui/button";
import { EmbloySpacer } from "@/components/ui/stuff";
import { toast } from "@/components/ui/use-toast";
import { cn, replaceNumberWithString } from "@/lib/utils";
import { Building2 } from "lucide-react";
import { useState } from "react";
import { FaAt, FaFacebook, FaGithub, FaInstagram, FaLink, FaLinkedin, FaPhone, FaTwitter } from "react-icons/fa";


export const Stats = ({ dict, company, className }) => {
 
    return(
    <div className="flex flex-wrap items-start justify-start gap-2">
        <div className={cn("flex flex-row items-center rounded-full border px-2 dark:border-background dark:text-muted-foreground", className)}>
            <h1 className="flex flex-row items-center justify-start gap-1.5 text-xs">
                <Building2 className="size-3" />
                {company.company_industry}
            </h1>
        </div>
        <EmbloySpacer className={"h-[4px]"} />
    </div>);
    
    
};

export const Socials = ({ dict, company }) => {
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
        className="mx-1 block cursor-copy md:hidden"
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
        className="mx-1 block cursor-copy md:hidden"
      >
        <FaAt className="text-gray-800 dark:text-gray-200" />
      </button>
    )}
    <Button
        onClick={() => setIsModalOpen(true)}
        className={cn(buttonVariants({ variant: "transparent", size: "transparent" }), "text-primary-background block h-fit p-0 text-xs underline md:hidden")}
    >
        {dict?.board.list.more}
    </Button>


    <div className="hidden flex-wrap items-start justify-start gap-2 md:flex">
        {company?.company_phone && (
        <button
            onClick={() => {
            navigator.clipboard.writeText(company.company_phone);
            return toast({
                title: replaceNumberWithString(dict?.board.list.copied, "Phone"),
                variant: "default",
            });
            }}
            className="mx-1 flex cursor-copy flex-row items-center gap-0.5 break-all"
        >
            <FaPhone className="text-xs text-gray-800 dark:text-gray-200" />
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
            className="mx-1 flex cursor-copy flex-row items-center gap-0.5 break-all"
        >
            <FaAt className="text-xs text-gray-800 dark:text-gray-200" />
            <p className="text-xs">{company.company_email}</p>
        </button>
        )}
      {categorized.facebook.length > 0 &&
        categorized.facebook.map((url) => (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-1 flex flex-row items-center gap-0.5 break-all"
          >
            <FaFacebook className="text-xs text-blue-600" />
            <p className="text-xs">{url}</p>
          </a>
        ))}
      {categorized.instagram.length > 0 &&
        categorized.instagram.map((url) => (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-1 flex flex-row items-center gap-0.5 break-all"
          >
            <FaInstagram className="text-xs text-pink-500" />
            <p className="text-xs">{url}</p>
          </a>
        ))}
      {categorized.linkedin.length > 0 &&
        categorized.linkedin.map((url) => (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-1 flex flex-row items-center gap-0.5 break-all"
          >
            <FaLinkedin className="text-xs text-blue-700" />
            <p className="text-xs">{url}</p>
          </a>
        ))}
      {categorized.github.length > 0 &&
        categorized.github.map((url) => (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-1 flex flex-row items-center gap-0.5 break-all"
          >
            <FaGithub className="text-xs text-gray-800 dark:text-gray-200" />
            <p className="text-xs">{url}</p>
          </a>
        ))}
      {categorized.twitter.length > 0 &&
        categorized.twitter.map((url) => (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-1 flex flex-row items-center gap-0.5 break-all"
          >
            <FaTwitter className="text-xs text-blue-400" />
            <p className="text-xs">{url}</p>
          </a>
        ))}
      {categorized.other_urls.length > 0 &&
        categorized.other_urls.map((url) => (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-1 flex flex-row items-center gap-0.5 break-all"
          >
            <FaLink className="text-xs text-gray-800 dark:text-gray-200" />
            <p className="text-xs">{url}</p>
          </a>
        ))}
    </div>
  </div>

  {isModalOpen && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/75">
      <div className="w-11/12 rounded-md bg-white p-6 shadow-md dark:bg-gray-900 md:w-1/2">
        <div className="flex flex-row items-start justify-between">
            <h2 className="mb-4 text-xl font-semibold">Links</h2>
            <button
                onClick={() => setIsModalOpen(false)}
                className=" font-heading text-xl text-gray-800 dark:text-gray-200"
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
                        className="flex w-fit flex-row items-center gap-1.5"
                      >
                        <FaLink className="text-xs text-gray-800 dark:text-gray-200" />
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