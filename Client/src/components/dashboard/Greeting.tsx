
   "use client";

   interface Props { name: string }
   

   export default function Greeting({ name }: Props) {
     const hour   = new Date().getHours();
     const first  = name.split(" ")[0];     
   
     const greeting =
           hour <  4 ? "Burning the midnight oil" :
           hour < 12 ? "Good morning"             :
           hour < 17 ? "Good afternoon"           :
           hour < 21 ? "Good evening"             :
                       "Good night, night-owl";
   
     return (
       <h1 className="text-3xl sm:text-4xl font-bold
                      bg-clip-text text-transparent
                      bg-gradient-to-r from-purple-400 to-pink-300 mb-4">
         {greeting}, {first}!
       </h1>
     );
   }
   