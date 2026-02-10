import {
    Home,
    LayoutDashboardIcon,
    ShoppingCart,
    Heart,
    User,
    LogOutIcon,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { UserDropdownProps } from '@/types/user';
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { toast } from 'sonner';
import { auth } from '@/config/firebaseConfig';

export default function UserDropdown({ user }: UserDropdownProps) {
    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast.success('Logged out successfully!');
        } catch (error) {
            console.error('Logout failed:', error);
            toast.error('Logout failed. Please try again.');
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
                    <Avatar>
                        <AvatarImage
                            src={user?.avatarUrl || '/drippybanks.jpg'}
                            alt="Profile image"
                        />
                        <AvatarFallback>{user?.fullname?.[0] || 'DB'}</AvatarFallback>
                    </Avatar>
                    <LayoutDashboardIcon size={16} className="opacity-60" aria-hidden="true" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="max-w-64">
                <DropdownMenuLabel className="flex flex-col min-w-0">
                    <span className="text-foreground truncate text-sm font-medium">{user?.fullname}</span>
                    <span className="text-muted-foreground truncate text-xs font-normal">{user?.email}</span>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link href="/" className="flex items-center gap-2">
                            <Home size={16} className="opacity-60" aria-hidden="true" />
                            <span>Home</span>
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                        <Link href="/shop" className="flex items-center gap-2">
                            <LayoutDashboardIcon size={16} className="opacity-60" aria-hidden="true" />
                            <span>Shop</span>
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                        <Link href="/cart" className="flex items-center gap-2">
                            <ShoppingCart size={16} className="opacity-60" aria-hidden="true" />
                            <span>Cart</span>
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                        <Link href="/wishlist" className="flex items-center gap-2">
                            <Heart size={16} className="opacity-60" aria-hidden="true" />
                            <span>Wishlist</span>
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                        <Link href="/profile" className="flex items-center gap-2">
                            <User size={16} className="opacity-60" aria-hidden="true" />
                            <span>Profile</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                    <Button variant="destructive" onClick={handleLogout} className="flex items-center gap-2">
                        <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
                        <span>Logout</span>
                    </Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
