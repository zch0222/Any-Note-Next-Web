import Loading from "@/app/components/Loading";
import {redirect} from "next/navigation";

export function Redirect({to}: { to: any }) {
    redirect(to)
    return <Loading/>
}
