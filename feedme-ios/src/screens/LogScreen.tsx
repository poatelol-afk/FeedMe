import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fontSize } from '../lib/theme';
export default function LogScreen() {
  return <View style={s.c}><Text style={s.t}>?? Log</Text><Text style={s.sub}>Coming soon</Text></View>;
}
const s = StyleSheet.create({ c:{flex:1,backgroundColor:colors.bgBase,alignItems:'center',justifyContent:'center'}, t:{fontSize:fontSize['2xl'],color:colors.textPrimary}, sub:{color:colors.textMuted,marginTop:8} });
