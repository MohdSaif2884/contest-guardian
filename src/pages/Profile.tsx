import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate, Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bell, LogOut, ArrowLeft, Mail, User, Calendar, Pencil, Check, X, Phone } from "lucide-react";

const Profile = () => {
  const { user, signOut } = useAuth();
  const { profile, updateProfile } = useProfile();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [saving, setSaving] = useState(false);

  const avatarUrl = user?.user_metadata?.avatar_url || "";
  const fullName = profile?.full_name || user?.user_metadata?.full_name || "User";
  const email = user?.email || "";
  const phone = profile?.phone_number || "";
  const createdAt = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const initials = fullName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const startEditing = () => {
    setEditName(fullName === "User" ? "" : fullName);
    setEditPhone(phone);
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await updateProfile({
      full_name: editName.trim() || null,
      phone_number: editPhone.trim() || null,
    });
    setSaving(false);
    setEditing(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background dark">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="feature-icon h-9 w-9">
              <Bell className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">AlgoBell</span>
          </Link>
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
            <CardHeader className="items-center text-center pb-2">
              <Avatar className="h-24 w-24 mb-4 ring-2 ring-primary/30 ring-offset-2 ring-offset-background">
                <AvatarImage src={avatarUrl} alt={fullName} />
                <AvatarFallback className="text-2xl font-bold bg-primary/20 text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">{fullName}</CardTitle>
              {!editing && (
                <Button variant="ghost" size="sm" className="gap-1.5 mt-1 text-muted-foreground" onClick={startEditing}>
                  <Pencil className="h-3.5 w-3.5" />
                  Edit Profile
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {editing ? (
                <div className="space-y-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Display Name</Label>
                    <Input
                      id="edit-name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Your name"
                      maxLength={100}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-phone">Phone Number</Label>
                    <Input
                      id="edit-phone"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="+91 9876543210"
                      maxLength={20}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="gap-1.5 flex-1" onClick={handleSave} disabled={saving}>
                      <Check className="h-4 w-4" />
                      {saving ? "Saving..." : "Save"}
                    </Button>
                    <Button size="sm" variant="ghost" className="gap-1.5 flex-1" onClick={cancelEditing}>
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-muted/30 p-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Name</p>
                      <p className="text-sm font-medium">{fullName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-muted/30 p-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="text-sm font-medium">{phone || "Not set"}</p>
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-muted/30 p-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-muted/30 p-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Joined</p>
                  <p className="text-sm font-medium">{createdAt}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-muted/30 p-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Plan</p>
                  <p className="text-sm font-medium capitalize">{profile?.subscription_status || "free"}</p>
                </div>
              </div>

              <Button
                variant="destructive"
                className="w-full mt-6 gap-2"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;
