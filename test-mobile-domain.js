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

