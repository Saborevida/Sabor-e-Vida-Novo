import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, Heart, Star } from 'lucide-react';
import { Recipe } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { addToFavorites, removeFromFavorites } from '../../lib/supabase';
import Card from '../ui/card';
import Button from '../ui/button';

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite?: boolean;
  onFavoriteChange?: () => void;
  onClick?: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  isFavorite = false,
  onFavoriteChange,
  onClick,
}) => {
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const { user } = useAuth();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-neutral-600 bg-neutral-100';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Fácil';
      case 'medium': return 'Médio';
      case 'hard': return 'Difícil';
      default: return difficulty;
    }
  };

  const getCategoryText = (category: string) => {
    const categories = {
      breakfast: 'Café da Manhã',
      lunch: 'Almoço',
      dinner: 'Jantar',
      snack: 'Lanche',
      dessert: 'Sobremesa',
      beverage: 'Bebida',
    };
    return categories[category as keyof typeof categories] || category;
  };

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;

    setIsTogglingFavorite(true);
    try {
      if (isFavorite) {
        await removeFromFavorites(user.id, recipe.id);
      } else {
        await addToFavorites(user.id, recipe.id);
      }
      onFavoriteChange?.();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  return (
    <Card hover padding="none" className="overflow-hidden cursor-pointer" onClick={onClick}>
      <div className="relative">
        <img
          src={recipe.imageUrl || `https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400`}
          alt={recipe.name}
          className="w-full h-48 object-cover"
        />
        
        {/* Favorite Button */}
        {user && (
          <button
            onClick={handleFavoriteToggle}
            disabled={isTogglingFavorite}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors duration-200"
          >
            <Heart
              size={20}
              className={`${
                isFavorite ? 'text-red-500 fill-current' : 'text-neutral-400'
              } ${isTogglingFavorite ? 'animate-pulse' : ''}`}
            />
          </button>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-primary-500 text-white text-xs font-medium rounded-full">
            {getCategoryText(recipe.category)}
          </span>
        </div>

        {/* Glycemic Index Badge */}
        <div className="absolute bottom-3 left-3">
          <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
            <Star size={14} className="text-primary-600" />
            <span className="text-xs font-medium text-dark-700">
              IG: {recipe.nutritionInfo.glycemicIndex}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg text-dark-800 mb-2 line-clamp-2">
          {recipe.name}
        </h3>

        <div className="flex items-center justify-between text-sm text-neutral-600 mb-3">
          <div className="flex items-center space-x-1">
            <Clock size={16} />
            <span>{recipe.prepTime} min</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users size={16} />
            <span>{recipe.nutritionInfo.servings} porções</span>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
            {getDifficultyText(recipe.difficulty)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-neutral-600 mb-4">
          <div>
            <span className="font-medium">Calorias:</span> {recipe.nutritionInfo.calories}
          </div>
          <div>
            <span className="font-medium">Carbs:</span> {recipe.nutritionInfo.carbohydrates}g
          </div>
          <div>
            <span className="font-medium">Proteína:</span> {recipe.nutritionInfo.protein}g
          </div>
          <div>
            <span className="font-medium">Fibra:</span> {recipe.nutritionInfo.fiber}g
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {recipe.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <Button fullWidth variant="outline" size="sm">
          Ver Receita
        </Button>
      </div>
    </Card>
  );
};

export default RecipeCard;