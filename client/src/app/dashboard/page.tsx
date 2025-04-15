'use client';
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import BrandDashboard from "./Brand/page";
import ConsumerDashboard from "./Consumer/page";

function Dashboard() {
    const role = useSelector((state: RootState)=> state.userRole.role);
    if(role == 'Brand'){
        return <BrandDashboard/>
    }
    if(role == 'Consumer'){
        return <ConsumerDashboard/>
    }
    if(role == 'Wholesaler'){
        return <div  className="absolute top-[50%]">Wholesaler Dashboard</div>;
    }

    
}

export default Dashboard;