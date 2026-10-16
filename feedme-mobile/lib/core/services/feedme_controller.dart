import 'package:flutter/foundation.dart';
import '../models/feedme_models.dart';
import 'mock_kitchen_service.dart';

/// ═══════════════════════════════════════════════════════════════════════════════
/// Central Reactive State Controller for FeedMe 2.0
/// Manages Net Calories, Smart Scale Simulator, Run/Lift, Gamification & League
/// ═══════════════════════════════════════════════════════════════════════════════
class FeedMeController extends ChangeNotifier {
  // ─── Daily Calorie Targets & Balance ─────────────────────────────────────────
  int _baseTargetDailyCalories = 2000;
  int get targetDailyCalories =>
      _baseTargetDailyCalories + (cheatMealActive ? 500 : 0);

  int consumedCalories = 0;
  int cardioBurnedCalories = 0;
  int weightBurnedCalories = 0;

  int get burnedCalories => cardioBurnedCalories + weightBurnedCalories;
  int get netCalories => consumedCalories - burnedCalories;
  int get remainingQuota => targetDailyCalories - netCalories;

  /// Playful and encouraging coaching status message (Anti-Goal: never guilt user)
  String get calorieStatusMessage {
    if (remainingQuota >= 500) {
      return 'ฟิตสุดๆ! โควต้าเหลือเพียบ กินมื้อคุณภาพเติมพลังได้อีก 💪';
    } else if (remainingQuota >= 0) {
      return 'คุมแคลอรี่ได้ดีมาก! ใกล้แตะเป้าหมายสมดุลของวันแล้ว 🎯';
    } else {
      return 'แคลเกินเป้าหมายไปนิด ไม่เป็นไรนะ! ชวนไปเดินเล่น 15 นาที หรือใช้บัตร Cheat Meal Pass 🍔 ก็กลับมาเป๊ะได้ 🌟';
    }
  }

  // Macro Totals
  double consumedProteinG = 0.0;
  double consumedCarbsG = 0.0;
  double consumedFatG = 0.0;

  // ─── Gamification & League ───────────────────────────────────────────────────
  int streakDays = 12;
  int gems = 450;
  int weeklyXp = 1280;
  int streakFreezes = 2;
  bool cheatMealActive = false;
  String currentLeagueName = 'Emerald League (ลีกมรกต)';

  // ─── Smart Scale Simulator ───────────────────────────────────────────────────
  bool isScaleConnected = true;
  double currentScaleGrams = 0.0;
  late ScaleIngredient selectedScaleIngredient;
  List<WeighedBowlItem> cookingBowl = [];

  // ─── Meal Log ────────────────────────────────────────────────────────────────
  List<MealEntry> loggedMeals = [];

  // ─── Cardio Sessions ─────────────────────────────────────────────────────────
  List<CardioSession> cardioHistory = [];

  // ─── Weight Training Programs ────────────────────────────────────────────────
  List<WorkoutProgram> workoutPrograms = [];

  // ─── Social, Quests & Quests ─────────────────────────────────────────────────
  List<LeagueMember> leagueMembers = [];
  List<DailyQuest> dailyQuests = [];
  late PartyQuest activePartyQuest;
  List<String> recentStickers = [];

  // ─── Shop Items ──────────────────────────────────────────────────────────────
  List<ShopItem> shopItems = [];

  FeedMeController() {
    selectedScaleIngredient = MockKitchenService.scaleIngredients.first;
    _initializeDefaultData();
  }

