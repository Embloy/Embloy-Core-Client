"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@/lib/api/session";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { FileInput } from "@/components/ui/file-input";
import {
  deleteUser,
  updateUser,
  uploadUserImage,
  deleteImage,
} from "@/lib/api/user";
import { cn } from "@/lib/utils";
import { AvatarLarge, AvatarImage } from "@/components/ui/avatar";

import { userSchema } from "@/lib/validations/user";
import { buttonVariants } from "@/components/ui/button";
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
import { toast } from "@/components/ui/use-toast";
import { Icons } from "@/components/icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { getDictionary } from "@/app/[lang]/dictionaries";
import { useState } from "react";
import {Locale} from "../i18n-config"

interface UserFormProps extends React.HTMLAttributes<HTMLFormElement> {
  user: User
  params: {
    lang: Locale;
  };
}

type FormData = z.infer<typeof userSchema>;

export function UserForm({ user, className, params: { lang }, ...props }: UserFormProps) {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      ...user,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      twitter_url: user.twitter_url,
      linkedin_url: user.linkedin_url,
      instagram_url: user.instagram_url,
      facebook_url: user.facebook_url,
    },
  });

  const [isSaving, setIsSaving] = React.useState<boolean>(false);
  const [isDeleting, setIsDeleting] = React.useState<boolean>(false);
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = React.useState(false);
  const [dict, setDict] = useState<Record<string, any> | null>(null);

  React.useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };

    fetchDictionary();
  }, [lang]);

  async function onSubmit(data: FormData) {
    setIsSaving(true);

    const success = await updateUser(JSON.stringify({ user: data }));
    setIsSaving(false);

    if (!success) {
      return dict && toast({
        title: dict.dashboard.settings.errors.updateAccount.title,
        description: dict.dashboard.settings.errors.updateAccount.description,
        variant: "destructive",
      });
    }

    dict && toast({
      description: dict.dashboard.settings.success.updateAccount.description,
    });

    // router.refresh()
  }

  async function onDelete() {
    setIsDeleting(true);

    const success = await deleteUser();
    setIsDeleting(false);

    if (!success) {
      return dict && toast({
        title: dict.dashboard.settings.errors.deleteAccount.title,
        description: dict.dashboard.settings.errors.deleteAccount.description,
        variant: "destructive",
      });
    }

    dict && toast({
      description: dict.dashboard.settings.success.deleteAccount.description,
    });

    // router.refresh()
  }

  async function uploadImage() {
    if (selectedImage) {
      const success = await uploadUserImage(selectedImage);
      if (!success) {
        return dict && toast({
          title: dict.dashboard.settings.errors.uploadImage.title,
          description: dict.dashboard.settings.errors.uploadImage.description,
          variant: "destructive",
        });
      }
  
      dict && toast({
        description: dict.dashboard.settings.success.uploadImage.description,
      });    
    }
  }

  function onFileChange(file: File | null) {
    if (file && dict) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const validSize = 2 * 1024 * 1024; // 2MB in bytes
  
      if (!validTypes.includes(file.type)) {
        toast({
          title: dict.dashboard.settings.errors.invalidImageType.title,
          description: dict.dashboard.settings.errors.invalidImageType.description,
          variant: "destructive",
        });
        return;
      }
  
      if (file.size > validSize) {
        toast({
          title: dict.dashboard.settings.errors.invalidImageSize.title,
          description: dict.dashboard.settings.errors.invalidImageSize.description,
          variant: "destructive",
        });
        return;
      }
    }
  
    setSelectedImage(file);
  }

  return dict && (
    <form onSubmit={handleSubmit((data) => {
          onSubmit(data);
      })} className={cn(className)} {...props}>
   
      <div className="space-y-4">
   
        <Card>
          <CardHeader>
            <CardTitle>{dict.dashboard.settings.yourProfile}</CardTitle>
            <CardDescription>
            {dict.dashboard.settings.enterFullName}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="first_name">{dict.dashboard.settings.firstName}</Label>
                  <Input
                    id="first_name"
                    className={cn(
                      "w-full",
                      errors.first_name && "border-red-600"
                    )}
                    placeholder={dict.dashboard.settings.firstName}
                    {...register("first_name")}
                  />
                  {errors?.first_name?.message && (
                    <p className="px-1 text-xs text-red-600">
                      {dict.dashboard.settings.errors.validations[errors.first_name.message] || errors.first_name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="last_name" className="mt-4">
                  {dict.dashboard.settings.lastName}
                  </Label>
                  <Input
                    id="last_name"
                    className={cn(
                      "w-full",
                      errors.last_name && "border-red-600"
                    )}
                    placeholder={dict.dashboard.settings.lastName}
                    {...register("last_name")}
                  />
                  {errors?.last_name?.message && (
                    <p className="px-1 text-xs text-red-600">
                      {dict.dashboard.settings.errors.validations[errors.last_name.message] || errors.last_name.message}
                    </p>
                  )}
                </div>
                <div className="flex space-x-4">
                  {user.image_url && (
                    <button
                      type="button"
                      className={cn(buttonVariants(), className)}
                      onClick={deleteImage}
                    >
                      {dict.dashboard.settings.removeImage}
                    </button>
                  )}
                  <button
                    type="button"
                    className={cn(buttonVariants(), className)}
                    onClick={uploadImage}
                    disabled={!selectedImage}
                  >
                    {dict.dashboard.settings.uploadImage}
                  </button>
                </div>
              </div>
              <div>
                <div className="grid grid-cols-2 gap-8">
                  <FileInput
                    id="image_url"
                    className="w-full"
                    onFileChange={onFileChange} 
                    currentUserImageUrl={user.image_url}                  
                  />
                  {selectedImage && user.image_url && (
                    <div className="mt-2">
                      <AvatarLarge>
                        <AvatarImage src={user.image_url} alt={dict.dashboard.settings.profileImage} />
                      </AvatarLarge>
                      <p className="mt-2 text-sm text-gray-500">{dict.dashboard.settings.removeImageNotice}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>{" "}
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{dict.dashboard.settings.yourContactInfo}</CardTitle>
            <CardDescription>
              {dict.dashboard.settings.enterEmailPhone}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="email">{dict.dashboard.settings.email}</Label>
                <Input
                  id="email"
                  className={cn("w-full", errors.email && "border-red-600")}
                  placeholder="example@embloy.com"
                  {...register("email")}
                />
                  {errors?.email?.message && (
                    <p className="px-1 text-xs text-red-600">
                      {dict.dashboard.settings.errors.validations[errors.email.message] || errors.email.message}
                    </p>
                  )}
              </div>
              <div>
                <Label htmlFor="phone">{dict.dashboard.settings.phone}</Label>
                <Input
                  id="phone"
                  className={cn("w-full", errors.phone && "border-red-600")}
                  placeholder="+49 123456789"
                  {...register("phone")}
                />
                  {errors?.phone?.message && (
                    <p className="px-1 text-xs text-red-600">
                      {dict.dashboard.settings.errors.validations[errors.phone.message] || errors.phone.message}
                    </p>
                  )}
                </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{dict.dashboard.settings.yourAddress}</CardTitle>
            <CardDescription>{dict.dashboard.settings.enterAddress}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-1">
              <Label htmlFor="address">{dict.dashboard.settings.address}</Label>
              <Input
                id="address"
                className="w-full"
                size={32}
                placeholder="Raiffeisenstraße 9 85356 Freising"
                {...register("address")}
              />
              {errors?.address?.message && (
                <p className="px-1 text-xs text-red-600">
                  {dict.dashboard.settings.errors.validations[errors.address.message] || errors.address.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{dict.dashboard.settings.yourSocials}</CardTitle>
            <CardDescription>
              {dict.dashboard.settings.enterSocialMedia}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-1">
              <Label htmlFor="twitter">{dict.dashboard.settings.twitter}</Label>
              <Input
                id="twitter"
                className="w-full"
                size={32}
                placeholder="https://twitter.com/embloy"
                {...register("twitter_url")}
              />
              {errors?.twitter_url?.message && (
                <p className="px-1 text-xs text-red-600">
                  {dict.dashboard.settings.errors.validations[errors.twitter_url.message] || errors.twitter_url.message}
                </p>
              )}
              </div>
            <div className="grid gap-1">
              <Label htmlFor="linkedin">{dict.dashboard.settings.linkedIn}</Label>
              <Input
                id="linkedin"
                className="w-full"
                size={32}
                placeholder="https://linkedin.com/company/embloy"
                {...register("linkedin_url")}
              />
              {errors?.linkedin_url?.message && (
                <p className="px-1 text-xs text-red-600">
                  {dict.dashboard.settings.errors.validations[errors.linkedin_url.message] || errors.linkedin_url.message}
                </p>
              )}
            </div>
            <div className="grid gap-1">
              <Label htmlFor="instagram">{dict.dashboard.settings.instagram}</Label>
              <Input
                id="instagram"
                className="w-full"
                size={32}
                placeholder="https://instagram.com/embloy"
                {...register("instagram_url")}
              />
              {errors?.instagram_url?.message && (
                <p className="px-1 text-xs text-red-600">
                  {dict.dashboard.settings.errors.validations[errors.instagram_url.message] || errors.instagram_url.message}
                </p>
              )}
            </div>
            <div className="grid gap-1">
              <Label htmlFor="facebook">{dict.dashboard.settings.facebook}</Label>
              <Input
                id="facebook"
                className="w-full"
                size={32}
                placeholder="https://facebook.com/embloy"
                {...register("facebook_url")}
              />
              {errors?.facebook_url?.message && (
                <p className="px-1 text-xs text-red-600">
                  {dict.dashboard.settings.errors.validations[errors.facebook_url.message] || errors.facebook_url.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        <CardFooter>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="submit"
            className={cn(buttonVariants(), className)}
            disabled={isSaving}
          >
            {isSaving && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            <span>{dict.dashboard.settings.save}</span>
          </button>
          <button
            type="button"
            className={cn(
              buttonVariants({ variant: "destructive" }),
              className
            )}
            disabled={isSaving}
            onClick={() => setShowDeleteAlert(true)}
          >
            {isDeleting && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            <span>{dict.dashboard.settings.deleteAccount}</span>
          </button>
        </div>
      </CardFooter>
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
            {dict.dashboard.settings.deleteAccountConfirmation}
            </AlertDialogTitle>
            <AlertDialogDescription>
            {dict.dashboard.settings.deleteAccountWarning}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteAlert(false)}>{dict.dashboard.settings.cancel}</AlertDialogCancel>
            <AlertDialogAction
              onClick={async (event) => {
                event.preventDefault();
                setIsDeleting(true);

                await onDelete();
                setIsDeleting(false);
                setShowDeleteAlert(false);
                router.push(`/${lang}/login`);
                }
              }
              className={cn(
                buttonVariants({ variant: "destructive" }),
              )}
  
            >
              {isDeleting ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.trash className="mr-2 h-4 w-4" />
              )}
              <span>{dict.dashboard.settings.delete}</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      </div>
    </form>
  );
}
