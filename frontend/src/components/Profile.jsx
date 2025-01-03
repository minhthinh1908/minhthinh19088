import React, { useState } from 'react';
import Navbar from './shared/Navbar';
import { Avatar, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Contact, Mail, Pen } from 'lucide-react';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import AppliedJobTable from './AppliedJobTable';
import UpdateProfileDialog from './UpdateProfileDialog';
import { useSelector } from 'react-redux';
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs';

// const skills = ["Html", "Css", "Javascript", "Reactjs"]
const isResume = true;

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const { user } = useSelector((store) => store.auth);

    return (
        <div className="bg-gray-100 min-h-screen">
            <Navbar />
            <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-8 p-8 shadow-lg">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-6">
                        <Avatar className="h-24 w-24 shadow-lg">
                            <AvatarImage
                                src="https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"
                                alt="profile"
                            />
                        </Avatar>
                        <div>
                            <h1 className="font-semibold text-2xl text-gray-800">{user?.fullname}</h1>
                            <div className="mt-1">
                                {user?.profile?.bio ? (
                                    <div
                                        className="text-gray-600"
                                        dangerouslySetInnerHTML={{ __html: user.profile.bio }} // Hiển thị nội dung HTML từ React Quill
                                    ></div>
                                ) : (
                                    <p className="text-gray-600">No introduction information yet</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <Button
                        onClick={() => setOpen(true)}
                        className="flex items-center gap-2 text-sm"
                        variant="outline"
                    >
                        <Pen size={16} />
                        Edit
                    </Button>
                </div>
                <div className="my-6">
                    <div className="flex items-center gap-4 my-3 text-gray-700">
                        <Mail size={20} />
                        <span>{user?.email || "No email yet"}</span>
                    </div>
                    <div className="flex items-center gap-4 my-3 text-gray-700">
                        <Contact size={20} />
                        <span>{user?.phoneNumber || "No phone number yet"}</span>
                    </div>
                </div>
                <div className="my-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">Skill</h2>
                    <div className="flex flex-wrap gap-2">
                        {user?.profile?.skills?.length ? (
                            user?.profile?.skills.map((item, index) => (
                                <Badge key={index} className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                                    {item}
                                </Badge>
                            ))
                        ) : (
                            <span className="text-gray-500">No skills yet</span>
                        )}
                    </div>
                </div>
                <div className="grid w-full max-w-sm items-center gap-2">
                    <Label className="text-md font-semibold text-gray-800">CV</Label>
                    {isResume ? (
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={user?.profile?.resume}
                            className="text-blue-600 hover:underline"
                        >
                            {user?.profile?.resumeOriginalName || "Download CV"}
                        </a>
                    ) : (
                        <span className="text-gray-500">No CV yet</span>
                    )}
                </div>
            </div>

            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6">
                <h1 className="font-bold text-xl text-gray-800 mb-5">Applied Jobs</h1>
                <AppliedJobTable />
            </div>

            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    );
};

export default Profile;