  void _initializeDefaultData() {
    // Default initial meal (Breakfast)
    final breakfast = MealEntry(
      id: 'init_meal_1',
      name: 'โจ๊กข้าวโอ๊ตอบไก่สับไข่ออนเซ็น',
      calories: 340,
      proteinG: 32.0,
      carbsG: 38.0,
      fatG: 6.0,
      grams: 280,
      source: 'manual',
      emoji: '🥣',
      loggedAt: DateTime.now().subtract(const Duration(hours: 3)),
    );
    loggedMeals.add(breakfast);
    consumedCalories += breakfast.calories;
    consumedProteinG += breakfast.proteinG;
    consumedCarbsG += breakfast.carbsG;
    consumedFatG += breakfast.fatG;

    // Default weight programs
    workoutPrograms = [
      const WorkoutProgram(
        id: 'prog_push',
        title: 'Push Day (อก/ไหล่/หลังแขน)',
        expertTag: 'Hypertrophy Focus',
        focusArea: 'อก · ไหล่ · หลังแขน',
        estimatedBurnKcal: 240,
        sets: [
          WeightExerciseSet(
            exerciseName: 'Barbell Bench Press',
            weightKg: 82.5,
            reps: 8,
            previousBestKg: 80.0,
          ),
          WeightExerciseSet(
            exerciseName: 'Incline Dumbbell Press',
            weightKg: 24.0,
            reps: 10,
            previousBestKg: 24.0,
          ),
          WeightExerciseSet(
            exerciseName: 'Overhead Dumbbell Extension',
            weightKg: 14.0,
            reps: 12,
            previousBestKg: 14.0,
          ),
        ],
      ),
      const WorkoutProgram(
        id: 'prog_pull',
        title: 'Pull & Back Sculpt (หลัง/หน้าแขน)',
        expertTag: 'Strength Focus',
        focusArea: 'หลังส่วนบน · ปีก · ไบเซปส์',
        estimatedBurnKcal: 260,
        sets: [
          WeightExerciseSet(
            exerciseName: 'Barbell Deadlift',
            weightKg: 110.0,
            reps: 5,
            previousBestKg: 105.0,
          ),
          WeightExerciseSet(
            exerciseName: 'Lat Pulldown (Wide Grip)',
            weightKg: 55.0,
            reps: 10,
            previousBestKg: 50.0,
          ),
        ],
      ),
    ];

    // Default daily quests
    dailyQuests = [
      const DailyQuest(
        id: 'quest_photo',
        title: 'ถ่ายรูปมื้ออาหารหรือชั่งด้วยตาชั่ง',
        rewardXp: 25,
        rewardGems: 10,
        completed: true,
      ),
      const DailyQuest(
        id: 'quest_cardio',
        title: 'วิ่งหรือเดิน Cardio รวมอย่างน้อย 3 กม.',
        rewardXp: 80,
        rewardGems: 25,
        completed: false,
      ),
      const DailyQuest(
        id: 'quest_progressive',
        title: 'ทำลายสถิติ Progressive Overload เวท 1 ท่า',
        rewardXp: 50,
        rewardGems: 20,
        completed: false,
      ),
    ];

    // Default League leaderboard
    leagueMembers = [
      const LeagueMember(
        id: 'u_1',
        name: '🥇 NinjaRunner',
        weeklyXp: 3450,
        isCurrentUser: false,
        avatarEmoji: '🥷',
      ),
      LeagueMember(
        id: 'u_me',
        name: '🥈 คุณ (You)',
        weeklyXp: weeklyXp,
        isCurrentUser: true,
        avatarEmoji: '⚡',
      ),
      const LeagueMember(
        id: 'u_3',
        name: '🥉 Somchai Fit',
        weeklyXp: 2890,
        isCurrentUser: false,
        avatarEmoji: '🦁',
      ),
      const LeagueMember(
        id: 'u_4',
        name: '4. May_Runner',
        weeklyXp: 2150,
        isCurrentUser: false,
        avatarEmoji: '🏃‍♀️',
      ),
      const LeagueMember(
        id: 'u_5',
        name: '5. Bank_GymBro',
        weeklyXp: 1840,
        isCurrentUser: false,
        avatarEmoji: '🦍',
      ),
    ];

    // Default Party Boss Raid
    activePartyQuest = const PartyQuest(
      id: 'party_transfat_boss',
      title: 'แก๊งรวมพลังล้มบอสไขมันทรานส์',
      bossName: '👾 บอสไขมันทรานส์ (10,000 kcal)',
      targetBurnKcal: 10000,
      currentBurnKcal: 7850,
      isJoined: true,
      memberNames: ['คุณ (You)', 'NinjaRunner', 'Somchai Fit', 'May_Runner'],
    );

    // Default shop items
    shopItems = const [
      ShopItem(
        id: 'item_freeze',
        title: 'Streak Freeze',
        description: 'ล็อกสตรีคไม่ให้ขาด 1 วันหากลืมบันทึก',
        costGems: 200,
        emoji: '❄️',
        effectType: 'streak_freeze',
      ),
      ShopItem(
        id: 'item_cheat',
        title: 'บัตรตามใจปาก (Cheat Meal Pass)',
        description: 'เพิ่มโควต้าแคลอรี่พิเศษ +500 kcal วันนี้โดยไม่หักสตรีค',
        costGems: 350,
        emoji: '🍔',
        effectType: 'cheat_meal',
      ),
      ShopItem(
        id: 'item_double_xp',
        title: 'Double XP Potion (1 ชม.)',
        description: 'รับ XP คูณ 2 จากการวิ่งและยกเวทตลอด 1 ชั่วโมงถัดไป',
        costGems: 150,
        emoji: '⚡',
        effectType: 'double_xp',
      ),
    ];
  }

