import FullLogo from "../shared/logo/FullLogo";
import Profile from "./Profile";
import Notification from "./notification";

const Topbar = () => {
    return (
        <div className="py-2 px-6 z-50 sticky top-0 bg-[linear-gradient(90deg,_#001138_0%,_#001e66_100%)] flex items-center justify-between shadow-md">
            <div className="flex items-center gap-4">
                <div className="transition-opacity duration-300">
                    <FullLogo variant="light" />
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                <Notification variant="light" />
                <Profile variant="light" />
            </div>
        </div>
    )
}

export default Topbar;