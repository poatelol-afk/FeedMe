import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const mobileDir = path.join(rootDir, 'feedme-mobile');

test('FeedMe Mobile Task 2 RED Verification', async (t) => {
  await t.test('models file exists and exports required domain models', () => {
    const modelsPath = path.join(mobileDir, 'lib/core/models/feedme_models.dart');
    assert.strictEqual(fs.existsSync(modelsPath), true, 'feedme_models.dart must exist');
    const content = fs.readFileSync(modelsPath, 'utf-8');

    const expectedClasses = [
      'class MealEntry',
      'class RecipeSuggestion',
      'class ScaleIngredient',
      'class WeighedBowlItem',
      'class CardioSession',
      'class WeightExerciseSet',
      'class WorkoutProgram',
      'class DailyQuest',
      'class LeagueMember',
      'class PartyQuest',
      'class ShopItem',
    ];

    for (const cls of expectedClasses) {
      assert.ok(content.includes(cls), `feedme_models.dart must declare ${cls}`);
    }

    assert.ok(content.includes('bool get isProgressiveOverload => weightKg > previousBestKg;'), 'WeightExerciseSet must have Progressive Overload getter');
    assert.ok(content.includes('int get calories => ((grams * ingredient.kcalPer100g) / 100.0).round();'), 'WeighedBowlItem must calculate calories correctly');
  });

  await t.test('theme and tactile widget files exist with correct tokens', () => {
    const themePath = path.join(mobileDir, 'lib/core/theme/feedme_theme.dart');
    const buttonPath = path.join(mobileDir, 'lib/core/widgets/tactile_button.dart');
    const cardPath = path.join(mobileDir, 'lib/core/widgets/tactile_card.dart');
    const manifestPath = path.join(mobileDir, 'android/app/src/main/AndroidManifest.xml');

    assert.strictEqual(fs.existsSync(themePath), true, 'feedme_theme.dart must exist');
    assert.strictEqual(fs.existsSync(buttonPath), true, 'tactile_button.dart must exist');
    assert.strictEqual(fs.existsSync(cardPath), true, 'tactile_card.dart must exist');
    assert.strictEqual(fs.existsSync(manifestPath), true, 'AndroidManifest.xml must exist');

    const themeContent = fs.readFileSync(themePath, 'utf-8');
    assert.ok(themeContent.includes('0xFF131F24'), 'Theme canvas must be #131F24');
    assert.ok(themeContent.includes('0xFF58CC02'), 'Theme featherGreen must be #58CC02');
    assert.ok(themeContent.includes('0xFF46A302'), 'Theme featherGreenShadow must be #46A302');
  });
});

test('FeedMe Mobile Task 3 Controller & Kitchen Service Verification', async (t) => {
  await t.test('mock_kitchen_service.dart exists with datasets and recipe filtering', () => {
    const servicePath = path.join(mobileDir, 'lib/core/services/mock_kitchen_service.dart');
    assert.strictEqual(fs.existsSync(servicePath), true, 'mock_kitchen_service.dart must exist');
    const content = fs.readFileSync(servicePath, 'utf-8');

    assert.ok(content.includes('class MockKitchenService'), 'Must define MockKitchenService');
    assert.ok(content.includes('static List<MealEntry> get presetAiDishes'), 'Must provide presetAiDishes');
    assert.ok(content.includes('static List<ScaleIngredient> get scaleIngredients'), 'Must provide scaleIngredients');
    assert.ok(content.includes('static List<RecipeSuggestion> getSuggestedRecipes'), 'Must provide getSuggestedRecipes');
  });

  await t.test('feedme_controller.dart exists with reactive state and formulas', () => {
    const controllerPath = path.join(mobileDir, 'lib/core/services/feedme_controller.dart');
    assert.strictEqual(fs.existsSync(controllerPath), true, 'feedme_controller.dart must exist');
    const content = fs.readFileSync(controllerPath, 'utf-8');

    assert.ok(content.includes('class FeedMeController extends ChangeNotifier'), 'Must extend ChangeNotifier');
    assert.ok(content.includes('int get netCalories => consumedCalories - burnedCalories;'), 'Must calculate netCalories');
    assert.ok(content.includes('int get remainingQuota => targetDailyCalories - netCalories;'), 'Must calculate remainingQuota');
    assert.ok(content.includes('String get calorieStatusMessage'), 'Must provide calorieStatusMessage');
    assert.ok(content.includes('void tareScale()'), 'Must provide tareScale');
    assert.ok(content.includes('void sendScaleWeightToBowl()'), 'Must provide sendScaleWeightToBowl');
    assert.ok(content.includes('void recordSimulatedGpsRun'), 'Must provide recordSimulatedGpsRun');
    assert.ok(content.includes('void toggleExerciseSet'), 'Must provide toggleExerciseSet');
    assert.ok(content.includes('void togglePartyQuestJoin'), 'Must provide togglePartyQuestJoin');
  });
});

