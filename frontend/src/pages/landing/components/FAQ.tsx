import {
  Briefcase,
  Code2,
  GraduationCap,
  Megaphone,
  Palette,
  Users,
} from "lucide-react";

function BuiltFor() {
  const teams = [
    {
      icon: Code2,
      title: "Developers",
      description:
        "Plan sprints, track bugs, and manage development workflows.",
    },
    {
      icon: Users,
      title: "Project Managers",
      description:
        "Coordinate teams, assign tasks, and monitor project progress.",
    },
    {
      icon: Palette,
      title: "Design Teams",
      description:
        "Organize design requests, reviews, and creative workflows.",
    },
    {
      icon: Megaphone,
      title: "Marketing Teams",
      description:
        "Plan campaigns, content calendars, and team collaboration.",
    },
    {
      icon: Briefcase,
      title: "Small Businesses",
      description:
        "Keep projects, clients, and daily operations organized in one place.",
    },
    {
      icon: GraduationCap,
      title: "Students",
      description:
        "Manage assignments, group projects, and personal study goals.",
    },
  ];

  return (
    <section>
      <div className="mb-16 text-center">
        <span className="rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
          Built for everyone
        </span>

        <h2 className="mt-5 text-4xl font-bold text-slate-900 md:text-5xl">
          Built for every team
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
          Whether you're managing a small project or coordinating an entire
          organization, TaskFlow adapts to the way your team works.
        </p>
      </div>

     <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {teams.map((team) => {
          const Icon = team.icon;

          return (
            <div
              key={team.title}
              className="group rounded-xl border border-slate-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-md"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary">
                <Icon className="h-5 w-5 text-primary transition-colors group-hover:text-white" />
              </div>

              <h3 className="mb-2 text-base font-semibold text-slate-900">
                {team.title}
              </h3>

              <p className="text-sm leading-6 text-slate-600">
                {team.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default BuiltFor;