import React from "react";

export default function Home() {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-blue-darkBlue">Welcome Back</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of your projects and tasks</p>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Projects", value: 8 },
            { title: "Open Tasks", value: 24 },
            { title: "Pending Invites", value: 3 },
            { title: "Team Members", value: 12 }
          ].map((card) => (
            <div key={card.title} className="bg-brightness-light p-4 rounded-2xl shadow-sm">
              <p className="text-sm text-gray-500">{card.title}</p>
              <p className="text-2xl sm:text-3xl font-bold text-blue-darkBlue mt-2">{card.value}</p>
            </div>
          ))}
        </section>

        <section className="mt-8">
          <div className="bg-brightness-primary rounded-2xl p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-blue-darkBlue">Recent Activity</h2>
            <p className="text-sm text-gray-500 mt-2">You have no recent activity.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
