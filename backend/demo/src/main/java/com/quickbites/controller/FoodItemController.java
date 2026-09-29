package com.quickbites.controller;

import com.quickbites.entity.FoodItem;
import com.quickbites.service.FoodItemService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/food-items")
@CrossOrigin
public class FoodItemController {

    private final FoodItemService foodItemService;

    public FoodItemController(FoodItemService foodItemService) {
        this.foodItemService = foodItemService;
    }

    @GetMapping
    public List<FoodItem> getAllFoodItems() {
        return foodItemService.getAllFoodItems();
    }

    @GetMapping("/{id}")
    public FoodItem getFoodItemById(@PathVariable Integer id) {
        return foodItemService.getFoodItemById(id);
    }

    @PostMapping
    public FoodItem createFoodItem(@RequestBody FoodItem foodItem) {
        return foodItemService.createFoodItem(foodItem);
    }

    @PutMapping("/{id}")
    public FoodItem updateFoodItem(
            @PathVariable Integer id,
            @RequestBody FoodItem foodItem) {
        return foodItemService.updateFoodItem(id, foodItem);
    }

    @DeleteMapping("/{id}")
    public String deleteFoodItem(@PathVariable Integer id) {
        foodItemService.deleteFoodItem(id);
        return "Food item deleted successfully";
    }
}
