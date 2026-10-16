import 'package:flutter/material.dart';
import '../theme/feedme_theme.dart';

/// ═══════════════════════════════════════════════════════════════════════════════
/// Tactile 3D Card Surface (Duolingo Style with solid border and inner depth)
/// ═══════════════════════════════════════════════════════════════════════════════
class TactileCard extends StatelessWidget {
  final Widget child;
  final Color backgroundColor;
  final Color borderColor;
  final EdgeInsetsGeometry padding;
  final double borderRadius;
  final VoidCallback? onTap;

  const TactileCard({
    super.key,
    required this.child,
    this.backgroundColor = FeedMeColors.card,
    this.borderColor = FeedMeColors.cardBorder,
    this.padding = const EdgeInsets.all(16.0),
    this.borderRadius = 20.0,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final container = Container(
      padding: padding,
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(borderRadius),
        border: Border.all(color: borderColor, width: 2.0),
        boxShadow: const [
          BoxShadow(
            color: Color(0x20000000),
            offset: Offset(0, 4),
            blurRadius: 8,
          ),
        ],
      ),
      child: child,
    );

    if (onTap == null) return container;

    return Material(
      color: Colors.transparent,
      child: InkWell(
        borderRadius: BorderRadius.circular(borderRadius),
        onTap: onTap,
        child: container,
      ),
    );
  }
}
