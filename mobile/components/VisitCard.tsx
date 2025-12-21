import { Text, View } from "@/components"
import Octicons from '@expo/vector-icons/Octicons';
import { useColors } from '@/hooks/useColors'
import { useRouter } from 'expo-router'
import { TouchableOpacity } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';

interface VisitorCard {
  id: string;
  purpose: string;
  description: string;
  visiting: string;
  secured: boolean;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  onDelete: () => void;
}

export function VisitCard({ id, purpose, description, visiting, secured, status, date, onDelete }: VisitorCard) {
  const router = useRouter();
  const colors = useColors();

  const colorStatusMap = {
    'pending': colors.warning,
    'approved': colors.success,
    'completed': colors.primary,
    'rejected': colors.danger
  }
  return (
    <TouchableOpacity
      onPress={() => router.push(`/gatepass/${id}`)}
      delayLongPress={200}
      onLongPress={onDelete}
      activeOpacity={0.7}
      style={{
        backgroundColor: colors.card,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        paddingVertical: 12,
        paddingHorizontal: 14,
        gap: 2
      }}
    >
      <Text
        style={{
          fontSize: 16,
        }}
        type="bold"
      >
        {purpose}
      </Text>


      <Text type="secondary" style={{ fontSize: 12 }}>
        “{description}”
      </Text>

      <View style={{
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 2
      }}>
  
          <Text style={{ fontSize: 14, color: colorStatusMap[status] }}>
            {`${status[0].toUpperCase()}${status.slice(1)}`}
          </Text>
  

        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5
        }}>
          <Octicons name="shield-check" size={14} color={colors.badges.pink} />
          <Text style={{
            fontSize: 14,
            color: colors.badges.pink
          }}>Parent Pass</Text>

        </View>
      </View>
    </TouchableOpacity>
  )
}