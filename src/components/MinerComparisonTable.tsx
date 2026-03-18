import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

const plans = [
  { name: "Basic", price: 5700, daily: 86000, mines: 1, badge: null },
  { name: "Silver", price: 15000, daily: 250000, mines: 3, badge: null },
  { name: "Gold", price: 45000, daily: 750000, mines: 5, badge: "Popular" },
  { name: "Platinum", price: 100000, daily: 2000000, mines: 10, badge: "Best" },
];

const MinerComparisonTable = () => {
  return (
    <div className="mb-5">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
        <TrendingUp className="w-3.5 h-3.5" />
        ROI Comparison
      </p>
      <div className="border border-border rounded-xl overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="text-[10px] font-bold h-9 px-2">Plan</TableHead>
              <TableHead className="text-[10px] font-bold h-9 px-2">Price</TableHead>
              <TableHead className="text-[10px] font-bold h-9 px-2">Daily</TableHead>
              <TableHead className="text-[10px] font-bold h-9 px-2">Weekly</TableHead>
              <TableHead className="text-[10px] font-bold h-9 px-2">ROI</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.map((p) => {
              const weekly = p.daily * 7;
              const roiDays = Math.ceil(p.price / p.daily);
              return (
                <TableRow key={p.name} className="hover:bg-muted/20">
                  <TableCell className="text-[10px] font-semibold text-foreground px-2 py-2">
                    {p.name}
                    {p.badge && (
                      <Badge className="ml-1 text-[7px] px-1 py-0 bg-primary/10 text-primary border-none">
                        {p.badge}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-[10px] text-muted-foreground px-2 py-2">
                    ₦{p.price.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-[10px] text-primary font-medium px-2 py-2">
                    ₦{p.daily.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-[10px] text-muted-foreground px-2 py-2">
                    ₦{weekly.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-[10px] font-bold text-primary px-2 py-2">
                    {roiDays}d
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <p className="text-[9px] text-muted-foreground mt-1.5 text-center">
        ROI = days to recover your investment. Lower is better.
      </p>
    </div>
  );
};

export default MinerComparisonTable;
