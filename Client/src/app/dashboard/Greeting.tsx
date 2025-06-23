 "use client";
export default function Greeting({ name }: { name: string }) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
  return (
    <h1 className="text-3xl sm:text-4xl font-bold text-purple-400 mb-4">
      {greeting}, {name.split(" ")[0]}!
    </h1>
  );
}
