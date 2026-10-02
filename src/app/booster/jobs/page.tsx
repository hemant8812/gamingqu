import { redirect } from "next/navigation";

// The booster "Jobs" page is now called Orders.
export default function BoosterJobsRedirect() {
  redirect("/booster/orders");
}
