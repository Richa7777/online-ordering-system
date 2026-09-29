package com.quickbites.service;

import com.quickbites.entity.FoodItem;
import com.quickbites.repository.FoodItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FoodItemService {

    private final FoodItemRepository foodItemRepository;

    public FoodItemService(FoodItemRepository foodItemRepository) {
        this.foodItemRepository = foodItemRepository;
    }

    public List<FoodItem> getAllFoodItems() {
        return foodItemRepository.findAll();
    }

    public FoodItem getFoodItemById(Integer id) {
        return foodItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Food item not found"));
    }

    public FoodItem createFoodItem(FoodItem foodItem) {
        return foodItemRepository.save(foodItem);
    }

    public FoodItem updateFoodItem(Integer id, FoodItem foodItemDetails) {
        FoodItem foodItem = getFoodItemById(id);

        foodItem.setCategoryId(foodItemDetails.getCategoryId());
        foodItem.setFoodName(foodItemDetails.getFoodName());
        foodItem.setDescription(foodItemDetails.getDescription());
        foodItem.setPrice(foodItemDetails.getPrice());
        foodItem.setImageUrl(foodItemDetails.getImageUrl());
        foodItem.setIsAvailable(foodItemDetails.getIsAvailable());

        return foodItemRepository.save(foodItem);
    }

    public void deleteFoodItem(Integer id) {
        foodItemRepository.deleteById(id);
    }
}