  // ─── Scale Simulator Actions ────────────────────────────────────────────────
  void setScaleGrams(double grams) {
    currentScaleGrams = grams < 0 ? 0.0 : grams;
    notifyListeners();
  }

  void adjustScaleGrams(double delta) {
    final next = currentScaleGrams + delta;
    currentScaleGrams = next < 0 ? 0.0 : next;
    notifyListeners();
  }

  void tareScale() {
    currentScaleGrams = 0.0;
    notifyListeners();
  }

  void selectScaleIngredient(ScaleIngredient ing) {
    selectedScaleIngredient = ing;
    notifyListeners();
  }

  void sendScaleWeightToBowl() {
    if (currentScaleGrams <= 0) return;
    cookingBowl.add(
      WeighedBowlItem(
        ingredient: selectedScaleIngredient,
        grams: currentScaleGrams,
      ),
    );
    currentScaleGrams = 0.0;
    notifyListeners();
  }

  void clearCookingBowl() {
    cookingBowl.clear();
    notifyListeners();
  }

  void commitCookingBowlAsMeal(String customDishName) {
    if (cookingBowl.isEmpty) return;

    int totalKcal = 0;
    double totalP = 0;
    double totalC = 0;
    double totalF = 0;
    double totalGrams = 0;

    for (final item in cookingBowl) {
      totalKcal += item.calories;
      totalP += item.proteinG;
      totalC += item.carbsG;
      totalF += item.fatG;
      totalGrams += item.grams;
    }

    final meal = MealEntry(
      id: 'bowl_${DateTime.now().millisecondsSinceEpoch}',
      name: customDishName.trim().isEmpty ? 'ชามปรุงสดด้วยตาชั่งบลูทูธ' : customDishName,
      calories: totalKcal,
      proteinG: totalP,
      carbsG: totalC,
      fatG: totalF,
      grams: totalGrams,
      source: 'kitchen_scale',
      emoji: '🥗',
      loggedAt: DateTime.now(),
    );

    loggedMeals.insert(0, meal);
    consumedCalories += totalKcal;
    consumedProteinG += totalP;
    consumedCarbsG += totalC;
    consumedFatG += totalF;

    addXp(40);
    cookingBowl.clear();
    notifyListeners();
  }

  // ─── AI Food Scanner Action ─────────────────────────────────────────────────
  void logAiScannedMeal(MealEntry meal) {
    loggedMeals.insert(0, meal);
    consumedCalories += meal.calories;
    consumedProteinG += meal.proteinG;
    consumedCarbsG += meal.carbsG;
    consumedFatG += meal.fatG;

    addXp(25);
    notifyListeners();
  }

