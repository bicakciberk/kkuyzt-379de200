import { Armchair, BookOpen, Code2, Coffee, Pencil, Printer, Store, Utensils, type LucideIcon } from "lucide-react";

export const PARTNER_ICONS: { id: string; label: string; Icon: LucideIcon }[] = [
  { id: "coffee", label: "Kahve", Icon: Coffee },
  { id: "book", label: "Kitap", Icon: BookOpen },
  { id: "printer", label: "Baskı", Icon: Printer },
  { id: "armchair", label: "Çalışma alanı", Icon: Armchair },
  { id: "code", label: "Kod / Eğitim", Icon: Code2 },
  { id: "pencil", label: "Kırtasiye", Icon: Pencil },
  { id: "food", label: "Yemek", Icon: Utensils },
  { id: "store", label: "Mağaza", Icon: Store },
];
export const partnerIcon = (id: string) => (PARTNER_ICONS.find((x) => x.id === id) ?? PARTNER_ICONS[0]!).Icon;
