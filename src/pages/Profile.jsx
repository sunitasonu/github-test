import React, { useEffect, useState } from "react";
import { Save, User, Mail, Phone, MapPin, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { postData, updateData } from "@/utils/api";
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";


const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    address: "",
   
  });
  const [passwordData, setPasswordData] = useState({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});



  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if(storedUser) {
      const userData = JSON.parse(storedUser);
    
      setProfile((prev) => ({
        ...prev,
        name: userData.fullName || userData.name || "",
        email: userData.emailId || userData.email || "",
        phone: userData.mobileNo || userData.phone || "",
        position: userData.position || "",
        address: userData.address || "",
      }));
    }
  },[]);

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    marketingEmails: false,
  });

  
const handleProfileSubmit = async (e) => {
  e.preventDefault();

  try {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser?.id;

    const payload = {
      id: userId,
      fullName: profile.name,
      emailId: profile.email,
      mobileNo: profile.phone,
      position: profile.position,
       address: profile.address,
    };

    const res = await updateData("/user/update", payload);

    if (res.success) {
      toast.success("Profile updated!");
      localStorage.setItem("user", JSON.stringify({ ...storedUser, ...payload }));
    } else {
      toast.error(res.msg || "Update failed");
    }
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong while updating.");
  }
};



const handlePasswordChange = async () => {

  const current = (passwordData.currentPassword || "").trim();
  const newPass = (passwordData.newPassword || "").trim();
  const confirmPass = (passwordData.confirmPassword || "").trim();

  if (current === "") {
    toast.error("Please enter current password");
    return;
  }
  if (newPass.length < 6) {
    toast.error("New password must be at least 6 characters");
    return;
  }

  if (newPass === "" || confirmPass === "") {
  toast.error("Please enter both new password and confirm password");
  return;
  }

  if (newPass !== confirmPass) {
    toast.error("New passwords do not match");
    return;
  }

  try {
    const payload = {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
      newPassword_confirmation: passwordData.confirmPassword, // important for `confirmed` rule
    };

    const res = await postData("/user/change-password", payload); // 👈 your Laravel route
   

    if (res.success) {  
      toast.success(res.result);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } else {
       console.log("🔍 Response:", res);
      toast.error(res.result);
    }
  } catch (err) {
    console.error(err);
    toast.error( "Something went wrong");
  }
};




const handleSettingsSubmit = (e) => {
    e.preventDefault();
    console.log("Updating settings:", settings);
};

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600">
            Manage your account information and preferences
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          {/* <TabsTrigger value="notifications">Notifications</TabsTrigger> */}
        </TabsList>

        <TabsContent value="profile">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="Profile" />
                  <AvatarFallback className="text-2xl">JD</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Change Photo
                </Button>
              </CardContent>
            </Card>

            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profile.name}
                          onChange={(e) =>
                            setProfile({ ...profile, name: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) =>
                            setProfile({ ...profile, email: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={profile.phone}
                          onChange={(e) =>
                            setProfile({ ...profile, phone: e.target.value })
                          }
                          disabled
                        />
                      </div>
                      {/* <div>
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          value={profile.website}
                          onChange={(e) =>
                            setProfile({ ...profile, website: e.target.value })
                          }
                        />
                      </div> */}
                      {/* <div>
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          value={profile.company}
                          onChange={(e) =>
                            setProfile({ ...profile, company: e.target.value })
                          }
                        />
                      </div> */}
                      {/* <div>
                        <Label htmlFor="position">Role</Label>
                        <Input
                          id="position"
                          value={profile.position}
                          onChange={(e) =>
                            setProfile({ ...profile, position: e.target.value })
                          }
                        />
                      </div> */}
                      <div>
                        <Label htmlFor="position">Role</Label>
                        <select
                          id="position"
                          value={profile.position}
                          onChange={(e) =>
                            setProfile({ ...profile, position: e.target.value })
                          }
                          className="w-full border rounded p-2"
                        >
                          <option value="">Select Role</option>
                          <option value="1">Admin</option>
                          <option value="2">User</option>
                        </select>
                      </div>

                    </div>
                    {/* <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        rows={3}
                        value={profile.bio}
                        onChange={(e) =>
                          setProfile({ ...profile, bio: e.target.value })
                        }
                        placeholder="Tell us about yourself..."
                      />
                    </div> */}
                    <Button type="submit">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Address Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    value={profile.address}
                    onChange={(e) =>
                      setProfile({ ...profile, address: e.target.value })
                    }
                  />
                </div>
                {/* <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={profile.city}
                    onChange={(e) =>
                      setProfile({ ...profile, city: e.target.value })
                    }
                  />
                </div> */}
                {/* <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={profile.state}
                    onChange={(e) =>
                      setProfile({ ...profile, state: e.target.value })
                    }
                  />
                </div> */}
                {/* <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={profile.zipCode}
                    onChange={(e) =>
                      setProfile({ ...profile, zipCode: e.target.value })
                    }
                  />
                </div> */}
                {/* <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={profile.country}
                    onChange={(e) =>
                      setProfile({ ...profile, country: e.target.value })
                    }
                  />
                </div> */}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, currentPassword: e.target.value })
                }
                
                />
                
              </div>
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" 
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password"
                 value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                 />
              </div>
              <Button onClick={handlePasswordChange}>Update Password</Button>

              <Separator />
              {/* <div className="pt-4">
                <h3 className="text-lg font-medium text-red-600 mb-2">
                  Danger Zone
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Once you delete your account, there is no going back. Please
                  be certain.
                </p>
                <Button variant="destructive">Delete Account</Button>
              </div> */}
            </CardContent>
          </Card>
        </TabsContent>

        {/* <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSettingsSubmit} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-600">
                      Receive notifications via email
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        emailNotifications: e.target.checked,
                      })
                    }
                    className="h-4 w-4"
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-gray-600">
                      Receive push notifications in your browser
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        pushNotifications: e.target.checked,
                      })
                    }
                    className="h-4 w-4"
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Weekly Reports</p>
                    <p className="text-sm text-gray-600">
                      Receive weekly summary reports
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.weeklyReports}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        weeklyReports: e.target.checked,
                      })
                    }
                    className="h-4 w-4"
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Marketing Emails</p>
                    <p className="text-sm text-gray-600">
                      Receive promotional and marketing emails
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.marketingEmails}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        marketingEmails: e.target.checked,
                      })
                    }
                    className="h-4 w-4"
                  />
                </div>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent> */}
      </Tabs>
    </div>
  );
};

export default Profile;
