import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/src/constants/Colors';
import { useFamilyStore, LearningReport } from '@/src/store/useFamilyStore';
import { Bell, MapPin, Wallet, PlusCircle, ArrowRight, BarChart2, Calendar, FileText, Download, ChevronDown, ChevronUp } from 'lucide-react-native';
import Button from '@/src/components/ui/Button';

const ExpandableReportCard = ({ report }: { report: LearningReport }) => {
  const [expanded, setExpanded] = useState(false);

  const handleDownload = () => {
    Alert.alert("Unduhan Dimulai", `Laporan_${report.subject.replace(' ', '')}_${report.date}.pdf sedang diunduh ke perangkat Anda.`);
  };

  return (
    <View style={styles.reportCard}>
      <View style={styles.reportCardHeader}>
        <TouchableOpacity 
          style={styles.reportHeaderContent}
          onPress={() => setExpanded(!expanded)}
          activeOpacity={0.7}
        >
          <Image source={{ uri: report.photoUrl }} style={styles.tutorPic} />
          <View style={styles.reportHeaderInfo}>
            <Text style={styles.reportSubject}>{report.subject}</Text>
            <View style={styles.dateRow}>
              <Calendar size={12} color={Colors.textMuted} style={{ marginRight: 4 }} />
              <Text style={styles.dateText}>{report.date}</Text>
            </View>
          </View>
          {expanded ? <ChevronUp size={20} color={Colors.textMuted} style={{ marginRight: 8 }}/> : <ChevronDown size={20} color={Colors.textMuted} style={{ marginRight: 8 }}/>}
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.dlBtn} onPress={handleDownload}>
          <Download size={18} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {expanded && (
        <View style={styles.reportDetails}>
          <View style={styles.separator} />
          
          <Text style={styles.detailLabel}>Tutor Pengajar:</Text>
          <Text style={styles.detailValue}>{report.tutorName}</Text>

          <Text style={[styles.detailLabel, { marginTop: 12 }]}>Evaluasi Kemajuan:</Text>
          <View style={styles.summaryBox}>
            <FileText size={16} color={Colors.secondary} style={{ marginRight: 8, marginTop: 2 }} />
            <Text style={styles.summaryText}>{report.summary}</Text>
          </View>

          <Text style={[styles.detailLabel, { marginTop: 12 }]}>Karakter Meninjol:</Text>
          <View style={styles.characterRow}>
            {report.characters.map(char => (
              <View key={char} style={styles.chip}>
                <Text style={styles.chipText}>{char}</Text>
              </View>
            ))}
          </View>
          
          <TouchableOpacity style={styles.dlBtnFull} onPress={handleDownload}>
             <Download size={18} color="#FFF" style={{ marginRight: 8 }} />
             <Text style={styles.dlBtnFullText}>Download Laporan PDF (Lengkap)</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default function ParentDashboard() {
  const router = useRouter();
  const { children, reports, activeChildId, setActiveChild } = useFamilyStore();

  const activeChild = children.find(c => c.id === activeChildId) || children[0];
  const activeChildReports = reports.filter(r => r.childId === activeChild?.id);

  React.useEffect(() => {
    if (!activeChildId && children.length > 0) {
      setActiveChild(children[0].id);
    }
  }, [activeChildId]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greetingTitle}>Dashboard Keluarga</Text>
          <Text style={styles.greetingSub}>Pantau perkembangan belajar buah hati Anda.</Text>
        </View>
        <TouchableOpacity style={styles.iconCircle}>
          <Bell size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Child Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.childScroll}>
          {children.map(child => (
            <TouchableOpacity 
              key={child.id} 
              style={[styles.childAvatarContainer, activeChild?.id === child.id && styles.childAvatarActive]}
              onPress={() => setActiveChild(child.id)}
            >
              <Image source={{ uri: child.avatar }} style={styles.childAvatar} />
              <Text style={styles.childName} numberOfLines={1}>{child.name.split(' ')[0]}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.addChildBtn}>
            <PlusCircle size={32} color={Colors.textMuted} />
            <Text style={styles.addChildText}>Tambah Anak</Text>
          </TouchableOpacity>
        </ScrollView>

        {activeChild && (
          <View style={styles.childDetailBoard}>
            <Text style={styles.detailBoardTitle}>Aktivitas & Perkembangan: {activeChild.name}</Text>
            
            {/* Visual Analytics */}
            <View style={styles.analyticsGrid}>
              <View style={[styles.statBox, { backgroundColor: '#E1F0FF' }]}>
                <View style={[styles.iconWrap, { backgroundColor: Colors.lightBlue }]}>
                  <BarChart2 size={24} color={Colors.primary} />
                </View>
                <Text style={styles.statNumber}>{activeChildReports.length}</Text>
                <Text style={styles.statLabel}>Total Sesi</Text>
              </View>
              
              <View style={[styles.statBox, { backgroundColor: '#E8F6ED' }]}>
                <View style={[styles.iconWrap, { backgroundColor: Colors.lightGreen }]}>
                  <FileText size={24} color={Colors.secondary} />
                </View>
                <Text style={[styles.statNumber, { color: Colors.secondary }]}>{(activeChildReports.length * 1.5).toFixed(1)}</Text>
                <Text style={styles.statLabel}>Jam Belajar</Text>
              </View>
            </View>

            {/* Sesi Belajar Hari Ini / Live Tracking */}
            <TouchableOpacity 
              style={styles.liveSessionCard}
              onPress={() => router.push('/(parent)/tracking/live')}
            >
              <View style={styles.liveIndicator}>
                <View style={styles.greenDot} />
                <Text style={styles.liveText}>KELAS SEDANG BERJALAN</Text>
              </View>
              <Text style={styles.subjectText}>Fisika Dasar</Text>
              <Text style={styles.tutorText}>Bersama Budi Santoso</Text>
              
              <View style={styles.liveActionRow}>
                <MapPin size={16} color={Colors.secondary} style={{ marginRight: 6 }} />
                <Text style={styles.liveActionText}>Lihat Posisi Tutor (Live ETA)</Text>
                <ArrowRight size={16} color={Colors.secondary} style={{ marginLeft: 'auto' }} />
              </View>
            </TouchableOpacity>

            {/* Review & Laporan per Sesi */}
            <View style={{ marginTop: 32 }}>
              <Text style={styles.sectionHeading}>Riwayat & Laporan Sesi</Text>
              
              {activeChildReports.length > 0 ? (
                activeChildReports.map(report => (
                  <ExpandableReportCard key={report.id} report={report} />
                ))
              ) : (
                <Text style={styles.emptyText}>Belum ada riwayat pembelajaran selesai.</Text>
              )}
            </View>

            <Button 
              title={`Pesan Tutor Baru untuk ${activeChild.name.split(' ')[0]}`}
              onPress={() => router.push('/(customer)/order/location')}
              style={{ marginTop: 24 }}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#FFF' },
  greetingTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.primary },
  greetingSub: { fontSize: 13, color: Colors.textMuted, marginTop: 4 },
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center' },
  
  content: { paddingBottom: 40 },
  
  childScroll: { paddingHorizontal: 20, marginBottom: 16, marginTop: 12 },
  childAvatarContainer: { alignItems: 'center', marginRight: 16, width: 70 },
  childAvatarActive: { padding: 3, borderWidth: 2, borderColor: Colors.primary, borderRadius: 36 },
  childAvatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#E0E0E0' },
  childName: { fontSize: 12, fontWeight: 'bold', color: Colors.text, marginTop: 8, textAlign: 'center' },
  
  addChildBtn: { width: 60, height: 60, borderRadius: 30, borderWidth: 1, borderColor: '#D0D0D0', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' },
  addChildText: { fontSize: 10, color: Colors.textMuted, marginTop: 12, textAlign: 'center' },

  childDetailBoard: { backgroundColor: '#F8F9FB', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, paddingTop: 32, minHeight: 600, borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderColor: Colors.border },
  detailBoardTitle: { fontSize: 16, fontWeight: 'bold', color: '#0A1E3F', marginBottom: 20 },

  analyticsGrid: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  statBox: { flex: 1, borderRadius: 20, padding: 20 },
  iconWrap: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  statNumber: { fontSize: 28, fontWeight: 'bold', color: '#0A1E3F', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#4A5A75', fontWeight: 'bold' },

  liveSessionCard: { backgroundColor: Colors.lightGreen, padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#C8E6C9' },
  liveIndicator: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  greenDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.secondary, marginRight: 6 },
  liveText: { fontSize: 10, fontWeight: 'bold', color: Colors.secondary, letterSpacing: 1 },
  subjectText: { fontSize: 18, fontWeight: 'bold', color: Colors.text, marginBottom: 4 },
  tutorText: { fontSize: 14, color: Colors.textMuted, marginBottom: 16 },
  liveActionRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 12, borderRadius: 12 },
  liveActionText: { fontSize: 13, fontWeight: 'bold', color: Colors.secondary },

  sectionHeading: { fontSize: 16, fontWeight: 'bold', color: '#0A1E3F', marginBottom: 16 },
  emptyText: { fontSize: 13, color: Colors.textMuted, fontStyle: 'italic', textAlign: 'center', marginVertical: 20 },

  reportCard: { backgroundColor: '#FFF', borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden' },
  reportCardHeader: { flexDirection: 'row', alignItems: 'center', padding: 16, justifyContent: 'space-between' },
  reportHeaderContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  tutorPic: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#E0E0E0', marginRight: 16 },
  reportHeaderInfo: { flex: 1 },
  reportSubject: { fontSize: 15, fontWeight: 'bold', color: Colors.text, marginBottom: 4 },
  dateRow: { flexDirection: 'row', alignItems: 'center' },
  dateText: { fontSize: 12, color: Colors.textMuted },
  
  dlBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E1F0FF', justifyContent: 'center', alignItems: 'center' },
  
  reportDetails: { padding: 16, paddingTop: 0, backgroundColor: '#FFF' },
  separator: { height: 1, backgroundColor: Colors.border, marginBottom: 16 },
  detailLabel: { fontSize: 11, color: Colors.textMuted, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 4 },
  detailValue: { fontSize: 14, color: Colors.text, fontWeight: 'bold' },
  
  summaryBox: { flexDirection: 'row', backgroundColor: '#F8F9FB', padding: 12, borderRadius: 12, marginTop: 4 },
  summaryText: { flex: 1, fontSize: 13, color: Colors.text, fontStyle: 'italic', lineHeight: 20 },
  
  characterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4, marginBottom: 16 },
  chip: { backgroundColor: Colors.lightBlue, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  chipText: { color: Colors.primary, fontSize: 11, fontWeight: 'bold' },

  dlBtnFull: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 12 },
  dlBtnFullText: { color: '#FFF', fontSize: 13, fontWeight: 'bold' }
});
