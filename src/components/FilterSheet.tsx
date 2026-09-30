import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { SortBy, SortOrder } from "@/hooks/usePublicProducts";

interface FilterSheetProps {
  children: React.ReactNode;
  onApplyFilter: (sortBy: SortBy, sortOrder: SortOrder) => void;
  currentSortBy?: SortBy;
  currentSortOrder?: SortOrder;
}

const FilterSheet = ({ 
  children, 
  onApplyFilter, 
  currentSortBy = 'created_at', 
  currentSortOrder = 'desc' 
}: FilterSheetProps) => {
  const [sortBy, setSortBy] = useState<SortBy>(currentSortBy);
  const [sortOrder, setSortOrder] = useState<SortOrder>(currentSortOrder);

  const handleApply = () => {
    onApplyFilter(sortBy, sortOrder);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="bottom" className="h-auto max-h-[80vh] bg-background border-t border-border">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-foreground font-orator text-lg">
            Sort Products
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          {/* Sort By */}
          <div className="space-y-3">
            <Label className="text-foreground font-orator text-sm">Sort by</Label>
            <RadioGroup value={sortBy} onValueChange={(value) => setSortBy(value as SortBy)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="created_at" id="created_at" />
                <Label htmlFor="created_at" className="text-foreground font-orator text-sm">
                  Date Added
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="price" id="price" />
                <Label htmlFor="price" className="text-foreground font-orator text-sm">
                  Price
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Sort Order */}
          <div className="space-y-3">
            <Label className="text-foreground font-orator text-sm">Order</Label>
            <RadioGroup value={sortOrder} onValueChange={(value) => setSortOrder(value as SortOrder)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="desc" id="desc" />
                <Label htmlFor="desc" className="text-foreground font-orator text-sm">
                  {sortBy === 'price' ? 'High to Low' : 'Newest First'}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="asc" id="asc" />
                <Label htmlFor="asc" className="text-foreground font-orator text-sm">
                  {sortBy === 'price' ? 'Low to High' : 'Oldest First'}
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Apply Button */}
          <SheetClose asChild>
            <Button 
              onClick={handleApply}
              className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-orator"
              style={{ height: 'var(--button-height)' }}
            >
              Apply Filter
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FilterSheet;