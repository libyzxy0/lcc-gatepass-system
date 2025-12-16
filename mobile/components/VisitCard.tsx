import { Text, View } from "@/components"
import Octicons from '@expo/vector-icons/Octicons';
import { useColors } from '@/hooks/useColors'

type VisitorCard = {
  id: string;
  name: string;
  description: string;
  visiting: string;
  secured: boolean;
  status: string;
}

export function VisitCard({ id, name, description, visiting, secured, status }: VisitorCard) {
     const colors = useColors();
    return (
        <View
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
            {name}
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
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5
              }}>
                <Text style={{ fontSize: 14, color: colors.primary }}>
                  {visiting}
                </Text>
                <View style={{
                  width: 1,
                  height: 10,
                  backgroundColor: colors.border
                }} />
                <Text style={{ fontSize: 14, color: colors.warning }}>
                  {status}
                </Text>
              </View>

              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5
              }}>
                {secured ? (
                  <>
                  <Octicons name="shield-check" size={16} color={colors.success} />
                  <Text style={{
                    fontSize: 14,
                    color: colors.success
                  }}>Secured Pass</Text>
                  </>
                ) : (
                  <>
                  <Octicons name="shield-slash" size={16} color={colors.gray} />
                  <Text style={{
                    fontSize: 14,
                    color: colors.gray
                  }}>Printable Pass</Text> 
                  </>
                )}
              </View>
            </View>
          </View>
    )
}