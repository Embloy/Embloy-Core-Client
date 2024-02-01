"use client";

import * as React from "react";
import { useRouter, redirect } from "next/navigation";
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
import { AvatarLarge, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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

interface UserFormProps extends React.HTMLAttributes<HTMLFormElement> {
  user: User;
}

type FormData = z.infer<typeof userSchema>;

export function UserForm({ user, className, ...props }: UserFormProps) {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userSchema),
  });

  const [isSaving, setIsSaving] = React.useState<boolean>(false);
  const [isDeleting, setIsDeleting] = React.useState<boolean>(false);
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = React.useState(false);

  async function onSubmit(data: FormData) {
    setIsSaving(true);

    const success = await updateUser(JSON.stringify({ user: data }));
    setIsSaving(false);

    if (!success) {
      return toast({
        title: "Something went wrong.",
        description: "Your profile was not updated. Please try again.",
        variant: "destructive",
      });
    }

    toast({
      description: "Your profile has been updated.",
    });

    // router.refresh()
  }

  async function onDelete() {
    setIsDeleting(true);

    const success = await deleteUser();
    setIsDeleting(false);

    if (!success) {
      return toast({
        title: "Something went wrong.",
        description: "Your account was not deleted. Please try again.",
        variant: "destructive",
      });
    }

    toast({
      description: "Your account has been deleted.",
    });

    // router.refresh()
  }

  async function uploadImage() {
    if (selectedImage) {
      const success = await uploadUserImage(selectedImage);
      if (!success) {
        return toast({
          title: "Something went wrong.",
          description: "Your profile image was not updated. Please try again.",
          variant: "destructive",
        });
      }

      toast({
        description: "Your profile image has been updated. Reload the page to see the change.",
      });

      //  router.refresh()
    }
  }

  function onFileChange(file: File | null) {
    setSelectedImage(file);
  }

  return (
    <form
      className={cn(className)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>
              Please enter your full name and select an image to use as your
              profile picture.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    className={cn(
                      "w-full",
                      errors.first_name && "border-red-600"
                    )}
                    placeholder="First Name"
                    {...register("first_name")}
                  />
                  {errors?.first_name && (
                    <p className="px-1 text-xs text-red-600">
                      {errors.first_name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="last_name" className="mt-4">
                    Last Name
                  </Label>
                  <Input
                    id="last_name"
                    className={cn(
                      "w-full",
                      errors.last_name && "border-red-600"
                    )}
                    placeholder="Last Name"
                    {...register("last_name")}
                  />
                  {errors?.last_name && (
                    <p className="px-1 text-xs text-red-600">
                      {errors.last_name.message}
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
                      Remove Image
                    </button>
                  )}
                  <button
                    type="button"
                    className={cn(buttonVariants(), className)}
                    onClick={uploadImage}
                    disabled={!selectedImage}
                  >
                    Upload Image
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
                        <AvatarImage src={user.image_url} alt="Profile Image" />
                      </AvatarLarge>
                      <p className="mt-2 text-sm text-gray-500">This is your current image. It will be replaced if you press upload.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>{" "}
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Your Contact Information</CardTitle>
            <CardDescription>
              Please enter your email and phone number.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  className={cn("w-full", errors.email && "border-red-600")}
                  placeholder="example@embloy.com"
                  {...register("email")}
                />
                {errors?.email && (
                  <p className="px-1 text-xs text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  className={cn("w-full", errors.phone && "border-red-600")}
                  placeholder="+49 123456789"
                  {...register("phone")}
                />
                {errors?.phone && (
                  <p className="px-1 text-xs text-red-600">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Address</CardTitle>
            <CardDescription>Please enter your address.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-1">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                className="w-full"
                size={32}
                placeholder="Raiffeisenstraße 9 85356 Freising"
                {...register("address")}
              />
              {errors?.address && (
                <p className="px-1 text-xs text-red-600">
                  {errors.address.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Socials</CardTitle>
            <CardDescription>
              Please enter your social media handles.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-1">
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                id="twitter"
                className="w-full"
                size={32}
                placeholder="https://twitter.com/embloy"
                {...register("twitter_url")}
              />
              {errors?.twitter_url && (
                <p className="px-1 text-xs text-red-600">
                  {errors.twitter_url.message}
                </p>
              )}
            </div>
            <div className="grid gap-1">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                className="w-full"
                size={32}
                placeholder="https://linkedin.com/company/embloy"
                {...register("linkedin_url")}
              />
              {errors?.linkedin_url && (
                <p className="px-1 text-xs text-red-600">
                  {errors.linkedin_url.message}
                </p>
              )}
            </div>
            <div className="grid gap-1">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                className="w-full"
                size={32}
                placeholder="https://instagram.com/embloy"
                {...register("instagram_url")}
              />
              {errors?.instagram_url && (
                <p className="px-1 text-xs text-red-600">
                  {errors.instagram_url.message}
                </p>
              )}
            </div>
            <div className="grid gap-1">
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                className="w-full"
                size={32}
                placeholder="https://facebook.com/embloy"
                {...register("facebook_url")}
              />
              {errors?.facebook_url && (
                <p className="px-1 text-xs text-red-600">
                  {errors.facebook_url.message}
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
            <span>Save</span>
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
            <span>Delete Account</span>
          </button>
        </div>
      </CardFooter>
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete your account?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteAlert(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async (event) => {
                event.preventDefault();
                setIsDeleting(true);

                await onDelete();
                setIsDeleting(false);
                setShowDeleteAlert(false);
                router.push("/login");
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
              <span>Delete</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      </div>
    </form>
  );
}
