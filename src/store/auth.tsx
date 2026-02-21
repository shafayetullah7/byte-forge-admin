import {
    createContext,
    createResource,
    useContext,
    JSX,
    Resource,
} from "solid-js";
import { checkAuth, loginAdmin, logoutAdmin, type AdminUser } from "~/lib/api";

interface AuthContextType {
    user: Resource<AdminUser | null>;
    isAuthenticated: () => boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>();

export function AuthProvider(props: { children: JSX.Element }) {
    const [user, { mutate }] = createResource<AdminUser | null>(async () => {
        try {
            return await checkAuth();
        } catch {
            return null;
        }
    });

    const isAuthenticated = () => !!user();

    const login = async (email: string, password: string) => {
        const data = await loginAdmin({ email, password });
        mutate(data.admin);
    };

    const logout = async () => {
        try {
            await logoutAdmin();
        } finally {
            mutate(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                login,
                logout,
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
