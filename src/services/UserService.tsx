import api from "../utils/axios";

//  Interfaz para el usuario
export interface User {
    id: number;
    email: string;
    username: string; 
    role: string; 
    is_active: boolean; 
    date_joined: string; 
    last_login: string; 
    is_staff: boolean; 
    is_superuser: boolean; 
    groups: any []; 
    user_permissions: any[]; 
}
// Servicio para obtener los usuarios 
export const getUsers = async (): Promise<User[]> =>{
    const response = await api.get("/categories"); 
    return response.data; 
};