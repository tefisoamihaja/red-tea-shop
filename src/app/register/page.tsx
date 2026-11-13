import type { Metadata } from "next";
import { AuthSplit } from "@/components/layout/AuthSplit";
import { RegisterForm } from "./RegisterForm";

export const metadata: Metadata = {
  title: "Register — XAY Teahouse",
};

export default function RegisterPage() {
  return (
    <AuthSplit
      title={
        <>
          Join the
          <br />
          Inner
          <br />
          Circle
        </>
      }
      intro="Create an account to access private reserve harvests, ceremonial guides, and early architectural tea-ware releases."
      cardTitle="Register"
      cardSubtitle="Step into the future of luxury infusion"
    >
      <RegisterForm />
    </AuthSplit>
  );
}
