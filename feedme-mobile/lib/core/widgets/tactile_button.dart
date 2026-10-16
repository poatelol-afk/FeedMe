import 'package:flutter/material.dart';
import '../theme/feedme_theme.dart';

/// ═══════════════════════════════════════════════════════════════════════════════
/// Tactile 3D Action Button (Duolingo Style with dynamic press depth)
/// Hardened for flexible child widgets, custom padding, width, and depths.
/// ═══════════════════════════════════════════════════════════════════════════════
class TactileButton extends StatefulWidget {
  final String? label;
  final Widget? child;
  final VoidCallback? onPressed;
  final Color color;
  final Color? shadowColor;
  final Widget? icon;
  final double height;
  final double? width;
  final EdgeInsetsGeometry? padding;
  final TextStyle? textStyle;
  final bool isFullWidth;
  final double depth;
  final double? elevation;
  final double borderRadius;

  const TactileButton({
    super.key,
    this.label,
    this.child,
    required this.onPressed,
    this.color = FeedMeColors.featherGreen,
    this.shadowColor,
    this.icon,
    this.height = 48.0,
    this.width,
    this.padding,
    this.textStyle,
    this.isFullWidth = true,
    this.depth = 4.0,
    this.elevation,
    this.borderRadius = 16.0,
  }) : assert(
          label != null || child != null,
          'Either label or child must be provided to TactileButton',
        );

  @override
  State<TactileButton> createState() => _TactileButtonState();
}

class _TactileButtonState extends State<TactileButton> {
  bool _isPressed = false;

  Color _resolveShadowColor() {
    if (widget.shadowColor != null) return widget.shadowColor!;
    if (widget.color == FeedMeColors.featherGreen) return FeedMeColors.featherGreenShadow;
    if (widget.color == FeedMeColors.cardioOrange) return FeedMeColors.cardioOrangeShadow;
    if (widget.color == FeedMeColors.liftPurple) return FeedMeColors.liftPurpleShadow;
    if (widget.color == FeedMeColors.kitchenCyan) return FeedMeColors.kitchenCyanShadow;
    if (widget.color == FeedMeColors.leagueGold) return FeedMeColors.leagueGoldShadow;
    if (widget.color == FeedMeColors.coralRed) return FeedMeColors.coralRedShadow;
    return HSLColor.fromColor(widget.color).withLightness(
      (HSLColor.fromColor(widget.color).lightness - 0.15).clamp(0.0, 1.0),
    ).toColor();
  }

  @override
  Widget build(BuildContext context) {
    final effectiveMaxDepth = widget.elevation ?? widget.depth;
    final effectiveDepth = _isPressed ? 0.0 : effectiveMaxDepth;
    final topMargin = _isPressed ? effectiveMaxDepth : 0.0;
    final bottomMargin = effectiveMaxDepth - effectiveDepth;
    final shadowColor = _resolveShadowColor();

    Widget buttonBody;
    if (widget.child != null) {
      buttonBody = widget.child!;
    } else {
      buttonBody = Row(
        mainAxisSize: widget.isFullWidth ? MainAxisSize.max : MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          if (widget.icon != null) ...[
            widget.icon!,
            const SizedBox(width: 8.0),
          ],
          Text(
            widget.label ?? '',
            style: widget.textStyle ??
                const TextStyle(
                  color: Colors.white,
                  fontSize: 15,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 0.2,
                ),
          ),
        ],
      );
    }

    final container = AnimatedContainer(
      duration: const Duration(milliseconds: 60),
      margin: EdgeInsets.only(top: topMargin, bottom: bottomMargin),
      height: widget.padding == null ? widget.height : null,
      width: widget.width,
      padding: widget.padding,
      decoration: BoxDecoration(
        color: widget.color,
        borderRadius: BorderRadius.circular(widget.borderRadius),
        boxShadow: effectiveDepth > 0
            ? [
                BoxShadow(
                  color: shadowColor,
                  offset: Offset(0, effectiveDepth),
                  blurRadius: 0,
                )
              ]
            : null,
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(widget.borderRadius),
          onTapDown: widget.onPressed != null ? (_) => setState(() => _isPressed = true) : null,
          onTapUp: widget.onPressed != null ? (_) => setState(() => _isPressed = false) : null,
          onTapCancel: widget.onPressed != null ? () => setState(() => _isPressed = false) : null,
          onTap: widget.onPressed,
          child: Padding(
            padding: widget.padding ?? const EdgeInsets.symmetric(horizontal: 16.0),
            child: Center(
              child: buttonBody,
            ),
          ),
        ),
      ),
    );

    if (widget.width != null) {
      return container;
    }
    return widget.isFullWidth ? SizedBox(width: double.infinity, child: container) : container;
  }
}
