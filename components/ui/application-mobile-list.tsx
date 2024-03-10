import * as React from "react";
import { Application } from "@/lib/api/application";
import { Locale, parseLocale } from "@/i18n-config";
import { getDictionary } from "@/app/[lang]/dictionaries";
import { Card, CardContent } from "./card";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../new-york/ui/carousel";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { format } from "date-fns";
import { ApplicationResponse } from "../application-response";
import { Icons } from "../icons";
import { Badge } from "@/components/new-york/ui/badge";
import { getBadgeVariantFromLabel, getTextFromLabel } from "../application-list";

interface ApplicationItemProps {
  applications: Application[];
  params: {
    lang: Locale;
  };
}

export function ApplicationMobileList({
  applications,
  params: { lang },
}: ApplicationItemProps) {
  const [dict, setDict] = React.useState<Record<string, any> | null>(null);

  React.useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };
    fetchDictionary();
  }, [lang]);

  return (
    dict && (
      <div>
        <Carousel
          opts={{
            align: "start",
          }}
          orientation="vertical"
          className="w-full mt-5"
        >
          <CarouselContent className="-mt-1" style={{ height: 'calc(100vh - 520px)' }}>
            {applications.map((application, index) => (
              <Drawer key={index}>
                <DrawerTrigger asChild>
                  <CarouselItem className="pt-1 my-1 basis-1/5">
                    <Card>
                    <CardContent className="flex items-center justify-start py-4">
                      <div className="flex w-1/4 items-center mr-2">
                        <Avatar>
                          {application.job?.employer_image_url ? (
                            <div className="overflow-hidden rounded-full w-12 h-12">
                              <AvatarImage
                                alt="Picture"
                                src={application.job?.employer_image_url}
                                className="size-12 rounded-full border-2 border-muted-foreground text-muted-foreground"
                              />
                            </div>
                          ) : (
                            <AvatarFallback>
                              <Icons.user className="size-12 rounded-full border-2 border-muted-foreground text-muted-foreground" />
                            </AvatarFallback>
                          )}
                        </Avatar>
                      </div>
                      <div className="flex w-3/4 items-center">
                        <p className="text-sm">{application.job?.title}</p>
                      </div>
                      <Badge className="ml-2" key={application.status} variant={getBadgeVariantFromLabel(application.status)}>
                        {getTextFromLabel(application.status, dict)}
                      </Badge>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                </DrawerTrigger>
                <DrawerContent>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start p-4">
                      <div className="flex items-start gap-4 text-sm">
                        {
                          <Avatar >
                          {application.job?.employer_image_url ? (
                            <AvatarImage alt="Picture" src={application.job?.employer_image_url} className="size-12 rounded-full border-2 border-muted-foreground text-muted-foreground"/>
                          ) : (
                            <AvatarFallback>
                              <Icons.user className="size-12 rounded-full border-2 border-muted-foreground text-muted-foreground" />
                            </AvatarFallback>
                          )}
                        </Avatar>
                        }
                        <div className="grid gap-1">
                          <div className="font-semibold">
                            {application.job?.employer_name ||
                              `User#${application.job?.user_id}`}
                          </div>
                          <div className="line-clamp-1 text-xs">
                            {application.job?.employer_email ||
                              application.job?.employer_phone ||
                              dict.dashboard.applications.noContact}
                          </div>
                          <div className="line-clamp-1 text-xs">
                            {application.updated_at && (
                              <div className="ml-auto text-xs text-muted-foreground">
                                {format(
                                  new Date(application.updated_at),
                                  "PPpp",
                                  { locale: parseLocale(lang) }
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex-1 space-y-2 whitespace-pre-wrap p-4 text-xs">
                      {application.application_text}
                    </div>
                    <Separator />
                    <Separator className="mt-auto" />
                    <div className="overflow-auto p-2">
                      <ApplicationResponse
                        application={application}
                        params={{ lang: lang }}
                      />
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    )
  );
}
