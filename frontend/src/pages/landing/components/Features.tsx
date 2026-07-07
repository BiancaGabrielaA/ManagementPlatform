import {
  ClipboardList,
  Users,
  BarChart3,
  ShieldCheck,
} from "lucide-react";

function Features() {
  const features = [
    {
      icon: ClipboardList,
      title: "Task Management",
      description: "Create, assign and organize tasks with ease.",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Collaborate in real time with comments and mentions.",
    },
    {
      icon: BarChart3,
      title: "Reports & Analytics",
      description: "Monitor productivity and track project progress.",
    },
    {
      icon: ShieldCheck,
      title: "Secure Platform",
      description: "Protect your workspace with roles and secure authentication.",
    },
  ];

  return (
    <div>
      <div className="mb-16 text-center">
        <h2 className="text-4xl font-bold text-slate-900">
          Everything you need to manage projects
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
          Powerful tools that help teams stay organized, collaborate efficiently,
          and deliver projects on time.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.title}
              className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <Icon className="h-7 w-7 text-primary" />
              </div>

              <h3 className="mb-3 text-xl font-semibold text-slate-900">
                {feature.title}
              </h3>

              <p className="leading-7 text-slate-600">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Features;