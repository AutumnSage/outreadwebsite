import { create } from 'zustand';
import { Role } from '@prisma/client';
import { createClient } from '../supabase/client';
import { getUserBySuperbaseID } from '@/app/data-access/user';

interface UserState {
    id: string | null;
    username: string | null;
    supabaseUserId: string | null;
    profilePictureSrc: string | null;
    email: string | null;
    role: Role | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    credit : number |null;
    isLoading : boolean ;
    setUser: (user: Partial<UserState>) => void;
    clearUser: () => void;
}

const initialState: Omit<UserState, 'setUser' | 'clearUser'> = {
    id: null,
    username: null,
    supabaseUserId: null,
    profilePictureSrc: null,
    email: null,
    role: null,
    createdAt: null,
    updatedAt: null,
    credit : null,
    isLoading : false,
};

export const useUserStore = create<UserState>((set) => ({
    ...initialState,
    setUser: (user) => set((state) => ({ ...state, ...user })),
    clearUser: () => set(initialState),
}));

export const updateZustand = async ()=>{
    console.log("Updated UserState")
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();

    console.log(data)
    if (data.session?.user.id) {
        useUserStore.setState({ isLoading: true });
        const userData = await getUserBySuperbaseID(data.session?.user.id.toUpperCase() as string)
        console.log(userData)
        console.log("Loading"  + getUserIsLoading())
        if (userData) {
            useUserStore.setState({ ...userData, isLoading: false });
        } else {
            useUserStore.setState(initialState);
        }
    }

}

// Helper function to get the current user state
export const getUserState = () => useUserStore.getState();

export const getUserIsLoading = () => !!getUserState().isLoading;

export const getUserId = () => getUserState().id;

export const getUserCredit = () => getUserState().credit;

// Helper function to check if the user is authenticated
export const isAuthenticated = () => !!getUserState().supabaseUserId;

// Helper function to check if the user is an admin
export const isAdmin = () => getUserState().role === Role.ADMIN;

// Helper function to check if the user is a paid user
export const isPaidUser = () => getUserState().role === Role.PAID_USER;