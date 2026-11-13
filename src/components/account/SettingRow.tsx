import Link from "next/link";
import { ChevronRightIcon } from "@/components/ui/icons";

const row =
  "group flex w-full items-center justify-between px-4 py-10 text-left transition-colors duration-250 ease-out hover:bg-blush-50";

// The chevron shows on hover (always on touch screens).
export function SettingRow({ label, value, href }: { label: string; value: string; href?: string }) {
  const content = (
    <>
      <span className="flex min-w-0 flex-col gap-1">
        <span className="label opacity-50">{label}</span>
        <span className="truncate text-lg font-semibold">{value}</span>
      </span>
      {href && (
        <ChevronRightIcon className="size-4 shrink-0 opacity-0 transition-opacity duration-250 ease-out group-hover:opacity-100 pointer-coarse:opacity-100" />
      )}
    </>
  );

  return (
    <li className="border-b border-tea-500/10">
      {/* TODO: edit forms for email and newsletter */}
      {href ? (
        <Link href={href} className={row}>
          {content}
        </Link>
      ) : (
        <div className={row}>{content}</div>
      )}
    </li>
  );
}
