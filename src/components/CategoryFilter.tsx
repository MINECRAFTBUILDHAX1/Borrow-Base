
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface CategoryFilterProps {
  categories: Category[];
  onSelectCategory: (categoryId: string | null) => void;
  selectedCategory: string | null;
}

const CategoryFilter = ({ categories, onSelectCategory, selectedCategory }: CategoryFilterProps) => {
  return (
    <div className="py-4">
      <div className="flex justify-center">
        <div className="max-w-4xl w-full">
          <div className="flex flex-wrap gap-4 justify-center">
            <div 
              className={cn(
                "flex flex-col items-center gap-1 cursor-pointer min-w-[60px]",
                selectedCategory === null ? "text-brand-purple" : "text-gray-500"
              )}
              onClick={() => onSelectCategory(null)}
            >
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center",
                selectedCategory === null 
                  ? "bg-brand-purple text-white" 
                  : "bg-gray-100 text-gray-500"
              )}>
                <span className="text-xl">🏠</span>
              </div>
              <span className="text-xs">All</span>
            </div>
            
            {categories.map(category => (
              <div 
                key={category.id} 
                className={cn(
                  "flex flex-col items-center gap-1 cursor-pointer min-w-[60px]",
                  selectedCategory === category.id ? "text-brand-purple" : "text-gray-500"
                )}
                onClick={() => onSelectCategory(category.id)}
              >
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center",
                  selectedCategory === category.id 
                    ? "bg-brand-purple text-white" 
                    : "bg-gray-100 text-gray-500"
                )}>
                  <span className="text-xl">{category.icon}</span>
                </div>
                <span className="text-xs">{category.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
