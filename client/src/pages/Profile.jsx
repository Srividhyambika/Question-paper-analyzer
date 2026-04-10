import { useState } from "react";
import { useAuth } from "../store/useAuth";
import { updateProfile } from "../services/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import Avatar from "../components/ui/Avatar";
import toast from "react-hot-toast";

const AVATARS = [
  { id: "kungfu-panda", label: "Kung Fu Panda" },
  { id: "monkey-king", label: "Monkey King" },
  { id: "ninja-turtle", label: "Ninja Turtle" },
  { id: "spiderman", label: "Spider-Man" },
  { id: "batman", label: "Batman" },
  { id: null, label: "Use Initials" },
];

export default function Profile() {
  const { user, login } = useAuth();
  const [username, setUsername] = useState(user?.username || "");
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data } = await updateProfile({ username, avatar });
      login(localStorage.getItem("token"),{
        id: data.id,
        username: data.username,
        role: data.role,
        avatar: data.avatar,
      });
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground dark:text-white">Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your account details</p>
      </div>

      {/* Current avatar display */}
      <Card className="dark:neon-card">
        <CardContent className="pt-6 flex flex-col items-center gap-3">
          <Avatar avatar={avatar} username={username || user?.username} size="xl" />
          <div className="text-center">
            <p className="font-semibold text-foreground dark:text-white">{user?.username}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
        </CardContent>
      </Card>

      {/* Avatar picker */}
      <Card className="dark:neon-card">
        <CardHeader>
          <CardTitle className="text-base dark:text-white">Choose Avatar</CardTitle>
          <p className="text-xs text-muted-foreground">
            Select a character or use your initials
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {AVATARS.map((a) => (
              <button
                key={a.id || "initials"}
                onClick={() => setAvatar(a.id)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200
                  ${avatar === a.id
                    ? "border-primary bg-primary/10 dark:neon-border"
                    : "border-border hover:border-primary/40 bg-card"
                  }`}
              >
                <Avatar
                  avatar={a.id}
                  username={username || user?.username}
                  size="lg"
                />
                <span className="text-xs text-muted-foreground text-center leading-tight font-medium">
                  {a.label}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Username */}
      <Card className="dark:neon-card">
        <CardHeader>
          <CardTitle className="text-base dark:text-white">Account Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground dark:text-slate-200">
              Username
            </label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter new username"
              className="dark:neon-input"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground dark:text-slate-200">
              Role
            </label>
            <Input value={user?.role} disabled className="capitalize opacity-60" />
          </div>
          <Button
            className="w-full dark:neon-glow-btn"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
