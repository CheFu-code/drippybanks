import {
    BookOpen,
    ChevronDownIcon,
    Home,
    LayoutDashboardIcon,
    LogOutIcon,
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
// import { UserDropdownProps } from '@/types/user';
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { toast } from 'sonner';
import { auth } from '@/config/firebaseConfig'

export default function UserDropdown() {
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
                <Button
                    variant="ghost"
                    className="h-auto p-0 hover:bg-transparent border border-amber-300"
                >
                    <Avatar>
                        <AvatarImage
                        src={'/drippybanks.png'}
                            // src={user?.profilePicture || '/drippybanks.png'}
                            alt="Profile image"
                        />
                        <AvatarFallback>
                            DB
                            {/* {user?.fullname?.[0] || 'CA'} */}
                        </AvatarFallback>
                    </Avatar>
                    <ChevronDownIcon
                        size={16}
                        className="opacity-60"
                        aria-hidden="true"
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-w-64">
                <DropdownMenuLabel className="flex min-w-0 flex-col">
                    <span className="text-foreground truncate text-sm font-medium">
                        {/* {user?.fullname} */}
                        username
                    </span>
                    <span className="text-muted-foreground truncate text-xs font-normal">
                        {/* {user?.email} */}
                        example@email.com
                    </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link href={'/'} className="flex items-center gap-2">
                            <Home
                                size={16}
                                className="opacity-60"
                                aria-hidden="true"
                            />
                            <span>Home</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link
                            href={'/videos/all-videos'}
                            className="flex items-center gap-2"
                        >
                            <LayoutDashboardIcon
                                size={16}
                                className="opacity-60"
                                aria-hidden="true"
                            />
                            <span>Videos</span>
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                        <Link
                            href={'/courses'}
                            className="flex items-center gap-2"
                        >
                            <BookOpen
                                size={16}
                                className="opacity-60"
                                aria-hidden="true"
                            />
                            <span>Courses</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="flex items-center gap-2"
                    >
                        <LogOutIcon
                            size={16}
                            className="opacity-60"
                            aria-hidden="true"
                        />
                        <span>Logout</span>
                    </Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
