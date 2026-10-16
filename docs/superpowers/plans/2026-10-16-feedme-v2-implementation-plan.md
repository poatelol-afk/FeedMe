# FeedMe 2.0 (Flutter Mobile + Next.js Promo + ESP32 Hardware) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganize the repository into the 3-pillar structure (`feedme-mobile`, `feedme-website`, `feedme-hardware`), build the complete 5-tab gamified Flutter mobile app with interactive mockup services for AI Food Vision, Recipe Chef, and BLE Smart Scale, and clean up/align the Next.js 16 promotional landing page.

**Architecture:**
- **`feedme-mobile` (Flutter / Dart):** Feature-first architecture (`lib/core/`, `lib/features/{home,kitchen,workout,league,profile}/`) managed by a reactive `FeedMeController extends ChangeNotifier` state engine so every logged meal, smart-scale cooking bowl, GPS run, weight-training set, and quest immediately recalculates `Net Calories`, `Remaining Quota`, `XP`, and `Gems`.
- **`feedme-website` (Next.js 16 / TypeScript / Tailwind v4):** Pure promotional showcase landing page at `src/app/page.tsx` with interactive 3D phone preview (`PhoneMockup.tsx` including the "What Should I Cook?" AI Chef tab), 3-pillar Bento grid, and live Net Calorie & XP calculator, with all legacy web-app tracker components (`src/components/{dashboard,log,profile,shop,workout}`) removed.
- **`feedme-hardware` (ESP32-C3 + HX711):** Renamed from `Hardware/` to match the standardized monorepo structure.

**Tech Stack:** Flutter 3.x (Dart 3.x), `flutter_test`, Next.js 16.2, React 19, Tailwind CSS v4, Node.js native test runner (`node --test`).

**Spec:** `docs/superpowers/specs/2026-10-16-feedme-v2-gamified-mobile-redesign.md`

## Global Constraints

- **Folder Naming:** The root workspace (`c:\Users\poate\OneDrive\เอกสาร\FeedMe`) must use `feedme-mobile/`, `feedme-website/`, and `feedme-hardware/` (with `feedme-webapp/` removed).
- **Mock-First / Self-Contained Services:** AI Food Scanner, "What Should I Cook?" Recipe Chef, and BLE Smart Scale must work 100% offline/out-of-the-box in interactive simulation/mockup mode without requiring any external `GEMINI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, or physical Bluetooth hardware.
- **Tactile Gamified Theme:** Use the Duolingo-inspired dark slate palette (`#131F24` canvas, `#1F2F36` card surface, `#58CC02` Feather Green primary with `#46A302` 4px bottom border, `#FF9600` Cardio/Streak orange, `#CE82FF` Weight/Party purple, `#1CB0F6` Kitchen/Gems cyan, `#FFC800` League gold, `#FF4B4B` Coral alert).
- **Net Calorie Formula:** `Net Calories = Consumed Calories - (Cardio Burned + Weight Training Burned)` and `Remaining Quota = Target Daily Calories - Net Calories`.
- **Anti-Goals:** Never display punishing/guilt-inducing copy when a user exceeds their calorie target; frame over-target states playfully (e.g., suggesting a light walk or allowing a Cheat Meal Pass `🍔`). Party/Friend quests must be opt-in (`+ ชวนเพื่อนตั้งตี้`) or event-based, never forced.

## Review Focus

1. **Over-Calorie Playful Framing (Anti-Goal Enforcement):** When `Consumed - Burned > Target Daily Calories` (`remainingQuota < 0`), the UI and state helper must never crash or show negative shaming; it must return a playful recovery prompt (e.g., suggesting a 15-min walk or redeeming a Cheat Meal Pass `🍔`).
2. **Smart Scale Tare & Bowl Bounds:** Calling `tareScale()` resets current scale grams to `0.0`, and adding negative or zero-gram ingredients to the cooking bowl is ignored so bowl macros never become negative or NaN.
3. **Recipe Chef Quota Filtering:** When `remainingQuota` is low (e.g., `< 350 kcal`), `getSuggestedRecipes(remainingQuota)` still returns at least the lightest high-protein recipe options sorted by calorie fit rather than an empty list.
4. **Progressive Overload Detection:** Completing a weight training set where `weightKg > previousBestKg` (or `reps > previousBestReps` at equal weight) triggers `isProgressiveOverload = true` and awards bonus XP (`+25 XP`).
5. **Opt-In Party Quest Isolation:** A user can toggle/join or leave an optional Friend Party Quest (`joinOrCreatePartyQuest` / `leavePartyQuest`) without corrupting their individual Weekly League XP.

