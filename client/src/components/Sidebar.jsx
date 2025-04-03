import React, { useEffect, useState } from 'react'
import { useChatStore } from '../store/UseChatStore';
import SidebarSkeleton from './Skeleton/SidebarSkeleton';
import { Users } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const Sidebar = () => {
    const { getUsers, users, isUsersLoading, selectedUser, setSelectedUser } = useChatStore();

    const { onlineUsers } = useAuthStore()
    const [showOnline, setShowOnline] = useState(false);

    useEffect(() => {
        getUsers()
    }, [getUsers])

    const filteredUsers = showOnline ? users.filter(user => onlineUsers.includes(user._id)) : users;
    console.log(filteredUsers)

    if (isUsersLoading) {
        return <SidebarSkeleton />
    }
    return (
        <aside
            className="h-full w-20 lg:w-72 border-r border-base-300 
                 flex flex-col transition-all duration-200"
        >
            {/* Header */}
            <div className="border-b border-base-300 w-full p-5">
                <div className="flex items-center gap-2">
                    <Users className="w-6 h-6" />
                    <span className="font-medium hidden lg:block">Contacts</span>
                </div>
                <div className="mt-3 hidden lg:flex items-center gap-2">
                    <label className="cursor-pointer flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={showOnline}
                            onChange={(e) => setShowOnline(e.target.checked)}
                            className="checkbox checkbox-sm"
                        />
                        <span className="text-sm">Show online only</span>
                    </label>
                    <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
                </div>
            </div>
            <div className="overflow-y-auto w-full py-3">
                {filteredUsers.map((user) => (
                    <button
                        key={user._id}
                        onClick={() => setSelectedUser(user)}
                        className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors cursor-pointer
                            ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}`}
                    >
                        <div className="relative mx-auto lg:mx-0  rounded-full">
                            <img
                                src={user.profilePic || "/avatar.png"}
                                alt={user.fullname}
                                className="size-12 object-cover rounded-full"
                            />
                            {onlineUsers.includes(user._id) && (
                                <span className='absolute bottom-0 right-0 size-2 bg-green-500 rounded-full ring-2 ring-zinc-900' />
                            )}
                        </div>
                        {/* user Info */}
                        <div className="hidden lg:block text-left min-w-0">
                            <div className="font-medium truncate">{user.fullName}</div>
                            <div className="text-sm text-zinc-400">
                                {onlineUsers.includes(user._id) ? "Online" : "Ofline"}
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </aside>
    )
}

export default Sidebar
