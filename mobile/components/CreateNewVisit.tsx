import React, { useState } from 'react'
import { Text, View, Modal, ModalContent, Input, Button, showToast } from '@/components';
import { useColors } from '@/hooks/useColors'
import Ionicons from '@expo/vector-icons/Ionicons';
import { ActivityIndicator } from 'react-native'

type CreateNewVisit = {
    visible: boolean;
    onClose?: () => void;
}

export function CreateNewVisit({
    visible,
    onClose
}: CreateNewVisit) {
    const colors = useColors()
    const [loading, setLoading] = useState(false);
    return (
        <Modal visible={visible} onRequestClose={onClose}>
            <ModalContent
             style={{
                paddingVertical: 12,
                paddingHorizontal: 12,
                minWidth: 320
            }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Text type="bold" style={{
                        fontSize: 20
                    }}>Create Visit</Text>
                    <Button variant="icon" onPress={onClose}>
                        <Ionicons name="close-outline" size={22} color={colors.text} />
                    </Button>
                </View>
                <View style={{
                    marginTop: 12,
                    gap: 5
                }}>
                
                    <View style={{
                        gap: 2
                    }}>
                        <Text style={{
                            fontSize: 12
                        }}>Purpose</Text>
                        <Input
                            placeholder="Enter Visit Purpose"
                        />
                    </View>
                    
                    <View style={{
                        gap: 2
                    }}>
                        <Text style={{
                            fontSize: 12
                        }}>Description</Text>
                        <Input
                            placeholder="Enter Visit Description"
                        />
                    </View>

                     <View style={{
                        marginTop: 12,
                        marginBottom: 5,
                        width: '100%'
                    }}>
                        <Button
                            style={{
                                width: '100%',
                                minHeight: 40,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                            {loading ? (
                                <ActivityIndicator size="small" color={"white"} />
                            ) : 'Create'}
                        </Button>
                    </View>

                </View>

            </ModalContent>
        </Modal>
    )
}