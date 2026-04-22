import { Badge, Dropdown, Spinner } from "flowbite-react";
import { Icon } from "@iconify/react";
import { Link } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../utils/axios";
import { useAuth } from "../../../context/AuthContext";
import { useTranslation } from "react-i18next";

interface NotificationItem {
    id: string;
    title: string;
    message: string;
    is_read: boolean;
    type: string;
    created_at: string;
}

interface NotificationProps {
    variant?: "light" | "dark";
}

const Notification = ({ variant = "dark" }: NotificationProps) => {
    const { t } = useTranslation("headerTrad");
    const isDark = variant === "dark";
    const { isAuthenticated } = useAuth();
    const queryClient = useQueryClient();

    const { data: notifications = [], isLoading } = useQuery<NotificationItem[]>({
        queryKey: ["notifications"],
        queryFn: async () => {
            const response = await api.get("/core/notifications/");
            return response.data;
        },
        enabled: isAuthenticated,
        refetchInterval: 30000,
    });

    const markAsRead = useMutation({
        mutationFn: async (id: string) => {
            await api.post(`/core/notifications/${id}/mark_as_read/`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });

    const unreadCount = notifications.filter((n) => !n.is_read).length;

    if (!isAuthenticated) return null;

    return (
        <div className="relative group/menu">
            <Dropdown 
                label=""
                className="rounded-xl w-[320px] shadow-xl border-0 overflow-hidden"
                dismissOnClick={true}
                renderTrigger={() => (
                    <span
                        className={`h-10 w-10 rounded-full flex justify-center items-center cursor-pointer relative transition ${
                            isDark 
                            ? "hover:text-primary hover:bg-lightprimary text-gray-600 dark:text-gray-300"
                            : "text-white hover:bg-white/10"
                        }`}
                        aria-label={t("notifications.aria")}
                    >
                        <Icon icon="solar:bell-linear" height={22} />
                        {unreadCount > 0 && (
                            <Badge className="h-4 w-4 rounded-full absolute -end-1 -top-1 bg-red-500 text-white text-[10px] flex items-center justify-center p-0 border-2 border-white dark:border-dark">
                                {unreadCount}
                            </Badge>
                        )}
                    </span>
                )}
            >
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-darkgray">
                    <h3 className="text-sm font-bold text-gray-800 dark:text-white">
                        {t("notifications.title")}
                    </h3>
                    {unreadCount > 0 && (
                        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                            {t("notifications.new", { count: unreadCount })}
                        </span>
                    )}
                </div>

                <div className="max-h-[350px] overflow-y-auto">
                    {isLoading ? (
                        <div className="flex justify-center items-center p-8">
                            <Spinner size="md" />
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="p-8 text-center">
                            <Icon icon="solar:bell-off-outline" className="mx-auto mb-2 text-gray-300" height={42} />
                            <p className="text-sm text-gray-400">
                                {t("notifications.empty")}
                            </p>
                        </div>
                    ) : (
                        notifications.map((item) => (
                            <div 
                                key={item.id} 
                                className={`px-4 py-3 flex flex-col gap-1 border-b border-gray-50 dark:border-gray-800 transition hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer ${!item.is_read ? 'bg-primary/5 dark:bg-primary/10' : ''}`}
                                onClick={() => !item.is_read && markAsRead.mutate(item.id)}
                            >
                                <div className="flex justify-between items-start">
                                    <span className={`text-xs font-bold ${!item.is_read ? 'text-primary' : 'text-gray-700 dark:text-gray-200'}`}>
                                        {item.title}
                                    </span>
                                    {!item.is_read && <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1"></span>}
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                                    {item.message}
                                </p>
                                <span className="text-[10px] text-gray-400 mt-1">
                                    {new Date(item.created_at).toLocaleString()}
                                </span>
                            </div>
                        ))
                    )}
                </div>
                
                {notifications.length > 0 && (
                    <div className="p-2 bg-gray-50 dark:bg-darkgray text-center border-t border-gray-100 dark:border-gray-700">
                        <Link to="/cliente/notificaciones" className="text-[11px] font-bold text-primary hover:underline">
                            {t("notifications.all")}
                        </Link>
                    </div>
                )}
            </Dropdown>
        </div>
    );
};

export default Notification;