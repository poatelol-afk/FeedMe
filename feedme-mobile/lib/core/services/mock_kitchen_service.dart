import '../models/feedme_models.dart';

/// ═══════════════════════════════════════════════════════════════════════════════
/// Mock Kitchen Service: AI Food Scanner Preset Dishes, Scale Ingredients & Chef
/// ═══════════════════════════════════════════════════════════════════════════════
class MockKitchenService {
  /// Preset Thai & International dishes for instant AI Photo Scanner simulation
  static List<MealEntry> get presetAiDishes => [
        MealEntry(
          id: 'dish_krapao',
          name: 'ข้าวกะเพราอกไก่ไข่ดาวไม่น้ำมัน',
          calories: 580,
          proteinG: 42.0,
          carbsG: 65.0,
          fatG: 16.0,
          grams: 380,
          source: 'ai_camera',
          emoji: '🍛',
          loggedAt: DateTime.now(),
        ),
        MealEntry(
          id: 'dish_steamed_chicken_rice',
          name: 'ข้าวมันไก่ต้มอกไก่ ไม่เอาหนัง',
          calories: 520,
          proteinG: 38.0,
          carbsG: 64.0,
          fatG: 12.0,
          grams: 350,
          source: 'ai_camera',
          emoji: '🍗',
          loggedAt: DateTime.now(),
        ),
        MealEntry(
          id: 'dish_salmon_salad',
          name: 'สลัดแซลมอนย่างอะโวคาโดน้ำสลัดงาญี่ปุ่น',
          calories: 450,
          proteinG: 34.0,
          carbsG: 22.0,
          fatG: 25.0,
          grams: 320,
          source: 'ai_camera',
          emoji: '🥗',
          loggedAt: DateTime.now(),
        ),
        MealEntry(
          id: 'dish_somtum_chicken',
          name: 'ส้มตำไทย + อกไก่ย่างข้าวเหนียว 1/2 ห่อ',
          calories: 320,
          proteinG: 28.0,
          carbsG: 38.0,
          fatG: 6.0,
          grams: 300,
          source: 'ai_camera',
          emoji: '🌶️',
          loggedAt: DateTime.now(),
        ),
        MealEntry(
          id: 'dish_greek_yogurt_bowl',
          name: 'กรีกโยเกิร์ตโบวล์มิกซ์เบอร์รี่และกราโนล่า',
          calories: 280,
          proteinG: 20.0,
          carbsG: 36.0,
          fatG: 6.0,
          grams: 220,
          source: 'ai_camera',
          emoji: '🥣',
          loggedAt: DateTime.now(),
        ),
        MealEntry(
          id: 'dish_beef_noodle',
          name: 'ก๋วยเตี๋ยวเนื้อน้ำใสเส้นหมี่ ไม่เจียว',
          calories: 410,
          proteinG: 32.0,
          carbsG: 52.0,
          fatG: 8.0,
          grams: 380,
          source: 'ai_camera',
          emoji: '🍜',
          loggedAt: DateTime.now(),
        ),
      ];

  /// Raw & whole food ingredients for the Smart Scale simulator
  static List<ScaleIngredient> get scaleIngredients => const [
        ScaleIngredient(
          id: 'ing_chicken',
          name: 'อกไก่ลอกหนังดิบ',
          kcalPer100g: 120,
          proteinPer100g: 23.0,
          carbsPer100g: 0.0,
          fatPer100g: 2.5,
          emoji: '🍗',
        ),
        ScaleIngredient(
          id: 'ing_rice',
          name: 'ข้าวสวยหอมมะลิสุก',
          kcalPer100g: 130,
          proteinPer100g: 2.7,
          carbsPer100g: 28.2,
          fatPer100g: 0.3,
          emoji: '🍚',
        ),
        ScaleIngredient(
          id: 'ing_salmon',
          name: 'แซลมอนสดนอร์เวย์',
          kcalPer100g: 208,
          proteinPer100g: 20.4,
          carbsPer100g: 0.0,
          fatPer100g: 13.4,
          emoji: '🐟',
        ),
        ScaleIngredient(
          id: 'ing_egg',
          name: 'ไข่ไก่สดเบอร์ 0',
          kcalPer100g: 143,
          proteinPer100g: 12.6,
          carbsPer100g: 0.8,
          fatPer100g: 9.5,
          emoji: '🥚',
        ),
        ScaleIngredient(
          id: 'ing_broccoli',
          name: 'บรอกโคลีสด',
          kcalPer100g: 34,
          proteinPer100g: 2.8,
          carbsPer100g: 6.6,
          fatPer100g: 0.4,
          emoji: '🥦',
        ),
        ScaleIngredient(
          id: 'ing_oats',
          name: 'ข้าวโอ๊ตเต็มเมล็ด',
          kcalPer100g: 389,
          proteinPer100g: 16.9,
          carbsPer100g: 66.3,
          fatPer100g: 6.9,
          emoji: '🌾',
        ),
        ScaleIngredient(
          id: 'ing_whey',
          name: 'เวย์โปรตีนไอโซเลท',
          kcalPer100g: 370,
          proteinPer100g: 85.0,
          carbsPer100g: 3.0,
          fatPer100g: 1.5,
          emoji: '🥛',
        ),
      ];

