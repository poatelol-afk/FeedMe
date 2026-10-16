import 'package:flutter/material.dart';
import '../../core/models/feedme_models.dart';
import '../../core/services/feedme_controller.dart';
import '../../core/theme/feedme_theme.dart';
import '../../core/widgets/tactile_button.dart';
import '../../core/widgets/tactile_card.dart';

/// ═══════════════════════════════════════════════════════════════════════════════
/// Tab 3: Run & Lift — Strava-like GPS Cardio & Expert Weight Training Logger
/// ═══════════════════════════════════════════════════════════════════════════════
class WorkoutScreen extends StatefulWidget {
  final FeedMeController controller;

  const WorkoutScreen({
    super.key,
    required this.controller,
  });

  @override
  State<WorkoutScreen> createState() => _WorkoutScreenState();
}

class _WorkoutScreenState extends State<WorkoutScreen> {
  int _activeMode = 0; // 0: GPS Run, 1: Weight Training

  // Simulated GPS Run state
  double _simulatedKm = 5.24;
  int _simulatedSeconds = 1665;
  String _selectedRouteName = 'สวนลุมพินี Loop (รอบละ 2.5 km)';

  // Weight training state
  late String _selectedProgramId;

  @override
  void initState() {
    super.initState();
    _selectedProgramId = widget.controller.workoutPrograms.first.id;
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: widget.controller,
      builder: (context, _) {
        return SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ─── Mode Switcher (Run vs Lift) ─────────────────────────────────
              _buildModeSwitcher(),
              const SizedBox(height: 16.0),

              if (_activeMode == 0) _buildGpsRunView(),
              if (_activeMode == 1) _buildWeightTrainingView(),

              const SizedBox(height: 24.0),
            ],
          ),
        );
      },
    );
  }

  Widget _buildModeSwitcher() {
    return Container(
      padding: const EdgeInsets.all(4.0),
      decoration: BoxDecoration(
        color: FeedMeColors.card,
        borderRadius: BorderRadius.circular(16.0),
        border: Border.all(color: FeedMeColors.cardBorder),
      ),
      child: Row(
        children: [
          _buildSegmentTab(0, '🏃 วิ่ง GPS (Strava Style)', FeedMeColors.cardioOrange),
          _buildSegmentTab(1, '🏋️ เวทเทรนนิ่ง (Programs)', FeedMeColors.liftPurple),
        ],
      ),
    );
  }

  Widget _buildSegmentTab(int index, String title, Color activeColor) {
    final isActive = _activeMode == index;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _activeMode = index),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 150),
          padding: const EdgeInsets.symmetric(vertical: 10.0),
          decoration: BoxDecoration(
            color: isActive ? activeColor : Colors.transparent,
            borderRadius: BorderRadius.circular(12.0),
          ),
          child: Text(
            title,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w800,
              color: isActive ? Colors.white : FeedMeColors.textSecondary,
            ),
          ),
        ),
      ),
    );
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // 1. STRAVA-STYLE GPS CARDIO RUN
  // ═════════════════════════════════════════════════════════════════════════════
  Widget _buildGpsRunView() {
    final activeBurnKcal = (_simulatedKm * 68).round();
    final paceMins = (_simulatedSeconds / 60.0) / (_simulatedKm > 0 ? _simulatedKm : 1.0);
    final mins = paceMins.floor();
    final secs = ((paceMins - mins) * 60).round();
    final paceStr = '$mins:${secs.toString().padLeft(2, '0')}';

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Stylized Neon GPS Route Map Canvas
        Container(
          height: 180,
          width: double.infinity,
          decoration: BoxDecoration(
            color: const Color(0xFF0F172A),
            borderRadius: BorderRadius.circular(22),
            border: Border.all(color: FeedMeColors.cardioOrange.withValues(alpha: 0.5), width: 2),
            boxShadow: [
              BoxShadow(
                color: FeedMeColors.cardioOrange.withValues(alpha: 0.15),
                blurRadius: 14,
              ),
            ],
          ),
          child: Stack(
            children: [
              CustomPaint(
                size: const Size(double.infinity, 180),
                painter: _NeonGpsRoutePainter(),
              ),
              Positioned(
                top: 12,
                left: 12,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.black.withValues(alpha: 0.75),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    children: [
                      const CircleAvatar(radius: 4, backgroundColor: FeedMeColors.cardioOrange),
                      const SizedBox(width: 6),
                      Text(
                        'GPS Track: $_selectedRouteName',
                        style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                ),
              ),
              Positioned(
                bottom: 12,
                right: 12,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.black.withValues(alpha: 0.75),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Text(
                    '📍 OpenStreetMap Live Track',
                    style: TextStyle(color: FeedMeColors.textSecondary, fontSize: 10, fontWeight: FontWeight.bold),
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),

        // Live Running Metrics Dashboard
        TactileCard(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _buildMetricCell('ระยะทาง', '${_simulatedKm.toStringAsFixed(2)} km', FeedMeColors.textPrimary),
                  _buildMetricCell('Pace เฉลี่ย', '$paceStr /km', FeedMeColors.cardioOrange),
                  _buildMetricCell('เผาผลาญ', '$activeBurnKcal kcal', FeedMeColors.featherGreen),
                ],
              ),
              const SizedBox(height: 14),
              Row(
                children: [
                  Expanded(
                    child: TactileButton(
                      label: '+1.0 km (ก้าววิ่ง)',
                      color: FeedMeColors.card,
                      shadowColor: FeedMeColors.cardBorder,
                      height: 42,
                      onPressed: () {
                        setState(() {
                          _simulatedKm += 1.0;
                          _simulatedSeconds += 318;
                        });
                      },
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: TactileButton(
                      label: 'รีเซ็ตระยะ',
                      color: FeedMeColors.card,
                      shadowColor: FeedMeColors.cardBorder,
                      height: 42,
                      onPressed: () {
                        setState(() {
                          _simulatedKm = 0.0;
                          _simulatedSeconds = 0;
                        });
                      },
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              TactileButton(
                label: '🏁 จบการวิ่ง & ส่งแคลอรี่ไปหักลบ (+80 XP)',
                color: FeedMeColors.cardioOrange,
                shadowColor: FeedMeColors.cardioOrangeShadow,
                height: 48,
                onPressed: () {
                  if (_simulatedKm <= 0.1) return;
                  widget.controller.recordSimulatedGpsRun(
                    distanceKm: _simulatedKm,
                    durationSeconds: _simulatedSeconds,
                    routeName: _selectedRouteName,
                  );
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      backgroundColor: FeedMeColors.card,
                      content: Text('บันทึกการวิ่ง $_simulatedKm km (-$activeBurnKcal kcal, +80 XP) สำเร็จ! 🏃'),
                    ),
                  );
                },
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),

        // History of Runs
        const Text(
          'ประวัติการวิ่งล่าสุด:',
          style: TextStyle(color: FeedMeColors.textPrimary, fontSize: 13, fontWeight: FontWeight.w900),
        ),
        const SizedBox(height: 8),
        if (widget.controller.cardioHistory.isEmpty)
          const Text(
            'ยังไม่มีสถิติวิ่งวันนี้ แตะ "จบการวิ่ง" เพื่อบันทึกรอบแรก!',
            style: TextStyle(color: FeedMeColors.textMuted, fontSize: 11),
          )
        else
          ...widget.controller.cardioHistory.map((s) {
            return Container(
              margin: const EdgeInsets.only(bottom: 8),
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: FeedMeColors.card,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: FeedMeColors.cardBorder),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      const Text('🏃', style: TextStyle(fontSize: 22)),
                      const SizedBox(width: 10),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('${s.distanceKm} km · Pace ${s.avgPace}',
                              style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w800)),
                          Text('เวลา ${(s.durationSeconds / 60).round()} นาที',
                              style: const TextStyle(color: FeedMeColors.textMuted, fontSize: 10)),
                        ],
                      ),
                    ],
                  ),
                  Text('-${s.caloriesBurned} kcal',
                      style: const TextStyle(color: FeedMeColors.cardioOrange, fontSize: 13, fontWeight: FontWeight.w900)),
                ],
              ),
            );
          }),
      ],
    );
  }

  Widget _buildMetricCell(String label, String value, Color color) {
    return Column(
      children: [
        Text(label, style: const TextStyle(color: FeedMeColors.textMuted, fontSize: 11, fontWeight: FontWeight.bold)),
        const SizedBox(height: 3),
        Text(value, style: TextStyle(color: color, fontSize: 16, fontWeight: FontWeight.w900)),
      ],
    );
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // 2. WEIGHT TRAINING & PROGRESSIVE OVERLOAD LOGGER
  // ═════════════════════════════════════════════════════════════════════════════
  Widget _buildWeightTrainingView() {
    final program = widget.controller.workoutPrograms.firstWhere(
      (p) => p.id == _selectedProgramId,
      orElse: () => widget.controller.workoutPrograms.first,
    );

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Program Selector Chips
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: widget.controller.workoutPrograms.map((p) {
              final isChosen = p.id == _selectedProgramId;
              return Padding(
                padding: const EdgeInsets.only(right: 8.0),
                child: ChoiceChip(
                  selected: isChosen,
                  label: Text(p.title),
                  selectedColor: FeedMeColors.liftPurple.withValues(alpha: 0.25),
                  backgroundColor: FeedMeColors.card,
                  labelStyle: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: isChosen ? FeedMeColors.liftPurple : FeedMeColors.textSecondary,
                  ),
                  side: BorderSide(
                    color: isChosen ? FeedMeColors.liftPurple : FeedMeColors.cardBorder,
                  ),
                  onSelected: (_) => setState(() => _selectedProgramId = p.id),
                ),
              );
            }).toList(),
          ),
        ),
        const SizedBox(height: 12),

        // Program Header Card
        TactileCard(
          borderColor: FeedMeColors.liftPurple.withValues(alpha: 0.4),
          padding: const EdgeInsets.all(14),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(program.expertTag,
                      style: const TextStyle(color: FeedMeColors.liftPurple, fontSize: 11, fontWeight: FontWeight.w800)),
                  Text(program.focusArea,
                      style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w900)),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: FeedMeColors.liftPurple.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  'เผาผลาญ ~${program.estimatedBurnKcal} kcal',
                  style: const TextStyle(color: FeedMeColors.liftPurple, fontSize: 11, fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),

        const Text(
          'รายการเซ็ตฝึก (แตะ ✓ เพื่อบันทึกเซ็ต):',
          style: TextStyle(color: FeedMeColors.textPrimary, fontSize: 13, fontWeight: FontWeight.w900),
        ),
        const SizedBox(height: 8),

        ...program.sets.asMap().entries.map((entry) {
          final setIndex = entry.key;
          final setItem = entry.value;

          return Container(
            margin: const EdgeInsets.only(bottom: 8),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: FeedMeColors.card,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: setItem.completed
                    ? FeedMeColors.featherGreen.withValues(alpha: 0.6)
                    : FeedMeColors.cardBorder,
              ),
            ),
            child: Row(
              children: [
                IconButton(
                  icon: Icon(
                    setItem.completed ? Icons.check_box_rounded : Icons.check_box_outline_blank_rounded,
                    color: setItem.completed ? FeedMeColors.featherGreen : FeedMeColors.textMuted,
                  ),
                  onPressed: () {
                    widget.controller.toggleExerciseSet(program.id, setIndex);
                  },
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        setItem.exerciseName,
                        style: TextStyle(
                          color: setItem.completed ? FeedMeColors.textSecondary : Colors.white,
                          fontSize: 13,
                          fontWeight: FontWeight.w800,
                          decoration: setItem.completed ? TextDecoration.lineThrough : null,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        '${setItem.weightKg} kg × ${setItem.reps} ครั้ง (สถิติเดิม: ${setItem.previousBestKg} kg)',
                        style: const TextStyle(color: FeedMeColors.textMuted, fontSize: 11),
                      ),
                      if (setItem.isProgressiveOverload) ...[
                        const SizedBox(height: 4),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: FeedMeColors.featherGreen.withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: const Text(
                            '🔥 Progressive Overload: น้ำหนักเพิ่มขึ้น (+25 XP)',
                            style: TextStyle(color: FeedMeColors.featherGreen, fontSize: 9, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
              ],
            ),
          );
        }),
        const SizedBox(height: 12),

        TactileButton(
          label: '🏆 จบตารางฝึกวันนี้ (+100 XP)',
          color: FeedMeColors.liftPurple,
          shadowColor: FeedMeColors.liftPurpleShadow,
          height: 48,
          onPressed: () {
            widget.controller.completeWorkoutProgram(program.id);
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                backgroundColor: FeedMeColors.card,
                content: Text('จบตารางฝึก "${program.title}" สำเร็จ! (+100 XP, -${program.estimatedBurnKcal} kcal) 💪'),
              ),
            );
          },
        ),
      ],
    );
  }
}

/// Custom Neon Route Polyline Canvas Painter
class _NeonGpsRoutePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = FeedMeColors.cardioOrange
      ..strokeWidth = 4.0
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    final path = Path();
    path.moveTo(size.width * 0.15, size.height * 0.75);
    path.quadraticBezierTo(
      size.width * 0.35,
      size.height * 0.2,
      size.width * 0.55,
      size.height * 0.6,
    );
    path.quadraticBezierTo(
      size.width * 0.75,
      size.height * 0.9,
      size.width * 0.85,
      size.height * 0.3,
    );

    canvas.drawPath(path, paint);

    // Start Pin (Green)
    final startPaint = Paint()..color = FeedMeColors.featherGreen;
    canvas.drawCircle(Offset(size.width * 0.15, size.height * 0.75), 6.0, startPaint);

    // Current/End Pin (Gold)
    final endPaint = Paint()..color = FeedMeColors.leagueGold;
    canvas.drawCircle(Offset(size.width * 0.85, size.height * 0.3), 7.0, endPaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
