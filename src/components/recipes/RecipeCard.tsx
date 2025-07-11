import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, Heart, Star } from 'lucide-react';
import { Recipe } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { addToFavorites, removeFromFavorites } from '../../lib/supabase';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite?: boolean;
  onFavoriteChange?: () => void;
  onClick?: () => void;
  onTagClick?: (tag: string) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  isFavorite = false,
  onFavoriteChange,
  onClick,
  onTagClick,
}) => {
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [localIsFavorite, setLocalIsFavorite] = useState(isFavorite);
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
      if (localIsFavorite) {
        await removeFromFavorites(user.id, recipe.id);
        setLocalIsFavorite(false);
      } else {
        await addToFavorites(user.id, recipe.id);
        setLocalIsFavorite(true);
      }
      onFavoriteChange?.();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      setShowRecipeModal(true);
    }
  };

  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation();
    if (onTagClick) {
      onTagClick(tag);
    }
  };

  // Garantir que nutritionInfo existe com valores padrão
  const nutrition = recipe.nutritionInfo || {
    calories: 0,
    carbohydrates: 0,
    protein: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    glycemicIndex: 0,
    servings: 1
  };

  // Garantir que ingredients existe e formatar corretamente
  const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];

  return (
    <>
      <Card hover padding="none" className="overflow-hidden cursor-pointer" onClick={handleCardClick}>
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
                  localIsFavorite ? 'text-red-500 fill-current' : 'text-neutral-400'
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
                IG: {nutrition.glycemicIndex}
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
              <span>{nutrition.servings} porções</span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
              {getDifficultyText(recipe.difficulty)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-neutral-600 mb-4">
            <div>
              <span className="font-medium">Calorias:</span> {nutrition.calories}
            </div>
            <div>
              <span className="font-medium">Carbs:</span> {nutrition.carbohydrates}g
            </div>
            <div>
              <span className="font-medium">Proteína:</span> {nutrition.protein}g
            </div>
            <div>
              <span className="font-medium">Fibra:</span> {nutrition.fiber}g
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mb-4">
            {recipe.tags.slice(0, 3).map((tag, index) => (
              <button
                key={index}
                onClick={(e) => handleTagClick(e, tag)}
                className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-full hover:bg-primary-100 hover:text-primary-700 transition-colors duration-200"
              >
                {tag}
              </button>
            ))}
          </div>

          <Button fullWidth variant="outline" size="sm">
            Ver Receita
          </Button>
        </div>
      </Card>

      {/* Recipe Modal */}
      <Modal
        isOpen={showRecipeModal}
        onClose={() => setShowRecipeModal(false)}
        title={recipe.name}
        size="lg"
      >
        <div className="space-y-6">
          {/* Recipe Image */}
          <img
            src={recipe.imageUrl || `https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400`}
            alt={recipe.name}
            className="w-full h-64 object-cover rounded-lg"
          />

          {/* Recipe Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-neutral-50 rounded-lg">
              <Clock className="w-6 h-6 text-primary-600 mx-auto mb-2" />
              <p className="font-semibold">{recipe.prepTime} min</p>
              <p className="text-sm text-neutral-600">Preparo</p>
            </div>
            <div className="text-center p-4 bg-neutral-50 rounded-lg">
              <Users className="w-6 h-6 text-primary-600 mx-auto mb-2" />
              <p className="font-semibold">{nutrition.servings}</p>
              <p className="text-sm text-neutral-600">Porções</p>
            </div>
            <div className="text-center p-4 bg-neutral-50 rounded-lg">
              <Star className="w-6 h-6 text-primary-600 mx-auto mb-2" />
              <p className="font-semibold">IG {nutrition.glycemicIndex}</p>
              <p className="text-sm text-neutral-600">Índice Glicêmico</p>
            </div>
          </div>

          {/* Nutrition Info */}
          <div>
            <h3 className="text-lg font-semibold text-dark-800 mb-3">Informações Nutricionais</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 border rounded-lg">
                <p className="text-2xl font-bold text-primary-600">{nutrition.calories}</p>
                <p className="text-sm text-neutral-600">Calorias</p>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{nutrition.carbohydrates}g</p>
                <p className="text-sm text-neutral-600">Carboidratos</p>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <p className="text-2xl font-bold text-green-600">{nutrition.protein}g</p>
                <p className="text-sm text-neutral-600">Proteína</p>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">{nutrition.fiber}g</p>
                <p className="text-sm text-neutral-600">Fibra</p>
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <h3 className="text-lg font-semibold text-dark-800 mb-3">Ingredientes</h3>
            <ul className="space-y-2">
              {ingredients.length > 0 ? (
                ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                    <span>
                      {typeof ingredient === 'object' && ingredient !== null ? (
                        `${ingredient.amount || ''} ${ingredient.unit || ''} de ${ingredient.name || 'Ingrediente'}`
                      ) : (
                        ingredient
                      )}
                    </span>
                  </li>
                ))
              ) : (
                <li className="text-neutral-500 italic">Ingredientes não disponíveis</li>
              )}
            </ul>
          </div>

          {/* Instructions */}
          <div>
            <h3 className="text-lg font-semibold text-dark-800 mb-3">Modo de Preparo</h3>
            <ol className="space-y-3">
              {recipe.instructions && recipe.instructions.length > 0 ? (
                recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white text-sm font-bold rounded-full flex items-center justify-center mr-3 mt-0.5">
                      {index + 1}
                    </span>
                    <span>{instruction}</span>
                  </li>
                ))
              ) : (
                <li className="text-neutral-500 italic">Instruções não disponíveis</li>
              )}
            </ol>
          </div>

          {/* Tags */}
          {recipe.tags && recipe.tags.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-dark-800 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag, index) => (
                  <button
                    key={index}
                    onClick={() => onTagClick && onTagClick(tag)}
                    className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full hover:bg-primary-200 transition-colors duration-200"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default RecipeCard;