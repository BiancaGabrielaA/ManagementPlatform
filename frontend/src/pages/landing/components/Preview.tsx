function Preview() {
  return (
    <div className="text-center">
      <div className="mb-12">
        <h2 className="text-4xl font-bold text-slate-900">
          See TaskFlow in action
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
          A clean and intuitive workspace that helps teams organize projects,
          manage tasks, and collaborate efficiently.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        {/* Replace this with a screenshot later */}
        <div className="flex h-[550px] items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
          <div className="text-center">
            <p className="text-xl font-semibold text-slate-700">
              Dashboard Preview
            </p>

            <p className="mt-2 text-slate-500">
              Replace this area with a screenshot of your application.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Preview;