---

### Task 1: Workspace Reorganization & Promotional Website Cleanup (`feedme-hardware` & `feedme-website`)

**Files:**
- Move/Rename: `Hardware/` -> `feedme-hardware/`
- Delete: `feedme-webapp/`
- Delete: `feedme-website/src/components/dashboard/`, `feedme-website/src/components/layout/`, `feedme-website/src/components/log/`, `feedme-website/src/components/profile/`, `feedme-website/src/components/shop/`, `feedme-website/src/components/workout/`, `feedme-website/src/hooks/useAppState.tsx`, `feedme-website/src/lib/supabase/`
- Modify: `feedme-website/src/components/PhoneMockup.tsx`
- Modify: `feedme-website/src/__tests__/landing.test.ts`

**Interfaces:**
- Produces:
  - Clean directory layout: `feedme-hardware/Hardware_Scale.ino`, `feedme-hardware/README.md`
  - Updated `PhoneMockup.tsx` supporting `'ai' | 'chef' | 'scale'` sub-modes inside the Smart Kitchen tab and opt-in `+ ชวนเพื่อนตั้งตี้` button in the League tab.

- [ ] **Step 1: Update `feedme-website/src/__tests__/landing.test.ts` to assert legacy tracker component folders are removed and `PhoneMockup.tsx` includes the Recipe Chef & Opt-in Party UI**

```typescript
test('Verification: Legacy web-app component folders are removed from src/components', () => {
  const legacyComponentDirs = ['dashboard', 'layout', 'log', 'profile', 'shop', 'workout'];
  for (const dir of legacyComponentDirs) {
    assert.strictEqual(
      fs.existsSync(path.join(componentsDir, dir)),
      false,
      `Legacy web-app component directory "${dir}" should be removed`
    );
  }
});

test('Verification: PhoneMockup includes AI Scanner, Recipe Chef, BLE Scale Simulator, and Opt-in Party button', () => {
  const mockupContent = fs.readFileSync(path.join(componentsDir, 'PhoneMockup.tsx'), 'utf-8');
  assert.ok(mockupContent.includes('วันนี้ทำอะไรกินดี'), 'PhoneMockup must showcase the AI Recipe Chef');
  assert.ok(mockupContent.includes('ชวนเพื่อนตั้งตี้'), 'PhoneMockup must showcase the opt-in Party Quest button');
});
```

- [ ] **Step 2: Run the website test suite to verify the new assertions fail**

Run: `npm --prefix feedme-website test`
Expected: FAIL with `Legacy web-app component directory "dashboard" should be removed`

- [ ] **Step 3: Reorganize workspace folders (`Hardware` -> `feedme-hardware`, remove `feedme-webapp` and legacy `feedme-website` tracker directories) and update `feedme-website/src/components/PhoneMockup.tsx`**

Move `Hardware` to `feedme-hardware`, remove `feedme-webapp`, delete the unused `dashboard`, `layout`, `log`, `profile`, `shop`, `workout` folders under `feedme-website/src/components/`, and add the `'chef'` sub-tab (`👨‍🍳 วันนี้ทำอะไรกินดี?`) plus the `+ ชวนเพื่อนตั้งตี้` interactive toggle inside `feedme-website/src/components/PhoneMockup.tsx`.

- [ ] **Step 4: Run website tests and production build to verify everything passes**

Run: `npm --prefix feedme-website test && npm --prefix feedme-website run typecheck`
Expected: PASS with 0 errors.

- [ ] **Step 5: Commit workspace reorganization and website cleanup**

```bash
git add -A
git commit -m "refactor: reorganize monorepo folders and clean up feedme-website"
```

---

### Task 2: Flutter App Foundation, Tactile 3D Theme & Core Domain Models (`feedme-mobile`)

