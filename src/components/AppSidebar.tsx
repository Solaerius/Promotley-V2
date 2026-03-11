import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  BarChart3,
  Calendar,
  Sparkles,
  User,
  Settings,
  Home,
  LogOut,
  MessageSquare,
  Move,
  Coins,
  Moon,
  Sun,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useOrganization } from "@/hooks/useOrganization";
import { useUserCredits } from "@/hooks/useUserCredits";
import { useNavbarPosition } from "@/hooks/useNavbarPosition";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from "@/assets/logo.png";

const navItems = [
  { title: "Home", href: "/dashboard", icon: LayoutDashboard },
  { title: "Statistik", href: "/analytics", icon: BarChart3 },
  { title: "AI", href: "/ai", icon: Sparkles },
  { title: "Kalender", href: "/calendar", icon: Calendar },
  { title: "Konto", href: "/account", icon: User },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { activeOrganization } = useOrganization();
  const { credits } = useUserCredits();
  const { cyclePosition, getPositionLabel, position } = useNavbarPosition();
  const [userAvatarUrl, setUserAvatarUrl] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = (localStorage.getItem("theme") as "light" | "dark") || "light";
    setTheme(saved);
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from("users")
      .select("avatar_url")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data?.avatar_url) setUserAvatarUrl(data.avatar_url);
      });
  }, [user?.id]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const isActive = (path: string) => {
    if (path === "/dashboard") return location.pathname === "/dashboard" || location.pathname === "/";
    if (path === "/ai") return location.pathname.startsWith("/ai");
    if (path === "/account") return location.pathname.startsWith("/account") || location.pathname.startsWith("/settings") || location.pathname.startsWith("/organization");
    return location.pathname.startsWith(path);
  };

  const creditPct = credits?.max_credits ? (credits.credits_left / credits.max_credits) * 100 : 0;
  const creditColor = creditPct > 50 ? "bg-green-500" : creditPct > 20 ? "bg-yellow-500" : "bg-destructive";

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="p-3">
        <Link to="/dashboard" className="flex items-center gap-2">
          <img src={logo} alt="Promotley" className="w-7 h-7 shrink-0" />
          {!collapsed && <span className="font-semibold text-sm text-foreground">Promotley</span>}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.title}
                    >
                      <Link to={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

              {/* Chat / AI link */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="AI-Chat"
                  isActive={location.pathname === "/ai/chat"}
                >
                  <Link to="/ai/chat">
                    <MessageSquare className="h-4 w-4" />
                    <span>AI-Chat</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Position toggle at bottom of content */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={cyclePosition}
                  tooltip={`Flytta: ${getPositionLabel(position)}`}
                >
                  <Move className="h-4 w-4" />
                  <span>Flytta navbar</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="w-full"
                >
                  <Avatar className="h-6 w-6 shrink-0">
                    <AvatarImage src={userAvatarUrl || undefined} />
                    <AvatarFallback className="text-[10px] bg-muted">
                      {activeOrganization?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-xs font-medium truncate">
                      {activeOrganization?.name || user?.email?.split("@")[0] || "Användare"}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
                  </div>
                  <ChevronUp className="h-3 w-3 shrink-0 text-muted-foreground" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-56">
                {/* Credit gauge */}
                <div className="px-3 py-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-muted-foreground">Krediter</span>
                    <span className="text-[11px] font-semibold">
                      {credits?.credits_left ?? 0} / {credits?.max_credits ?? 0}
                    </span>
                  </div>
                  <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className={cn("h-full transition-all rounded-full", creditColor)}
                      style={{ width: `${Math.min(creditPct, 100)}%` }}
                    />
                  </div>
                  <button
                    onClick={() => navigate("/buy-credits")}
                    className="mt-2 flex items-center gap-1 text-[10px] text-primary hover:underline"
                  >
                    <Coins className="h-3 w-3" />
                    Köp krediter
                  </button>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={toggleTheme}>
                  {theme === "light" ? <Moon className="mr-2 h-3.5 w-3.5" /> : <Sun className="mr-2 h-3.5 w-3.5" />}
                  {theme === "light" ? "Mörkt läge" : "Ljust läge"}
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/account">
                    <Settings className="mr-2 h-3.5 w-3.5" />
                    Inställningar
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/">
                    <Home className="mr-2 h-3.5 w-3.5" />
                    Till startsidan
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                  <LogOut className="mr-2 h-3.5 w-3.5" />
                  Logga ut
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
