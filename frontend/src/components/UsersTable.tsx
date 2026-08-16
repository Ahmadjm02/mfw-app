import type { User } from "../types/user";
import { initial, joinedLong, joinedShort, sinceThen } from "../lib/format";

export function Monogram({ name, size }: { name: string; size: number }) {
  return (
    <div
      aria-hidden="true"
      className="flex flex-none items-center justify-center rounded-[11px] bg-surface font-display font-bold text-accent"
      style={{ width: size, height: size, fontSize: size === 36 ? 15 : 14 }}
    >
      {initial(name)}
    </div>
  );
}

/** Table layout, desktop only. */
function DesktopTable({ users }: { users: User[] }) {
  return (
    <div className="hidden rounded-2xl border border-line bg-card px-6 pt-2 pb-3.5 md:block">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="py-3.5 pr-4 pl-0 text-left text-[11px] font-semibold tracking-[.1em] text-ink-muted uppercase">
              User
            </th>
            <th className="w-[300px] px-4 py-3.5 text-left text-[11px] font-semibold tracking-[.1em] text-ink-muted uppercase">
              Email
            </th>
            <th className="w-[190px] px-4 py-3.5 text-left text-[11px] font-semibold tracking-[.1em] text-ink-muted uppercase">
              Joined
            </th>
            <th className="w-[230px] py-3.5 pr-0 pl-4 text-right text-[11px] font-semibold tracking-[.1em] text-ink-muted uppercase">
              Since then
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => {
            const since = sinceThen(u.created_at, u.updated_at);
            return (
              <tr key={u.id} className="hover:bg-row-hover">
                <td className="border-t border-line-soft py-3.5 pr-4 pl-0">
                  <div className="flex items-center gap-3">
                    <Monogram name={u.name} size={36} />
                    <span className="text-[15.5px] font-semibold tracking-[-0.012em] whitespace-nowrap text-ink">
                      {u.name}
                    </span>
                  </div>
                </td>
                <td className="border-t border-line-soft px-4 py-3.5 text-sm whitespace-nowrap text-ink-muted">
                  {u.email}
                </td>
                <td className="border-t border-line-soft px-4 py-3.5 text-sm whitespace-nowrap text-ink-muted">
                  {joinedLong(u.created_at)}
                </td>
                <td
                  className={`border-t border-line-soft py-3.5 pr-0 pl-4 text-right text-sm whitespace-nowrap ${since.edited ? "text-alert" : "text-ink-muted"}`}
                >
                  {since.text}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** Stacked card layout, mobile only. Dates are abbreviated to fit the narrow column. */
function MobileList({ users }: { users: User[] }) {
  return (
    <div className="flex flex-col rounded-2xl border border-line bg-card px-4 pt-0.5 pb-2 md:hidden">
      {users.map((u) => {
        const since = sinceThen(u.created_at, u.updated_at, true);
        return (
          <div key={u.id} className="flex flex-col gap-2.5 border-t border-line-soft py-4">
            <div className="flex items-center gap-[11px]">
              <Monogram name={u.name} size={34} />
              <div className="min-w-0">
                <div className="text-[15px] font-semibold tracking-[-0.012em] text-ink">
                  {u.name}
                </div>
                <div className="overflow-hidden text-[12.5px] text-ellipsis whitespace-nowrap text-accent-muted">
                  {u.email}
                </div>
              </div>
            </div>
            <div className="flex gap-6 pl-[45px]">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-semibold tracking-[.1em] text-ink-muted uppercase">
                  Joined
                </span>
                <span className="text-[13px] text-ink-muted">{joinedShort(u.created_at)}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-semibold tracking-[.1em] text-ink-muted uppercase">
                  Since then
                </span>
                <span className={`text-[13px] ${since.edited ? "text-alert" : "text-ink-muted"}`}>
                  {since.text}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** The fetched users, rendered as a table on desktop and as cards on mobile. */
export function UsersTable({ users }: { users: User[] }) {
  return (
    <>
      <DesktopTable users={users} />
      <MobileList users={users} />
    </>
  );
}