  /// Available tags of items commonly found in fridge
  static List<String> get fridgeTags => const [
        'อกไก่',
        'ไข่ไก่',
        'แซลมอน',
        'ข้าวสวย',
        'บรอกโคลี',
        'ข้าวโอ๊ต',
      ];

  /// AI Chef recipe library
  static final List<RecipeSuggestion> _allRecipes = [
    const RecipeSuggestion(
      id: 'rec_steamed_egg_shrimp',
      name: 'ไข่ตุ๋นกุ้งคลีนหม้อทอด',
      calories: 210,
      proteinG: 22.0,
      carbsG: 4.0,
      fatG: 11.0,
      ingredients: ['ไข่ไก่', 'กุ้งสด', 'ต้นหอม'],
      emoji: '🥚',
      prepTime: '12 นาที',
    ),
    const RecipeSuggestion(
      id: 'rec_grilled_chicken_jaew',
      name: 'อกไก่ย่างสมุนไพรจิ้มแจ่ว',
      calories: 380,
      proteinG: 44.0,
      carbsG: 12.0,
      fatG: 14.0,
      ingredients: ['อกไก่', 'พริกป่น', 'ข้าวคั่ว', 'มะนาว'],
      emoji: '🍗',
      prepTime: '15 นาที',
    ),
    const RecipeSuggestion(
      id: 'rec_salmon_teriyaki',
      name: 'แซลมอนย่างเทอริยากิซอสคลีน',
      calories: 420,
      proteinG: 36.0,
      carbsG: 18.0,
      fatG: 22.0,
      ingredients: ['แซลมอน', 'บรอกโคลี', 'ซีอิ๊วโซเดียมต่ำ'],
      emoji: '🐟',
      prepTime: '18 นาที',
    ),
    const RecipeSuggestion(
      id: 'rec_oat_protein_porridge',
      name: 'โจ๊กข้าวโอ๊ตอบไก่สับไข่ออนเซ็น',
      calories: 340,
      proteinG: 32.0,
      carbsG: 38.0,
      fatG: 6.0,
      ingredients: ['ข้าวโอ๊ต', 'อกไก่', 'ไข่ไก่'],
      emoji: '🥣',
      prepTime: '10 นาที',
    ),
    const RecipeSuggestion(
      id: 'rec_tofu_stirfry',
      name: 'ผัดกะเพราเต้าหู้เห็ดหอมอกไก่สับ',
      calories: 310,
      proteinG: 35.0,
      carbsG: 15.0,
      fatG: 10.0,
      ingredients: ['อกไก่', 'ใบกะเพรา', 'เต้าหู้'],
      emoji: '🍛',
      prepTime: '10 นาที',
    ),
    const RecipeSuggestion(
      id: 'rec_boiled_egg_salad',
      name: 'ยำไข่ต้มตานีอกไก่ฉีก',
      calories: 260,
      proteinG: 26.0,
      carbsG: 14.0,
      fatG: 10.0,
      ingredients: ['ไข่ไก่', 'อกไก่', 'หอมแดง', 'มะนาว'],
      emoji: '🥗',
      prepTime: '8 นาที',
    ),
  ];

  /// Returns 3-5 recipes filtered and sorted to fit the remaining calorie quota.
  /// Never returns an empty list even if remainingQuota is very small.
  static List<RecipeSuggestion> getSuggestedRecipes(int remainingQuotaKcal,
      [List<String> selectedFridgeTags = const []]) {
    // Make a copy to sort
    final copy = List<RecipeSuggestion>.from(_allRecipes);

    // If remaining quota is low (e.g. < 300 kcal), sort by lowest calories first
    if (remainingQuotaKcal < 300) {
      copy.sort((a, b) => a.calories.compareTo(b.calories));
      return copy.take(3).toList();
    }

    // Sort by proximity to remaining quota (without going over by > 100 kcal)
    copy.sort((a, b) {
      final diffA = (remainingQuotaKcal - a.calories).abs();
      final diffB = (remainingQuotaKcal - b.calories).abs();
      return diffA.compareTo(diffB);
    });

    return copy.take(4).toList();
  }
}