  // ─── Workout Actions ────────────────────────────────────────────────────────
  void recordSimulatedGpsRun({
    required double distanceKm,
    required int durationSeconds,
    required String routeName,
  }) {
    final activeBurn = (distanceKm * 68).round();
    final paceMin = (durationSeconds / 60.0) / distanceKm;
    final paceMins = paceMin.floor();
    final paceSecs = ((paceMin - paceMins) * 60).round();
    final paceStr = '$paceMins:${paceSecs.toString().padLeft(2, '0')}';

    final session = CardioSession(
      id: 'run_${DateTime.now().millisecondsSinceEpoch}',
      activityType: 'run',
      distanceKm: distanceKm,
      durationSeconds: durationSeconds,
      avgPace: paceStr,
      caloriesBurned: activeBurn,
      xpEarned: 80,
      routePoints: [
        [13.736717, 100.523186],
        [13.738000, 100.525000],
        [13.739000, 100.524000],
        [13.737500, 100.522000],
      ],
    );

    cardioHistory.insert(0, session);
    cardioBurnedCalories += activeBurn;
    if (activePartyQuest.isJoined) {
      activePartyQuest = activePartyQuest.copyWith(
        currentBurnKcal: activePartyQuest.currentBurnKcal + activeBurn,
      );
    }
    addXp(session.xpEarned);
    notifyListeners();
  }

  void toggleExerciseSet(String programId, int setIndex) {
    final pIndex = workoutPrograms.indexWhere((p) => p.id == programId);
    if (pIndex == -1) return;

    final program = workoutPrograms[pIndex];
    if (setIndex < 0 || setIndex >= program.sets.length) return;

    final targetSet = program.sets[setIndex];
    final nextState = !targetSet.completed;

    final updatedSets = List<WeightExerciseSet>.from(program.sets);
    updatedSets[setIndex] = targetSet.copyWith(completed: nextState);

    workoutPrograms[pIndex] = WorkoutProgram(
      id: program.id,
      title: program.title,
      expertTag: program.expertTag,
      focusArea: program.focusArea,
      estimatedBurnKcal: program.estimatedBurnKcal,
      sets: updatedSets,
    );

    // Progressive overload bonus
    if (nextState && targetSet.isProgressiveOverload) {
      addXp(25);
    }

    notifyListeners();
  }

  void completeWorkoutProgram(String programId) {
    final program = workoutPrograms.firstWhere((p) => p.id == programId);
    weightBurnedCalories += program.estimatedBurnKcal;
    if (activePartyQuest.isJoined) {
      activePartyQuest = activePartyQuest.copyWith(
        currentBurnKcal: activePartyQuest.currentBurnKcal + program.estimatedBurnKcal,
      );
    }
    addXp(100);
    notifyListeners();
  }

  // ─── Social & Quests ────────────────────────────────────────────────────────
  void togglePartyQuestJoin() {
    activePartyQuest = activePartyQuest.copyWith(
      isJoined: !activePartyQuest.isJoined,
    );
    notifyListeners();
  }

  void sendFriendSticker(String friendName, String sticker) {
    recentStickers.add('$sticker ส่งให้ $friendName');
    addXp(5);
    notifyListeners();
  }

  // ─── Shop & Economy ─────────────────────────────────────────────────────────
  bool purchaseShopItem(ShopItem item) {
    if (gems < item.costGems) return false;

    gems -= item.costGems;
    if (item.effectType == 'streak_freeze') {
      streakFreezes += 1;
    } else if (item.effectType == 'cheat_meal') {
      cheatMealActive = true;
    } else if (item.effectType == 'double_xp') {
      addXp(50);
    }

    notifyListeners();
    return true;
  }

  void addXp(int amount) {
    weeklyXp += amount;
    // Keep user's entry in league in sync
    final myIndex = leagueMembers.indexWhere((m) => m.isCurrentUser);
    if (myIndex != -1) {
      final me = leagueMembers[myIndex];
      leagueMembers[myIndex] = LeagueMember(
        id: me.id,
        name: me.name,
        weeklyXp: weeklyXp,
        isCurrentUser: true,
        avatarEmoji: me.avatarEmoji,
      );
      // Re-sort leaderboard descending by XP
      leagueMembers.sort((a, b) => b.weeklyXp.compareTo(a.weeklyXp));
    }
    notifyListeners();
  }
}
