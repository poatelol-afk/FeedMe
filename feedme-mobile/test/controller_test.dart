import 'package:flutter_test/flutter_test.dart';
import 'package:feedme_mobile/core/services/feedme_controller.dart';
import 'package:feedme_mobile/core/services/mock_kitchen_service.dart';

void main() {
  group('FeedMeController & MockKitchenService Tests', () {
    test('Net Calorie calculation updates when meals and workouts are logged', () {
      final controller = FeedMeController();
      final initialNet = controller.netCalories;
      final sampleMeal = MockKitchenService.presetAiDishes.first;
      controller.logAiScannedMeal(sampleMeal);
      expect(controller.netCalories, initialNet + sampleMeal.calories);

      controller.recordSimulatedGpsRun(
        distanceKm: 3.0,
        durationSeconds: 1080,
        routeName: 'สวนลุมพินี Loop',
      );
      expect(controller.burnedCalories, greaterThan(0));
      expect(controller.netCalories, controller.consumedCalories - controller.burnedCalories);
    });

    test('Smart Scale tare resets grams to 0 and ignores 0g send to bowl', () {
      final controller = FeedMeController();
      controller.setScaleGrams(185.0);
      controller.tareScale();
      expect(controller.currentScaleGrams, 0.0);
      final bowlCountBefore = controller.cookingBowl.length;
      controller.sendScaleWeightToBowl();
      expect(controller.cookingBowl.length, bowlCountBefore);
    });

    test('Adding positive grams to bowl adds item and resets scale', () {
      final controller = FeedMeController();
      controller.setScaleGrams(150.0);
      controller.sendScaleWeightToBowl();
      expect(controller.cookingBowl.length, 1);
      expect(controller.currentScaleGrams, 0.0);
    });

    test('Over-calorie state returns playful non-punishing coaching message', () {
      final controller = FeedMeController();
      for (var i = 0; i < 5; i++) {
        controller.logAiScannedMeal(MockKitchenService.presetAiDishes.first);
      }
      expect(controller.remainingQuota, lessThan(0));
      expect(controller.calorieStatusMessage, contains('เดินเล่น'));
    });

    test('Opt-in Party Quest can be joined and left without losing Weekly League XP', () {
      final controller = FeedMeController();
      final xpBefore = controller.weeklyXp;
      final initialJoined = controller.activePartyQuest.isJoined;
      controller.togglePartyQuestJoin();
      expect(controller.activePartyQuest.isJoined, !initialJoined);
      controller.togglePartyQuestJoin();
      expect(controller.activePartyQuest.isJoined, initialJoined);
      expect(controller.weeklyXp, xpBefore);
    });

    test('Recipe Chef returns recipes filtered by remaining quota without empty result', () {
      final lowRecipes = MockKitchenService.getSuggestedRecipes(250);
      expect(lowRecipes.isNotEmpty, isTrue);
      final normalRecipes = MockKitchenService.getSuggestedRecipes(800);
      expect(normalRecipes.isNotEmpty, isTrue);
    });
  });
}
