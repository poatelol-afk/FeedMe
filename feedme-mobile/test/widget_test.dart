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