test('FeedMe Mobile Task 4 Home and Kitchen Screen Verification', async (t) => {
  await t.test('home_screen.dart exists with Net Calorie card and daily quests', () => {
    const homePath = path.join(mobileDir, 'lib/features/home/home_screen.dart');
    assert.strictEqual(fs.existsSync(homePath), true, 'home_screen.dart must exist');
    const content = fs.readFileSync(homePath, 'utf-8');

    assert.ok(content.includes('class HomeScreen'), 'Must define HomeScreen');
    assert.ok(content.includes('สมดุลพลังงาน'), 'Must display Net Calories title');
    assert.ok(content.includes('controller.calorieStatusMessage'), 'Must display playful coaching message');
    assert.ok(content.includes('controller.remainingQuota'), 'Must display remaining quota');
  });

  await t.test('kitchen_screen.dart exists with AI scanner, Recipe Chef, and Scale simulator', () => {
    const kitchenPath = path.join(mobileDir, 'lib/features/kitchen/kitchen_screen.dart');
    assert.strictEqual(fs.existsSync(kitchenPath), true, 'kitchen_screen.dart must exist');
    const content = fs.readFileSync(kitchenPath, 'utf-8');

    assert.ok(content.includes('class KitchenScreen'), 'Must define KitchenScreen');
    assert.ok(content.includes('สแกนอาหาร AI'), 'Must include AI Food scanner mode');
    assert.ok(content.includes('วันนี้ทำอะไรกินดี'), 'Must include AI Chef mode');
    assert.ok(content.includes('ตาชั่งวัตถุดิบ BLE'), 'Must include BLE Scale mode');
    assert.ok(content.includes('controller.tareScale'), 'Must wire tareScale');
    assert.ok(content.includes('controller.sendScaleWeightToBowl'), 'Must wire sendScaleWeightToBowl');
  });
});

test('FeedMe Mobile Task 5 Workout and League Screen Verification', async (t) => {
  await t.test('workout_screen.dart exists with GPS run painter and weight training logger', () => {
    const workoutPath = path.join(mobileDir, 'lib/features/workout/workout_screen.dart');
    assert.strictEqual(fs.existsSync(workoutPath), true, 'workout_screen.dart must exist');
    const content = fs.readFileSync(workoutPath, 'utf-8');

    assert.ok(content.includes('class WorkoutScreen'), 'Must define WorkoutScreen');
    assert.ok(content.includes('วิ่ง GPS'), 'Must include GPS Run mode');
    assert.ok(content.includes('เวทเทรนนิ่ง'), 'Must include Weight Training mode');
    assert.ok(content.includes('controller.recordSimulatedGpsRun'), 'Must wire recordSimulatedGpsRun');
    assert.ok(content.includes('controller.toggleExerciseSet'), 'Must wire toggleExerciseSet');
  });

  await t.test('league_screen.dart exists with Weekly Leaderboard and Opt-in Party Raid', () => {
    const leaguePath = path.join(mobileDir, 'lib/features/league/league_screen.dart');
    assert.strictEqual(fs.existsSync(leaguePath), true, 'league_screen.dart must exist');
    const content = fs.readFileSync(leaguePath, 'utf-8');

    assert.ok(content.includes('class LeagueScreen'), 'Must define LeagueScreen');
    assert.ok(content.includes('ลีกมรกต') || content.includes('Emerald League'), 'Must display league name');
    assert.ok(content.includes('ชวนเพื่อนตั้งตี้'), 'Must include opt-in Party Quest button');
    assert.ok(content.includes('controller.togglePartyQuestJoin'), 'Must wire togglePartyQuestJoin');
  });
});

