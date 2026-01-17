import { Text, View, showToast } from "@/components"
import Octicons from '@expo/vector-icons/Octicons';
import { useColors } from '@/hooks/useColors'
import { useRouter } from 'expo-router'
import { TouchableOpacity } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from "expo-image";
import { LinearGradient } from 'expo-linear-gradient';
import { ModalDestructive } from "@/components/ui/modals/ModalDestructive";
import { deleteGatepass } from '@/api/helper/gatepass'
import { useGatepassStore } from '@/utils/gatepass-store'
import { useState } from 'react'

interface IVehicle {
  type: string;
  plate_number: string;
}

interface IVisitorCard {
  id: string;
  purpose: string;
  description: string;
  vehicle: IVehicle | null;
  status: 'pending' | 'approved' | 'rejected';
  schedule_date: string;
  qr_token: string;
}

export function VisitCard({ id, purpose, description, vehicle, status, schedule_date, qr_token }: IVisitorCard) {
  const router = useRouter();
  const colors = useColors();
  const [deleteModal, showDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { fetchGatepass } = useGatepassStore();

  const colorStatusMap = {
    'pending': colors.warning,
    'approved': colors.success,
    'expired': colors.badges.pink,
    'rejected': colors.danger
  }

  const labelMap = {
    'pending': 'Pending Approval',
    'approved': 'Gatepass Approved',
    'expired': 'Gatepass Expired',
    'rejected': 'Gatepass Rejected'
  }

  const iconMap = {
    'pending': 'sync',
    'approved': 'shield-check',
    'expired': 'stop',
    'rejected': 'blocked'
  }

  const handleDelete = async () => {
    setDeleting(true);
    const data = await deleteGatepass(id);
    await fetchGatepass();
    showToast({
      type: data.success ? 'success' : 'error',
      text1: data.success ? "Gatepass Deleted" : "Failed to delete gatepass",
      text2: data.message
    })
    setDeleting(false);
  }
  
  const handleViewGatepass = () => {
    if (status === 'approved') {
      router.push(`/gatepass/${id}`)
    } else {
      showToast({
        type: 'default',
        text1: 'Unable to View',
        text2: 'Gatepass is not approved by the administrator.'
      })
    }
  }

  return (
    <>
      <ModalDestructive
        visible={deleteModal}
        onConfirm={handleDelete}
        loading={deleting}
        description={'Are you sure that you want to delete this gatepass? This will revoke your gatepass!'}
        onClose={() => showDeleteModal(false)}
      />
      <TouchableOpacity
        onPress={handleViewGatepass}
        delayLongPress={200}
        onLongPress={() => showDeleteModal(true)}
        activeOpacity={0.7}
        style={{
          backgroundColor: colors.card,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: colorStatusMap[status] + '22',
          gap: 2
        }}
      >
        <LinearGradient
          style={{
            flexDirection: 'row',
            paddingVertical: 12,
            paddingHorizontal: 14,
            borderRadius: 8,
            position: 'relative'
          }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1.2, y: 1 }}
          colors={[
            `${colorStatusMap[status]}22`,
            `${colorStatusMap[status]}12`,
            colors.card,
          ]}
        >
          <View>
            <Text
              style={{
                fontSize: 16,
                color: colorStatusMap[status]
              }}
              type="bold"
              numberOfLines={1}
              ellipsizeMode={'tail'}
            >
              {purpose}
            </Text>


            <Text
              type="secondary"
              style={{ fontSize: 12 }}
              numberOfLines={2}
              ellipsizeMode={'tail'}
            >
              {description}
            </Text>

            <View style={{
              flexDirection: 'column',
              marginTop: 2
            }}>

              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5
              }}>
                <Octicons name={iconMap[status]} size={12} style={{
                  color: colorStatusMap[status]
                }} />
                <Text style={{ fontSize: 12, color: colorStatusMap[status] }}>
                  {labelMap[status]}
                </Text>
              </View>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5
              }}>
                <Octicons name="calendar" size={12} color={colors.primary} />
                <Text style={{
                  fontSize: 12,
                  color: colors.primary
                }}>{schedule_date && new Date(schedule_date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}</Text>
              </View>
            </View>
          </View>

          <View style={{
            position: 'absolute',
            right: 20,
          }}>
            <Octicons name={iconMap[status]} size={80} style={{
              color: colorStatusMap[status] + '12',
              paddingVertical: 20
            }} />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </>
  )
}