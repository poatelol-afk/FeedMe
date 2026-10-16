import 'package:flutter_test/flutter_test.dart';
import 'package:feedme_mobile/core/models/feedme_models.dart';

void main() {
  group('FeedMe Core Models Test', () {
    test('WeighedBowlItem computes macros proportionally from grams', () {
      const chicken = ScaleIngredient(
        id: 'chicken_breast',
        name: 'อกไก่ลอกหนังดิบ',
        kcalPer100g: 120,
        proteinPer100g: 23,
        carbsPer100g: 0,
        fatPer100g: 2.5,
        emoji: '🍗',
      );
      const item = WeighedBowlItem(ingredient: chicken, grams: 150);
      expect(item.calories, 180);
      expect(item.proteinG, closeTo(34.5, 0.1));
      expect(item.carbsG, closeTo(0.0, 0.1));
      expect(item.fatG, closeTo(3.75, 0.1));
    });

    test('WeightExerciseSet detects Progressive Overload when weightKg > previousBestKg', () {
      final set1 = WeightExerciseSet(
        exerciseName: 'Barbell Bench Press',
        weightKg: 62.5,
        reps: 8,
        previousBestKg: 60.0,
      );
      expect(set1.isProgressiveOverload, isTrue);

      final set2 = WeightExerciseSet(
        exerciseName: 'Barbell Bench Press',
        weightKg: 60.0,
        reps: 8,
        previousBestKg: 60.0,
      );
      expect(set2.isProgressiveOverload, isFalse);
    });

    test('CardioSession stores distance, pace and route correctly', () {
      final session = CardioSession(
        id: 'cardio_1',
        activityType: 'run',
        distanceKm: 5.2,
        durationSeconds: 1620,
        avgPace: '5:11',
        caloriesBurned: 360,
        xpEarned: 85,
        routePoints: [
          [13.736717, 100.523186],
          [13.738000, 100.525000],
        ],
      );
      expect(session.distanceKm, 5.2);
      expect(session.xpEarned, 85);
      expect(session.routePoints.length, 2);
    });

    test('ShopItem correctly handles gem cost and effect type', () {
      const item = ShopItem(
        id: 'freeze_1',
        title: 'Streak Freeze',
        description: 'แช่แข็งสตรีค 1 วัน',
        costGems: 200,
        emoji: '❄️',
        effectType: 'streak_freeze',
      );
      expect(item.costGems, 200);
      expect(item.effectType, 'streak_freeze');
    });
  });
}