test('FeedMe Mobile Task 6 Profile Screen and App Shell Verification', async (t) => {
  await t.test('profile_screen.dart exists with Gem Shop, streak protection, and BLE hardware card', () => {
    const profilePath = path.join(mobileDir, 'lib/features/profile/profile_screen.dart');
    assert.strictEqual(fs.existsSync(profilePath), true, 'profile_screen.dart must exist');
    const content = fs.readFileSync(profilePath, 'utf-8');

    assert.ok(content.includes('class ProfileScreen'), 'Must define ProfileScreen');
    assert.ok(content.includes('ร้านค้ารางวัล (Gem Shop)'), 'Must include Duolingo Gem Shop');
    assert.ok(content.includes('Streak Protection'), 'Must include streak freeze protection');
    assert.ok(content.includes('FeedMe Smart Scale'), 'Must include BLE scale hardware info');
    assert.ok(content.includes('controller.toggleScaleConnection'), 'Must wire toggleScaleConnection');
    assert.ok(content.includes('controller.purchaseShopItem'), 'Must wire purchaseShopItem');
  });

  await t.test('main.dart exists with 5-tab IndexedStack and gamified status top bar', () => {
    const mainPath = path.join(mobileDir, 'lib/main.dart');
    assert.strictEqual(fs.existsSync(mainPath), true, 'main.dart must exist');
    const content = fs.readFileSync(mainPath, 'utf-8');

    assert.ok(content.includes('class FeedMeApp'), 'Must define FeedMeApp');
    assert.ok(content.includes('class FeedMeMainShell'), 'Must define FeedMeMainShell');
    assert.ok(content.includes('IndexedStack'), 'Must use IndexedStack for preserving tab state');
    assert.ok(content.includes('หน้าแรก'), 'Tab 1: หน้าแรก');
    assert.ok(content.includes('ครัว AI'), 'Tab 2: ครัว AI');
    assert.ok(content.includes('ออกกำลัง'), 'Tab 3: ออกกำลัง');
    assert.ok(content.includes('ลีกเพื่อน'), 'Tab 4: ลีกเพื่อน');
    assert.ok(content.includes('โปรไฟล์'), 'Tab 5: โปรไฟล์');
  });

  await t.test('widget_test.dart exists and covers 5 bottom navigation tabs', () => {
    const testPath = path.join(mobileDir, 'test/widget_test.dart');
    assert.strictEqual(fs.existsSync(testPath), true, 'widget_test.dart must exist');
    const content = fs.readFileSync(testPath, 'utf-8');

    assert.ok(content.includes('FeedMeApp'), 'Must test FeedMeApp');
    assert.ok(content.includes('หน้าแรก'), 'Must assert หน้าแรก');
    assert.ok(content.includes('ครัว AI'), 'Must assert ครัว AI');
    assert.ok(content.includes('ออกกำลัง'), 'Must assert ออกกำลัง');
    assert.ok(content.includes('ลีกเพื่อน'), 'Must assert ลีกเพื่อน');
    assert.ok(content.includes('โปรไฟล์'), 'Must assert โปรไฟล์');
  });
});