**Files:**
- Create: `feedme-mobile/pubspec.yaml`
- Create: `feedme-mobile/analysis_options.yaml`
- Create: `feedme-mobile/android/app/src/main/AndroidManifest.xml`
- Create: `feedme-mobile/lib/core/theme/feedme_theme.dart`
- Create: `feedme-mobile/lib/core/widgets/tactile_button.dart`
- Create: `feedme-mobile/lib/core/widgets/tactile_card.dart`
- Create: `feedme-mobile/lib/core/models/feedme_models.dart`
- Test: `feedme-mobile/test/models_test.dart`

**Interfaces:**
- Produces:
  - `FeedMeColors` (`canvas = Color(0xFF131F24)`, `card = Color(0xFF1F2F36)`, `featherGreen = Color(0xFF58CC02)`, `featherGreenShadow = Color(0xFF46A302)`, `cardioOrange = Color(0xFFFF9600)`, `liftPurple = Color(0xFFCE82FF)`, `kitchenCyan = Color(0xFF1CB0F6)`, `leagueGold = Color(0xFFFFC800)`, `coralRed = Color(0xFFFF4B4B)`)
  - `TactileButton({required String label, required VoidCallback onPressed, Color color, Color shadowColor, Widget? icon})`
  - `TactileCard({required Widget child, Color borderColor, EdgeInsets padding})`
  - Domain models in `lib/core/models/feedme_models.dart`:
    - `MealEntry({required String id, required String name, required int calories, required double proteinG, required double carbsG, required double fatG, required double grams, required String source, required String emoji})`
    - `RecipeSuggestion({required String id, required String name, required int calories, required double proteinG, required double carbsG, required double fatG, required List<String> ingredients, required String emoji, required String prepTime})`
    - `ScaleIngredient({required String id, required String name, required double kcalPer100g, required double proteinPer100g, required double carbsPer100g, required double fatPer100g, required String emoji})`
    - `WeighedBowlItem({required ScaleIngredient ingredient, required double grams})` with getters `int get calories`, `double get proteinG`, `double get carbsG`, `double get fatG`
    - `CardioSession({required String id, required String activityType, required double distanceKm, required int durationSeconds, required String avgPace, required int caloriesBurned, required int xpEarned, required List<List<double>> routePoints})`
    - `WeightExerciseSet({required String exerciseName, required double weightKg, required int reps, required double previousBestKg, bool completed = false})` with getter `bool get isProgressiveOverload => weightKg > previousBestKg`
    - `WorkoutProgram({required String id, required String title, required String expertTag, required String focusArea, required int estimatedBurnKcal, required List<WeightExerciseSet> sets})`
    - `DailyQuest({required String id, required String title, required int rewardXp, required int rewardGems, required bool completed})`
    - `LeagueMember({required String id, required String name, required int weeklyXp, required bool isCurrentUser, required String avatarEmoji})`
    - `PartyQuest({required String id, required String title, required String bossName, required int targetBurnKcal, required int currentBurnKcal, required bool isJoined, required List<String> memberNames})`
    - `ShopItem({required String id, required String title, required String description, required int costGems, required String emoji, required String effectType})`

- [ ] **Step 1: Create `feedme-mobile/pubspec.yaml` and write unit test `feedme-mobile/test/models_test.dart`**

```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:feedme_mobile/core/models/feedme_models.dart';

void main() {
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
  });
}
```

- [ ] **Step 2: Implement `lib/core/models/feedme_models.dart`, `lib/core/theme/feedme_theme.dart`, `lib/core/widgets/tactile_button.dart`, `lib/core/widgets/tactile_card.dart`, and `android/app/src/main/AndroidManifest.xml`**

Create the Flutter package configuration (`pubspec.yaml`, `analysis_options.yaml`), Android manifest with `ACCESS_FINE_LOCATION`, `BLUETOOTH_SCAN`, `BLUETOOTH_CONNECT`, and `CAMERA` declarations, the Duolingo-inspired `FeedMeColors` + `TactileButton` / `TactileCard` widgets, and all domain model classes in `lib/core/models/feedme_models.dart`.

- [ ] **Step 3: Verify `feedme_models.dart` and theme files have complete type definitions and zero syntax issues**

If `flutter` CLI is available on PATH, run `flutter test test/models_test.dart`; otherwise verify via our Node/TypeScript static structure verifier script.

- [ ] **Step 4: Commit Flutter foundation, theme, and domain models**

