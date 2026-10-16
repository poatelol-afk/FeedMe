// ═══════════════════════════════════════════════════════════════════════════════
// FeedMe 2.0 Core Domain Models
// ═══════════════════════════════════════════════════════════════════════════════

/// Represents an individual logged meal entry (AI scanner, scale, or manual).
class MealEntry {
  final String id;
  final String name;
  final int calories;
  final double proteinG;
  final double carbsG;
  final double fatG;
  final double grams;
  final String source; // 'ai_camera' | 'kitchen_scale' | 'manual'
  final String emoji;
  final DateTime loggedAt;

  const MealEntry({
    required this.id,
    required this.name,
    required this.calories,
    required this.proteinG,
    required this.carbsG,
    required this.fatG,
    required this.grams,
    required this.source,
    required this.emoji,
    required this.loggedAt,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'calories': calories,
        'proteinG': proteinG,
        'carbsG': carbsG,
        'fatG': fatG,
        'grams': grams,
        'source': source,
        'emoji': emoji,
        'loggedAt': loggedAt.toIso8601String(),
      };
}

/// Represents an AI-generated recipe tailored to remaining calories and fridge contents.
class RecipeSuggestion {
  final String id;
  final String name;
  final int calories;
  final double proteinG;
  final double carbsG;
  final double fatG;
  final List<String> ingredients;
  final String emoji;
  final String prepTime;

  const RecipeSuggestion({
    required this.id,
    required this.name,
    required this.calories,
    required this.proteinG,
    required this.carbsG,
    required this.fatG,
    required this.ingredients,
    required this.emoji,
    required this.prepTime,
  });
}

/// An ingredient profile with nutritional density per 100 grams.
class ScaleIngredient {
  final String id;
  final String name;
  final double kcalPer100g;
  final double proteinPer100g;
  final double carbsPer100g;
  final double fatPer100g;
  final String emoji;

  const ScaleIngredient({
    required this.id,
    required this.name,
    required this.kcalPer100g,
    required this.proteinPer100g,
    required this.carbsPer100g,
    required this.fatPer100g,
    required this.emoji,
  });
}

/// An ingredient that has been weighed on the Smart Scale and added to the bowl.
class WeighedBowlItem {
  final ScaleIngredient ingredient;
  final double grams;

  const WeighedBowlItem({
    required this.ingredient,
    required this.grams,
  });

  int get calories => ((grams * ingredient.kcalPer100g) / 100.0).round();
  double get proteinG => (grams * ingredient.proteinPer100g) / 100.0;
  double get carbsG => (grams * ingredient.carbsPer100g) / 100.0;
  double get fatG => (grams * ingredient.fatPer100g) / 100.0;
}

/// A GPS cardio run or walk workout session.
class CardioSession {
  final String id;
  final String activityType; // 'run' | 'walk' | 'bike'
  final double distanceKm;
  final int durationSeconds;
  final String avgPace; // '5:18'
  final int caloriesBurned;
  final int xpEarned;
  final List<List<double>> routePoints; // [[lat, lng], ...]

  const CardioSession({
    required this.id,
    required this.activityType,
    required this.distanceKm,
    required this.durationSeconds,
    required this.avgPace,
    required this.caloriesBurned,
    required this.xpEarned,
    required this.routePoints,
  });
}

/// A weight training exercise set tracking progressive overload.
class WeightExerciseSet {
  final String exerciseName;
  final double weightKg;
  final int reps;
  final double previousBestKg;
  final bool completed;

  const WeightExerciseSet({
    required this.exerciseName,
    required this.weightKg,
    required this.reps,
    required this.previousBestKg,
    this.completed = false,
  });

  bool get isProgressiveOverload => weightKg > previousBestKg;

  WeightExerciseSet copyWith({
    String? exerciseName,
    double? weightKg,
    int? reps,
    double? previousBestKg,
    bool? completed,
  }) {
    return WeightExerciseSet(
      exerciseName: exerciseName ?? this.exerciseName,
      weightKg: weightKg ?? this.weightKg,
      reps: reps ?? this.reps,
      previousBestKg: previousBestKg ?? this.previousBestKg,
      completed: completed ?? this.completed,
    );
  }
}

/// A pre-built expert weight training workout program.
class WorkoutProgram {
  final String id;
  final String title;
  final String expertTag;
  final String focusArea;
  final int estimatedBurnKcal;
  final List<WeightExerciseSet> sets;

  const WorkoutProgram({
    required this.id,
    required this.title,
    required this.expertTag,
    required this.focusArea,
    required this.estimatedBurnKcal,
    required this.sets,
  });
}

/// A daily habit quest yielding XP and Gems.
class DailyQuest {
  final String id;
  final String title;
  final int rewardXp;
  final int rewardGems;
  final bool completed;

  const DailyQuest({
    required this.id,
    required this.title,
    required this.rewardXp,
    required this.rewardGems,
    this.completed = false,
  });

  DailyQuest copyWith({bool? completed}) => DailyQuest(
        id: id,
        title: title,
        rewardXp: rewardXp,
        rewardGems: rewardGems,
        completed: completed ?? this.completed,
      );
}

/// A participant in the Duolingo-style weekly leaderboard league.
class LeagueMember {
  final String id;
  final String name;
  final int weeklyXp;
  final bool isCurrentUser;
  final String avatarEmoji;

  const LeagueMember({
    required this.id,
    required this.name,
    required this.weeklyXp,
    required this.isCurrentUser,
    required this.avatarEmoji,
  });
}

/// An opt-in co-op boss raid quest where party members combine burned calories.
class PartyQuest {
  final String id;
  final String title;
  final String bossName;
  final int targetBurnKcal;
  final int currentBurnKcal;
  final bool isJoined;
  final List<String> memberNames;

  const PartyQuest({
    required this.id,
    required this.title,
    required this.bossName,
    required this.targetBurnKcal,
    required this.currentBurnKcal,
    required this.isJoined,
    required this.memberNames,
  });

  PartyQuest copyWith({
    int? currentBurnKcal,
    bool? isJoined,
    List<String>? memberNames,
  }) {
    return PartyQuest(
      id: id,
      title: title,
      bossName: bossName,
      targetBurnKcal: targetBurnKcal,
      currentBurnKcal: currentBurnKcal ?? this.currentBurnKcal,
      isJoined: isJoined ?? this.isJoined,
      memberNames: memberNames ?? this.memberNames,
    );
  }
}

/// An item purchasable in the Gem Reward Shop.
class ShopItem {
  final String id;
  final String title;
  final String description;
  final int costGems;
  final String emoji;
  final String effectType; // 'streak_freeze' | 'cheat_meal' | 'double_xp'

  const ShopItem({
    required this.id,
    required this.title,
    required this.description,
    required this.costGems,
    required this.emoji,
    required this.effectType,
  });
}
