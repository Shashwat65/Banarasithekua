import { Menu, Search, ShoppingCart, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ganeshaMark from "@/assets/ganesha-mark.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// In a HashRouter, raw anchor hashes (e.g. #hero) conflict with route resolution.
// We therefore treat these as logical section IDs and perform a programmatic scroll.
const NAV_LINKS: { label: string; section: string }[] = [
  { label: "Home", section: "hero" },
  { label: "Shop", section: "products" },
  { label: "Values", section: "values" },
  { label: "Story", section: "story" },
  { label: "Contact", section: "footer" },
];

const Header = () => {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const requestLogin = (destination?: string) => {
    const from = destination || `${location.pathname}${location.search}`;
    navigate("/login", { state: { from } });
  };

  const handleCartNavigate = () => {
    if (!user) {
      toast("Please login to view your cart", {
        description: "Sign in to manage your items and checkout.",
      });
      requestLogin("/cart");
      return;
    }
    navigate("/cart");
  };

  const handleCheckoutNavigate = () => {
    if (!user) {
      toast("Login required", {
        description: "Create an account or sign in before placing an order.",
      });
      requestLogin("/checkout");
      return;
    }
    navigate("/checkout");
  };

  const handleCall = () => {
    window.location.href = "tel:+918887776665";
  };

  const initials = user?.email ? user.email.charAt(0).toUpperCase() : "U";

  const desktopActions = user ? (
    <div className="hidden md:flex items-center gap-3">
      <Button
        variant="ghost"
        size="icon"
        className="text-secondary hover:text-primary"
        onClick={() => navigate("/products")}
      >
        <Search className="h-5 w-5" />
      </Button>
      <Button
        variant="outline"
        className="border-primary/30 text-secondary hover:bg-primary/5 px-4"
        onClick={handleCall}
      >
        Call Us
      </Button>
      <Button
        className="relative bg-primary hover:bg-primary/90 text-primary-foreground px-6 shadow-lg shadow-primary/30"
        onClick={handleCartNavigate}
      >
        <ShoppingCart className="h-4 w-4 mr-2" />
        View Cart
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
            {totalItems}
          </span>
        )}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="rounded-full border border-border/70 p-1 focus:outline-none focus:ring-2 focus:ring-primary/40">
            <Avatar className="h-9 w-9">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-60">
          <DropdownMenuLabel>
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Signed in
              </span>
              <span className="text-sm font-semibold">{user.email}</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {user.role === "admin" ? (
            <DropdownMenuItem onClick={() => navigate("/admin")}>
              Admin Dashboard
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuItem onClick={handleCartNavigate}>My Cart</DropdownMenuItem>
          <DropdownMenuItem onClick={handleCheckoutNavigate}>Checkout</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ) : (
    <div className="hidden md:flex items-center gap-3">
      <Button
        variant="ghost"
        size="icon"
        className="text-secondary hover:text-primary"
        onClick={() => navigate("/products")}
      >
        <Search className="h-5 w-5" />
      </Button>
      <Button
        variant="outline"
        className="border-primary/30 text-secondary hover:bg-primary/5 px-4"
        onClick={handleCall}
      >
        Call Us
      </Button>
      <Button
        variant="ghost"
        className="text-secondary hover:text-primary"
        onClick={() => requestLogin()}
      >
        <LogIn className="h-4 w-4 mr-2" />
        Login
      </Button>
      <Button
        className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-5"
        onClick={() => navigate("/signup", { state: { from: `${location.pathname}${location.search}` } })}
      >
        <UserPlus className="h-4 w-4 mr-2" />
        Join Us
      </Button>
      <Button
        className="relative bg-primary hover:bg-primary/90 text-primary-foreground px-6 shadow-lg shadow-primary/30"
        onClick={handleCartNavigate}
      >
        <ShoppingCart className="h-4 w-4 mr-2" />
        View Cart
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
            {totalItems}
          </span>
        )}
      </Button>
    </div>
  );

  const mobileActions = user ? (
    <div className="flex md:hidden items-center gap-2">
      <Button variant="ghost" size="icon" className="relative text-secondary" onClick={handleCartNavigate}>
        <ShoppingCart className="h-5 w-5" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-semibold">
            {totalItems}
          </span>
        )}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="rounded-full border border-border/70 p-1 focus:outline-none focus:ring-2 focus:ring-primary/40">
            <Avatar className="h-9 w-9">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {user.role === "admin" ? (
            <DropdownMenuItem onClick={() => navigate("/admin")}>Admin Dashboard</DropdownMenuItem>
          ) : null}
          <DropdownMenuItem onClick={handleCartNavigate}>My Cart</DropdownMenuItem>
          <DropdownMenuItem onClick={handleCheckoutNavigate}>Checkout</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ) : (
    <div className="flex md:hidden items-center gap-2">
      <Button variant="ghost" size="icon" className="text-secondary" onClick={() => requestLogin()}>
        <LogIn className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon" className="relative text-secondary" onClick={handleCartNavigate}>
        <ShoppingCart className="h-5 w-5" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-semibold">
            {totalItems}
          </span>
        )}
      </Button>
    </div>
  );

  const scrollToSection = (sectionId: string) => {
    const doScroll = () => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    if (location.pathname !== "/") {
      // Navigate home, then scroll after mount
      navigate("/", { state: { scrollTarget: sectionId } });
    } else {
      // Already on home; slight delay to allow layout
      requestAnimationFrame(doScroll);
    }
  };

  return (
    <header className="border-b border-border/70 bg-background/90 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          <div className="flex items-center gap-3 sm:gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-secondary">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] bg-background/95 backdrop-blur-md">
                <SheetHeader className="text-left space-y-2">
                  <SheetTitle className="text-lg font-semibold text-secondary">
                    Banarasi Thekua
                  </SheetTitle>
                  <p className="text-xs text-secondary/60 leading-relaxed">
                    Heritage mithai handcrafted daily in Maruti Nagar, Varanasi.
                  </p>
                </SheetHeader>
                <nav className="mt-6 flex flex-col gap-1 text-secondary/80 text-sm">
                  {NAV_LINKS.map((item) => (
                    <button
                      key={item.section}
                      onClick={() => scrollToSection(item.section)}
                      className="text-left rounded-lg px-3 py-2 hover:bg-secondary/10 transition focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>
                <div className="mt-8 grid gap-3 text-sm">
                  {user ? (
                    <>
                      <Button onClick={handleCartNavigate} className="justify-start">
                        View Cart
                      </Button>
                      <Button variant="outline" onClick={handleCheckoutNavigate} className="justify-start">
                        Checkout
                      </Button>
                      {user.role === "admin" ? (
                        <Button variant="ghost" onClick={() => navigate("/admin")} className="justify-start">
                          Admin Dashboard
                        </Button>
                      ) : null}
                      <Button variant="ghost" onClick={logout} className="justify-start text-red-500">
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={() => requestLogin()} className="justify-start">
                        Login
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => navigate("/signup", { state: { from: `${location.pathname}${location.search}` } })}
                        className="justify-start"
                      >
                        Create Account
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex-shrink-0 flex items-center justify-center">
                <img src={ganeshaMark} alt="Banarasi Thekua" className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14" />
              </div>
              <div className="flex flex-col justify-center min-w-0">
                <span className="block text-[9px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.25em] sm:tracking-[0.32em] md:tracking-[0.45em] text-accent font-semibold whitespace-nowrap">
                  Banarasi Thekua
                </span>
                <span className="block text-base sm:text-lg md:text-xl lg:text-[22px] font-serif font-semibold text-secondary whitespace-nowrap">
                  Heritage Mithai Atelier
                </span>
              </div>
            </div>
          </div>

          <nav className="hidden lg:flex items-center text-sm font-medium tracking-wide text-secondary/75 gap-8 xl:gap-10">
            {NAV_LINKS.map((item) => (
              <button
                key={item.section}
                onClick={() => scrollToSection(item.section)}
                className="relative transition hover:text-secondary focus:outline-none focus:ring-2 focus:ring-primary/30 rounded-md px-1"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {desktopActions}

          {mobileActions}
        </div>
      </div>
    </header>
  );
};

export default Header;