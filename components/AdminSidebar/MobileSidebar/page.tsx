"use client";
import { useState } from "react";
import { Menu, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NavLinks from "../NavLinks/page";
import NavFooter from "../NavFooter/page";

export default function MobileSidebar({
  userName,
  handleLogout,
}: {
  readonly userName: string;
  readonly handleLogout: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="lg:hidden fixed top-4 left-4 z-40">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon-lg"
            className="bg-white shadow-md"
          >
            <Menu className="h-10 w-10" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center gap-2 border-b px-6">
              <GraduationCap className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                LearnHub
              </span>
            </div>
            <div className="flex-1 px-3 py-4">
              <NavLinks onItemClick={() => setOpen(false)} />
            </div>
            <NavFooter userName={userName} handleLogout={handleLogout} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