```bash
git add feedme-mobile
git commit -m "feat(mobile): add Flutter foundation, Duolingo 3D theme, and core models"
```

---

### Task 3: Central Gamified State Controller & Mockup Services (`FeedMeController`, AI Kitchen & BLE Scale Simulator)

**Files:**
- Create: `feedme-mobile/lib/core/services/mock_kitchen_service.dart`
- Create: `feedme-mobile/lib/core/services/feedme_controller.dart`
- Test: `feedme-mobile/test/controller_test.dart`

**Interfaces:**
- Consumes: `lib/core/models/feedme_models.dart`
- Produces:
  - `MockKitchenService`:
    - `List<MealEntry> get presetAiDishes` (Thai & International dishes for instant AI photo scanner simulation)
    - `List<ScaleIngredient> get scaleIngredients` (raw chicken breast, jasmine rice, salmon, eggs, broccoli, olive oil, etc.)
    - `List<RecipeSuggestion> getSuggestedRecipes(int remainingQuotaKcal, List<String> selectedFridgeTags)` (always returns at least 3 recipes sorted by calorie fit)
  - `FeedMeController extends ChangeNotifier`:
    - `int get targetDailyCalories` (default `2000`, increases by `+500` when a Cheat Meal Pass `🍔` is activated)
    - `int get consumedCalories`, `int get burnedCalories`, `int get netCalories`, `int get remainingQuota`
    - `String get calorieStatusMessage` (returns positive playful encouragement even when `remainingQuota < 0`)
    - `int get streakDays`, `int get gems`, `int get weeklyXp`, `int get streakFreezes`
    - `double get currentScaleGrams`, `ScaleIngredient get selectedScaleIngredient`, `List<WeighedBowlItem> get cookingBowl`
    - `void logAiScannedMeal(MealEntry meal)`
    - `void setScaleGrams(double grams)`, `void adjustScaleGrams(double delta)`, `void tareScale()`
    - `void sendScaleWeightToBowl()`, `void commitCookingBowlAsMeal(String customDishName)`
    - `void recordSimulatedGpsRun({required double distanceKm, required int durationSeconds, required String routeName})`
    - `void toggleExerciseSet(String programId, int setIndex)`, `void completeWorkoutProgram(String programId)`
    - `void togglePartyQuestJoin()`, `void sendFriendSticker(String friendName, String sticker)`
    - `bool purchaseShopItem(ShopItem item)`

- [ ] **Step 1: Write unit test `feedme-mobile/test/controller_test.dart` covering Net Calorie balance, Smart Scale Tare/Bowl bounds, Recipe Chef quota filtering, Progressive Overload bonus XP, Opt-in Party Quest, and Over-Calorie playful message**

```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:feedme_mobile/core/services/feedme_controller.dart';
import 'package:feedme_mobile/core/services/mock_kitchen_service.dart';

void main() {
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
    controller.togglePartyQuestJoin();
    expect(controller.activePartyQuest.isJoined, isFalse);
    controller.togglePartyQuestJoin();
    expect(controller.activePartyQuest.isJoined, isTrue);
    expect(controller.weeklyXp, xpBefore);
  });
}
```

- [ ] **Step 2: Implement `MockKitchenService` in `feedme-mobile/lib/core/services/mock_kitchen_service.dart` and `FeedMeController` in `feedme-mobile/lib/core/services/feedme_controller.dart`**

Implement all preset dishes, fridge ingredient tags, recipe filtering logic, scale simulator state (`tareScale`, `adjustScaleGrams`, `sendScaleWeightToBowl`, `commitCookingBowlAsMeal`), GPS run simulation, Weight Training set completion with Progressive Overload bonus XP (`+25 XP`), Weekly League ranking updates, and Opt-in Party Quest raid progress.

- [ ] **Step 3: Verify `mock_kitchen_service.dart` and `feedme_controller.dart`**

Run tests or verify state transitions.

- [ ] **Step 4: Commit `MockKitchenService` and `FeedMeController`**

```bash
git add feedme-mobile/lib/core/services feedme-mobile/test/controller_test.dart
git commit -m "feat(mobile): add FeedMeController state engine and mock AI/Scale kitchen service"
```

---

### Task 4: Tab 1 (Home & Net Calorie Dashboard) & Tab 2 (Smart Kitchen: AI Scanner, Recipe Chef & BLE Scale Simulator)

