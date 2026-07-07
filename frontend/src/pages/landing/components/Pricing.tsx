function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for individuals getting started.",
      features: [
        "Up to 3 users",
        "Unlimited tasks",
        "Basic analytics",
        "Email support",
      ],
      featured: false,
    },
    {
      name: "Pro",
      price: "$9",
      description: "Per user / month",
      features: [
        "Unlimited users",
        "Unlimited projects",
        "Advanced analytics",
        "Priority support",
        "Team collaboration",
      ],
      featured: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations",
      features: [
        "Unlimited users",
        "Dedicated support",
        "Custom integrations",
        "Advanced security",
        "SLA & onboarding",
      ],
      featured: false,
    },
  ];

  return (
    <div>
      <div className="mb-16 text-center">
        <h2 className="text-4xl font-bold text-slate-900">
          Simple and transparent pricing
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
          Start for free and upgrade whenever your team grows.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-3xl border p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl ${
              plan.featured
                ? "border-primary bg-primary text-white"
                : "border-slate-200 bg-white"
            }`}
          >
            {plan.featured && (
              <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-primary">
                Most Popular
              </span>
            )}

            <h3 className="mt-6 text-2xl font-bold">{plan.name}</h3>

            <p
              className={`mt-2 ${
                plan.featured ? "text-primary-foreground" : "text-slate-500"
              }`}
            >
              {plan.description}
            </p>

            <div className="mt-8">
              <span className="text-5xl font-extrabold">{plan.price}</span>

              {plan.name === "Pro" && (
                <span className="ml-2 text-sm">/month</span>
              )}
            </div>

            <ul className="mt-8 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature}>✓ {feature}</li>
              ))}
            </ul>

            <button
              className={`mt-10 w-full rounded-xl py-3 font-semibold transition ${
                plan.featured
                  ? "bg-white text-primary hover:bg-slate-100"
                  : "bg-primary text-white transition hover:opacity-90"
              }`}
            >
              {plan.name === "Enterprise"
                ? "Contact Sales"
                : "Get Started"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Pricing;