import {
    Heart,
    LayoutDashboardIcon,
    LogOutIcon,
    ShoppingCart,
    User
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLogout } from '@/hooks/useLogout';
import { UserDropdownProps } from '@/types/user';
import Link from 'next/link';
import { GiClothes } from 'react-icons/gi';

export default function UserDropdown({ user }: UserDropdownProps) {
    const { handleLogout } = useLogout();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
                    <Avatar>
                        <AvatarImage
                            src={user?.avatarUrl}
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
                        <Link href={`/${user?.id}/profile`} className="flex items-center gap-2">
                            <User size={16} className="opacity-60" aria-hidden="true" />
                            <span>Profile</span>
                        </Link>
                    </DropdownMenuItem>

                    {user?.role === 'admin' && (<DropdownMenuItem asChild>
                        <Link href='/admin/dashboard' className="flex items-center gap-2">
                            <GiClothes size={16} className="opacity-60" aria-hidden="true" />
                            <span>Admin Dashboard</span>
                        </Link>
                    </DropdownMenuItem>)}
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                    <Button variant="destructive" onClick={() => handleLogout()} className="flex items-center gap-2">
                        <LogOutIcon size={16} className=" text-white" aria-hidden="true" />
                        <span>Logout</span>
                    </Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
