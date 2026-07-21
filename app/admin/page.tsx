import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { listContacts } from "@/lib/db";
import AdminShell from "./AdminShell";

export const dynamic = "force-dynamic";

export default function AdminContacts() {
  if (!isAdmin()) redirect("/admin/login");

  const contacts = listContacts();

  return (
    <AdminShell active="contacts">
      <div className="flex items-baseline justify-between">
        <h1 className="font-display text-3xl font-bold tracking-headline text-on-surface">
          Mockup requests
        </h1>
        <span className="font-body text-sm text-on-surface-variant">
          {contacts.length} total
        </span>
      </div>

      {contacts.length === 0 ? (
        <p className="glass mt-8 rounded-xl p-8 font-body text-base text-on-surface-variant">
          No requests yet. When someone submits the &ldquo;Get a free homepage
          mockup&rdquo; form on the landing page, it will appear here.
        </p>
      ) : (
        <div className="glass mt-8 overflow-x-auto rounded-xl">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th className="label-caps !text-xs px-6 py-4">When</th>
                <th className="label-caps !text-xs px-6 py-4">Name</th>
                <th className="label-caps !text-xs px-6 py-4">Email</th>
                <th className="label-caps !text-xs px-6 py-4">Website</th>
                <th className="label-caps !text-xs px-6 py-4">About</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr key={c.id} className="border-b border-white/5 align-top last:border-b-0">
                  <td className="whitespace-nowrap px-6 py-4 font-body text-sm text-on-surface-variant">
                    {new Date(c.created_at + "Z").toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-6 py-4 font-body text-sm font-medium text-on-surface">
                    {c.name}
                  </td>
                  <td className="px-6 py-4 font-body text-sm">
                    <a href={`mailto:${c.email}`} className="text-primary hover:underline">
                      {c.email}
                    </a>
                  </td>
                  <td className="max-w-[180px] truncate px-6 py-4 font-body text-sm text-on-surface-variant">
                    {c.website ? (
                      <a href={c.website} target="_blank" rel="noreferrer" className="hover:text-on-surface">
                        {c.website}
                      </a>
                    ) : (
                      <span className="text-outline">—</span>
                    )}
                  </td>
                  <td className="max-w-[320px] px-6 py-4 font-body text-sm text-on-surface-variant">
                    {c.about || <span className="text-outline">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
