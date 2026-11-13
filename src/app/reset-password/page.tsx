import type { Metadata } from "next";
import { ResetForm } from "./ResetForm";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Reset Password — XAY Teahouse",
};

export default function ResetPasswordPage() {
  return (
    <div className="flex justify-center px-6 pt-40 pb-32 md:px-16 xl:pt-83 xl:pb-56">
      <Reveal className="flex w-full max-w-240 flex-col items-center gap-12 pb-4 text-center md:gap-16">
        <h1 className="heading text-8xl md:text-10xl xl:text-11xl">Reset</h1>
        <p className="text-sm tracking-ultra uppercase opacity-80">
          Enter your email to receive a recovery link
        </p>
        <ResetForm />
      </Reveal>
    </div>
  );
}
