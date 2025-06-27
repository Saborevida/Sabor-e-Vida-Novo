export interface User {
  id: string;
  email: string;
  name: string;
  dateOfBirth?: Date;
  diabetesType: 'type1' | 'type2' | 'gestational' | 'prediabetes';
  healthGoals: string[];
  dietaryPreferences: string[];
  subscriptionPlan: 'free' | 'premium';
  createdAt: Date;
  updatedAt: Date;
}

export interface Recipe {
  id: string;
  name: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert' | 'beverage';
  ingredients: Ingredient[];
  instructions: string[];
  nutritionInfo: NutritionInfo;
  prepTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

export interface NutritionInfo {
  calories: number;
  carbohydrates: number;
  protein: number;
  fat: number;
  fiber: number;
  sugar: number;
  glycemicIndex: number;
  servings: number;
}

export interface MealPlan {
  id: string;
  userId: string;
  name: string;
  startDate: Date;
  endDate: Date;
  meals: DailyMeals[];
  shoppingList: ShoppingItem[];
  createdAt: Date;
}

export interface DailyMeals {
  date: Date;
  breakfast?: Recipe;
  lunch?: Recipe;
  dinner?: Recipe;
  snacks: Recipe[];
}

export interface ShoppingItem {
  name: string;
  amount: number;
  unit: string;
  category: string;
  checked: boolean;
}

export interface Favorite {
  id: string;
  userId: string;
  recipeId: string;
  createdAt: Date;
}

export interface EducationalContent {
  id: string;
  title: string;
  content: string;
  category: 'glossary' | 'tips' | 'nutrition-table';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid';
  plan: 'free' | 'premium';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  createdAt: Date;
  updatedAt: Date;
}