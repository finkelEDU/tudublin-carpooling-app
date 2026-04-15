import {cookies} from "next/headers";
import {verifyToken} from "@/lib/auth";

export async function getSession(){
	const cookieStore = await cookies();
	const token = cookieStore.get("session")?.value;
	
	if(!token) return null;
	
	const session = verifyToken(token);
	return session || null;
}