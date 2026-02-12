 "use client";
 import { useFormStatus } from "react-dom";
 
 export function SubmitButton({
   children,
   className = "w-full h-9 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold",
   pendingClassName = "opacity-75 cursor-wait",
 }: {
   children: React.ReactNode;
   className?: string;
   pendingClassName?: string;
 }) {
   const { pending } = useFormStatus();
   return (
     <button
       type="submit"
       disabled={pending}
       className={`${className} ${pending ? pendingClassName : ""}`}
     >
       {pending ? (
         <span className="inline-flex items-center gap-2">
           <span className="loading loading-spinner loading-sm" />
           <span>Processing...</span>
         </span>
       ) : (
         children
       )}
     </button>
   );
 }
