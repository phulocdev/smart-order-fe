"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { OAUTH_LOGIN_ERROR_MESSAGE, ROUTES } from "@/constants/constants";
import { ENTITY_ERROR_STATUS_CODE, EntityError, HttpError } from "@/lib/errors";
import { cn, handleApiError } from "@/lib/utils";
import { LoginBodyType, loginSchema } from "@/schemaValidations/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const searchParams = useSearchParams();
  const oAuthLoginErrorMessage = searchParams.get("error");

  const form = useForm<LoginBodyType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onLoginWithCredential(values: LoginBodyType) {
    try {
      setIsLoading(true);
      const { email, password } = values;
      const response = await signIn("employee-credentials", {
        // Có lỗi trả về từ NextServer thì k redirect sang route lỗi
        // Dù login success  nhưng mà nếu redirect: false & có callbackUrl thì sau đó vẫn không chuyển dang route: /dashboard/order
        redirect: false,
        email,
        password,
      });

      if (response?.error) {
        const error = JSON.parse(response.error) as HttpError;
        if (error.statusCode === ENTITY_ERROR_STATUS_CODE) {
          const { message, errors } = error as EntityError;
          // Reformat lại objError - được parse từ chuỗi JSON sang obj EntityError để có thể xử lý đúng dạng lỗi ở hàm handleApiError()
          // Chỉ riêng với EntityError thì mới cần làm vậy | Những error còn lại toast lên là ok rồi
          throw new EntityError({ message, errors });
        }
        throw error;
      }
      router.replace(ROUTES.DASHBOARD.ORDERS);
    } catch (error) {
      handleApiError({ error, setError: form.setError });
    } finally {
      setIsLoading(false);
    }
  }

  function onLoginWithGoogle() {
    // Login SSO với Social Provider thì mặc dù có redirect: false nhưng vẫn navigate sang trang /dashboard/orders được
    signIn("google", { callbackUrl: ROUTES.DASHBOARD.ORDERS, redirect: false });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onLoginWithCredential)}
        className="space-y-5"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  className="text-sm"
                  placeholder="Hãy nhập email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
              {/* <Link href={'/forgot-password'} className='mt-1 block text-sm text-red-500 dark:text-red-800'>
                Quên mật khẩu?
              </Link> */}
            </FormItem>
          )}
        />
        {oAuthLoginErrorMessage === OAUTH_LOGIN_ERROR_MESSAGE && (
          <div className="text-[13px] font-medium text-red-500">
            Tài khoản không tồn tại trên hệ thống!
          </div>
        )}
        <>
          <Button
            type="submit"
            className={cn("w-full", {
              "cursor-not-allowed opacity-80": isLoading,
            })}
          >
            {isLoading && (
              <Loader className="mr-2 size-4 animate-spin" aria-hidden="true" />
            )}
            Đăng nhập
          </Button>
          <Button
            type="button"
            variant={"outline"}
            className={cn("w-full", {
              "cursor-not-allowed opacity-80": isLoading,
            })}
            onClick={onLoginWithGoogle}
          >
            <Image
              alt="googleIcon"
              src={"/google.svg"}
              width={24}
              height={24}
              className="aspect-square w-6 object-cover"
            />
            Đăng nhập với Google
          </Button>
        </>
        {/* <Button
          type='button'
          variant={'outline'}
          className='w-full'
          onClick={() => signIn('github', { callbackUrl: '/' })}
        >
          Đăng nhập với Github
        </Button> */}
      </form>
    </Form>
  );
}
