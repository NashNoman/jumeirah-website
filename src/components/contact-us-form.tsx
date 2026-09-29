"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function ContactUsFrom({ className }: { className?: string }) {
  const t = useTranslations("ContactUs");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null,
  );
  const [invalidFields, setInvalidFields] = useState<Set<string>>(new Set());

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setIsSubmitting(true);
    setSubmitStatus(null);

    const formData = new FormData(form);
    const data = {
      firstname: formData.get("firstname") as string,
      lastname: formData.get("lastname") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      message: formData.get("message") as string,
    };

    const errors = new Set<string>();

    if (!data.firstname?.trim()) errors.add("firstname");
    if (!data.lastname?.trim()) errors.add("lastname");
    if (!data.message?.trim()) errors.add("message");

    if (!data.email?.trim() && !data.phone?.trim()) {
      errors.add("email");
      errors.add("phone");
    }

    if (data.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.add("email");
    }

    if (data.phone?.trim() && !/^[\d\s\+\-\(\)]+$/.test(data.phone)) {
      errors.add("phone");
    }

    if (errors.size > 0) {
      setInvalidFields(errors);
      setSubmitStatus("error");
      setIsSubmitting(false);
      return;
    }

    setInvalidFields(new Set());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setInvalidFields(new Set());
        form.reset();
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col space-y-4 rounded-4xl md:space-y-6 lg:rounded-[3rem] lg:px-8 lg:py-7",
        className,
      )}
    >
      <div>
        <h3 className="first-letter-primary-or-clip from-[0.5ch] to-[0.5ch] pb-1 font-serif text-3xl md:text-4xl">
          {t("contact-us")}
        </h3>
        <p className="mt-2 text-sm font-light text-[#9C9C9C] md:text-base lg:mt-4">
          {t("description")}
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="grid grow items-center gap-4 lg:grid-cols-2"
      >
        <Input
          name="firstname"
          placeholder={t("first-name")}
          isInvalid={invalidFields.has("firstname")}
        />
        <Input
          name="lastname"
          placeholder={t("last-name")}
          isInvalid={invalidFields.has("lastname")}
        />
        <Input
          name="email"
          className="col-span-full"
          placeholder={t("email")}
          type="email"
          isInvalid={invalidFields.has("email")}
        />
        <Input
          name="phone"
          dir="ltr"
          className="col-span-full rtl:text-right"
          placeholder={t("phone")}
          type="tel"
          isInvalid={invalidFields.has("phone")}
        />
        <TextArea
          name="message"
          className="col-span-full"
          placeholder={t("message")}
          maxLength={1000}
          isInvalid={invalidFields.has("message")}
        />
        {submitStatus === "success" && (
          <p className="col-span-full text-center text-sm text-green-400">
            {t("success-message")}
          </p>
        )}
        {submitStatus === "error" && (
          <p className="col-span-full text-center text-sm text-red-400">
            {t("error-message")}
          </p>
        )}
        <SubmitButton className="col-span-full" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : t("send-message")}
        </SubmitButton>
      </form>
    </div>
  );
}

function Input({
  className,
  isInvalid,
  ...props
}: React.ComponentProps<"input"> & { isInvalid?: boolean }) {
  return (
    <input
      className={cn(
        "rounded-full border bg-white/5 px-5 py-3 placeholder-[#757575]",
        isInvalid ? "border-red-500" : "border-white/30",
        className,
      )}
      maxLength={255}
      {...props}
    />
  );
}

function TextArea({
  className,
  isInvalid,
  ...props
}: React.ComponentProps<"textarea"> & { isInvalid?: boolean }) {
  return (
    <textarea
      rows={5}
      className={cn(
        "resize-none rounded-3xl border bg-white/5 px-5 py-3 placeholder-[#757575]",
        isInvalid ? "border-red-500" : "border-white/30",
        className,
      )}
      {...props}
    />
  );
}

function SubmitButton({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "bg-primary cursor-pointer rounded-xl py-3 text-center text-black transition-colors transition-discrete hover:text-black/70 hover:brightness-110 focus:text-black/70 focus:brightness-110 focus:drop-shadow-[0_0_5px_#ffcb05] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      type="submit"
      {...props}
    />
  );
}
