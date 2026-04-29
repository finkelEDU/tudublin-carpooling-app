import { connectDB } from "@/lib/db";
import Pool from "@/models/Pool";
import PoolRequest from "@/models/PoolRequest";
import MapClient from "./components/MapClient";

export default async function Home() {
  await connectDB();

  const pools = await Pool.find().lean();
  const requests = await PoolRequest.find().populate("student", "username").lean();

  const safePools = JSON.parse(JSON.stringify(pools));
  const safeRequests = JSON.parse(JSON.stringify(requests));
  

  return (
    <div>
      <h1>Home</h1>

      <h1>Welcome to TU Dublin's Carpooling</h1>

      <p>Many students are aware that travelling to TUDublin is not easy! Therefore, we will allow students and non-students to offer rides to college.</p>
      <p>Signing up is easy, just click Sign Up at the top of the page and fill in a few details. Then you can request or offer carpool rides to college.</p>

      <h2>Live Pool Map</h2>

      <MapClient pools={safePools} requests={safeRequests} />
    </div>
  );
}