**Files:**
- Create: `feedme-mobile/lib/features/home/home_screen.dart`
- Create: `feedme-mobile/lib/features/kitchen/kitchen_screen.dart`

**Interfaces:**
- Consumes: `FeedMeController`, `MockKitchenService`, `TactileButton`, `TactileCard`, `FeedMeColors`
- Produces:
  - `HomeScreen({required FeedMeController controller, required ValueChanged<int> onSwitchTab})`
  - `KitchenScreen({required FeedMeController controller})` featuring 3 interactive segmented modes:
    1. `📸 สแกนอาหาร AI (Mockup)` — Select/snap a dish, play scanning animation, preview macros, and tap `บันทึกมื้อนี้ (+25 XP)`.
    2. `👨‍🍳 วันนี้ทำอะไรกินดี? (AI Chef)` — Filter by remaining calorie quota (`controller.remainingQuota`) and fridge ingredient chips (`อกไก่`, `ไข่ไก่`, `แซลมอน`, `เต้าหู้`, `ผักใบเขียว`), tap a recipe to log or load into the Smart Scale.
    3. `⚖️ ตาชั่งวัตถุดิบ BLE (Simulator)` — Digital gram readout (`0.0 g`), `TARE (ตัดน้ำหนักจาน)`, slider & `+10g / +50g / +100g` buttons, ingredient selector, `SEND เข้าชามผสม`, live bowl macro summary, and `ปรุงเสร็จ & บันทึกมื้ออาหาร (+40 XP)`.

- [ ] **Step 1: Implement `HomeScreen` in `feedme-mobile/lib/features/home/home_screen.dart`**

Include the Net Calorie Hero Card (`กินเข้าไป - เผาผลาญ = สุทธิ` and `เหลือโควต้าอีก X kcal`), playful status banner (`controller.calorieStatusMessage`), Protein/Carbs/Fat progress bars, Quick Action buttons jumping to Kitchen or Workout tabs, Daily Quests checklist (`เควสประจำวัน`), and today's logged meals & workouts list.

- [ ] **Step 2: Implement `KitchenScreen` in `feedme-mobile/lib/features/kitchen/kitchen_screen.dart`**

Implement the 3 sub-modes (`📸 สแกนอาหาร AI`, `👨‍🍳 วันนี้ทำอะไรกินดี?`, and `⚖️ ตาชั่งวัตถุดิบ BLE`) wired directly to `FeedMeController`.

- [ ] **Step 3: Commit Home and Smart Kitchen screens**

```bash
git add feedme-mobile/lib/features/home feedme-mobile/lib/features/kitchen
git commit -m "feat(mobile): implement Home Net Calorie dashboard and Smart Kitchen screen"
```

---

### Task 5: Tab 3 (Run & Lift: Strava GPS Cardio + Expert Weight Training) & Tab 4 (Duolingo League + Opt-In Party Quests)

**Files:**
- Create: `feedme-mobile/lib/features/workout/workout_screen.dart`
- Create: `feedme-mobile/lib/features/league/league_screen.dart`

**Interfaces:**
- Consumes: `FeedMeController`, `TactileButton`, `TactileCard`, `FeedMeColors`
- Produces:
  - `WorkoutScreen({required FeedMeController controller})` featuring 2 segmented modes:
    1. `🏃 วิ่ง GPS (Strava Style)` — Custom interactive GPS Route Map painter (`CustomPaint` rendering the neon route polyline, start/current pin, and park selector), live/simulated timer, Distance (`km`), Pace (`min/km`), Active Burn (`kcal`), Daily Running Event progress bar, and `จบการวิ่ง & ส่งแคลอรี่ไปหักลบ (+80 XP)` button.
    2. `🏋️ เวทเทรนนิ่ง (Expert Programs)` — Program selector (*Push Day (อก/ไหล่/หลังแขน)*, *Pull & Back Sculpt*, *Full Body Fat Burn*), per-set checklist (`weightKg x reps`) with `🔥 Progressive Overload` badge and rest timer simulation, plus `จบตารางฝึกวันนี้ (+100 XP)` button.
  - `LeagueScreen({required FeedMeController controller})` featuring:
    1. **Weekly Duolingo League Leaderboard:** Emerald League tier banner, Promotion Zone (Top 3 highlighted in green), Demotion Zone warning, and dynamic sorting as the user earns XP.
    2. **Opt-In Friend Quests / Party Boss Raid:** Toggle button (`+ ชวนเพื่อนตั้งตี้ / เข้าร่วมอีเวนต์` vs `ออกจากปาร์ตี้ชั่วคราว`), Boss HP progress bar (`แก๊งหมูกระทะ vs. บอสไขมันทรานส์`), and 1-tap Friend Activity Feed sticker reactions (`🔥 เชียร์`, `👏 สุดยอด`, `👀 แอบกินไรน่ะ`).

- [ ] **Step 1: Implement `WorkoutScreen` in `feedme-mobile/lib/features/workout/workout_screen.dart`**

Build the Strava-inspired GPS Run view (with `GpsRouteMapPainter` custom canvas and interactive run simulator) and the Weight Training program & set logger view.

- [ ] **Step 2: Implement `LeagueScreen` in `feedme-mobile/lib/features/league/league_screen.dart`**

Build the Weekly XP League leaderboard and the opt-in Party Boss Raid + Friend Sticker Feed.

- [ ] **Step 3: Commit Workout and League screens**

```bash
git add feedme-mobile/lib/features/workout feedme-mobile/lib/features/league
git commit -m "feat(mobile): implement Run & Lift workout screen and League & Party social screen"
```

---

### Task 6: Tab 5 (Profile & Gem Shop), App Shell Entrypoint & End-to-End Verification

**Files:**
- Create: `feedme-mobile/lib/features/profile/profile_screen.dart`
- Create: `feedme-mobile/lib/main.dart`
- Modify: `feedme-mobile/test/widget_test.dart`

**Interfaces:**
- Consumes: `FeedMeController`, `HomeScreen`, `KitchenScreen`, `WorkoutScreen`, `LeagueScreen`, `ProfileScreen`
- Produces:
  - `ProfileScreen({required FeedMeController controller})` featuring Avatar & Level badge, Streak Freeze (`❄️`) status, Reward Gem Shop (`❄️ Streak Freeze`, `🍔 บัตรตามใจปาก Cheat Meal Pass +500 kcal`, `⚡ Double XP Potion`), and Hardware BLE Scale simulator connection toggle.
  - `FeedMeApp` in `lib/main.dart` with top status header (`🔥 Streak`, `💎 Gems`, `⚡ XP`) and 5-tab Duolingo-style bottom navigation bar (`หน้าแรก`, `ครัว AI`, `ออกกำลัง`, `ลีกเพื่อน`, `โปรไฟล์`).

- [ ] **Step 1: Implement `ProfileScreen` in `feedme-mobile/lib/features/profile/profile_screen.dart` and `FeedMeApp` in `feedme-mobile/lib/main.dart`**

Wire all 5 screens into `FeedMeApp` using an `IndexedStack` so switching tabs preserves state seamlessly, with a persistent gamified top bar and bottom navigation bar.

- [ ] **Step 2: Write widget smoke test in `feedme-mobile/test/widget_test.dart`**

```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:feedme_mobile/main.dart';

void main() {
  testWidgets('FeedMeApp renders 5 bottom tabs and Net Calorie hero card', (WidgetTester tester) async {
    await tester.pumpWidget(const FeedMeApp());
    expect(find.textContaining('สมดุลพลังงาน'), findsOneWidget);
    expect(find.text('หน้าแรก'), findsOneWidget);
    expect(find.text('ครัว AI'), findsOneWidget);
    expect(find.text('ออกกำลัง'), findsOneWidget);
    expect(find.text('ลีกเพื่อน'), findsOneWidget);
    expect(find.text('โปรไฟล์'), findsOneWidget);
  });
}
```

- [ ] **Step 3: Run full repository verification (Website tests, TypeScript check, and Monorepo Structure check)**

Run: `npm --prefix feedme-website test && npm --prefix feedme-website run typecheck`
Expected: PASS with 0 errors.

- [ ] **Step 4: Commit Profile screen, `main.dart`, and widget tests**

```bash
git add feedme-mobile
git commit -m "feat(mobile): add Profile & Gem Shop screen, main 5-tab shell, and widget tests"
```
